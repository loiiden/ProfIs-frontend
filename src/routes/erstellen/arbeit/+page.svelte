<script>
    // Komponenten importieren
    import PreviewOverviewArbeit from "$lib/components/arbeit/preview-overview-arbeit.svelte";
    import ErfassenNoten from "$lib/components/arbeit/erfassen-noten.svelte";
    import ErfassenDatenArbeit from "$lib/components/arbeit/erfassen-daten-arbeit.svelte";
    import { POST } from "$lib/functions";
    // Import für Navigation
    import { goto } from '$app/navigation';

    let { data } = $props();

    let arbeitData = $state({
        mainEvaluator: null,
        secondEvaluator: null,
        mainEvaluatorWorkMark: null,
        mainEvaluatorColloquiumMark: null,
        secondEvaluatorWorkMark: null,
        secondEvaluatorColloquiumMark: null,
        comment: "",
        titel: "", 
        startDatum: ""
    });

    // Button "Speichern": baut Payload und sendet die an das Backend
    async function arbeitSpeichern() {
        console.log("Speichere:", arbeitData);
        // Payload so formen, wie das Backend es erwartet
        let payload = {
            title: arbeitData.titel,
            mainEvaluatorId: arbeitData.mainEvaluator?.id, 
            secondEvaluatorId: arbeitData.secondEvaluator?.id,
            
            // INTERNE PRÜFUNG/BEREINIGUNG: Wenn "", dann null senden. Sonst Wert.
            mainEvaluatorWorkMark: arbeitData.mainEvaluatorWorkMark === "" ? null : arbeitData.mainEvaluatorWorkMark,
            mainEvaluatorColloquiumMark: arbeitData.mainEvaluatorColloquiumMark === "" ? null : arbeitData.mainEvaluatorColloquiumMark,
            secondEvaluatorWorkMark: arbeitData.secondEvaluatorWorkMark === "" ? null : arbeitData.secondEvaluatorWorkMark,
            secondEvaluatorColloquiumMark: arbeitData.secondEvaluatorColloquiumMark === "" ? null : arbeitData.secondEvaluatorColloquiumMark,
            comment: arbeitData.comment // Kommentiert, da API das noch nicht hat
        };

        // Tatsächlicher API-Call
        let res = await POST("/api/scientific-work", payload);

        // Erfolgs-/Fehlerbehandlung 
        if(res.ok) {
            alert("Erfolgreich gespeichert!");
            goto("/arbeiten"); // Weiterleiten zur Übersicht der Arbeiten
        } else {
            alert("Fehler beim Speichern");
        }
    }

    // Button "Abbrechen": ohne Speichern zurück zur Übersicht
    function abbrechen() {
        // Zur Übersicht der Arbeiten zurückkehren
        goto("/arbeiten");
    }
</script>

<main class="erstellen-arbeit-container">
    <div class="header-row">
        <div class="page-title">Arbeit erfassen</div>
        </div>

    <PreviewOverviewArbeit />
    <ErfassenNoten 
        evaluators={data?.referenten ?? []} 
        bind:data={arbeitData} 
    />
    
    <ErfassenDatenArbeit />

    <div class="action-bar">
        <button class="cancel-btn" onclick={abbrechen}>Abbrechen</button>
        <button class="save-btn" onclick={arbeitSpeichern}>Speichern</button>
    </div>
</main>

<style lang="scss">
    @import 'src/styles/colors.scss';
    /* Gesamt-Layout der Seite */
    .erstellen-arbeit-container {
        display: grid;
        grid-template-rows: repeat(16, auto); /* Eine Zeile mehr für die Buttons als es vorher war*/
        grid-template-columns: repeat(12, 1fr);
        column-gap: 20px;
        row-gap: 30px;
        padding-bottom: 50px;
        font-family: "Roboto";
    }

    /* Header oben mit Titel */
    .header-row {
        grid-column-start: 1;
        grid-column-end: 13;
        display: flex;
        align-items: center;
        padding: 0 30px;
        margin-bottom: 20px;
    }

    .page-title {
        font-size: 2em;
    }

    /* Aktionsleiste (Abbrechen/Speichern) unten rechts */
    .action-bar {
        grid-column: 8 / 13;
        /* Gleiche Breite wie die rechte Spalte */
        grid-row: 16 / 17;
        /* Unterhalb der Inhalte platzieren */
        
        display: flex;
        justify-content: flex-end; /* Rechtsbündig */
        gap: 20px;
        /* Abstand zwischen den Buttons */
        margin-top: 10px;
    }

    /* Button Speichern, Farben aus colors.scss */
    .save-btn {
        background-color: $primary;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

        &:hover {
            background-color: #1a9cb7;
        }
    }

    /* Button Abbrechen, Farben aus colors.scss */
    .cancel-btn {
        background-color: #FFFFFF;
        color: $error; /* Rote Schrift wie im Bild */
        border: 1px solid #E9E9E9;
        padding: 12px 24px;
        border-radius: 6px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: rgba(149, 157, 165, 0.1) 0px 4px 12px;
        &:hover {
            background-color: #f9f9f9;
        }
    }
</style>