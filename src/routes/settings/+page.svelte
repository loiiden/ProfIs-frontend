<script>
    import EvaluatorSearch from '$lib/components/arbeit/evaluator-search.svelte';  //wiederverwenden von Referentensuche
    import { POST } from '$lib/functions';
    import { invalidateAll } from '$app/navigation';
    import { api_url } from '$lib/constants';
    import DownloadSwsReport from '$lib/components/download-sws-report.svelte';

    let { data } = $props();

    // --- TEIL 1: BENUTZER ---
    let selectedUser = $state(data.currentUser || null); // aktuell ausgewählter Benutzer (Evaluator)

    async function saveUser() {
        if(!selectedUser) return; // ohne Auswahl nichts speichern
        
        // ENDPUNKT: /api/evaluator/main-user/{id}
        // Speichert den aktuell ausgewählten Benutzer als "Main User"
        let res = await POST(`/api/evaluator/main-user/${selectedUser.id}`);
        
        if (res.ok) {
            //alert(`Benutzer ${selectedUser.firstName} ${selectedUser.lastName} erfolgreich gespeichert!`); // Optional: Bestätigungspopup
            invalidateAll(); // lädt Settings-Daten neu (damit UI direkt aktualisiert wird)
        } else {
            alert("Fehler beim Speichern des Benutzers.");
        }
    }

    // --- TEIL 2: STUDIENGÄNGE ---
    let newProgramName = $state("");    // Eingabefeld: Titel
    let newProgramSws = $state("");     // Eingabefeld: SWS
    let newProgramDegree = $state("");  // Eingabefeld: Abschluss (Enum-String)

    // Mapping auf API-Werte (degreeType wird als String an Backend gesendet)
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

    // Kürzel-Mapping für die Titelpräfixe (wird aktuell nicht zum Speichern verwendet, bleibt aber erhalten)
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

    // Baut den Titel für die Anzeige (Studiengang-Liste): "<Kürzel> in <Titel>"
    function formatProgramDisplay(program) {
        const title = (program?.title || "").trim();
        const short = getDegreeShort(program?.degreeType);

        if (!short) return title;

        return `${short} in ${title}`;
    }


    // Helper für UI: Prüft, ob Studiengänge vorhanden sind
    function hasStudyPrograms() {
        return Array.isArray(data?.studyPrograms) && data.studyPrograms.length > 0;
    }

    async function addStudyProgram() {
        // Validierung: Alle Felder müssen gefüllt sein
        if(newProgramName.trim() === "" || newProgramSws === "" || newProgramDegree === "") {
            alert("Bitte alle Felder (Titel, SWS, Abschluss) ausfüllen.");
            return;
        }

        // Payload so wie Backend es erwartet
        let payload = { 
            // title: formatProgramTitle(newProgramName, newProgramDegree), // Titel mit Abschluss-Kürzel präfixen, nach Anruf mit Loick entfernt
            title: newProgramName, //Stattdessen nur der Titel
            sws: Number(newProgramSws), // String -> Number (Backend erwartet Zahl)
            degreeType: newProgramDegree // Sendet z.B. "B_SC"
        };
        
        // API Call: legt Studiengang an
        let res = await POST('/api/study-program', payload);
        
        if(res.ok) {
            // Felder leeren + UI neu laden
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

        // Löscht Studiengang per REST-DELETE (Fetch direkt, weil DELETE Helper in functions.js fehlt)
        try {
            let res = await fetch(`${api_url}/api/study-program/${id}`, {
                method: 'DELETE'
            });

            if(res.ok) {
                invalidateAll(); // Liste neu laden
            } else {
                alert("Konnte nicht gelöscht werden.");
            }
        } catch (e) {
            console.error(e);
            alert("Verbindungsfehler beim Löschen.");
        }
    }

    // --- TEIL 3: EXCEL IMPORT/EXPORT ---
    let excelFile = $state(null);       // ausgewählte Excel-Datei (File Objekt)
    let isDragging = $state(false);     // UI-State für Drag&Drop Highlight
    let fileInput;                      // Referenz auf verstecktes <input type="file">

    // Öffnet den System-Dateidialog (Explorer)
    function openFilePicker() {
        fileInput?.click();
    }

    // Setzt die Datei + minimale Validierung (nur .xlsx zulassen)
    function setExcelFile(file) {
        if (!file) return;

        // Minimal-Validierung: nur .xlsx
        const name = (file?.name || "").toLowerCase();
        if (!name.endsWith(".xlsx")) {
            alert("Bitte eine .xlsx Datei auswählen.");
            return;
        }

        excelFile = file;
    }

    // Input-Change Handler (Datei über Explorer ausgewählt)
    function onFileChange(e) {
        const file = e?.target?.files?.[0];
        setExcelFile(file);
    }

    // Drag&Drop: sobald Datei in Dropzone kommt -> UI markieren
    function onDragEnter(e) {
        e.preventDefault();
        isDragging = true;
    }

    // Drag&Drop: über Dropzone halten -> UI markieren
    function onDragOver(e) {
        e.preventDefault();
        isDragging = true;
    }

    // Drag&Drop: Dropzone verlassen -> UI-Markierung entfernen
    function onDragLeave(e) {
        e.preventDefault();
        isDragging = false;
    }

    // Drag&Drop: Datei fallen lassen -> Datei übernehmen
    function onDrop(e) {
        e.preventDefault();
        isDragging = false;

        const file = e?.dataTransfer?.files?.[0];
        setExcelFile(file);
    }

    // Upload der Excel-Datei als multipart/form-data an /api/data/import
    async function importExcel() {
        if (!excelFile) {
            alert("Bitte wählen Sie eine Excel-Datei aus.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("excelFile", excelFile); // Backend erwartet key: excelFile

            let res = await fetch(`${api_url}/api/data/import`, {
                method: "POST",
                body: formData
            });

            if (res.ok) {
                let msg = await res.text();

                // Übersetze englische Erfolgsmeldung ins Deutsche
                if (msg && msg.trim() === "Successfully imported Excel data to database") {
                    alert("Excel-Daten wurden erfolgreich importiert!");
                } else {
                    alert(msg || "Import erfolgreich!");
                }

                // File-State resetten (damit danach auch die gleiche Datei erneut gewählt werden kann)
                excelFile = null;
                if (fileInput) fileInput.value = ""; // Reset, damit gleiche Datei erneut gewählt werden kann

                invalidateAll(); // lädt nach dem Import alle Daten neu (Studiengänge etc.)
            } else {
                // Backend liefert ggf. Textfehler zurück
                let err = "";
                try { err = await res.text(); } catch (_) {}
                alert(err ? `Fehler beim Importieren: ${err}` : "Fehler beim Importieren.");
            }
        } catch (e) {
            console.error(e);
            alert("Verbindungsfehler beim Import.");
        }
    }

    // Export startet einen Datei-Download in neuem Tab
    function exportExcel() {
        window.open(`${api_url}/api/data/export`, '_blank');
    }

    // --- TEIL 4: DATENBANK ZURÜCKSETZEN ---
    async function resetDatabase() {
        // Sicherheitsabfrage
        if(!confirm('Sind Sie sicher, dass Sie alle Daten löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden!')) {
            return;
        }

        try {
            // Löscht die kompletten DB
            let res = await fetch(`${api_url}/api/data/reset`, {
                method: 'DELETE'
            });

            if(res.ok) {
                alert('Datenbank wurde erfolgreich zurückgesetzt.');
                invalidateAll();
                window.location.reload(); // Hard-Reload, damit UI sicher "clean" ist
            } else {
                alert('Fehler beim Zurücksetzen der Datenbank.');
                invalidateAll();
                window.location.reload(); // ebenfalls reload, um evtl. inkonsistente UI zu vermeiden
            }
        } catch (e) {
            console.error(e);
            alert('Verbindungsfehler beim Zurücksetzen.');
        }
    }
</script>

<svelte:head>
    <title>Einstellungen - ProfIS</title>
</svelte:head>

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
        
        <!-- Liste hat fixe Höhe + Scroll -->
        <div class="program-list">
            <div class="list-header">
                <span></span>
                <span></span>
            </div>

            {#if hasStudyPrograms()}
                <!-- Anzeige: vorhandene Studiengänge -->
                {#each data.studyPrograms as program}
                    <div class="program-row">
                        <span class="program-name">{formatProgramDisplay(program)}</span>
                        <button class="delete-btn" onclick={() => deleteStudyProgram(program.id)}>Löschen</button>
                    </div>
                {/each}
            {:else}
                <!-- Effekt: Wird angezeigt, wenn keine Studiengänge vorhanden sind -->
                <div class="empty-programs">Keine Studiengänge vorhanden.</div>
            {/if}
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

            <!-- Button: Studiengang hinzufügen -->
            <button class="add-btn" onclick={addStudyProgram}>+</button>
        </div>
    </div>

    <div class="card excel-section">
        <div class="headline-s">Daten Import/Export</div>

        <div class="excel-row">
            <div
                class="dropzone"
                class:dragover={isDragging}
                onclick={openFilePicker}
                ondragenter={onDragEnter}
                ondragover={onDragOver}
                ondragleave={onDragLeave}
                ondrop={onDrop}
            >
                <!-- Excel-Datei für den Import auswählen (Drag & Drop oder Klick) -->
                <input
                    bind:this={fileInput}
                    type="file"
                    accept=".xlsx"
                    style="display: none;"
                    onchange={onFileChange}
                />

                {#if excelFile}
                    <!-- Anzeige: ausgewählte Datei -->
                    <span class="dropzone-text">{excelFile.name}</span>
                {:else}
                    <!-- Placeholder: keine Datei ausgewählt -->
                    <span class="dropzone-text dropzone-placeholder">Excel-Datei auswählen / Drag & Drop</span>
                {/if}
            </div>

            <!-- Import startet Upload, Button deaktiviert ohne Datei -->
            <button class="save-btn" onclick={importExcel} disabled={!excelFile}>Importieren</button>
        </div>

        <div class="excel-row" style="margin-top: 10px;">
            <span class="export-label">
                Datenbankstand sichern:
            </span>
            <!-- Export öffnet Download-Endpoint -->
            <button class="secondary-btn" onclick={exportExcel}>Exportieren</button>
        </div>
    </div>
    <DownloadSwsReport active = {selectedUser !== null}></DownloadSwsReport>

    <!-- TEIL 4: GEFAHRENZONE -->
    <div class="card danger-section">
        <div class="headline-s danger-title">ProfIS zurücksetzen</div>
        <p class="description">
            Hier können Sie alle Daten in ProfIS vollständig löschen.<br>
            Dabei werden sämtliche gespeicherten Informationen unwiderruflich gelöscht.<br><br>
            Wenn Sie die Daten später noch benötigen, exportieren Sie diese bitte vorher als Backup. Bitte beachten Sie, dass Events nicht mitgesichert werden.<br><br>
            <strong class="danger-warning">Diese Aktion kann nicht rückgängig gemacht werden.</strong>
        </p>
        <!-- Reset löscht DB komplett -->
        <button class="danger-btn" onclick={resetDatabase}>Alle Daten löschen</button>
    </div>
</main>

<style lang="scss">
    @import 'src/styles/colors.scss'; // Für $primary, $error etc.

    /* --- Gesamt-Layout (12-Spalten Grid) --- */
    .settings-container {
        display: grid;
        grid-template-rows: repeat(16, auto);
        grid-template-columns: repeat(12, 1fr);
        column-gap: 20px;
        row-gap: 30px;
        padding-bottom: 50px;
        font-family: "Inter", sans-serif;
    }

    /* Seitentitel-Bereich (oben) */
    .page-header {
        grid-column: 1 / 13;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30px;
        margin-top: 20px;
    }

    .page-title {
        font-size: 18px;
        font-weight: 600;
    }

    /* Help-Link als Button */
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

    /* Genereller Karten-Style (alle Sections) */
    .card {
        background-color: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 10px;
        padding: 24px;
        display: flex;
        flex-direction: column;
    }

    /* Überschriften in Cards */
    .headline-s {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 10px;
    }

    /* Standard Beschreibungstext (grau) */
    .description {
        color: $tertiary; /* Grau aus colors.scss */
        font-size: 14px;
        margin-bottom: 20px;
        margin-top: 0;
        line-height: 1.5;
    }

    /* --- User Section --- */
    .user-section {
        grid-column: 1 / 7;  /* linke Hälfte */
        grid-row: 2 / 3;
    }

    /* Row: Suche + Button */
    .input-row {
        display: flex;
        gap: 15px;
        align-items: stretch;
    }

    /* Wrapper um die Suchkomponente (damit Höhe/Styles passen) */
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
        grid-column: 7 / 13; /* rechte Hälfte */
        grid-row: 2 / 5; 
    }

    /* Liste der Studiengänge (fixe Höhe + Scroll, um Layout-Sprünge zu vermeiden) */
    .program-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 20px;
        height: 450px;
        //max-height: 300px; //mal schauen ob nötig
        overflow-y: auto;
    }

    /* Empty-State wenn keine Studiengänge existieren */
    .empty-programs {
        padding: 12px;
        border: 1px dashed #E9E9E9;
        border-radius: 6px;
        color: $tertiary;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 80px;
    }

    /* Header-Zeile über der Liste (aktuell ohne Labels) */
    .list-header {
        display: grid;
        grid-template-columns: 1fr auto;
        padding: 0 12px;
        font-size: 12px;
        font-weight: 600;
        color: $tertiary;
        margin-bottom: 5px;
    }

    /* Einzelner Eintrag in der Studiengang-Liste */
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

    /* --- Excel Section --- */
    .excel-section {
        grid-column: 1 / 7; /* linke Hälfte unter User */
        grid-row: 3 / 4;
        //justify-content: center; /* Inhalt vertikal mittig, wenn Platz da ist */
    }
    
    /* Row-Layout innerhalb Excel-Card */
    .excel-row {
        display: flex;
        align-items: center;
        gap: 15px;
        width: 100%;
    }

    /* Dropzone: kompakt, gleiche Höhe wie Buttons */
    .dropzone {
        flex-grow: 1;
        height: 38px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        border: 1px dashed #E9E9E9;
        border-radius: 6px;
        cursor: pointer;
        user-select: none;
        background-color: #FFFFFF;
        overflow: hidden;

        /* Highlight wenn Drag&Drop aktiv */
        &.dragover {
            background-color: #FDF8F8;
            border-color: #CCC;
        }
    }

    /* Text innerhalb Dropzone */
    .dropzone-text {
        font-size: 13px;
        color: black;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /* Placeholder-Styling */
    .dropzone-placeholder {
        color: $tertiary;
    }
    
    /* Label vor dem Export-Button */
    .export-label {
        flex-grow: 1;
        font-size: 14px;
        font-weight: 500;
        color: $secondary;
    }

    /* --- Buttons (global) --- */
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

    /* Primary Buttons (Speichern/Import/Add) */
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
        &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    /* Delete-Button in Liste */
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
        grid-column: 1 / 13; /* volle Breite */
        grid-row: 5 / 6;
        border: 1px solid #FFCDD2;
        background-color: #FFFAFA;
    }

    .danger-title {
        color: #D32F2F;
    }

    .danger-warning {
        color: #D32F2F;
    }

    /* Danger Button */
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
