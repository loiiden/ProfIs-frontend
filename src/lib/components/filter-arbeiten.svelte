<script>
    import DetailView from "$lib/components/overview-arbeit.svelte";

    let search = "";

    let selectedItem = null;
    let activeId = null;

    let items = [
        {id: 1, title: "Loick", status: "in Planung"},
        {id: 2, title: "Max", status: "in Bearbeitung"},
        {id: 3, title: "Mena", status: "Korrektur"},
        {id: 4, title: "Anton Rodenwald", status: "Abgeschlossen"},
        {id: 5, title: "Anton Baranov", status: "Abgebrochen"},
        {id: 6, title: "Kiro Laban", status: "Korrektur"},
        {id: 7, title: "Max Zoll", status: "Abgebrochen"},
        {id: 8, title: "Loick Gandonou", status: "Abgeschlossen"},
        {id: 9, title: "Marcel Mena", status: "in Bearbeitung"}
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
        activeId = item.id;
    }
</script>

<style lang="scss">
  .filter-arbeiten-container {
    grid-column-start: 8;
    grid-column-end: 13;
    grid-row-start: 2;
    grid-row-end: 12;

    box-sizing: border-box;
    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
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
    background: #dce7ff;
    color: #244b9b;
  }

  .correction {
    background: #ffe8c6;
    color: #8a5f0a;
  }

  .done {
    background: #d3fbd8;
    color: #155d15;
  }

  .progress {
    background: #ffe2a3;
    color: #8a5b00;
  }

  .canceled {
    background: #ffd2d2;
    color: #8a1a1a;
  }

</style>

<div class="filter-arbeiten-container">
    <h2>Arbeiten</h2>

    <input
            type="text"
            placeholder="Arbeit suchen..."
            bind:value={search}
    />

    <div class="scroll-area">
        {#each filteredItems as item}
            <div class="list-item">
                <button class="detail-btn {activeId === item.id ? 'active' : ''}"
                        on:click={() => showDetails(item)}></button>

                <div class="title">{item.title}</div>

                <div class={getStatusClass(item.status)}>
                    {item.status}
                </div>
            </div>
        {/each}
    </div>

</div>
<DetailView item={selectedItem}/>
