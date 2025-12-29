<script>
    import search from '$lib/assets/search.svg';
    import openblank from '$lib/assets/open-blank.svg';

    let { data } = $props();

    let referent_base = data.referenten
    let referent_filtered = $state(data.referenten);

    let connected_works = $state([]);

    let search_value = $state("");

    function filter_search(){
        referent_filtered = referent_base.filter((ref) => (ref.firstName + " " + ref.lastName + " " + ref.email).includes(search_value))
    }

    function show_connected(ref_id){
        connected_works = [ref_id];
    }
</script>

<div class="referent-filter-table-container">
    <div class="headline-s">REFERENTEN</div>
    <div class="referent-table-container stroke-style">
        <div class="search-bar">
            <img src={search} alt="">
            <input type="text" class="search-input" placeholder="Referent suchen"
                bind:value={search_value} oninput={filter_search}>
        </div>
        <div class="table-head">
            <span class="head-name">Referent</span>
            <span class="head-works">Arbeiten</span>
            <span class="head-email">E-Mail</span>
            <span class="head-phone">Telefonnummer</span>
        </div>
        <div class="referent-table">
            {#each referent_filtered as referent}
                <div class="referent-row">
                    <span onclick={() => { show_connected(referent.id); }} class="ref-name">{referent.firstName + " " + referent.lastName}<a target="_blank" href="/erstellen/referent/?id={referent.id}"><img class="open-new" src={openblank} alt=""></a></span>
                    <span class="current-works">{Math.floor(Math.random() * 10)}</span>
                    <span class="ref-email"><a href="mailto:{referent.email}">{referent.email}</a></span>
                    <span class="ref-phone">{referent.phoneNumber}</span>
                </div>
            {/each}
        </div>
    </div>
    <div class="connected-works stroke-style">
        {#each connected_works as work}
            {work}
        {/each}
    </div>
</div>

<style lang="scss">
.referent-filter-table-container {
    display: grid;
    grid-template-rows: repeat(15, 9px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 20px;
    row-gap: 45px;

    font-family: 'Inter';

    .headline-s {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 3;

        padding: 0px 30px;
        font-weight: 600;
        font-size: 18px;
        font-family: "Inter";
        display: flex;
        align-items: center;
    }

    .referent-table-container {
        grid-column-start: 1;
        grid-column-end: 9;
        grid-row-start: 2;
        grid-row-end: 16;

        display: flex;
        flex-direction: column;

        padding: 12px;
        border-radius: 10px;
        padding-right: 0px;

        .search-bar {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            box-sizing: border-box;
            padding: 6px;
            font-size: 12px;
            width: 50%;
            border-radius: 6px;

            * {
                padding: 6px;
            }

            input {
                border: none;
                font-size: 14px;
                font-weight: 400;
                width: 100%;
                outline: none;
            }
        }

        .table-head {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 99%;
            box-sizing: border-box;
            padding: 12px;
            font-size: 12px;
            font-weight: 600;
            
            .head-name {
                width: 28%;
            }

            .head-works {
                width: 5%;
            }

            .head-email {
                width: 40%;
            }

            .head-phone {
                width: 15%;
                text-align: right;
            }
        }

        .referent-table {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            overflow: scroll;

            .referent-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 99%;
                box-sizing: border-box;
                padding: 12px;
                font-size: 12px;

                .ref-name {
                    width: 30%;
                    cursor: pointer;

                    .open-new {
                        width: 14px;
                        margin-left: 10px;
                        user-select: none;
                    }
                }

                .current-works {
                    background-color: $note4;
                    color: #FFFFFF;
                    width: 22px;
                    text-align: center;
                    border-radius: 5px;
                }

                .ref-email {
                    width: 40%;
                }

                .ref-phone {
                    width: 15%;
                    text-align: right;
                }
            }
        }


        
    }

    .connected-works {
        grid-column-start: 9;
        grid-column-end: 13;
        grid-row-start: 2;
        grid-row-end: 16;

        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        padding: 12px;
        border-radius: 10px;
    }
}

</style>