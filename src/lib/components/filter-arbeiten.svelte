<script>
    import searchimg from '$lib/assets/search.svg';

    import DetailView from "$lib/components/overview-arbeit.svelte";
    import CommentArbeit from "$lib/components/overview/comment-arbeit.svelte";

    let search = "";
    
    let selectedIndex = null;
    $: selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null;

    let items = [
        {
            id: 1,
            title: "Loick",
            status: "FINAL_SUBMISSION",
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
            status: "PROPOSAL",
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
            status: "REVIEW",
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
            status: "ARCHIVE",
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
            status: "ABORT",
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
            status: "FINAL_SUBMISSION",
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
            status: "DISCUSSION",
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
            status: "ARCHIVE",
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
            status: "DISCUSSION",
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
            status: "ABORT",
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

    const color_mapping = {
        "PROPOSAL": "#7D8398",
        "DISCUSSION": "#24B6D8",
        "FINAL_SUBMISSION": "#65A839",
        "REVIEW": "#2e5812",
        "ARCHIVE": "#333C70",
        "ABORT": "#AF4357"
    }

    const status_mapping = {
        "PROPOSAL": "In Planung",
        "DISCUSSION": "Besprochen",
        "FINAL_SUBMISSION": "Abgegeben",
        "REVIEW": "Korrektur",
        "ARCHIVE": "Archiviert",
        "ABORT": "Abgebrochen"
    }

    import archive from '$lib/assets/archive.svg';
    import bookmark from '$lib/assets/bookmark.svg';
    import checkmark from '$lib/assets/checkmark.svg';
    import cross from '$lib/assets/cross.svg';
    import hourglasssplit from '$lib/assets/hourglass-split.svg';
    import pen from '$lib/assets/pen.svg';

    const img_mapping = {
        "PROPOSAL": bookmark,
        "DISCUSSION": pen,
        "FINAL_SUBMISSION": checkmark,
        "REVIEW": hourglasssplit,
        "ARCHIVE": archive,
        "ABORT": cross
    }
</script>

<div class="filter-arbeiten-container stroke-style">
    <h2>Arbeiten</h2>

    <div class="search">
        <img src={searchimg} alt="">
        <input
                type="text"
                class="search-input"
                placeholder="Suche nach Studenten"
                bind:value={search}
        />
    </div>

    <div class="scroll-area">
        {#each filteredItems as item, i}
            <div class="list-item stroke-style">
                <button
                        class="detail-btn {selectedIndex === i ? 'active' : ''}"
                        on:click={() => selectedIndex = i}
                ></button>

                <div class="left-side">
                    <div class="style-med">{item.title}</div>
                    <div  class="style-small">{item.course}</div>
                    <div  class="style-small">Hier sollte ein langer Titel der Wissenschaftlichen Arbeit stehen, der sich über mehrere Zeilen erstreckt</div>
                </div>
                
                <span class="swork-status" style:color="{color_mapping[item.status]}">
                    <p><img src={img_mapping[item.status]} alt=""></p>
                    <p>{status_mapping[item.status]}</p>
                    <p>24.03.2026</p>
                </span>
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

    h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #000;
    }

    .search {
        padding: 12px 0px;
        font-size: 14px;
        border-radius: 6px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 60%;
        
        * {
            padding: 6px;
        }

        input {
            border: none;
            font-size: 14px;
            font-weight: 400;
            width: 80%;
            outline: none;
        }
    }
  }

  .scroll-area {
    height: 82%;
    overflow: auto;
    padding-right: 5px;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    margin-bottom: 8px;
    background: white;
    border-radius: 6px;
  }

  .left-side {
    width: 73%;
  }

  input {
    width: 60%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
  }

.swork-status {
    width: 15%;
    font-size: 12px;
    font-weight: 600;

    p {
        margin: 0px;

        img {
            width: 12px;
        }
    }

    * {
        padding: 1px 0px;
    }
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

.style-small {
    font-size: 14px;
    font-family: 'Inter';
}

.style-med {
    font-size: 14px;
    font-family: 'Inter SB';
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