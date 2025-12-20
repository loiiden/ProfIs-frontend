<script>
    import ColoredNumber from "../blocks/colored-number.svelte";
    import AnnotatedNumber from "../blocks/annotated-number.svelte";

    let props = $props();

    let position = -35 + ((5.0 - props.average) / 4) * 532.5;
    let vheight = $state(68);
    let vmargin = $state(0);
    if((props.average % 1) < 0.14 || (props.average % 1) > 0.86){
        vheight = 24;
        vmargin = 44;
    };

</script>

<div class="noten-skala-container">
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
        <div class="average-mark" style="left: {position}px;">
            <AnnotatedNumber number={props.average} annotation="Durchschnitt"/>
            <div class="vertical-long-line" style="height: {vheight}px;margin-top: {vmargin}px;"></div>
        </div>
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
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
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
    height: 70%;

    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

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