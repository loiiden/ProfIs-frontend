<script>
    let {
        data = [],
        placeholder = "Studiengang suchen",
        selectedStudyProgram = null,
        onSelected = null,
        onCleared = null
    } = $props();

    let searchTerm = $state("");
    let showDropdown = $state(false);

    let safeData = $derived(Array.isArray(data) ? data : []);

    let filtered = $derived(
        safeData.filter(sp =>
            `${sp.title ?? ""}`.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    function select(sp) {
        if (typeof onSelected === "function") onSelected(sp);
        searchTerm = sp.title ?? "";
        showDropdown = false;
    }

    function clear() {
        if (typeof onCleared === "function") onCleared();
        searchTerm = "";
        showDropdown = true;
    }

    $effect(() => {
        if (selectedStudyProgram && !showDropdown) {
            searchTerm = selectedStudyProgram.title ?? "";
        }
    });

</script>

<div class="search-component">
    <div class="input-container">
        {#if selectedStudyProgram}
            <button class="display-value" type="button" onclick={clear} aria-label="Auswahl ändern">
                {selectedStudyProgram.title}
            </button>
        {:else}
            <div class="input-wrapper">
                <input
                        type="text"
                        {placeholder}
                        bind:value={searchTerm}
                        onfocus={() => showDropdown = true}
                        oninput={() => showDropdown = true}
                />
            </div>
        {/if}
    </div>

    {#if showDropdown && !selectedStudyProgram && searchTerm.length > 0 && filtered.length > 0}
        <div class="dropdown-list">
            {#each filtered as sp}
                <button class="list-item" type="button" onclick={() => select(sp)}>
                    {sp.title}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
  .search-component {
    position: relative;
    width: 100%;
    font-family: "Inter", sans-serif;
  }

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

    &:focus-within { border-color: #ccc; }
  }

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

  .input-wrapper {
    display: flex;
    width: 100%;
    align-items: center;

    input {
      border: none;
      outline: none;
      font-size: 16px;
      color: #3B4B55;
      width: 100%;
      font-family: "Inter";

      &::placeholder { color: #A0A0A0; }
    }
  }

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
    max-height: 220px;
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

  .dropdown-list.empty .empty-row {
    padding: 12px 16px;
    font-size: 14px;
    color: #888;
  }
</style>
