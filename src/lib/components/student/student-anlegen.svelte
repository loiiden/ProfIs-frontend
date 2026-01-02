<script>
    import { POST, PATCH } from "$lib/functions";

    async function post_student(){
        let payload = {
            "firstName": vorname,
            "lastName": nachname,
            "address": addresse,
            "email": email,
            "phoneNumber": telefon,
            "studentNumber": Number(matrikel),
            "salutation": anrede,
            "academicLevel": abschluss,
            "scientificWorksIds": []
        }

        let res = await POST("/api/student", payload);
        
        console.log(res);

        if(res.status == 200){
            console.log("Successfully Created Student");
            window.location = "/erstellen/student";
        }
    }

    async function patch_student(id){
        let payload = {
            "firstName": vorname,
            "lastName": nachname,
            "address": addresse,
            "email": email,
            "phoneNumber": telefon,
            "studentNumber": Number(matrikel),
            "salutation": anrede,
            "academicLevel": abschluss,
            "scientificWorksIds": []
        }

        let res = await PATCH(`/api/student/${id}`, payload);
        
        console.log(res);

        if(res.status == 200){
            console.log("Successfully Patched Student");
            window.location = "/erstellen/student";
        }
    }

    let props = $props();

    let create = $derived(props.create);
    let student_id = $derived(props.student_id);;
    let student_data = $derived(props.student_data);

    let vorname = $derived(student_data.firstName);
    let nachname = $derived(student_data.lastName);
    let addresse = $derived(student_data.address);
    let email = $derived(student_data.email);
    let telefon = $derived(student_data.phoneNumber);
    let matrikel = $derived(student_data.studentNumber);
    let abschluss = $derived(student_data.academicLevel);
    let anrede = $derived(student_data.salutation);

    let external_toggle = $state(false);
</script>

<div class="student-anlegen-container">
    <div class="headline">STUDENT ANLEGEN</div>
    <div class="student-name-container stroke-style">
        <div class="headline-s">Student</div>
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
        <div class="annotated-text-input">
            <div class="annotation">Matrikelnummer</div>
            <input class="stroke-style" type="text" placeholder="Matrikelnummer" bind:value={matrikel}>
        </div>
    </div>
    <div class="student-contact-information-container stroke-style">
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
        <button class="submit" onclick={() => { create ? post_student() : patch_student(student_id); }}>Submit</button>
    </div>
</div>

<style lang="scss">
.student-anlegen-container {
    display: grid;
    grid-template-rows: repeat(30, 4.5px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 110px;
    row-gap: 25px;

    font-family: "Inter";

    .headline {
        grid-column-start: 1;
        grid-column-end: 6;
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

.student-name-container {
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 3;
    grid-row-end: 19;

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
        font-size: 14px;
        font-family: 'Inter SB';
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

    .student-status {
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

.student-contact-information-container {
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
    grid-column-start: 10;
    grid-column-end: 13;
    grid-row-start: 15;
    grid-row-end: 19;

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
    }
}

</style>