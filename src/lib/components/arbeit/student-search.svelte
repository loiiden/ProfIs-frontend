<script>
    // optionales Icon (wie bei dir)
    import searchIcon from '$lib/assets/search.svg';

    let {
        data = [],
        placeholder = "Student suchen",
        selectedStudent = $bindable(null)
    } = $props();

    let searchTerm = $state("");
    let showDropdown = $state(false);

    let safeData = $derived(Array.isArray(data) ? data : []);

    // exakt wie bei EvaluatorSearch
    let filtered = $derived(
        safeData.filter(s =>
            `${s.firstName ?? ""} ${s.lastName ?? ""}`
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        )
    );

    function select(student) {
        selectedStudent = student;
        searchTerm = `${student.firstName} ${student.lastName}`;
        showDropdown = false;
    }

    function clear() {
        selectedStudent = null;
        searchTerm = "";
        showDropdown = true;
    }
</script>

<div class="search-component">
    <div class="input-container">

        {#if selectedStudent}
            <!-- AUSGEWÄHLT → Button -->
            <button
                    class="display-value"
                    onclick={clear}
                    aria-label="Auswahl ändern"
            >
                {selectedStudent.firstName} {selectedStudent.lastName}
            </button>
        {:else}
            <!-- SUCHFELD -->
            <div class="input-wrapper">
                <input
                        type="text"
                        {placeholder}
                        bind:value={searchTerm}
                        onfocus={() => showDropdown = true}
                        oninput={() => showDropdown = true}
                />

                {#if filtered.length === 0 && searchTerm.length > 0}
                    <button type="button" class="create-btn">
                        erstellen
                    </button>
                {/if}
            </div>
        {/if}

    </div>

    {#if showDropdown && !selectedStudent && searchTerm.length > 0 && filtered.length > 0}
        <div class="dropdown-list">
            {#each filtered as student}
                <button
                        class="list-item"
                        onclick={() => select(student)}
                >
                    {student.firstName} {student.lastName}
                </button>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
  /* EXAKT aus deinem EvaluatorSearch übernommen */

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

    &:focus-within {
      border-color: #ccc;
    }
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
