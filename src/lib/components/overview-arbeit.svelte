<script>
    export let item = null;
</script>

<div class="overview-arbeit-container">
    <div class="effect-el-1"></div>
    <div class="effect-el-2"></div>
    <div class="overview-arbeit">

        {#if item}
            <div class="">
                <h2>{item.title}</h2>
                <p><b>Status:</b> {item.status}</p>
                <p>{item.description}</p>
            </div>
        {/if}

    </div>
</div>

<style lang="scss">
  .overview-arbeit-container {
    grid-column-start: 1;
    grid-column-end: 8;
    grid-row-start: 2;
    grid-row-end: 10;

    display: flex;
    justify-content: left;
    align-items: start;

    position: relative;

    .effect-el-1, .effect-el-2, .overview-arbeit {
      position: absolute;
      border-radius: 10px;
    }

    .effect-el-1, .effect-el-2 {
      background-color: #41525A66;
      width: 95.5%;
      height: 87%;
    }

    .effect-el-1 {
      transform: rotate(-2.85deg);
    }

    .effect-el-2 {
      transform: rotate(-6.37deg);
    }

    .overview-arbeit {
      width: 94%;
      height: 87%;
      background-color: #FFFFFF;
      box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
      padding: 12px;
      box-sizing: border-box;
    }
  }
</style>

