<script>
    import { onMount } from 'svelte';
    
    import ReferentAnlegen from '$lib/components/referent/referent-anlegen.svelte';
    
    import { GET, POST } from '$lib/functions';
    
    function get_referent(id){
        return GET(`/api/evaluator/${id}`);
    }

    let create = $state(true);
    let referent_id = $state(0);
    let referent_data = $state({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        academicLevel: null,
        role: null,
        salutation: null
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
    <ReferentAnlegen create={create} referent_id={referent_id} referent_data={referent_data}/>
</main>

<style lang="scss"></style>