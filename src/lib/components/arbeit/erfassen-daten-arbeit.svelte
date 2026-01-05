<script>
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import StudentSearch from '$lib/components/arbeit/student-search.svelte';
    import { GET } from '$lib/functions.js';


    let scientificWork = $state({

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

        mainEvaluatorWorkMark: null,
        mainEvaluatorColloquiumMark: null,
        secondEvaluatorWorkMark: null,
        secondEvaluatorColloquiumMark: null,

        comment: ""
    });

    let kolloquiumUI = $state({ tag: "", zeit: "" });

    let students = $state([]);
    let selectedStudent = $state(null);

    let studyPrograms = $state([]);
    let selectedStudyProgramId = $state(null);

    let studyProgramText = $state("");

    let studyProgramById = $derived(
        new Map((Array.isArray(studyPrograms) ? studyPrograms : []).map(sp => [sp.id, sp.title]))
    );

    let veranstaltungen = $state([{ name: "", tag: "" }]);
    let activeVeranstaltungIndex = $state(0);

    let activeVeranstaltung = $derived(
        veranstaltungen[activeVeranstaltungIndex] ?? { name: "", tag: "" }
    );

    let isLastVeranstaltung = $derived(activeVeranstaltungIndex === veranstaltungen.length - 1);

    onMount(async () => {
        try {
            students = await GET('/api/student');
            studyPrograms = await GET('/api/study-program');
        } catch (e) {
            console.error('Konnte Daten nicht laden:', e);
            students = [];
            studyPrograms = [];
        }
    });

    $effect(() => {
        // studentId
        scientificWork.studentId = selectedStudent?.id ?? null;

        if (!selectedStudent) {
            // reset
            selectedStudyProgramId = null;
            scientificWork.studyProgramId = null;
            studyProgramText = "";
            return;
        }

        const spId = selectedStudent.studyProgramId ?? null;
        selectedStudyProgramId = spId;
        scientificWork.studyProgramId = spId;

        if (spId) {
            studyProgramText = studyProgramById.get(spId) ?? "";
        } else {
            studyProgramText = "";
        }
    });

    $effect(() => {
        if (!kolloquiumUI.tag || !kolloquiumUI.zeit) {
            scientificWork.colloquium = null;
            return;
        }
        scientificWork.colloquium = `${kolloquiumUI.tag}T${kolloquiumUI.zeit}`;
    });

    function setDurationMinutes(minutesStr) {
        const minutes = Number(minutesStr);
        scientificWork.colloquiumDuration = Number.isFinite(minutes) && minutes > 0 ? `PT${minutes}M` : null;
    }

    function setStudyProgram(sp) {
        selectedStudyProgramId = sp.id;
        scientificWork.studyProgramId = sp.id;
        studyProgramText = sp.title;
    }

    function onStudyProgramTextInput(value) {
        studyProgramText = value;
        selectedStudyProgramId = null;
        scientificWork.studyProgramId = null;
    }

    function addVeranstaltung() {
        veranstaltungen = [...veranstaltungen, { name: "", tag: "" }];
        activeVeranstaltungIndex = veranstaltungen.length - 1;
    }

    function removeVeranstaltung() {
        if (veranstaltungen.length <= 1) return;
        if (isLastVeranstaltung) return;

        veranstaltungen = veranstaltungen.filter((_, i) => i !== activeVeranstaltungIndex);
        activeVeranstaltungIndex = Math.max(0, activeVeranstaltungIndex - 1);
    }

    function goToVeranstaltung(index) {
        if (index < 0 || index >= veranstaltungen.length) return;
        activeVeranstaltungIndex = index;
    }

    function updateVeranstaltungName(value) {
        const copy = [...veranstaltungen];
        copy[activeVeranstaltungIndex] = { ...copy[activeVeranstaltungIndex], name: value };
        veranstaltungen = copy;
    }

    function updateVeranstaltungTag(value) {
        const copy = [...veranstaltungen];
        copy[activeVeranstaltungIndex] = { ...copy[activeVeranstaltungIndex], tag: value };
        veranstaltungen = copy;
    }
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
                    />
                </div>

                <button class="btn create-btn" type="button" on:click={() => goto('/erstellen/student')}>
                    erstellen
                </button>
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
                    <textarea bind:value={scientificWork.title} placeholder="-"></textarea>
                </div>
            </div>

            <div class="grid-2">
                <div class="field">
                    <div class="sub-label">Startdatum</div>
                    <div class="input-shell">
                        <input type="date" bind:value={scientificWork.startDate} />
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Abgabedatum</div>
                    <div class="input-shell">
                        <input type="date" bind:value={scientificWork.endDate} />
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
                        <input type="date" bind:value={kolloquiumUI.tag} />
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Zeit</div>
                    <div class="input-shell">
                        <input type="time" bind:value={kolloquiumUI.zeit} />
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Dauer</div>
                    <div class="input-shell">
                        <select on:change={(e) => setDurationMinutes(e.target.value)}>
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
                        <input type="time" bind:value={scientificWork.presentationStart} />
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Präsentation bis</div>
                    <div class="input-shell">
                        <input type="time" bind:value={scientificWork.presentationEnd} />
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Diskussion von</div>
                    <div class="input-shell">
                        <input type="time" bind:value={scientificWork.discussionStart} />
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Diskussion bis</div>
                    <div class="input-shell">
                        <input type="time" bind:value={scientificWork.discussionEnd} />
                    </div>
                </div>
            </div>

            <div class="field">
                <div class="sub-label">Kolloquiumsstandort*</div>
                <div class="input-shell">
                    <input type="text" bind:value={scientificWork.colloquiumLocation} placeholder="-" />
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

                    {#each Array.from({ length: veranstaltungen.length }, (_, i) => i) as i}
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
                    <div class="sub-label">Name</div>
                    <div class="input-shell">
                        <input
                                type="text"
                                placeholder="-"
                                value={activeVeranstaltung.name}
                                on:input={(e) => updateVeranstaltungName(e.target.value)}
                        />
                    </div>
                </div>

                <div class="field">
                    <div class="sub-label">Tag</div>
                    <div class="input-shell">
                        <input
                                type="date"
                                value={activeVeranstaltung.tag}
                                on:input={(e) => updateVeranstaltungTag(e.target.value)}
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
                        <button type="button" class="input-shell action-shell remove-shell" on:click={removeVeranstaltung}>
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

    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 10px;

    max-height: 800px;
    overflow-y: auto;
    font-family: "Inter", sans-serif;
  }

  .card { padding: 16px; }

  .section { display: flex; flex-direction: column; gap: 10px; }
  .section-title { font-weight: 700; font-size: 14px; }

  .divider { height: 1px; background: #EEF0F4; margin: 14px 0; }

  .row-inline { display: flex; gap: 10px; }
  .student-row { align-items: center; }
  .grow { flex: 1; min-width: 0; }

  .label { font-weight: 600; font-size: 13px; margin-bottom: 6px; }
  .sub-label { font-weight: 600; font-size: 12px; margin-bottom: 6px; }

  .field { display: flex; flex-direction: column; gap: 6px; }

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

  .textarea { height: auto; align-items: flex-start; }
  .textarea textarea { min-height: 70px; resize: vertical; }

  .btn {
    border: 1px solid #E7EAF0;
    border-radius: 12px;
    padding: 10px 14px;
    height: 46px;
    background: #fff;
    cursor: pointer;
    white-space: nowrap;
  }

  .create-btn { height: 50px; }

  .pills { display: flex; gap: 8px; flex-wrap: wrap; }

  .pill {
    border: 1px solid #E7EAF0;
    border-radius: 10px;
    padding: 6px 10px;
    font-size: 12px;
    cursor: pointer;
    background: #fff;
    font-weight: 600;
  }

  .pill.active { border-color: #111; }

  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .grid-3-kollo { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 12px; align-items: end; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; align-items: end; }
  .grid-3-event { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: end; }

  .veranstaltung-header { display: flex; justify-content: space-between; align-items: center; }
  .pager { display: flex; gap: 8px; align-items: center; }

  .pager-arrow { border: none; background: transparent; cursor: pointer; font-size: 16px; padding: 0; }
  .pager-arrow:disabled { opacity: 0.3; cursor: default; }

  .pager-num { border: none; background: transparent; cursor: pointer; font-size: 14px; padding: 0; }
  .pager-num.active { color: #2f7d32; font-weight: 700; }

  .action-shell {
    justify-content: center;
    width: 100%;
    padding: 0;
    cursor: pointer;
    user-select: none;
  }

  .plus-shell { font-size: 24px; font-weight: 500; }
  .remove-shell { font-size: 13px; font-weight: 600; }

  .action-shell:hover { background: #fafafa; }

</style>
