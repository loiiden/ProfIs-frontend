<script>
    let props = $props();
</script>

<div class="comment-arbeit-container stroke-style">
    <p class="style-med">Kommentar:</p>
    <p class="style-small">{props.kommentar}</p>
</div>

<style lang="scss">
.comment-arbeit-container {
    grid-column-start: 3;
    grid-column-end: 8;
    grid-row-start: 10;
    grid-row-end: 12;

    box-sizing: border-box;
    background-color: #FFFFFF;
    padding: 12px;
    border-radius: 10px;

    overflow: auto;

    p {
        margin: 0px;
    }
}

.style-small {
    font-size: 14px;
    font-family: 'Inter';
}

.style-med {
    font-size: 14px;
    font-family: 'Inter SB';
}
</style>