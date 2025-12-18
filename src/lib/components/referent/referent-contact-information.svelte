<script>
    import AnnotatedTextInput from "../blocks/annotated-text-input.svelte";
    import { rf_state } from "../../../routes/erstellen/referent/state.svelte";

    let props = $props();
</script>

<div class="referent-contact-information-container">
    <div>Kontaktdaten</div>
    <AnnotatedTextInput annotation="Telefonnummer" store={rf_state} attribute="telefon"/>
    <AnnotatedTextInput annotation="E-Mail" store={rf_state} attribute="email"/>
    <AnnotatedTextInput annotation="Addresse" store={rf_state} attribute="addresse"/>
</div>

<style lang="scss">
.referent-contact-information-container {
    grid-column-start: 7;
    grid-column-end: 13;
    grid-row-start: 2;
    grid-row-end: 9;

    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    padding: 12px;
    border-radius: 10px;

    div {
        padding: 12px;
        font-weight: 600;
    }
}

</style>