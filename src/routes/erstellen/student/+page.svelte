<script>
    import { onMount } from 'svelte';
    import { afterNavigate } from '$app/navigation';
    
    import StudentAnlegen from "$lib/components/student/student-anlegen.svelte";
    
    import { GET, POST } from '$lib/functions';
    
    let { data } = $props();
    let study_programs = data.study_programs;

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
        scientificWorksIds: [],
        studyProgramId: null
    });

    afterNavigate(async () => {
        const url_params = new URLSearchParams(window.location.search);
        if(url_params.has('id')){
            student_id = url_params.get("id");
            create = false;
            student_data = await get_student(student_id);
        } else {
            create = true;
            student_id = 0;
            student_data = {
                id: null,
                firstName: "",
                lastName: "",
                address: "",
                email: "",
                phoneNumber: "",
                studentNumber: null,
                salutation: null,
                academicLevel: null,
                scientificWorksIds: [],
                studyProgramId: null
            };
        }
    });
</script>

<main class="erstellen-student-container">
    <StudentAnlegen create={create} student_id={student_id} student_data={student_data} study_programs={study_programs}/>
</main>

<style lang="scss"></style>