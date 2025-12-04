<script>
    let props = $props();

    // APIs [Number() wandelt Text zu Zahl um]
    let ziel = $derived(Number(props.target ?? 2.0));
    let jetzt = $derived(Number(props.current ?? 0));
    let arbeiten = $derived(Number(props.count ?? 0));

    // Prozentberechnung für den Balken [geteilt durch 0 geht nicht]
    let prozent = $derived(ziel > 0 ? Math.min((jetzt / ziel) * 100, 100) : 0);

    // Schauen ob über Limit
    let überLimit = $derived(jetzt > ziel);

</script>

<div class="overview-sws-container">
    <h3>SWS</h3>

    <div class="content-row">
        <div class="chart-area">
            <div class="bar-track">
                <div class="bar-fill" style="height: {prozent}%;"></div>
            </div>
        </div>

        <div class="info-area">
            
            <div class="stat-block secondary">
                <span class="value">{ziel.toFixed(1)}</span>
                <span class="label">Ziel</span>
            </div>

            <div class="stat-block primary">
                <span class="value {überLimit ? 'alarm' : ''}">
                    {jetzt.toFixed(1)}
                </span>
                <span class="label">Jetzt</span>
            </div>

            <div class="spacer"></div>

            <div class="footer-stat">
                {arbeiten} Arbeiten
            </div>
        </div>
    </div>
</div>

<style lang="scss">
//Eigene Farben
$text-light: #6e6f72;


.overview-sws-container {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 10;
    grid-row-end: 16;

    box-sizing: border-box;
    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    
    // Angepasst auf 16px 
    padding: 16px; 
    border-radius: 10px; 

    display: flex;
    flex-direction: column;
    font-family: "Inter", sans-serif;
}

//Überschrift
h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #000;
    margin-bottom: 15px;
}

//Hält Balken und Infos zusammen
.content-row {
    display: flex;
    flex-grow: 1;
    align-items: stretch;
}

//Wrapper Balken
.chart-area {
    padding-right: 20px;
    display: flex;
    align-items: flex-end;
}

.bar-track {
    width: 45px;
    height: 100%;
    background-color: #F4F4F4;
    border-radius: 8px;
    position: relative;
    display: flex;
    align-items: flex-end;
}


.bar-fill {
    width: 100%;
    border-radius: 8px;
    //Block-Effekt
    background-image: repeating-linear-gradient(
        to top,
        $success,
        $success 18px,
        transparent 18px,
        transparent 22px
    );
    transition: height 0.6s cubic-bezier(0.22, 1, 0.36, 1); //Animation
}

//Container für die Infos rechts neben dem Balken
.info-area {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    padding-top: 5px; 
}

.stat-block {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    .value {
        font-size: 28px;
        font-weight: 500;
        line-height: 1;
    }

    .label {
        font-size: 14px;
        color: $text-light;
        margin-top: 4px;
    }

    &.primary .value {
        color: #000;
        font-weight: 600;

        // Wenn die Klasse "alarm" --> roter Text
        &.alarm {
            color: $error; 
        }
    }

    &.secondary .value {
        color: $text-light;
    }
}

//Drückt den Footer nach unten
.spacer {
    flex-grow: 1;
}

//Anzeige der Anzahl Arbeiten unten
.footer-stat {
    font-size: 16px;
    font-weight: 500;
    color: #000;
    border-top: 1px solid #F4F4F4; //Trennlinie
    padding-top: 10px;
}
</style>