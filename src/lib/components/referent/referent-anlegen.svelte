<script>
    import { POST, PATCH, DELETE } from "$lib/functions";

    async function post_referent(){
        let payload = {
            "firstName": vorname,
            "lastName": nachname,
            "email": email,
            "address": addresse,
            "salutation": anrede,
            "phoneNumber": telefon,
            "academicLevel": abschluss,
            "role": external_toggle ? "EXTERNAL" : "PROFESSOR"
        }

        let res = await POST("/api/evaluator", payload);        
        
        if(res.status == 201){
            console.log("Successfully Created Referent");
            window.location = `/referenten`;
        }
    }

    async function patch_referent(id){
        let payload = {
            "firstName": vorname,
            "lastName": nachname,
            "email": email,
            "address": addresse,
            "salutation": anrede,
            "phoneNumber": telefon,
            "academicLevel": abschluss,
            "role": external_toggle ? "EXTERNAL" : "PROFESSOR"
        }

        let res = await PATCH(`/api/evaluator/${id}`, payload);

        if(res.status == 200){
            console.log("Successfully Patched Referent");
            window.location = `/referenten`;
        }
    }

    async function delete_referent(id){
        let res = await DELETE(`/api/evaluator/${id}`);

        if(res.status == 204){
            console.log("Successfully Deleted Referent");
            window.location = `/referenten`;
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
    let addresse = $derived(referent_data.address);
    let abschluss = $derived(referent_data.academicLevel);
    let anrede = $derived(referent_data.salutation);

    let external_toggle = $derived(referent_data.role === "EXTERNAL");
</script>

<div class="referent-anlegen-container">
    <div class="headline">{create ? "REFERENT ANLEGEN" : "REFERENT BEARBEITEN"}</div>
    <div class="referent-name-container stroke-style">
        <div class="headline-s">Referent</div>
        <div class="select-title">Titel</div>
        <div class="titel">
            <select class="stroke-style" bind:value={anrede} name="" id="">
                <option value="HERR">Herr</option>
                <option value="FRAU">Frau</option>
                <option value="DIVERS">Divers</option>
            </select>
            <select class="stroke-style" bind:value={abschluss} name="" id="">
                <option value="NONE">kein Abschluss</option>
                <option value="BACHELOR">Bachelor</option>
                <option value="DIPLOMA">Diplom</option>
                <option value="MASTER">Master</option>
                <option value="DR">Doktor</option>
                <option value="PROF">Prof.</option>
                <option value="PROF_DOCTOR">Prof. Dr.</option>
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
            <span class="description">Status</span>
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
        <button class="cancel stroke-style" onclick={() => { window.location = "/referenten"; }}>Abbrechen</button>
        {#if !create}
            <button class="delete stroke-style" onclick={() => { delete_referent(referent_id); }}>Löschen</button>
        {/if}
        <button class="submit" onclick={() => { create ? post_referent() : patch_referent(referent_id); }}>{create ? "Erstellen" : "Aktualisieren"}</button>
    </div>
</div>

<style lang="scss">
.referent-anlegen-container {
    display: grid;
    grid-template-rows: repeat(30, 4.5px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 20px;
    row-gap: 25px;

    font-family: "Inter";

    .headline {
        grid-column-start: 1;
        grid-column-end: 5;
        grid-row-start: 1;
        grid-row-end: 4;
        padding: 0px 30px;
        font-weight: 600;
        font-size: 18px;
        font-family: "Inter";
        display: flex;
        align-items: center;
    }
}

.referent-name-container {
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 3;
    grid-row-end: 17;

    background-color: #FFFFFF;
    padding: 12px;
    border-radius: 10px;

    .headline-s {
        padding: 12px;
        font-weight: 600;
        font-size: 18px;
        font-family: 'Inter SB';
    }

    .select-title {
        font-weight: 900;
        margin-bottom: 0px;
        padding-left: 12px;
        font-size: 14px;
        font-family: 'Inter SB';
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

        .description {
            font-size: 14x;
        }

        .toggle-internal {
            margin-left: 20px;
        }

        .toggle {
            font-size: 13px;
            font-family: 'Inter SB';
            padding: 12px;
            border-radius: 6px;
            cursor: pointer;
        }

        .toggle-active {
            color: $note1;
        }
    }
}

.referent-contact-information-container {
    grid-column-start: 7;
    grid-column-end: 13;
    grid-row-start: 3;
    grid-row-end: 16;

    background-color: #FFFFFF;
    padding: 12px;
    border-radius: 10px;

    .headline-s {
        padding: 12px;
        font-weight: 600;
        font-size: 18px;
        font-family: 'Inter SB';
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
        font-size: 14px;
        font-family: 'Inter SB';
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
    grid-column-start: 9;
    grid-column-end: 13;
    grid-row-start: 15;
    grid-row-end: 19;

    display: flex;
    justify-content: flex-end;
    align-items: center;

    button {
        margin: 15px;
        font-weight: 600;
        font-size: 14px;
        font-family: "Inter";
        border-radius: 6px;
        padding: 12px;
        cursor: pointer;
        min-width: 100px;
    }

    .cancel {
        color: $error;
        background: none;
    }

    .delete {
        color: white;
        background-color: $error;
    }

    .submit {
        background-color: $primary;
        color: #FFFFFF;
        border: none;
    }
}

</style>