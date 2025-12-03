<div class="overview-arbeit-container">
    <div class="effect-el-1"></div>
    <div class="effect-el-2"></div>
    <div class="overview-arbeit">
        <h1>Anton Baranov</h1>
    </div>
</div>

<style lang="scss">
.overview-arbeit-container {
    grid-column-start: 1;
    grid-column-end: 17;
    grid-row-start: 2;
    grid-row-end: 7;

    display: flex;
    justify-content: center;

    position: relative;

    .effect-el-1, .effect-el-2, .overview-arbeit {
        position: absolute;
        border-radius: 10px;
    }

    .effect-el-1, .effect-el-2 {
        background-color: #41525A66;
        width: 100%;
        height: 100%;
    }

    .effect-el-1 {
        transform: rotate(-2.7deg);
    }

    .effect-el-2 {
        transform: rotate(-6.7deg);
    }

    .overview-arbeit {
        width: 96%;
        height: 100%;
        background-color: #FFFFFF;
        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        padding: 12px;
        box-sizing: border-box;
    }
}
</style>