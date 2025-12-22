<script>

    import {goto} from '$app/navigation';

    let student = { name: "", studiengang: "" };
    let arbeit = { titel: "", startdatum: "", enddatum: "" };
    let kolloquium = { tag: "", zeit: "", dauer: "", standort: "" };
    let veranstaltungen = [{ name: "", tag: "" }];

    function addVeranstaltung() {
        veranstaltungen = [...veranstaltungen, {name: "", tag: ""}];
    }

    function removeVeranstaltung(index) {
        veranstaltungen = veranstaltungen.filter((_, i) => i !== index);
    }

    function goToOtherPage() {
        goto('/erstellen/student');
    }

</script>

<div class="erfassen-daten-arbeit-container">
    <h1>Studentenverwaltung</h1>

    <h2>Student</h2>
    <div class="field">
        <label>Name</label>
        <input bind:value={student.name}/>
    </div>

    <div class="field">
        <label>Studiengang</label>
        <input bind:value={student.studiengang}/>
    </div>

    <button on:click={goToOtherPage}>
        erstellen
    </button>

    <h2>Arbeit</h2>
    <div class="field">
        <label>Titel</label>
        <input bind:value={arbeit.titel}/>
    </div>

    <div class="row">
        <div class="field">
            <label>Startdatum</label>
            <input type="date" bind:value={arbeit.startdatum}/>
        </div>

        <div class="field">
            <label>Enddatum</label>
            <input type="date" bind:value={arbeit.enddatum}/>
        </div>
    </div>

    <h2>Kolloquium</h2>
    <div class="row">
        <div class="field">
            <label>Tag</label>
            <input type="date" bind:value={kolloquium.tag}/>
        </div>

        <div class="field">
            <label>Zeit</label>
            <input type="time" bind:value={kolloquium.zeit}/>
        </div>
    </div>

    <div class="row">
        <div class="field">
            <label>Dauer (Minuten)</label>
            <input type="number" bind:value={kolloquium.dauer}/>
        </div>

        <div class="field">
            <label>Standort</label>
            <input bind:value={kolloquium.standort}/>
        </div>
    </div>

    <h2>Veranstaltungen</h2>

    {#each veranstaltungen as veranstaltung, index}
        <div class="veranstaltung">
            <div class="row">
                <div class="field">
                    <label>Name</label>
                    <input bind:value={veranstaltung.name}/>
                </div>

                <div class="field">
                    <label>Tag</label>
                    <input type="date" bind:value={veranstaltung.tag}/>
                </div>
            </div>

            {#if veranstaltungen.length > 1}
                <button on:click={() => removeVeranstaltung(index)}>
                    Entfernen
                </button>
            {/if}
        </div>
    {/each}

    <button on:click={addVeranstaltung}>
        ➕ Veranstaltung hinzufügen
    </button>
</div>

<style lang="scss">
  .erfassen-daten-arbeit-container {
    grid-column-start: 8;
    grid-column-end: 13;
    grid-row-start: 2;
    grid-row-end: 16;
    overflow-y: auto;
    max-height: 800px;
    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 12px;
    border-radius: 10px;
  }

  h2 {
    margin: 1.5rem 0 0.5rem;
    font-size: 1.1rem;
  }

  label {
    font-size: 0.85rem;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .field {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }

  .row {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  input, textarea {
    padding: 0.75rem;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    font-size: 0.95rem;
  }

  textarea {
    resize: vertical;
    min-height: 90px;
  }

  button {
    border-radius: 10px;
    border: 1px solid #e5e7eb;
    padding: 0.6rem 1rem;
    background: #fff;
    cursor: pointer;
    font-size: 0.9rem;
  }
</style>