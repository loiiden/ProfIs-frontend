<script>
    import ColoredNumber from "../blocks/colored-number.svelte";
    import AnnotatedNumber from "../blocks/annotated-number.svelte";

    let props = $props();
    let distribution = $derived(props.distribution)

    function roundNumber(number, digits) {
        let multiple = Math.pow(10, digits);
        let num = Math.round(number * multiple) / multiple;
        num = num.toFixed(2)
        
        if (num[3] == "0")
            return num.substring(0, num.length - 1);
        
        return num;
    }

    let average = $derived(roundNumber(props.average, 2));

    let position = -37 + ((5.0 - average) / 4) * 532.0;
    let vheight = $state(57);
    let vmargin = $state(0);
    if((average % 1) < 0.14 || (average % 1) > 0.86){
        vheight = 23;
        vmargin = 35;
    };

</script>

<div class="noten-skala-container stroke-style">
    <div class="mark-information">
        <AnnotatedNumber number={props.bewertet} annotation="Bewertet"/>
        <AnnotatedNumber number={props.offen} annotation="Offen"/>
    </div>
    <div class="skala">
        <div class="marks">
            <ColoredNumber number="5,0" color="mark5"/>
            <ColoredNumber number="4,0" color="mark4"/>
            <ColoredNumber number="3,0" color="mark3"/>
            <ColoredNumber number="2,0" color="mark2"/>
            <ColoredNumber number="1,0" color="mark1"/>
        </div>
        <div class="lines">
            <div class="vertical"></div>
            <div class="horizontal mark4"></div>
            <div class="vertical"></div>
            <div class="horizontal mark3"></div>
            <div class="vertical"></div>
            <div class="horizontal mark2"></div>
            <div class="vertical"></div>
            <div class="horizontal mark1"></div>
            <div class="vertical"></div>
        </div>
        <div class="distribution">
            <div class="distri four">{distribution.fromFourToFive}</div>
            <div class="distri three">{distribution.fromThreeToFour}</div>
            <div class="distri two">{distribution.fromTwoToThree}</div>
            <div class="distri one">{distribution.fromOneToTwo}</div>
        </div>

        {#if parseFloat(average) !== 0}
        <div class="average-mark" style="left: {position}px;">
            <AnnotatedNumber number={average} annotation="Durchschnitt"/>
            <div class="vertical-long-line" style="height: {vheight}px;margin-top: {vmargin}px;"></div>
        </div>
        {/if}
    </div>
    <div class="annotation-marks">
        <p>Grundnote</p>
        <p class="s-count">Anzahl Studenten</p>
    </div>
</div>

<style lang="scss">
.noten-skala-container {
    grid-column-start: 6;
    grid-column-end: 13;
    grid-row-start: 12;
    grid-row-end: 16;

    box-sizing: border-box;
    background-color: #FFFFFF;
    padding: 12px;
    border-radius: 10px;
}

.noten-skala-container {
    font-family: "Inter";
    display: flex;
    justify-content: left;
    align-items: center;
}

.skala {
    margin-left: 30px;
    width: 70%;
    height: 85%;

    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;

    .marks {
        width: 100%;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .lines {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: flex-end;
    
        .vertical {
            margin: 0px 10px;
            width: 1px;
            height: 24px;
            background-color: #41525A;
        }

        .horizontal {
            width: 112px;
            height: 6px;
            border-radius: 5px;
        }
    }

    .distribution {
        width: 74%;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .distri {
            font-size: 20px;
            font-family: 'Inter SB';
            padding-top: 4px;
        }
    }
}

.annotation-marks {
    height: 85%;
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    flex-direction: column;

    p {
        font-size: 12px;
        padding-left: 12px;
        padding-bottom: 6px;
        margin: 0px;
    }

    .s-count {
        margin-top: 45px;
    }
}

.average-mark {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    position: absolute;
    top: -25px;

    .vertical-long-line {
        margin: 0px 10px;
        width: 1px;
        background-color: #41525A;
    }
}

.mark1 {
    background-color: $note1;
}

.mark2 {
    background-color: $note2;
}

.mark3 {
    background-color: $note3;
}

.mark4 {
    background-color: $note4;
}

</style>