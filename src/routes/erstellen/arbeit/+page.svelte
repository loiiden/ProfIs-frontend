<script>
    import PreviewOverviewArbeit from "$lib/components/arbeit/preview-overview-arbeit.svelte";
    import ErfassenNoten from "$lib/components/arbeit/erfassen-noten.svelte";
    import ErfassenDatenArbeit from "$lib/components/arbeit/erfassen-daten-arbeit.svelte";
</script>

<main class="erstellen-arbeit-container">
    <div>Arbeit erfassen</div>
    <PreviewOverviewArbeit />
    <ErfassenNoten />
    <ErfassenDatenArbeit />
</main>

<style lang="scss">
.erstellen-arbeit-container {
    display: grid;
    grid-template-rows: repeat(15, 9px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 60px;
    row-gap: 50px;

    font-family: "Roboto";

    div {
        grid-column-start: 1;
        grid-column-end: 5;
        padding: 0px 30px;
        font-size: 2em;
    }
}

</style>