<script>
    let props = $props();
</script>

<div class="person-filter-table-container">
    <div class="person-filter"></div>
    <div class="person-table">
        {#each props.students as student}
            <div class="person-row">
                <span>{student.firstName}</span>
                <span>{student.lastName}</span>
                <span>{student.email}</span>
                <span>{student.phoneNumber}</span>
                <span>{student.scientificWorksIds.length}</span>
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