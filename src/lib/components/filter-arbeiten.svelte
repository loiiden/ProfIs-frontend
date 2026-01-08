<script>
    import DetailView from "$lib/components/overview-arbeit.svelte";
    import CommentArbeit from "$lib/components/overview/comment-arbeit.svelte";

    let search = "";

    let selectedIndex = null;
    $: selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;


    let items = [
        {
            id: 1,
            title: "Loick",
            status: "in Planung",
            arbeit: "Bachelorthesis",
            course: "B.S Softwaretechnologie",
            startDatum: "2025-09-04",
            abgabe: "2025-12-01",
            korrektur: "2025-12-02",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        },
        {
            id: 2,
            title: "Max",
            status: "in Bearbeitung",
            arbeit: "Masterarbeit",
            course: "Mathematik",
            startDatum: "2025-04-09",
            abgabe: "2025-09-12",
            korrektur: "2025-12-01",
            besprechung: "2025-12-09",
            kolloquium: "2026-01-01",
            referent: "Dr. Grüne",
            referentNote: "2.0",
            korreferent: "Mustermann",
            koNote: "2.5",
            gesamtnote: "2.2"
        },
        {
            id: 3,
            title: "Mena",
            status: "Korrektur",
            arbeit: "Bachelorthesis",
            course: "Maschinenbau",
            startDatum: "2025-09-04",
            abgabe: "2025-12-09",
            korrektur: "2026-02-12",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        },
        {
            id: 4,
            title: "Anton Rodenwald",
            status: "Abgeschlossen",
            arbeit: "Bachelorthesis",
            course: "Bau IW",
            startDatum: "2025-09-04",
            abgabe: "2025-12-09",
            korrektur: "2026-02-12",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        },
        {
            id: 5,
            title: "Anton Baranov",
            status: "Abgebrochen",
            arbeit: "Masterabeit",
            course: "B.S Softwaretechnologie",
            startDatum: "2025-09-04",
            abgabe: "2025-12-09",
            korrektur: "2026-02-12",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        },
        {
            id: 6,
            title: "Kiro Laban",
            status: "Korrektur",
            arbeit: "Praxisprojekt",
            course: "BWL",
            startDatum: "2025-09-04",
            abgabe: "2025-12-09",
            korrektur: "2026-02-12",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        },
        {
            id: 7,
            title: "Max Zoll",
            status: "Abgebrochen",
            arbeit: "Bachelorthesis",
            course: "B.S Softwaretechnologie",
            startDatum: "2025-09-04",
            abgabe: "2025-12-09",
            korrektur: "2026-02-12",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        },
        {
            id: 8,
            title: "Loick Gandonou",
            status: "Abgeschlossen",
            arbeit: "Masterabeit",
            course: "B.S Softwaretechnologie",
            startDatum: "2025-09-04",
            abgabe: "2025-12-09",
            korrektur: "2026-02-12",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        },
        {
            id: 9,
            title: "Marcel Mena",
            status: "in Bearbeitung",
            arbeit: "Praxisprojekt",
            course: "Maschinenbau",
            startDatum: "2025-09-04",
            abgabe: "2025-12-09",
            korrektur: "2026-02-12",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        },
        {
            id: 10,
            title: "Maksim",
            status: "in Bearbeitung",
            arbeit: "Bachelorthesis",
            course: "Mathematik",
            startDatum: "2025-09-04",
            abgabe: "2025-12-09",
            korrektur: "2026-02-12",
            besprechung: "2026-04-25",
            kolloquium: "2026-07-25",
            referent: "Dr. Grüne",
            referentNote: "1.0",
            korreferent: "Mustermann",
            koNote: "1.5",
            gesamtnote: "1.5"
        }
    ]

    $: filteredItems = items.filter(item =>
        item.title.toLowerCase().includes(search.toLowerCase())
    );

    function getStatusClass(status) {
        switch (status) {
            case "in Planung":
                return "status planning";
            case "Korrektur":
                return "status correction";
            case "Abgeschlossen":
                return "status done";
            case "in Bearbeitung":
                return "status progress";
            case "Abgebrochen":
                return "status canceled";
        }
    }

    function showDetails(item) {
        selectedItem = item;
    }

    function prev() {
        if (selectedIndex > 0) selectedIndex--;
    }

    function next() {
        if (selectedIndex < filteredItems.length - 1) selectedIndex++;
    }

</script>

<div class="filter-arbeiten-container stroke-style">
    <h2>Arbeiten</h2>

    <input
            type="text"
            placeholder="Arbeit suchen..."
            bind:value={search}
    />

    <div class="scroll-area">
        {#each filteredItems as item, i}
            <div class="list-item">
                <button
                        class="detail-btn {selectedIndex === i ? 'active' : ''}"
                        on:click={() => selectedIndex = i}
                ></button>

                <div class="title">{item.title}</div>
                <div class={getStatusClass(item.status)}>{item.status}</div>
            </div>
        {/each}
    </div>

</div>

<style lang="scss">
  .filter-arbeiten-container {
    grid-column-start: 8;
    grid-column-end: 13;
    grid-row-start: 2;
    grid-row-end: 12;

    box-sizing: border-box;
    background-color: #FFFFFF;
    padding: 12px;
    border-radius: 10px;
  }

  .scroll-area {
    max-height: 400px;
    overflow-y: auto;
    padding-right: 5px;
  }

  .title {
    flex: 1;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    margin-bottom: 8px;
    background: white;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  input {
    width: 90%;
    padding: 10px;
    margin-bottom: 16px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
  }

  .status {
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.8rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .detail-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #ddd;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .detail-btn:hover {
    background: #ccc;
  }

  .detail-btn.active {
    background: #444;
    color: white;
  }

  .planning {
    color: $note2;
  }

  .correction {
    color: $note4;
  }

  .done {
    color: $note1;
  }

  .progress {
    color: $note3;
  }

  .canceled {
    color: $note5;
  }

</style>


<DetailView
        item={selectedItem}
        index={selectedIndex}
        count={filteredItems.length}
        prev={prev}
        next={next}
/>

<CommentArbeit kommentar="asdfas dfasd fasdfa sdfasd fasdf asdfas dfasdfasd fasdf asdfasdf
asdfas dfasdfasdfa sdfasdfas dfasdfa sdfasdfa sdfasd fasdfasd fasdfasdf
asdfas dfasdfas dfasdfas dfasd fas dfasdfa sdfasd fasd fasdf asdf asdfasdf
asdfas dfasdfas dfasdfas dfasd fas dfasdfa sdfasd fasd fasdf asdf asdfasdf
asdfas dfasdfas dfasdfas dfasd fas dfasdfa sdfasd fasd fasdf asdf asdfasdf
asdfas dfasdfas dfasdfas dfasd fas dfasdfa sdfasd fasd fasdf asdf asdfasdf"/>