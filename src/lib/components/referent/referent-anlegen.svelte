<script>
    import { POST } from "$lib/functions";

    async function post_referent(){
        let payload = {
            "firstName": vorname,
            "lastName": nachname,
            "email": email,
            "phoneNumber": telefon,
            "academicLevel": abschluss,
            "role": null
        }
        console.log(payload);
        let res = await POST("/api/evaluator", payload);
        
        if(res.status == 201){
            console.log("Successfully Created Referent");
            // window.location = "/erstellen/referent";
        }
    }

    let props = $props();

    let create = $derived(props.create);
    let referent_id = $derived(props.referent_id);;
    let referent_data = $derived(props.referent_data);

    let vorname = $derived(referent_data.firstName);
    let nachname = $derived(referent_data.lastName);
    let telefon = $derived(referent_data.phoneNumber);
    let email = $derived(referent_data.email);
    let addresse = $derived(referent_data.addresse);
    let abschluss = $derived(referent_data.academicLevel);

    let external_toggle = $state(false);
    let anrede = $state("d")
</script>

<div class="referent-anlegen-container">
    <div class="headline">Referent anlegen</div>
    <div class="referent-name-container stroke-style">
        <div class="headline-s">Referent</div>
        <div class="select-title">Titel</div>
        <div class="titel">
            <select class="stroke-style" bind:value={anrede} name="" id="">
                <option value="m">Herr</option>
                <option value="w">Frau</option>
                <option value="d">Divers</option>
            </select>
            <select class="stroke-style" bind:value={abschluss} name="" id="">
                <option value="0">kein Abschluss</option>
                <option value="1">Bachelor</option>
                <option value="2">Master</option>
                <option value="2">Doktor</option>
            </select>
        </div>
        <div class="annotated-text-input">
            <div class="annotation">Vorname</div>
            <input class="stroke-style" type="text" placeholder="Vorname" bind:value={vorname}>
        </div>
        <div class="annotated-text-input">
            <div class="annotation">Nachname</div>
            <input class="stroke-style" type="text" placeholder="Nachname" bind:value={nachname}>
        </div>
        <div class="referent-status">
            <span>Status:</span>
            <span class="toggle toggle-internal { external_toggle ? "" : "toggle-active" }" onclick={() => external_toggle = false}>Internal</span>
            <span class="toggle toggle-external { external_toggle ? "toggle-active" : "" }" onclick={() => external_toggle = true}>External</span>
        </div>
    </div>
    <div class="referent-contact-information-container stroke-style">
        <div class="headline-s">Kontaktdaten</div>
        <div class="annotated-text-input">
            <div class="annotation">Telefon</div>
            <input class="stroke-style" type="text" placeholder="Telefon" bind:value={telefon}>
        </div>
        <div class="annotated-text-input">
            <div class="annotation">E-Mail</div>
            <input class="stroke-style" type="text" placeholder="E-Mail" bind:value={email}>
        </div>
        <div class="annotated-text-input">
            <div class="annotation">Addresse</div>
            <input class="stroke-style" type="text" placeholder="Addresse" bind:value={addresse}>
        </div>
    </div>
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

.referent-name-container {
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 2;
    grid-row-end: 10;

    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 12px;
    border-radius: 10px;

    .headline-s {
        padding: 12px;
        font-weight: 600;
    }

    .select-title {
        font-size: 12px;
        font-weight: 900;
        margin-bottom: 0px;
        padding-left: 12px;
    }

    .titel {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 12px;

        select {
            padding: 10px;
            margin-right: 20px;
            border-radius: 5px;
            background-color: #FFFFFF;
        }
    }

    .referent-status {
        padding: 12px;

        .toggle-internal {
            margin-left: 20px;
        }

        .toggle {
            font-size: 12px;
            padding: 12px;
            border-radius: 6px;
            cursor: pointer;
        }

        .toggle-active {
            background-color: $note1;
        }
    }
}

.referent-contact-information-container {
    grid-column-start: 7;
    grid-column-end: 13;
    grid-row-start: 2;
    grid-row-end: 9;

    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 12px;
    border-radius: 10px;

    .headline-s {
        padding: 12px;
        font-weight: 600;
    }
}

.annotated-text-input {
    font-family: "Inter";
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 12px;

    .annotation {
        font-size: 12px;    
        font-weight: 900;
        margin-bottom: 8px;
        padding-left: 0px;
    }

    input {
        border-radius: 6px;
        font-size: 16px;
        outline: none;
        padding: 12px;
        width: 100%;
        box-sizing: border-box;
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