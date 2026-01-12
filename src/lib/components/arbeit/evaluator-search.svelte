<script>
    //KI: ChatGPT5.2 Thinking & Github Copilot Claude Opus 4: Verbessere und Kontrolliere meinen Code. Wenn du Sachen siehst die, nicht Funktionieren, sage mir bescheid und gebe verbesserungsvorschläge; übernommen und angepasst



    // Such-Icon (derzeit nicht verwendet)
    import searchIcon from '$lib/assets/search.svg';

    //Neu: Import für Refresh-Button
    import { invalidateAll } from '$app/navigation';

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
    <div class="search-wrapper">

        <div class="input-container">
            <!-- KI: Gemini 3 Pro: Ich möchte, dass wenn ich suche, und noch kein Treffer gefunden wurde, ein Button zum Erstellen eines neuen Referenten erscheint, übernommen -->
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

        <button 
            class="refresh-btn" 
            onclick={() => invalidateAll()} 
        >
            ⟳
        </button>

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
    //KI: ChatGPT 5.2 Thinking: Fragen zu einzelnen CSS befehlen und Funktionen, angelehnt an/übernommen

    /* Keine Imports -> feste Farben */

    /* Äußerer Wrapper */
    .search-component {
        position: relative;
        width: 100%;
        font-family: "Inter", sans-serif;
    }

    /* Äußerer Wrapper (Layout) um Input + Refresh-Button nebeneinander zu halten */
    .search-wrapper {
        display: flex;
        gap: 10px;
        align-items: center;
        width: 100%;
    }

    /* Rahmen und Layout des Eingabebereichs, inkl. Fokuszustand */
    .input-container {
        flex-grow: 1;
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

    /* Refresh-Button zum Aktualisieren der Liste */
    .refresh-btn {
        flex-shrink: 0;
        width: 50px;
        height: 50px;
        background: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 6px;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #3B4B55;
        transition: background-color 0.2s;
        font-family: "Inter", sans-serif;

        &:hover {
            background-color: #f7f7f7;
        }

        &:active {
            background-color: #e0e0e0;
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
