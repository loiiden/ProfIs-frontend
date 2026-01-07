<script>
    import { onMount } from 'svelte';
    
    import StudentAnlegen from "$lib/components/student/student-anlegen.svelte";
    
    import { GET, POST } from '$lib/functions';
    
    function get_student(id){
        return GET(`/api/student/${id}`);
    }

    let create = $state(true);
    let student_id = $state(0);
    let student_data = $state({
        id: null,
        firstName: "",
        lastName: "",
        address: "",
        email: "",
        phoneNumber: "",
        studentNumber: null,
        salutation: null,
        academicLevel: null,
        scientificWorksIds: []
    });

    onMount(async () => {
        const url_params = new URLSearchParams(window.location.search);
        if(url_params.has('id')){
            student_id = url_params.get("id");
            create = false;
            student_data = await get_student(student_id);
        }
    });
</script>

<main class="erstellen-student-container">
    <StudentAnlegen create={create} student_id={student_id} student_data={student_data}/>
</main>

<style lang="scss"></style>