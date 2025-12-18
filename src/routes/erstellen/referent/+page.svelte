<script>
    import { onMount } from 'svelte';
    import ReferentName from "$lib/components/referent/referent-name.svelte";
    import ReferentContactInformation from "$lib/components/referent/referent-contact-information.svelte";
    
    import { GET, POST } from '$lib/functions';
    import { rf_state } from "./state.svelte";

    function post_referent(){
        let payload = {
            "firstName": rf_state.vorname,
            "lastName": rf_state.nachname,
            "email": rf_state.email,
            "phoneNumber": rf_state.telefon,
            "academicLevel": null,
            "role": null
        }
        POST("/api/evaluator", payload);
    }

    function get_referent(id){
        return GET(`/api/evaluator/${id}`);
    }

    let create = true;
    let referent_id ;
    let referent_data = $state({
        firstName: "v",
        lastName: "n",
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
            let res = await get_referent(referent_id);
            console.log(referent_data);
            referent_data.firstName = "test";
            console.log(referent_data);
        }
    });
</script>

<main class="erstellen-referent-container">
    <div class="headline">Referent anlegen</div>
    <ReferentName vorname={referent_data.firstName} nachname={referent_data.lastName}/>
    <ReferentContactInformation />
    <div class="buttons">
        <button class="cancel" onclick={() => { window.location = "/"; }}>Cancel</button>
        <button class="submit" onclick={() => { post_referent(); }}>Submit</button>
    </div>
</main>

<style lang="scss">
.erstellen-referent-container {
    display: grid;
    grid-template-rows: repeat(15, 9px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 110px;
    row-gap: 50px;

    font-family: "Roboto";

    .headline {
        grid-column-start: 1;
        grid-column-end: 5;
        padding: 0px 30px;
        font-size: 2em;
    }
}

.buttons {
    grid-column-start: 10;
    grid-column-end: 13;
    grid-row-start: 10;
    grid-row-end: 12;

    display: flex;
    justify-content: center;
    align-items: center;

    button {
        margin: 15px;
        font-weight: 600;
        font-size: 14px;
        font-family: "Inter";
        border: none;
        border-radius: 6px;
        padding: 12px;
        cursor: pointer;
    }

    .cancel {
        color: $error;
        background: none;
    }

    .submit {
        background-color: $primary;
        color: #FFFFFF;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
}

</style>