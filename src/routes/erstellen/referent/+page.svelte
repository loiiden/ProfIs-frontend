<script>
    import { onMount } from 'svelte';
    
    import ReferentAnlegen from '$lib/components/referent/referent-anlegen.svelte';
    
    import { GET, POST } from '$lib/functions';
    import { rf_state } from "./state.svelte";

    function get_referent(id){
        return GET(`/api/evaluator/${id}`);
    }

    function reset_state(){
        console.log("Reset");
        rf_state.vorname = "";
        rf_state.nachname = "";
        rf_state.status = false;
        rf_state.telefon = "";
        rf_state.email = "";
        rf_state.addresse = "";
        
        referent_data = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            academicLevel: null,
            role: null
        }
    }

    let create = $state(true);
    let referent_id = $state(0);
    let referent_data = $state({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        academicLevel: null,
        role: null
    });

    onMount(async () => {
        const url_params = new URLSearchParams(window.location.search);
        if(url_params.has('id')){
            referent_id = url_params.get("id");
            create = false;
            referent_data = await get_referent(referent_id);
        }
    });
</script>

<main class="erstellen-referent-container">
    <ReferentAnlegen on:reset={reset_state()} rf_state={rf_state} referent_data={referent_data}
        create={create} referent_id={referent_id}/>
</main>

<style lang="scss">
.erstellen-referent-container {
}

</style>