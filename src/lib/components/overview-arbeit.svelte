<script>
    export let item = null;

    export let prev;
    export let next;
    export let index;
    export let count;
</script>

<div class="overview-arbeit-container">

    <div class="effect-el-1"></div>
    <div class="effect-el-2"></div>

    <div class="overview-arbeit stroke-style">

        {#if item}

            <div class="header">
                <div>
                    <h2>{item.title}</h2>
                    <p class="arbeit">{item.arbeit}</p>
                </div>

                <div class="right-header">
                    <p class="course">{item.course}</p>

                    <div class="arrow-controls">
                        <button class="arrow-btn" on:click={prev} disabled={index === 0}>◀</button>
                        <button class="arrow-btn" on:click={next} disabled={index === count - 1}>▶</button>
                    </div>
                </div>
            </div>

            <div class="grades">

                <div class="line">
                    <span>Referent:</span> {item.referent}
                    <div class="Note green">{item.referentNote}</div>
                </div>

                <div class="line">
                    <span>Korreferent:</span> {item.korreferent}
                    <div class="Note blue">{item.koNote}</div>
                </div>

                <div class="line">
                    <span>Gesamtnote:</span>
                    <div class="Note green">{item.gesamtnote}</div>
                </div>

            </div>

        {:else}

            <div class="placeholder">

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
    border: none;

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
      padding: 12px;
      box-sizing: border-box;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .header .left {
    display: flex;
    flex-direction: column;
  }

  .header .right {
    font-size: 1rem;
    font-weight: 600;
    color: #6b7280;
  }

  h2 {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 600;
  }

  .arbeit {
    margin-top: .4rem;
    color: #6b7280;
  }

  .course {
    margin-top: .4rem;
    color: #6b7280;
    left: 50px;
  }

  .grades {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .line {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: .88rem;
  }

  .line span {
    font-weight: 600;
  }

  .Note {
    min-width: 48px;
    height: 48px;
    border-radius: .8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: #fff;
  }

  .green {
    background: $note1;
  }

  .blue {
    background: $note2;
  }

  .placeholder {
    padding: 2rem;
    color: #6b7280;
    font-size: 1.1rem;
  }

  .right-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .arrow-controls {
    display: flex;
    gap: .4rem;
  }

  .arrow-btn {
    border: none;
    background: #e2e8f0;
    padding: .3rem .5rem;
    font-size: 1rem;
    border-radius: 6px;
    cursor: pointer;
  }

  .arrow-btn:disabled {
    opacity: .4;
    cursor: default;
  }

</style>
