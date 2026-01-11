<script>
    import { onMount } from 'svelte';
    import { afterNavigate } from '$app/navigation';
    import PreviewOverviewArbeit from "$lib/components/overview-arbeit.svelte";
    import ErfassenNoten from "$lib/components/arbeit/erfassen-noten.svelte";
    import ErfassenDatenArbeit from "$lib/components/arbeit/erfassen-daten-arbeit.svelte";
    import {POST, GET, PATCH, DELETE} from "$lib/functions";
    import {goto} from "$app/navigation";

    let {data} = $props();

    let study_programs_mapping = {};
    data.study_programs.forEach(program => {
        study_programs_mapping[program.id] = program.title;
    });

    let student_mapping = {};
    data.students.forEach(student => {
        student_mapping[student.id] = student;
    });

    let referent_mapping = {};
    data.referenten.forEach(referent => {
        referent_mapping[referent.id] = referent;
    });

    let create = $state(true);
    let workId = $state(0);

    let arbeitData = $state({
        mainEvaluator: null,
        secondEvaluator: null,
        mainEvaluatorWorkMark: null,
        mainEvaluatorColloquiumMark: null,
        secondEvaluatorWorkMark: null,
        secondEvaluatorColloquiumMark: null,
        title: "",
        startDate: "",
        endDate: "",
        colloquium: null,
        colloquiumLocation: "",
        colloquiumDuration: null,
        presentationStart: "",
        presentationEnd: "",
        discussionStart: "",
        discussionEnd: "",
        studentId: null,
        studyProgramId: null,
        comment: "",
        events: [{eventType: "", eventDate: ""}]
    });
    
    // Track event IDs loaded from backend to detect deletions
    let loadedEventIds = $state([]);
    
    let isSaving = $state(false);

    function findEvaluator(id) {
        if (!id || !data.referenten) return null;
        return data.referenten.find(r => r.id === id) || { id: id };
    }

    // --- NEUE HELFER-FUNKTIONEN ---
    // Wandelt [2025, 7, 9] in "2025-07-09" um
    function formatBackendDate(d) {
        if (!d) return null;
        if (Array.isArray(d)) {
            const [y, m, day] = d;
            return `${y}-${m.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        }
        return d;
    }

    // Wandelt [2025, 10, 12, 14, 30] in "2025-10-12T14:30" um
    function formatBackendDateTime(d) {
        if (!d) return null;
        if (Array.isArray(d)) {
            const [y, m, day, h, min] = d;
            return `${y}-${m.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}T${h.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        }
        return d;
    }
    // -----------------------------

    async function loadWork(id) {
        try {
            const work = await GET(`/api/scientific-work/${id}`);
            const workEvents = await GET(`/api/scientific-work/${id}/events`);

            if (work) {
                arbeitData = {
                    ...arbeitData,
                    title: work.title,
                    // Hier wenden wir die Formatierung an:
                    startDate: formatBackendDate(work.startDate),
                    endDate: formatBackendDate(work.endDate),
                    colloquium: formatBackendDateTime(work.colloquium),
                    
                    colloquiumLocation: work.colloquiumLocation,
                    colloquiumDuration: work.colloquiumDuration,
                    presentationStart: work.presentationStart,
                    presentationEnd: work.presentationEnd,
                    discussionStart: work.discussionStart,
                    discussionEnd: work.discussionEnd,
                    studentId: work.studentId,
                    studyProgramId: work.studyProgramId,
                    comment: work.comment,
                    mainEvaluatorWorkMark: work.mainEvaluatorWorkMark,
                    mainEvaluatorColloquiumMark: work.mainEvaluatorColloquiumMark,
                    secondEvaluatorWorkMark: work.secondEvaluatorWorkMark,
                    secondEvaluatorColloquiumMark: work.secondEvaluatorColloquiumMark,
                    
                    mainEvaluator: findEvaluator(work.mainEvaluatorId),
                    secondEvaluator: findEvaluator(work.secondEvaluatorId),

                    // Auch die Events müssen formatiert werden
                    events: (workEvents && workEvents.length > 0) 
                        ? workEvents.map(e => ({
                            ...e,
                            eventDate: formatBackendDate(e.eventDate)
                          }))
                        : [{eventType: "", eventDate: ""}]
                };

                // Remember IDs of events fetched from backend
                loadedEventIds = (workEvents ?? [])
                    .map(e => e?.id)
                    .filter(id => id !== null && id !== undefined);
            }
        } catch (e) {
            console.error("Fehler beim Laden der Arbeit:", e);
        }
    }

    let previousWorkId = 0;

    afterNavigate(async () => {
        const url_params = new URLSearchParams(window.location.search);
        if(url_params.has('id')){
            workId = url_params.get("id");
            create = false;
            await loadWork(workId);
            previousWorkId = workId;
        } else {
            const wasEditMode = previousWorkId !== 0;
            create = true;
            workId = 0;
            // Reset data when switching to create mode
            arbeitData = {
                mainEvaluator: null,
                secondEvaluator: null,
                mainEvaluatorWorkMark: null,
                mainEvaluatorColloquiumMark: null,
                secondEvaluatorWorkMark: null,
                secondEvaluatorColloquiumMark: null,
                title: "",
                startDate: "",
                endDate: "",
                colloquium: null,
                colloquiumLocation: "",
                colloquiumDuration: null,
                presentationStart: "",
                presentationEnd: "",
                discussionStart: "",
                discussionEnd: "",
                studentId: null,
                studyProgramId: null,
                comment: "",
                events: [{eventType: "", eventDate: ""}]
            };
            loadedEventIds = [];
            previousWorkId = 0;
            
            // Auto-refresh nach Wechsel von Edit zu Create
            if (wasEditMode) {
                setTimeout(() => {
                    window.location.reload();
                }, 200);
            }
        }
    });

    function toNullIfEmpty(v) {
        const s = (v ?? "").toString().trim();
        return s === "" ? null : s;
    }

    function buildScientificWorkCreateDTO() {
        return {
            colloquium: arbeitData.colloquium ?? null,
            colloquiumLocation: toNullIfEmpty(arbeitData.colloquiumLocation),
            colloquiumDuration: arbeitData.colloquiumDuration ?? null,
            presentationStart: toNullIfEmpty(arbeitData.presentationStart),
            presentationEnd: toNullIfEmpty(arbeitData.presentationEnd),
            discussionStart: toNullIfEmpty(arbeitData.discussionStart),
            discussionEnd: toNullIfEmpty(arbeitData.discussionEnd),
            title: arbeitData.title,
            startDate: toNullIfEmpty(arbeitData.startDate),
            endDate: toNullIfEmpty(arbeitData.endDate),
            studentId: arbeitData.studentId ?? null,
            studyProgramId: arbeitData.studyProgramId ?? null,
            mainEvaluatorId: arbeitData.mainEvaluator?.id ?? null,
            secondEvaluatorId: arbeitData.secondEvaluator?.id ?? null,
            mainEvaluatorWorkMark: toNullIfEmpty(arbeitData.mainEvaluatorWorkMark),
            mainEvaluatorColloquiumMark: toNullIfEmpty(arbeitData.mainEvaluatorColloquiumMark),
            secondEvaluatorWorkMark: toNullIfEmpty(arbeitData.secondEvaluatorWorkMark),
            secondEvaluatorColloquiumMark: toNullIfEmpty(arbeitData.secondEvaluatorColloquiumMark),
            comment: toNullIfEmpty(arbeitData.comment)
        };
    }

    function buildEventDTOs(scientificWorkId) {
        return (arbeitData.events ?? [])
            .filter(e => e.eventType && e.eventDate)
            .map(e => ({
                id: e.id,
                eventType: e.eventType,
                eventDate: e.eventDate,
                scientificWorkId
            }));
    }

    function validateBeforeSubmit() {
        if (!arbeitData.title || arbeitData.title.trim() === "") {
            return "Bitte einen Titel eingeben.";
        }
        const invalidEvent = (arbeitData.events ?? []).some(e =>
            (e.eventType && !e.eventDate) || (!e.eventType && e.eventDate)
        );
        if (invalidEvent) return "Bitte bei jeder Veranstaltung Typ UND Datum ausfüllen.";

        return null;
    }

    async function arbeitSpeichern() {
        const err = validateBeforeSubmit();
        if (err) {
            alert(err);
            return;
        }
        if (isSaving) return;

        isSaving = true;
        try {
            const workPayload = buildScientificWorkCreateDTO();
            let finalWorkId = workId;

            if (create) {
                const workRes = await POST("/api/scientific-work", workPayload);
                if (!workRes?.ok) {
                    alert("Fehler beim Erstellen der Arbeit.");
                    return;
                }
                const created = await workRes.json();
                finalWorkId = created?.id ?? created?.scientificWorkId;
            } else {
                const workRes = await PATCH(`/api/scientific-work/${workId}`, workPayload);
                if (!workRes?.ok) {
                    alert("Fehler beim Aktualisieren der Arbeit.");
                    return;
                }
            }

            if (!finalWorkId) {
                alert("Fehler: Keine ID vorhanden.");
                return;
            }

            const events = buildEventDTOs(finalWorkId);

            // Detect deleted events: present before, missing now (after filtering invalid ones)
            const currentValidIds = new Set(events.map(e => e.id).filter(Boolean));
            const toDeleteIds = (loadedEventIds ?? []).filter(id => !currentValidIds.has(id));

            console.debug("Speichern: Events (DTO)", events);
            console.debug("Speichern: Zu löschende Event-IDs", toDeleteIds);

            for (const id of toDeleteIds) {
                try {
                    const res = await DELETE(`/api/event/${id}`);
                    if (!res?.ok) {
                        const txt = await res.text().catch(() => "");
                        console.error(`Event-DELETE fehlgeschlagen (${id}):`, res?.status, txt);
                    } else {
                        console.debug(`Event gelöscht: ${id}`);
                    }
                } catch (e) {
                    console.error(`Fehler beim Löschen des Events ${id}:`, e);
                }
            }
            for (const ev of events) {
                try {
                    if (ev.id) {
                        const res = await PATCH(`/api/event/${ev.id}`, ev);
                        if (!res?.ok) {
                            const txt = await res.text().catch(() => "");
                            console.error(`Event-PATCH fehlgeschlagen (${ev.id}):`, res?.status, txt);
                        }
                    } else {
                        const res = await POST("/api/event", ev);
                        if (!res?.ok) {
                            const txt = await res.text().catch(() => "");
                            console.error(`Event-POST fehlgeschlagen:`, res?.status, txt);
                        }
                    }
                } catch (e) {
                    console.error("Fehler beim Speichern/Aktualisieren eines Events:", e);
                }
            }

            // Update local snapshot of event IDs to reflect current state
            loadedEventIds = events.map(e => e.id).filter(Boolean);

            alert(create ? "Erfolgreich gespeichert!" : "Erfolgreich aktualisiert!");
            goto("/arbeiten");
        } catch (e) {
            console.error("Save failed:", e);
            alert("Fehler beim Speichern der Arbeit.");
        } finally {
            isSaving = false;
        }
    }

    function abbrechen() {
        goto("/arbeiten");
    }
</script>

<main class="erstellen-arbeit-container">
    <div class="header-row">
        <div class="page-title">{create ? "ARBEIT ANLEGEN" : "ARBEIT BEARBEITEN"}</div>
    </div>

    <PreviewOverviewArbeit swork={arbeitData} studmap={student_mapping}
        progmap={study_programs_mapping} refmap={referent_mapping}/>

    <ErfassenNoten
            evaluators={data?.referenten ?? []}
            bind:data={arbeitData}
    />

    <ErfassenDatenArbeit
            bind:data={arbeitData}
    />

    <div class="action-bar">
        <button class="cancel-btn" type="button" on:click={abbrechen}>
            Abbrechen
        </button>

        <button class="save-btn" type="button" on:click={arbeitSpeichern} disabled={isSaving}>
            {isSaving ? "Speichern..." : (create ? "Speichern" : "Aktualisieren")}
        </button>
    </div>
</main>

<style lang="scss">
  @import 'src/styles/colors.scss';
  .erstellen-arbeit-container {
    display: grid;
    grid-template-rows: repeat(40, 4.5px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 20px;
    row-gap: 25px;
    padding-bottom: 50px;
    font-family: "Inter";
  }

  .header-row {
    grid-column-start: 1;
    grid-column-end: 13;
    grid-row-start: 1;
    grid-row-end: 4;
    display: flex;
    align-items: center;
    padding: 0 30px;
  }

  .page-title {
    font-weight: 600;
    font-size: 18px;
    font-family: "Inter";
  }

  .action-bar {
    grid-column: 8 / 13;
    grid-row: 36 / 38;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
  }

  .save-btn {
    background-color: $primary;
    color: white;
    border: none;
    padding: 12px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    min-width: 100px;
    cursor: pointer;

    &:hover {
      background-color: #1a9cb7;
    }

    &:disabled {
      opacity: 0.6;
      cursor: default;
    }
  }

  .cancel-btn {
    background-color: #FFFFFF;
    color: $error;
    border: 1px solid #E9E9E9;
    padding: 12px 12px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    min-width: 100px;
    cursor: pointer;
    box-shadow: rgba(149, 157, 165, 0.1) 0px 4px 12px;
    &:hover {
      background-color: #f9f9f9;
    }
  }
</style>