<script>
    // Import von der Such-Komponente
    import EvaluatorSearch from '$lib/components/arbeit/evaluator-search.svelte';
    
    let { 
        evaluators = [],
        data = $bindable({
            referent: null,
            korreferent: null,
            pointsRefArbeit: null,
            pointsRefKoll: null,
            pointsKoArbeit: null,
            pointsKoKoll: null,
            comment: ""
        })
    } = $props();

    // Durchschnitt der 4 Noten, wenn nicht alle 4 Werte eingegeben --> ? anzeigen
    let average = $derived.by(() => {
        const inputs = [
            data.pointsRefArbeit, 
            data.pointsRefKoll, 
            data.pointsKoArbeit, 
            data.pointsKoKoll
        ];
        const validInputs = inputs.filter(p => p !== null && p !== "" && !isNaN(p));

        if (validInputs.length < 4) return null;

        const sum = validInputs.reduce((a, b) => Number(a) + Number(b), 0);
        return (sum / 4).toFixed(1);
    });

    // Punkteskala von THM in Farben 
    function getColorClass(score) {
        if (!score) return "";
        const s = Number(score);
        if (s >= 87.5) return "mark1";
        if (s >= 72.5) return "mark2";
        if (s >= 57.5) return "mark3";
        if (s >= 50.0) return "mark4";
        return "mark5";
    }

    // neue Farbklasse, wenn sich `average` ändert
    let resultColor = $derived(getColorClass(average));
</script>

<div class="erfassen-noten-container">
    <!-- Block 1: Referent wählen und Noten des Referenten eingeben -->
    <div class="block">
        <div class="main-label">Referent</div>
        <div class="search-row">
            <EvaluatorSearch data={evaluators} bind:selectedEvaluator={data.referent} />
        </div>
        
        <div class="grades-row">
            <div class="grade-group">
                <span class="grade-label">Note<br>Arbeit:</span>
                <input type="number" class="grade-input" bind:value={data.pointsRefArbeit} placeholder="-">
            </div>
            <div class="grade-group">
                <span class="grade-label">Note<br>Kolloquium:</span>
                <input type="number" class="grade-input" bind:value={data.pointsRefKoll} placeholder="-">
            </div>
        </div>
    </div>

    <!-- Block 2: Korreferent wählen und Noten des Korreferenten eingeben -->
    <div class="block">
        <div class="main-label">Korreferent</div>
        <div class="search-row">
            <EvaluatorSearch data={evaluators} bind:selectedEvaluator={data.korreferent} />
        </div>

        <div class="grades-row">
            <div class="grade-group">
                <span class="grade-label">Note<br>Arbeit:</span>
                <input type="number" class="grade-input" bind:value={data.pointsKoArbeit} placeholder="-">
            </div>
            <div class="grade-group">
                <span class="grade-label">Note<br>Kolloquium:</span>
                <input type="number" class="grade-input" bind:value={data.pointsKoKoll} placeholder="-">
            </div>
        </div>
    </div>

    <!-- Block 3: Freitext-Kommentar und Anzeige der Gesamtnote -->
    <div class="block footer-block">
        <div class="left-col">
            <div class="main-label">Kommentar</div>
            <textarea class="comment-box" bind:value={data.comment}></textarea>
        </div>

        <div class="right-col">
            <div class="total-wrapper">
                <div class="total-label">Gesamtnote<br>der Arbeit:</div>
                <!-- Farbbox zeigt "average" oder "?", Klasse kommt aus "resultColor" (mark1..mark5) -->
                <div class="total-box {resultColor}">
                    {average ?? "?"}
                </div>
            </div>
        </div>
    </div>

</div>

<style lang="scss">
    /* Äußerer Container des Formulars */
    .erfassen-noten-container {
        grid-column-start: 1;
        grid-column-end: 8;
        grid-row-start: 9;
        grid-row-end: 16;
        
        background-color: #FFFFFF;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        border-radius: 10px;
        
        padding: 30px;
        font-family: "Inter", sans-serif;
        display: flex;
        flex-direction: column;
        gap: 30px;
    }

    /* Abschnittsüberschrift */
    .main-label {
        font-weight: 700;
        font-size: 15px;
        color: #000;
        margin-bottom: 12px;
    }

    .search-row {
        margin-bottom: 15px;
    }

    /* Zwei Noteneingaben nebeneinander */
    .grades-row {
        display: flex;
        gap: 60px;
        align-items: center;
    }

    .grade-group {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .grade-label {
        font-weight: 600;
        font-size: 14px;
        line-height: 1.2;
        color: #000;
    }

    .grade-input {
        width: 45px;
        height: 45px;
        background-color: #F8F9FA;
        border: none;
        border-radius: 6px;
        text-align: center;
        font-weight: 600;
        font-size: 16px;
        color: #333;
        outline: none;

        &::placeholder { color: #333; }
        
        /* Browser Zahlenpfeile (diese nach oben/unten) ausblenden*/
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }
    }

    .footer-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .left-col {
        flex-grow: 1;
        margin-right: 40px;
    }

    .comment-box {
        width: 100%;
        height: 120px;
        border: 1px solid #E9E9E9;
        border-radius: 6px;
        resize: none;
        padding: 12px;
        font-family: "Inter";
        font-size: 14px;
        outline: none;
        box-sizing: border-box;

        &:focus { border-color: #ccc; }
    }

    .right-col {
        min-width: 150px;
        padding-bottom: 10px;
        margin-top: -30px;
    }

    .total-wrapper {
        display: flex;
        align-items: center;
        gap: 15px;
    }

    .total-label {
        font-weight: 700;
        font-size: 14px;
        line-height: 1.2;
        text-align: left;
        color: #000;
    }

    /* Die farbige Box mit der Gesamtnote rechts */
    .total-box {
        width: 50px;
        height: 50px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: 700;
        font-size: 16px;
        color: white;
        background-color: #9E9E9E;
    }

    // Farbklassen für die Gesamtnote.
    .mark1 { background-color: $note1; }
    .mark2 { background-color: $note2; }
    .mark3 { background-color: $note3; }
    .mark4 { background-color: $note4; }
    .mark5 { background-color: $note5; }
</style>