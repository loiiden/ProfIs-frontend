<script>
    import EvaluatorSearch from '$lib/components/arbeit/evaluator-search.svelte';  //wiederverwenden von Referentensuche
    import { POST } from '$lib/functions';
    import { invalidateAll } from '$app/navigation';
    import { api_url } from '$lib/constants'; // Annahme: api_url importieren oder relative pfade nutzen

    let { data } = $props();

    // --- TEIL 1: BENUTZER ---
    let selectedUser = $state(data.currentUser || null);

    async function saveUser() {
        if(!selectedUser) return;
        
        // ENDPUNKT: /api/evaluator/main-user/{id}
        let res = await POST(`/api/evaluator/main-user/${selectedUser.id}`);
        
        if (res.ok) {
            //alert(`Benutzer ${selectedUser.firstName} ${selectedUser.lastName} erfolgreich gespeichert!`); // Optional: Bestätigungspopup
            invalidateAll(); 
        } else {
            alert("Fehler beim Speichern des Benutzers.");
        }
    }

    // --- TEIL 2: STUDIENGÄNGE ---
    let newProgramName = $state("");
    let newProgramSws = $state("");
    let newProgramDegree = $state(""); // Speichert die Zahl (B=1, M=2 oder D=3)

    // Mapping auf API-Werte
    const degreeOptions = [
        // Bachelor
        { value: 'B_A', label: 'Bachelor of Arts (B.A.)' },
        { value: 'B_ENG', label: 'Bachelor of Engineering (B.Eng.)' },
        { value: 'B_SC', label: 'Bachelor of Science (B.Sc.)' },
        { value: 'B_LAWS', label: 'Bachelor of Laws (LL.B.)' },
        { value: 'BBA', label: 'Bachelor of Business Admin. (BBA)' },
        // Master
        { value: 'M_A', label: 'Master of Arts (M.A.)' },
        { value: 'M_SC', label: 'Master of Science (M.Sc.)' },
        { value: 'M_ENG', label: 'Master of Engineering (M.Eng.)' },
        { value: 'M_LAWS', label: 'Master of Laws (LL.M.)' },
        { value: 'MBA', label: 'Master of Business Admin. (MBA)' }
    ];

    // Kürzel-Mapping für die Titelpräfixe
    const degreeShortMap = {
        B_A: 'B.A.',
        B_ENG: 'B.Eng.',
        B_SC: 'B.Sc.',
        B_LAWS: 'LL.B.',
        BBA: 'BBA',
        M_A: 'M.A.',
        M_SC: 'M.Sc.',
        M_ENG: 'M.Eng.',
        M_LAWS: 'LL.M.',
        MBA: 'MBA'
    };

    // Liefert das Kurz-Kürzel (z.B. "B.Sc.") für den gewählten Abschluss
    function getDegreeShort(value) {
        return degreeShortMap[value] || value || '';
    }

    // Baut den zu sendenden Titel nach Schema: "<Kürzel> in <Titel>"
    function formatProgramTitle(title, degreeType) {
        const short = getDegreeShort(degreeType);
        return short ? `${short} in ${title}` : title;
    }

    async function addStudyProgram() {
        // Validierung: Alle Felder müssen gefüllt sein
        if(newProgramName.trim() === "" || newProgramSws === "" || newProgramDegree === "") {
            alert("Bitte alle Felder (Titel, SWS, Abschluss) ausfüllen.");
            return;
        }

        let payload = { 
            title: formatProgramTitle(newProgramName, newProgramDegree), // Titel mit Abschluss-Kürzel präfixen
            sws: Number(newProgramSws),
            degreeType: newProgramDegree // Sendet z.B. "B_SC"
        };
        
        // API Call 
        let res = await POST('/api/study-program', payload);
        
        if(res.ok) {
            newProgramName = "";
            newProgramSws = "";
            newProgramDegree = "";
            invalidateAll();
        } else {
            alert("Fehler beim Hinzufügen.");
        }
    }

    async function deleteStudyProgram(id) {
        //if(!confirm("Diesen Studiengang wirklich löschen?")) return; // Optional: Bestätigungspopup

        // Fetch direkt hier, da DELETE Helper in functions.js fehlt
        try {
            let res = await fetch(`${api_url}/api/study-program/${id}`, {
                method: 'DELETE'
            });

            if(res.ok) {
                invalidateAll();
            } else {
                alert("Konnte nicht gelöscht werden.");
            }
        } catch (e) {
            console.error(e);
            alert("Verbindungsfehler beim Löschen.");
        }
    }
</script>

<main class="settings-container">
    <div class="page-title">EINSTELLUNGEN</div>

    <!-- TEIL 1: BENUTZER -->
    <div class="card user-section">
        <div class="headline-s">Benutzer auswählen</div>
        <p class="description">
            Wählen Sie hier Ihren Namen als Benutzer aus.
            {#if data.currentUser}
                <br><br>
                <strong>Aktuell eingestellt:</strong> {data.currentUser.firstName} {data.currentUser.lastName}
            {/if}
        </p>
        
        <!-- Eingabe: Suchkomponente (evaluator-search) + Speichern-Button -->
        <div class="input-row">
            <div class="search-wrapper">
                <EvaluatorSearch 
                    data={data.referenten} 
                    bind:selectedEvaluator={selectedUser} 
                    placeholder="Benutzer/Referent suchen..."
                />
            </div>
            <button class="save-btn" onclick={saveUser}>Speichern</button>
        </div>
    </div>

    <!-- TEIL 2: STUDIENGÄNGE -->
    <div class="card program-section">
        <div class="headline-s">Studiengänge verwalten</div>
        
        <div class="program-list">
            <div class="list-header">
                <span></span>
                <span></span>
            </div>

            <!-- Anzeige: der (ggf. bereits mit Kürzel) zusammengesetzte Titel -->
            {#each data.studyPrograms as program}
                <div class="program-row">
                    <span class="program-name">{program.title}</span>
                    <button class="delete-btn" onclick={() => deleteStudyProgram(program.id)}>Löschen</button>
                </div>
            {/each}
        </div>

        <!-- Eingabe: Neue Studiengänge hinzufügen -->
        <div class="add-row">
            <input class="input-title" type="text" placeholder="Titel (z.B. Softwaretechnologie)" bind:value={newProgramName} />
            <input
                class="input-sws"
                type="number"
                placeholder="SWS"
                bind:value={newProgramSws}
                min="0"
                step="0.1"
                inputmode="decimal"
            />

            <!-- Dropdown für Abschluss -->
            <select class="input-degree" bind:value={newProgramDegree}>
                <option value="" disabled selected>Abschluss wählen</option>
                {#each degreeOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>

            <button class="add-btn" onclick={addStudyProgram}>+</button>
        </div>
    </div>
</main>

<style lang="scss">
    @import 'src/styles/colors.scss'; // Für $primary, $error etc.

    /* --- Gesamt-Layout --- */
    .settings-container {
        display: grid;
        grid-template-rows: repeat(16, auto);
        grid-template-columns: repeat(12, 1fr);
        column-gap: 20px;
        row-gap: 30px;
        padding-bottom: 50px;
        font-family: "Inter", sans-serif;
    }

    /* Seitentitel */
    .page-title {
        grid-column: 1 / 13;
        padding: 0 30px;
        font-size: 2em;
        margin-top: 20px;
    }

    /* Genereller Karten-Style (wie bei den anderen Seiten) */
    .card {
        background-color: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 10px;
        padding: 24px;
        display: flex;
        flex-direction: column;
    }

    /* --- Überschriften & Beschreibungen --- */
    .headline-s {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 10px;
    }

    .description {
        color: $tertiary; /* Grau aus colors.scss */
        font-size: 14px;
        margin-bottom: 20px;
        margin-top: 0;
        line-height: 1.5;
    }

    /* --- User Section Layout --- */
    .user-section {
        grid-column: 1 / 7; /* Linke Hälfte */
        grid-row: 2 / 8;
    }

    .input-row {
        display: flex;
        gap: 15px;
        align-items: stretch;
    }

    .search-wrapper {
        flex-grow: 1;
    }

    /* --- Program Section Layout --- */
    .program-section {
        grid-column: 7 / 13; /* Rechte Hälfte */
        grid-row: 2 / 12;    /* Etwas länger, da Liste */
    }

    .program-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
        max-height: 300px;
        overflow-y: auto;
    }

    .list-header {
        display: grid;
        /* GEÄNDERT: Nur noch 2 Spalten (Titel nimmt Platz, Button nimmt Rest) */
        grid-template-columns: 1fr auto; 
        padding: 0 12px;
        font-size: 12px;
        font-weight: 600;
        color: $tertiary;
        margin-bottom: 5px;
    }

    .program-row {
        display: grid;
        /* GEÄNDERT: Gleiches Grid wie Header */
        grid-template-columns: 1fr auto;
        align-items: center;
        padding: 12px;
        border: 1px solid #F4F4F4;
        border-radius: 6px;
        gap: 10px;

        .program-name {
            font-size: 14px;
            font-weight: 500;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    /* --- Neue Studiengänge hinzufügen --- */
    .add-row {
        display: flex;
        gap: 10px;
        margin-top: auto; /* Drückt es nach unten */

        input, select {
            padding: 10px;
            border: 1px solid #E9E9E9;
            border-radius: 6px;
            outline: none;
            font-family: "Inter";
            font-size: 14px;
            background-color: white;
            
            &:focus {
                border-color: #ccc;
            }
        }

        /* Breiten der Eingabefelder */
        .input-title { flex-grow: 2; }
        .input-sws { width: 60px; }
        .input-degree { flex-grow: 1; cursor: pointer; }
    }

    /* --- Buttons --- */
    button {
        cursor: pointer;
        border-radius: 6px;
        font-family: "Inter";
        font-size: 14px;
        font-weight: 600;
        border: none;
        padding: 10px 16px;
        transition: background 0.2s;
    }

    /* Gemeinsame Styles für Speichern- und Hinzufügen-Button */
    .save-btn, .add-btn {
        background-color: $primary;
        color: white;

        /* Match the search component height */
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 16px;

        &:hover { opacity: 0.9; }
    }

    /* Löschen-Button */
    .delete-btn {
        background-color: white;
        color: $error;
        border: 1px solid #E9E9E9;
        padding: 6px 12px;
        font-size: 12px;

        &:hover { background-color: #FFF0F0; }
    }
</style>