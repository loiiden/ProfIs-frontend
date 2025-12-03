<script>
    let props = $props();
</script>

<div class="colored-number {props.color}">{props.number}</div>

<style lang="scss">
.colored-number {
    color: #FFFFFF;
    font-family: "Inter";
    font-size: 15px;
    width: 35px;
    height: 35px;
    border-radius: 5px;
    text-align: center;
    line-height: 35px;
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

.mark5 {
    background-color: $note5;
}

</style>