<script>
    import AnnotatedTextInput from "../blocks/annotated-text-input.svelte";

    let external_toggle = false;
</script>

<div class="referent-name-container">
    <div>Referent</div>
    <AnnotatedTextInput annotation="Titel"/>
    <AnnotatedTextInput annotation="Vorname"/>
    <AnnotatedTextInput annotation="Nachname"/>
    <div class="referent-status">
        <span>Status:</span>
        <span class="toggle toggle-internal { external_toggle ? "" : "toggle-active" }" onclick={() => { external_toggle = false}}>Internal</span>
        <span class="toggle toggle-external { external_toggle ? "toggle-active" : "" }" onclick={() => { external_toggle = true}}>External</span>
    </div>
</div>

<style lang="scss">
.referent-name-container {
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 2;
    grid-row-end: 10;

    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 12px;
    border-radius: 10px;

    div {
        padding: 12px;
        font-weight: 600;
    }

    .referent-status {
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

</style>