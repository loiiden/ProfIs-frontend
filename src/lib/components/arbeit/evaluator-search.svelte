<script>
    // Such-Icon (derzeit nicht verwendet)
    import searchIcon from '$lib/assets/search.svg';

    let { 
        data = [], 
        placeholder = "Suche", 
        selectedEvaluator = $bindable(null) 
    } = $props();

    let searchTerm = $state("");
    let showDropdown = $state(false);

    // Abgeleitete Liste: Filtert `data` anhand von Vor-/Nachname, 
    let filtered = $derived(
        data.filter(p => 
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    // Eine Person auswählen: Wert setzen, Suchtext mit vollem Namen füllen,
    function select(person) {
        selectedEvaluator = person;
        searchTerm = `${person.firstName} ${person.lastName}`;
        showDropdown = false;
    }

    // Auswahl zurücksetzen: Person auf `null`, Suchtext leeren, Dropdown anzeigen (wenn man draufklickt)
    function clear() {
        selectedEvaluator = null;
        searchTerm = "";
        showDropdown = true;
    }
</script>

<div class="search-component">
    <div class="input-container">
        <!-- Fall 1: Schon eine Person gewählt → als Button anzeigen (Klick = `clear()`) -->
        {#if selectedEvaluator}
             <button class="display-value" onclick={clear} aria-label="Auswahl ändern">
                {selectedEvaluator.firstName} {selectedEvaluator.lastName}
             </button>
        {:else}
             <!-- Fall 2: Noch keine Person gewählt → Eingabefeld für Suche anzeigen -->
             <div class="input-wrapper">
                <input 
                    type="text" 
                    {placeholder} 
                    bind:value={searchTerm}
                    onfocus={() => showDropdown = true}
                    oninput={() => showDropdown = true}
                />
                
                {#if filtered.length === 0 && searchTerm.length > 0}
                    <!-- Keine Treffer, aber Suchtext vorhanden → Erstellen Button zu Referent erstellen -->
                    <a 
                        href="/erstellen/referent" 
                        target="_blank" 
                        class="create-btn"
                        style="text-decoration: none; display: inline-block; text-align: center;"
                    >
                        erstellen
                    </a>
                {/if}
             </div>
        {/if}
    </div>

    <!-- Dropdown anzeigen, wenn sichtbar, keine Person gewählt, Suchtext vorhanden und Treffer existieren -->
    {#if showDropdown && !selectedEvaluator && searchTerm.length > 0 && filtered.length > 0}
        <div class="dropdown-list">
            {#each filtered as person}
                <!-- Eintrag anklicken, um Person zu wählen -->
                <button class="list-item" onclick={() => select(person)}>
                    {person.firstName} {person.lastName}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
    /* Keine Imports nötig hier, wir nutzen feste Farben für dieses Element */

    /* Äußerer Wrapper */
    .search-component {
        position: relative;
        width: 100%;
        font-family: "Inter", sans-serif;
    }

    /* Rahmen und Layout des Eingabebereichs, inkl. Fokuszustand */
    .input-container {
        height: 50px;
        background: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 6px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
        transition: border-color 0.2s;

        &:focus-within {
            border-color: #ccc;
        }
    }

    /* Darstellung der gewählten Person als klickbarer Text */
    .display-value {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        font-size: 16px;
        color: #000;
        cursor: pointer;
        padding: 0;
        font-family: "Inter";
    }

    /* Wrapper um Eingabefeld und optionalen "erstellen"-Button */
    .input-wrapper {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: space-between;

        input {
            border: none;
            outline: none;
            font-size: 16px;
            color: #3B4B55;
            width: 100%;
            font-family: "Inter";

            &::placeholder {
                color: #A0A0A0;
            }
        }
    }

    /* Optionaler Button, wenn keine Treffer existieren */
    .create-btn {
        background: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 6px;
        padding: 6px 16px;
        font-size: 14px;
        font-weight: 500;
        color: #000;
        cursor: pointer;
        margin-left: 10px;
        white-space: nowrap;
        font-family: "Inter";

        &:hover {
            background-color: #f7f7f7;
        }
    }

    /* Dropdown-Liste mit Treffern */
    .dropdown-list {
        position: absolute;
        top: 55px;
        left: 0;
        width: 100%;
        background: white;
        border: 1px solid #E9E9E9;
        border-radius: 6px;
        box-shadow: 0px 4px 12px rgba(0,0,0,0.05);
        z-index: 20;
        max-height: 200px;
        overflow-y: auto;

        .list-item {
            display: block;
            width: 100%;
            text-align: left;
            padding: 12px 16px;
            background: none;
            border: none;
            border-bottom: 1px solid #f0f0f0;
            cursor: pointer;
            font-size: 14px;
            color: #3B4B55;
            font-family: "Inter";

            &:last-child { border-bottom: none; }
            &:hover { background-color: #f9f9f9; }
        }
    }
</style>