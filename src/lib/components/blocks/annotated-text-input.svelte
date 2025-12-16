<script>
    let props = $props();

    let text_value = $state("");
</script>

<div class="annotated-text-input">
    <div class="annotation">{props.annotation}</div>
    <input type="text" placeholder={props.annotation} bind:value={text_value}>
</div>

<style lang="scss">
.annotated-text-input {
    font-family: "Inter";
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 12px;
}

.annotation {
    font-size: 12px;
    font-weight: 900;
    margin-bottom: 8px;
    padding-left: 0px;
}

input {
    border: none;
    border-radius: 6px;
    font-size: 16px;
    outline: none;
    padding: 12px;
    width: 100%;
    background-color: #F8FAFB;
}

</style>