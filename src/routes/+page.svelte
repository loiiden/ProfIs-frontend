<script>
    import OverviewArbeit from "$lib/components/overview-arbeit.svelte";
    import FilterArbeiten from "$lib/components/filter-arbeiten.svelte";
    import OverviewSws from "$lib/components/overview/overview-sws.svelte";
    import CommentArbeit from "$lib/components/overview/comment-arbeit.svelte";
    import OverviewTermine from "$lib/components/overview/overview-termine.svelte";
    import NotenSkala from "$lib/components/overview/noten-skala.svelte";

    let { data } = $props();
</script>

<main class="overview-container">
    <div class="headline-s">ÜBERSICHT</div>
    <OverviewArbeit />
    <FilterArbeiten />
    <OverviewSws target={data.sws.target} count={data.sws.count} />
    <CommentArbeit />
    <OverviewTermine />
    <NotenSkala bewertet={data.marks.marked} offen={data.marks.open} average={data.marks.average}/>
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