<script>
    import OverviewArbeit from "$lib/components/overview-arbeit.svelte";
    import FilterArbeiten from "$lib/components/filter-arbeiten.svelte";
    import OverviewSws from "$lib/components/overview-sws.svelte";
</script>

<main class="overview-container">
    <h1>Übersicht</h1>
    <OverviewArbeit />
    <FilterArbeiten />
    <OverviewSws />
</main>

<style lang="scss">
.overview-container {
    display: grid;
    grid-template-rows: repeat(15, 1fr);
    grid-template-columns: repeat(28, 1fr);

    padding: 0% 10%;
    font-family: "Roboto";
    background-color: #F9F9F9;

    h1 {
        grid-column-start: 1;
        grid-column-end: 5;
    }
}

</style>