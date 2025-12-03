<script>
    let props = $props();
</script>

<div class="annotated-number">
    <div class="number">{props.number}</div>
    <div class="annotation">{props.annotation}</div>
</div>

<style lang="scss">
.annotated-number {
    font-family: "Inter";
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 12px;
}

.number {
    font-size: 40px;
    font-weight: 800;
}

.annotation {
    font-size: 14px;
    font-weight: 400;
}

</style>