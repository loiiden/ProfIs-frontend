<script>
	import ReferentFilterTable from "$lib/components/referent-filter-table.svelte";

    let { data } = $props();
</script>

<main class="referent-overview-container">
    <div>Übersicht Referenten</div>
    <ReferentFilterTable referenten={data.referenten}/>
</main>

<style lang="scss">
.referent-overview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    font-family: "Roboto";
    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 12px;
    border-radius: 10px;
}

</style>