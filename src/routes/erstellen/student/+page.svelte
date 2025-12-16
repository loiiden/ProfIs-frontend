<script>
    import StudentName from "$lib/components/student/student-name.svelte";
    import StudentStudyInformation from "$lib/components/student/student-study-information.svelte";
    import StudentContactInformation from "$lib/components/student/student-contact-information.svelte";
</script>

<main class="erstellen-student-container">
    <div>Student erfassen</div>
    <StudentName />
    <StudentStudyInformation />
    <StudentContactInformation />
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