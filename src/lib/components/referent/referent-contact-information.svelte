<script>
    import AnnotatedTextInput from "../blocks/annotated-text-input.svelte";
    
    let props = $props();

    let rf_state = props.rf_state;

    let telefon = $derived(props.telefon);
    let email = $derived(props.email);
    let addresse = $derived(props.addresse);
</script>

<div class="referent-contact-information-container stroke-style">
    <div>Kontaktdaten</div>
    <AnnotatedTextInput annotation="Telefonnummer" value={telefon} store={rf_state} attribute="telefon"/>
    <AnnotatedTextInput annotation="E-Mail" value={email} store={rf_state} attribute="email"/>
    <AnnotatedTextInput annotation="Addresse" value={addresse} store={rf_state} attribute="addresse"/>
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