<script>
    import OverviewArbeit from "$lib/components/overview-arbeit.svelte";
    import FilterArbeiten from "$lib/components/filter-arbeiten.svelte";
    import OverviewSws from "$lib/components/overview-sws.svelte";
    import CommentArbeit from "$lib/components/comment-arbeit.svelte";
    import OverviewTermine from "$lib/components/overview-termine.svelte";
    import NotenSkala from "$lib/components/noten-skala.svelte";

    let { data } = $props();
</script>

<main class="overview-container">
    <div>Übersicht</div>
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

    font-family: "Roboto";

    div {
        grid-column-start: 1;
        grid-column-end: 5;
        padding: 0px 30px;
        font-size: 2em;
    }
}

</style>