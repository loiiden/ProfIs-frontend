<script>
    import FilterArbeiten from "$lib/components/filter-arbeiten.svelte";
    import OverviewSws from "$lib/components/overview/overview-sws.svelte";
    import OverviewTermine from "$lib/components/overview/overview-termine.svelte";
    import NotenSkala from "$lib/components/overview/noten-skala.svelte";

    let { data } = $props();
</script>

<main class="overview-container">
    <div class="headline-s">ÜBERSICHT</div>
    <FilterArbeiten sworks={data.sworks} study_programs={data.study_programs} students={data.students} referents={data.referents}/>
    <OverviewSws target={data.sws.target} current={data.sws.current} />
    <OverviewTermine termine={data.termine} />
    <NotenSkala bewertet={data.marks.countArchivedScientificWorks} offen={data.marks.countsOpenScientificWorks}
        average={data.marks.averageMarkForAllScientificWorks} distribution={data.marks.distribution}/>
</main>

<style lang="scss">
.overview-container {
    display: grid;
    grid-template-rows: repeat(15, 42px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 15px;
    row-gap: 15px;

    font-family: "Inter";

    .headline-s {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 2;
        position: relative;
        top: 10px;

        padding: 0px 30px;
        font-weight: 600;
        font-size: 18px;
        font-family: "Inter";
        display: flex;
        align-items: center;
    }
}

</style>