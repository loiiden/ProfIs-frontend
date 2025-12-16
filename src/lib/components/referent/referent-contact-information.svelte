<script>
    import AnnotatedTextInput from "../blocks/annotated-text-input.svelte";
</script>

<div class="referent-contact-information-container">
    <div>Kontaktdaten</div>
    <AnnotatedTextInput annotation="Telefonnummer"/>
    <AnnotatedTextInput annotation="E-Mail"/>
    <AnnotatedTextInput annotation="Addresse"/>
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