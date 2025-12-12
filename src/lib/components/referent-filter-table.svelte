<script>
    let props = $props();
</script>

<div class="referent-filter-table-container">
    <div class="referent-filter"></div>
    <div class="referent-table">
        {#each props.referenten as referent}
            <div class="referent-row">
                <span>{referent.firstName}</span>
                <span>{referent.email}</span>
                <span>{referent.phoneNumber}</span>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
.referent-filter-table-container {
    margin: 20px;
    width: 100%;

    .referent-table {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;

        .referent-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
        }
    }
}

</style>