<script>
    import {onMount} from 'svelte';
    import StudentSearch from '$lib/components/arbeit/student-search.svelte';
    import {GET} from '$lib/functions.js';

    let {
        data = $bindable({
            colloquium: null,
            colloquiumLocation: "",
            colloquiumDuration: null,
            presentationStart: "",
            presentationEnd: "",
            discussionStart: "",
            discussionEnd: "",
            title: "",
            startDate: "",
            endDate: "",
            studentId: null,
            studyProgramId: null,
            mainEvaluatorId: null,
            secondEvaluatorId: null,
            comment: "",
            events: [{eventType: "", eventDate: ""}]
        })
    } = $props();

    let kolloquiumUI = $state({tag: "", zeit: ""});
    let durationMinutes = $state("");

    let students = $state([]);
    let selectedStudent = $state(null);

    let studyPrograms = $state([]);
    let selectedStudyProgramId = $state(null);
    let studyProgramText = $state("");
    let studyProgramById = $derived(
        new Map((Array.isArray(studyPrograms) ? studyPrograms : []).map(sp => [sp.id, sp.title]))
    );
    let activeVeranstaltungIndex = $state(0);

    let activeVeranstaltung = $derived(
        data.events?.[activeVeranstaltungIndex] ?? {eventType: "", eventDate: ""}
    );
    let isLastVeranstaltung = $derived(activeVeranstaltungIndex === (data.events?.length ?? 1) - 1);
    const EVENT_OPTIONS = [
        {value: "PROPOSAL", label: "PROPOSAL"},
        {value: "DISCUSSION", label: "DISCUSSION"},
        {value: "FINAL_SUBMISSION", label: "FINAL_SUBMISSION"},
        {value: "REVIEW", label: "REVIEW"},
        {value: "ARCHIVE", label: "ARCHIVE"},
        {value: "ABORT", label: "ABORT"}
    ];

    $effect(() => {
        if (data.studentId && !selectedStudent && students.length > 0) {
            const found = students.find(s => s.id === data.studentId);
            if (found) selectedStudent = found;
        }
    });

    // Sicherheitsprüfung hinzugefügt
    $effect(() => {
        if (data.colloquium && (!kolloquiumUI.tag || !kolloquiumUI.zeit)) {
            // Check ob es ein String ist, bevor wir split aufrufen
            if (typeof data.colloquium === 'string') {
                const parts = data.colloquium.split('T');
                if (parts.length >= 2) {
                    kolloquiumUI.tag = parts[0];
                    kolloquiumUI.zeit = parts[1].substring(0, 5);
                }
            }
        }
        if (data.colloquiumDuration) {
             const match = data.colloquiumDuration.match(/\d+/);
             if (match) durationMinutes = match[0];
        }
    });

    $effect(() => {
        const selectedId = selectedStudent?.id ?? null;

        if (selectedId !== null) {
            data.studentId = selectedId;
            const spId = selectedStudent.studyProgramId ?? null;
            selectedStudyProgramId = spId;
            data.studyProgramId = spId;
            studyProgramText = spId ? (studyProgramById.get(spId) ?? "") : "";
            return;
        }

        // Only clear selection when nothing is selected and no prefilled value exists
        if (!data.studentId) {
            selectedStudyProgramId = null;
            data.studyProgramId = null;
            studyProgramText = "";
        }
    });

    $effect(() => {
        if (!kolloquiumUI.tag || !kolloquiumUI.zeit) {
            if (!data.colloquium) return;
        } else {
             data.colloquium = `${kolloquiumUI.tag}T${kolloquiumUI.zeit}`;
        }
    });

    function setDurationMinutes(minutesStr) {
        durationMinutes = minutesStr;
        const minutes = Number(minutesStr);
        data.colloquiumDuration = Number.isFinite(minutes) && minutes > 0 ? `PT${minutes}M` : null;
    }

    function setStudyProgram(sp) {
        selectedStudyProgramId = sp.id;
        data.studyProgramId = sp.id;
        studyProgramText = sp.title;
    }

    function onStudyProgramTextInput(value) {
        studyProgramText = value;
        selectedStudyProgramId = null;
        data.studyProgramId = null;
    }

    function handleStudentClear() {
        data.studentId = null;
        selectedStudyProgramId = null;
        data.studyProgramId = null;
        studyProgramText = "";
    }

    function addVeranstaltung() {
        data.events = [...(data.events ?? []), {eventType: "", eventDate: ""}];
        activeVeranstaltungIndex = (data.events?.length ?? 1) - 1;
    }

    function removeVeranstaltung() {
        if ((data.events?.length ?? 0) <= 1) return;
        if (isLastVeranstaltung) return;

        data.events = (data.events ?? []).filter((_, i) => i !== activeVeranstaltungIndex);
        activeVeranstaltungIndex = Math.max(0, activeVeranstaltungIndex - 1);
    }

    function goToVeranstaltung(index) {
        const len = data.events?.length ?? 0;
        if (index < 0 || index >= len) return;
        activeVeranstaltungIndex = index;
    }

    function updateVeranstaltungType(value) {
        const copy = [...(data.events ?? [])];
        copy[activeVeranstaltungIndex] = {...(copy[activeVeranstaltungIndex] ?? {}), eventType: value};
        data.events = copy;
    }

    function updateVeranstaltungDate(value) {
        const copy = [...(data.events ?? [])];
        copy[activeVeranstaltungIndex] = {...(copy[activeVeranstaltungIndex] ?? {}), eventDate: value};
        data.events = copy;
    }

    async function loadStudents() {
        console.log("loading students...");
        students = await GET('/api/student');
    }

    async function loadStudyPrograms() {
        try {
            studyPrograms = await GET("/api/study-program");
        } catch (e) {
            console.error("Konnte Studiengänge nicht laden:", e);
            studyPrograms = [];
        }
    }

    onMount(async () => {
        await Promise.all([loadStudents(), loadStudyPrograms()]);
    });
</script>

<div class="erfassen-daten-arbeit-container">
    <div class="card">
    <div class="section">
            <div class="section-title">Student</div>

            <div class="row-inline student-row">
                <div class="grow">
                    <StudentSearch
                            data={students}
                            bind:selectedStudent={selectedStudent}
                            placeholder="Suche"
                            refresh={loadStudents}
                            onClear={handleStudentClear}
                    />
                </div>
            </div>

            <div class="field">
                <div class="label">Studiengang</div>

                <div class="pills">
                    {#each studyPrograms as sp}
                        <button
                                type="button"
                                class="pill {selectedStudyProgramId === sp.id ? 'active' : ''}"
                                on:click={() => setStudyProgram(sp)}
                        >
                            {sp.title}
                        </button>
                    {/each}
                </div>

                <div class="input-shell">
                    <input
                            type="text"
                            placeholder="-"
                            value={studyProgramText}
                            on:input={(e) => onStudyProgramTextInput(e.target.value)}
                    />
                </div>
            </div>
        </div>

        <div class="divider"></div>

        <div class="section">
            <div class="section-title">Arbeit</div>

            <div class="field">
                <div class="sub-label">Titel</div>
                <div class="input-shell textarea">
                    <textarea bind:value={data.title} placeholder="-"></textarea>
                </div>
            </div>

            <div class="grid-2">
                <div class="field">
                    <div class="sub-label">Startdatum</div>
                    <div class="input-shell">
                        <input type="date" bind:value={data.startDate}/>
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Abgabedatum</div>
                    <div class="input-shell">
                        <input type="date" bind:value={data.endDate}/>
                    </div>
                </div>
            </div>
        </div>

        <div class="divider"></div>

        <div class="section">
            <div class="section-title">Kolloquiumsprotokoll</div>

            <div class="grid-3-kollo">
                <div class="field">
                    <div class="sub-label">Tag</div>
                    <div class="input-shell">
                        <input type="date" bind:value={kolloquiumUI.tag}/>
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Zeit</div>
                    <div class="input-shell">
                        <input type="time" bind:value={kolloquiumUI.zeit}/>
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Dauer</div>
                    <div class="input-shell">
                        <select value={durationMinutes} on:change={(e) => setDurationMinutes(e.target.value)}>
                            <option value="">Bitte wählen</option>
                            <option value="30">30 Min</option>
                            <option value="45">45 Min</option>
                            <option value="60">1 Std</option>
                            <option value="75">1 Std 15 Min</option>
                            <option value="90">1 Std 30 Min</option>
                            <option value="105">1 Std 45 Min</option>
                            <option value="120">2 Std</option>
                            <option value="135">2 Std 15 Min</option>
                            <option value="150">2 Std 30 Min</option>
                            <option value="165">2 Std 45 Min</option>
                            <option value="180">3 Std</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="grid-4">
                <div class="field">
                    <div class="sub-label">Präsentation von</div>
                    <div class="input-shell">
                        <input type="time" bind:value={data.presentationStart}/>
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Präsentation bis</div>
                    <div class="input-shell">
                        <input type="time" bind:value={data.presentationEnd}/>
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Diskussion von</div>
                    <div class="input-shell">
                        <input type="time" bind:value={data.discussionStart}/>
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Diskussion bis</div>
                    <div class="input-shell">
                        <input type="time" bind:value={data.discussionEnd}/>
                    </div>
                </div>
            </div>

            <div class="field">
                <div class="sub-label">Kolloquiumsstandort*</div>
                <div class="input-shell">
                    <input type="text" bind:value={data.colloquiumLocation} placeholder="-"/>
                </div>
            </div>
        </div>

        <div class="divider"></div>

        <div class="section">
            <div class="veranstaltung-header">
                <div class="section-title">Veranstaltung*</div>

                <div class="pager">
                    <button
                            type="button"
                            class="pager-arrow"
                            on:click={() => goToVeranstaltung(activeVeranstaltungIndex - 1)}
                            disabled={activeVeranstaltungIndex === 0}
                    >
                        ←
                    </button>

                    {#each Array.from({length: data.events?.length ?? 0}, (_, i) => i) as i}
                        <button
                                type="button"
                                class="pager-num {i === activeVeranstaltungIndex ? 'active' : ''}"
                                on:click={() => goToVeranstaltung(i)}
                        >
                            [{i + 1}]
                        </button>
                    {/each}
                </div>
            </div>

            <div class="grid-3-event">
                <div class="field">
                    <div class="sub-label">Typ</div>
                    <div class="input-shell">
                        <select
                                value={activeVeranstaltung.eventType}
                                on:change={(e) => updateVeranstaltungType(e.target.value)}
                        >
                            <option value="" disabled selected={activeVeranstaltung.eventType === ""}>
                                Bitte wählen
                            </option>
                            {#each EVENT_OPTIONS as opt}
                                <option value={opt.value}>{opt.label}</option>
                            {/each}
                        </select>
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Datum</div>
                    <div class="input-shell">
                        <input
                                type="date"
                                value={activeVeranstaltung.eventDate}
                                on:input={(e) => updateVeranstaltungDate(e.target.value)}
                        />
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">&nbsp;</div>

                    {#if isLastVeranstaltung}
                        <button type="button" class="input-shell action-shell plus-shell" on:click={addVeranstaltung}>
                            +
                        </button>
                    {:else}
                        <button type="button" class="input-shell action-shell remove-shell"
                                on:click={removeVeranstaltung}>
                            entfernen
                        </button>
                    {/if}
                </div>
            </div>
        </div>

    </div>
</div>

<style lang="scss">
  .erfassen-daten-arbeit-container {
    grid-column-start: 8;
    grid-column-end: 13;
    grid-row-start: 2;
    grid-row-end: 16;
    border: 1px solid #E9E9E9;
    background-color: #FFFFFF;
    border-radius: 10px;
    max-height: 800px;
    overflow-y: auto;
    font-family: "Inter", sans-serif;
  }

  .card {
    padding: 16px;
  }

  .section {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .section-title {
    font-weight: 700;
    font-size: 14px;
  }

  .divider {
    height: 1px;
    background: #EEF0F4;
    margin: 14px 0;
  }

  .row-inline {
    display: flex;
    gap: 10px;
  }

  .student-row {
    align-items: center;
  }

  .grow {
    flex: 1;
    min-width: 0;
  }

  .label {
    font-weight: 600;
    font-size: 13px;
    margin-bottom: 6px;
  }

  .sub-label {
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 6px;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .input-shell {
    border: 1px solid #E7EAF0;
    border-radius: 12px;
    padding: 10px 12px;
    height: 46px;
    display: flex;
    align-items: center;
    background: #fff;
    box-sizing: border-box;
  }

  .input-shell input,
  .input-shell textarea,
  .input-shell select {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
    font-family: "Inter";
    font-size: 13px;
  }

  .input-shell select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    padding: 0;
    margin: 0;
  }

  .textarea {
    height: auto;
    align-items: flex-start;
  }

  .textarea textarea {
    min-height: 70px;
    resize: vertical;
  }

  .pills {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .pill {
    border: 1px solid #E7EAF0;
    border-radius: 10px;
    padding: 6px 10px;
    font-size: 12px;
    cursor: pointer;
    background: #fff;
    font-weight: 600;
  }

  .pill.active {
    border-color: #111;
  }

  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }

  .grid-3-kollo {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 12px;
    align-items: end;
  }

  .grid-4 {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    align-items: end;
  }

  .grid-3-event {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    align-items: end;
  }

  .veranstaltung-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .pager {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .pager-arrow {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 16px;
    padding: 0;
  }

  .pager-arrow:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .pager-num {
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
  }

  .pager-num.active {
    color: #2f7d32;
    font-weight: 700;
  }

  .action-shell {
    justify-content: center;
    width: 100%;
    padding: 0;
    cursor: pointer;
    user-select: none;
  }

  .plus-shell {
    font-size: 24px;
    font-weight: 500;
  }

  .remove-shell {
    font-size: 13px;
    font-weight: 600;
  }

  .action-shell:hover {
    background: #fafafa;
  }
</style>