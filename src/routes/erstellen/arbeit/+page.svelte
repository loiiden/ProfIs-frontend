<script>

    import PreviewOverviewArbeit from "$lib/components/arbeit/preview-overview-arbeit.svelte";
    import ErfassenNoten from "$lib/components/arbeit/erfassen-noten.svelte";
    import ErfassenDatenArbeit from "$lib/components/arbeit/erfassen-daten-arbeit.svelte";


    import {POST} from "$lib/functions";
    import {goto} from "$app/navigation";

    let {data} = $props();

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

    let isSaving = $state(false);

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
            const workRes = await POST("/api/scientific-work", workPayload);

            if (!workRes?.ok) {
                console.error("Work create failed:", workRes);
                alert("Fehler beim Erstellen der Arbeit.");
                return;
            }

            const created = await workRes.json();
            const scientificWorkId = created?.id ?? created?.scientificWorkId;

            if (!scientificWorkId) {
                console.error("Create response ohne ID:", created);
                alert("Fehler: Keine scientificWorkId vom Backend erhalten.");
                return;
            }

            const events = buildEventDTOs(scientificWorkId);

            for (const ev of events) {
                const evRes = await POST("/api/event", ev);
                if (!evRes?.ok) {
                    console.error("Event create failed:", ev, evRes);
                    alert("Fehler beim Speichern eines Events.");
                    return;
                }
            }

            alert("Erfolgreich gespeichert!");
            goto("/arbeiten");
        } catch (e) {
            console.error("Create failed:", e);
            alert("Fehler beim Erstellen der Arbeit.");
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
        <div class="page-title">ARBEIT ANLEGEN</div>
    </div>

    <PreviewOverviewArbeit/>

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
            {isSaving ? "Speichern..." : "Speichern"}
        </button>
    </div>
</main>

<style lang="scss">
  @import 'src/styles/colors.scss';

  .erstellen-arbeit-container {
    display: grid;
    grid-template-rows: repeat(30, 4.5px);
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
    grid-row: 28 / 30;
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
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

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
