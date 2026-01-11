<script>
    import EvaluatorSearch from '$lib/components/arbeit/evaluator-search.svelte';  //wiederverwenden von Referentensuche
    import { POST } from '$lib/functions';
    import { invalidateAll } from '$app/navigation';
    import { api_url } from '$lib/constants';

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
    let newProgramDegree = $state("");

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

    // Baut den zu sendenden Titel nach Schema: "<Kürzel> in <Titel>", nach Telefonat mit Loick nicht mehr erwünscht
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
            // title: formatProgramTitle(newProgramName, newProgramDegree), // Titel mit Abschluss-Kürzel präfixen, nach Anruf mit Loick entfernt
            title: newProgramName, //Stattdessen nur der Titel
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

// --- TEIL 3: EXCEL IMPORT/EXPORT ---
let serverFilePath = $state("");

//Funktion um Pfad zu formatieren und zu validieren
function normalizePath(input) {
    const raw = (input ?? "").trim();
    if (!raw) return { ok: false, error: "Bitte geben Sie den Pfad zur Datei an." };

    // 1) ohne Quotes
    if (!raw.startsWith('"') && !raw.startsWith("'") && !raw.endsWith('"') && !raw.endsWith("'")) {
        return { ok: true, path: raw };
    }

    // 2) mit "..."
    if (raw.length >= 2 && raw.startsWith('"') && raw.endsWith('"')) {
        const inner = raw.slice(1, -1).trim();
        if (!inner) return { ok: false, error: "Bitte geben Sie den Pfad zur Datei an." };
        return { ok: true, path: inner };
    }

    // 3) mit '...'
    if (raw.length >= 2 && raw.startsWith("'") && raw.endsWith("'")) {
        const inner = raw.slice(1, -1).trim();
        if (!inner) return { ok: false, error: "Bitte geben Sie den Pfad zur Datei an." };
        return { ok: true, path: inner };
    }

    // alles andere
    return { ok: false, error: "Ungültiger Pfad: Bitte entweder ohne Anführungszeichen oder mit passenden \"...\" bzw. '...' einfügen." };
}

async function importExcel() {
    const normalized = normalizePath(serverFilePath);

    if (!normalized.ok) {
        alert(normalized.error);
        return;
    }

    try {
        let res = await POST(`/api/data/import?file=${encodeURIComponent(normalized.path)}`, {});
        if (res.ok) {
            let msg = await res.text();
            // Übersetze englische Erfolgsmeldung ins Deutsche
            if (msg && msg.trim() === "Successfully imported Excel data to database") {
                alert("Excel-Daten wurden erfolgreich importiert!");
            } else {
                alert(msg || "Import erfolgreich!");
            }
            invalidateAll();
        } else {
            alert("Fehler beim Importieren (Prüfen Sie den Pfad).");
        }
    } catch (e) {
        console.error(e);
        alert("Verbindungsfehler beim Import.");
    }
}

function exportExcel() {
    window.open(`${api_url}/api/data/export`, '_blank');
}


    // --- TEIL 4: DATENBANK ZURÜCKSETZEN ---
    async function resetDatabase() {
        if(!confirm('Sind Sie sicher, dass Sie alle Daten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden!')) {
            return;
        }

        try {
            let res = await fetch(`${api_url}/api/data/reset`, {
                method: 'DELETE'
            });

            if(res.ok) {
                alert('Datenbank wurde erfolgreich zurückgesetzt.');
                invalidateAll();
                window.location.reload();
            } else {
                alert('Fehler beim Zurücksetzen der Datenbank.');
                invalidateAll();
                window.location.reload();
            }
        } catch (e) {
            console.error(e);
            alert('Verbindungsfehler beim Zurücksetzen.');
        }
    }
</script>

<main class="settings-container">
    <div class="page-header">
        <div class="page-title">EINSTELLUNGEN</div>
        <a href="settings/user-documentation" class="help-btn">Hilfe</a>
    </div>

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
            <select class="input-degree" bind:value={newProgramDegree} required>
                <option value="" disabled selected>Abschluss wählen</option>
                {#each degreeOptions as opt}
                    <option value={opt.value}>{opt.label}</option>
                {/each}
            </select>

            <button class="add-btn" onclick={addStudyProgram}>+</button>
        </div>
    </div>

    <div class="card excel-section">
        <div class="headline-s">Daten Import/Export</div>
        <p class="description">
            Hier können Sie Daten über Excel-Listen importieren und exportieren. <br>
            <span style="font-size: 0.9em; opacity: 0.8;">Hinweis: Um eine Datei zu importieren, geben Sie bitte den Pfad zu der Datei an.</span>
        </p>

        <div class="excel-row">
            <input 
                class="input-path" 
                type="text" 
                placeholder="Datei-Pfad (z.B. C:\Users\mena2\Documents\ProfisExcel.xlsx)" 
                bind:value={serverFilePath} 
            />
            <button class="save-btn" onclick={importExcel}>Importieren</button>
        </div>

        <div class="excel-row" style="margin-top: 15px;">
            <span class="export-label">
                Datenbankstand sichern:
            </span>
            <button class="secondary-btn" onclick={exportExcel}>Exportieren</button>
        </div>
    </div>

    <!-- TEIL 4: GEFAHRENZONE -->
    <div class="card danger-section">
        <div class="headline-s danger-title">ProfIS zurücksetzen</div>
        <p class="description">
            Hier können Sie alle Daten in ProfIS vollständig löschen.<br>
            Dabei werden sämtliche gespeicherten Informationen unwiderruflich gelöscht.<br><br>
            Wenn Sie die Daten später noch benötigen, exportieren Sie diese bitte vorher als Backup. Bitte beachten Sie, dass Events nicht mitgesichert werden.<br><br>
            <strong class="danger-warning">Diese Aktion kann nicht rückgängig gemacht werden.</strong>
        </p>
        <button class="danger-btn" onclick={resetDatabase}>Alle Daten löschen</button>
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

    /* Seitentitel-Bereich */
    .page-header {
        grid-column: 1 / 13;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        margin-top: 20px;
    }

    .page-title {
        font-size: 2em;
    }

    .help-btn {
        background-color: #FDF8F8;
        color: black;
        border: 1px solid #E9E9E9;
        text-decoration: none;
        padding: 10px 20px;
        border-radius: 6px;
        font-family: "Inter";
        font-size: 14px;
        font-weight: 600;
        transition: background 0.2s;

        &:hover { background-color: #FFF0F0; }
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

    /* --- User Section --- */
    .user-section {
        grid-column: 1 / 7;
        grid-row: 2 / 3;
    }

    .input-row {
        display: flex;
        gap: 15px;
        align-items: stretch;
    }

    .search-wrapper {
        flex-grow: 1;
        
        :global(.search-wrapper) {
            align-items: stretch;
        }
        
        :global(.input-container) {
            height: 38px;
        }
        
        :global(.refresh-btn) {
            height: 38px;
            width: 38px;
        }
        
        :global(.input-wrapper input) {
            font-size: 14px;
            color: black;
            
            &::placeholder {
                color: #A0A0A0;
            }
        }
        
        :global(.display-value) {
            font-size: 14px;
            color: black;
        }
    }

    /* --- Program Section Layout --- */
    .program-section {
        grid-column: 7 / 13;
        grid-row: 2 / 4; 
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
        grid-template-columns: 1fr auto;
        padding: 0 12px;
        font-size: 12px;
        font-weight: 600;
        color: $tertiary;
        margin-bottom: 5px;
    }

    .program-row {
        display: grid;
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
        margin-top: auto; 
        input, select {
            padding: 10px;
            border: 1px solid #E9E9E9;
            border-radius: 6px;
            outline: none;
            font-family: "Inter";
            font-size: 14px;
            background-color: white;
            color: black;
            &::placeholder { color: #A0A0A0; }
            &:focus { border-color: #ccc; }
        }

        /* Breiten der Eingabefelder */
        .input-title { flex-grow: 3; }
        .input-sws { width: 50px; }
        .input-degree { 
            flex-grow: 1; 
            cursor: pointer;
            
            &:invalid {
                color: #A0A0A0;
            }
            
            option {
                color: black;
            }
        }
    }

    /* --- Excel Section (angepasst) --- */
    .excel-section {
        grid-column: 1 / 7;
        grid-row: 3 / 4; /* Auch länger gemacht, passend zur rechten Seite */
        justify-content: center; /* Inhalt vertikal mittig, wenn Platz da ist */
    }
    
    .excel-row {
        display: flex;
        align-items: center;
        gap: 15px;
        width: 100%;
    }

    .input-path {
        flex-grow: 1;
        padding: 10px;
        border: 1px solid #E9E9E9;
        border-radius: 6px;
        font-family: "Inter";
        font-size: 14px;
        color: black;
        &::placeholder { color: #A0A0A0; }
        &:focus { border-color: #ccc; outline: none; }
    }
    
    .export-label {
        flex-grow: 1;
        font-size: 14px;
        font-weight: 500;
        color: $secondary; /* Dunkelgrau/Schwarz */
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
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 16px;
        height: 38px;
        box-sizing: border-box;

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

    /* --- Danger Section --- */
    .danger-section {
        grid-column: 1 / 13;
        grid-row: 4 / 5;
        border: 1px solid #FFCDD2;
        background-color: #FFFAFA;
    }

    .danger-title {
        color: #D32F2F;
    }

    .danger-warning {
        color: #D32F2F;
    }

    .danger-btn {
        background-color: #D32F2F;
        color: white;
        padding: 10px 20px;
        font-weight: 600;
        align-self: flex-start;

        &:hover { 
            background-color: #B71C1C;
        }
    }
</style>
