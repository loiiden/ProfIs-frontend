<script>
    import ReferentName from "$lib/components/referent/referent-name.svelte";
    import ReferentContactInformation from "$lib/components/referent/referent-contact-information.svelte";
    
    import { createEventDispatcher } from "svelte";

    import { POST } from "$lib/functions";
    
    const dispatch = createEventDispatcher();

    async function post_referent(){
        let payload = {
            "firstName": rf_state.vorname,
            "lastName": rf_state.nachname,
            "email": rf_state.email,
            "phoneNumber": rf_state.telefon,
            "academicLevel": null,
            "role": null
        }
        let res = await POST("/api/evaluator", payload);
        
        if(res.status == 201){
            dispatch("reset");
            window.alert("Referent erfolgreich erstellt");
        }
        
    }

    let props = $props();

    let rf_state = props.rf_state;

    let create = $derived(props.create);
    let referent_id = $derived(props.referent_id);;
    let referent_data = $derived(props.referent_data);
</script>

<div class="referent-anlegen-container">
    <div class="headline">Referent anlegen</div>
    <ReferentName rf_state={rf_state} vorname={referent_data.firstName} nachname={referent_data.lastName}/>
    <ReferentContactInformation rf_state={rf_state} telefon={referent_data.phoneNumber}
        email={referent_data.email} addresse={referent_data.addresse}/>
    <div class="buttons">
        <button class="cancel" onclick={() => { window.location = "/"; }}>Cancel</button>
        <button class="submit" onclick={() => { post_referent(); }}>Submit</button>
    </div>
</div>

<style lang="scss">
.referent-anlegen-container {
    display: grid;
    grid-template-rows: repeat(15, 9px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 110px;
    row-gap: 50px;

    font-family: "Roboto";

    .headline {
        grid-column-start: 1;
        grid-column-end: 5;
        grid-row-start: 1;
        grid-row-end: 2;
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