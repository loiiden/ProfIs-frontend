<script>
    import search from '$lib/assets/search.svg';
</script>

<div class="global-search-container">
    <img src={search} alt="">
    <input type="text" class="search-input" placeholder="Suche">
    <span>K + WIN</span>
</div>

<style lang="scss">
.global-search-container {
    grid-column-start: 2;
    grid-column-end: 6;
    
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #FFFFFF;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 8px;
    margin: 16px;

    color: #7D8398;

    * {
        margin: 5px;
    }

    input {
        border: none;
        font-size: 14px;
        font-weight: 400;
        width: 250px;
        outline: none;
        color: #7D8398;
    }
}

</style>