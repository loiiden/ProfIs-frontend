<script>
    import ReferentName from "$lib/components/referent/referent-name.svelte";
    import ReferentContactInformation from "$lib/components/referent/referent-contact-information.svelte";
</script>

<main class="erstellen-referent-container">
    <div>Referent erfassen</div>
    <ReferentName />
    <ReferentContactInformation />
</main>

<style lang="scss">
.erstellen-referent-container {
    display: grid;
    grid-template-rows: repeat(15, 9px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 110px;
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