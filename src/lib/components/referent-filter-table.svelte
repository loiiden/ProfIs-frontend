<script>
    let props = $props();
</script>

<div class="person-filter-table-container">
    <div class="person-filter"></div>
    <div class="person-table">
        {#each props.persons as person}
            <div class="person-row">
                <span>{person.vorname}</span>
                <span>{person.nachname}</span>
                <span>{person.mail}</span>
                <span>{person.scheinfrei_ja_nein}</span>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
.person-filter-table-container {
    margin: 20px;
    width: 100%;

    .person-table {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;

        .person-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
    }
}

</style>