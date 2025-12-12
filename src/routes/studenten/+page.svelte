<script>
    import StudentFilterTable from "$lib/components/student-filter-table.svelte";

    let { data } = $props();
</script>

<main class="student-overview-container">
    <div>Übersicht Studenten</div>
    <StudentFilterTable students={data.students}/>
</main>

<style lang="scss">
.student-overview-container {
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