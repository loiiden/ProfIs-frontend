<script>
</script>

<main class="erstellen-student-container">
    <div>Student erfassen</div>
</main>

<style lang="scss">
.erstellen-student-container {
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