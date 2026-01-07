<script>
    import search from '$lib/assets/search.svg';
    import openblank from '$lib/assets/open-blank.svg';
    import caretdown from '$lib/assets/caret-down.svg';
    import caretup from '$lib/assets/caret-up.svg';

    let { data } = $props();

    let referent_base = data.referenten
    let referent_filtered = $state(data.referenten);

    const status_options = ["PROFESSOR", "EXTERNAL"];
    const academic_levels = ["NONE", "BACHELOR", "MASTER", "DR", "PROF", "PROF_DOCTOR", "DIPLOMA"];
    const status_mapping = {
        "PROFESSOR": "Intern (Hochschulpersonal)",
        "EXTERNAL": "Extern (Gastdozent / Partner)"
    }
    const alevel_mapping = {
        "NONE": "kein Abschluss",
        "BACHELOR": "Bachelor",
        "MASTER": "Master",
        "DR": "Doktor",
        "PROF": "Professor",
        "PROF_DOCTOR": "Professor und Doktor",
        "DIPLOMA": "Diplom oder Magister"
    }

    let search_value = $state("");
    let status_filter = $state([]);
    let academic_levels_selected = $state([]);

    let show_filter = $state(false);
    let filter_on = $derived(status_filter.length > 0 || academic_levels_selected.length > 0);

    function filter_search(){
        referent_filtered = referent_base.filter((ref) => (ref.firstName + " " + ref.lastName + " " + ref.email).includes(search_value))
        if(status_filter.length > 0)
            referent_filtered = referent_filtered.filter((ref) => status_filter.includes(ref.role));
        if(academic_levels_selected.length > 0)
            referent_filtered = referent_filtered.filter((ref) => academic_levels_selected.includes(ref.academicLevel));
    }

    function set_active_status(){
        let root = document.querySelector(".filter-status");

        if (root == null) return;
        
        for(let child of root.children){
            let status = child.getAttribute("data-status");
            if(status_filter.includes(status)){
                child.style.fontWeight = "700";
                child.style.color = "#000000";
            } else {
                child.style.fontWeight = "400";
                child.style.color = "#3c3c3c";
            }
        }
    }

    function set_active_alevels(){
        let root = document.querySelector(".filter-alevel");

        if (root == null) return;
        
        for(let child of root.children){
            let alevel = child.getAttribute("data-alevel");
            if(academic_levels_selected.includes(alevel)){
                child.style.fontWeight = "700";
                child.style.color = "#000000";
            } else {
                child.style.fontWeight = "400";
                child.style.color = "#3c3c3c";
            }
        }
    }

    function toggle_status(status){
        if(status_filter.includes(status)){
            status_filter.splice(status_filter.indexOf(status), 1)
        } else {
            status_filter.push(status);
        }

        set_active_status();
        filter_search();
    }

    function toggle_alevel(alevel){
        if(academic_levels_selected.includes(alevel)){
            academic_levels_selected.splice(academic_levels_selected.indexOf(alevel), 1)
        } else {
            academic_levels_selected.push(alevel);
        }

        set_active_alevels();
        filter_search();
    }

    let connected_works = $state([]);

    function show_connected(ref_id){
        connected_works = [ref_id];
    }

    const alevel_to_title = {
        "NONE": "",
        "BACHELOR": "",
        "MASTER": "",
        "DR": "Dr. ",
        "PROF": "Prof. ",
        "PROF_DOCTOR": "Prof. Dr. ",
        "DIPLOMA": ""
    }
</script>

<div class="referent-filter-table-container">
    <div class="headline-s">REFERENTEN</div>
    <div class="referent-table-container stroke-style">
        <div class="search-bar">
            <div class="search">
                <img src={search} alt="">
                <input type="text" class="search-input" placeholder="Referent suchen"
                    bind:value={search_value} oninput={filter_search}>
            </div>
            <div class="filter-container">
                <span class="reset-filter stroke-style" onclick={() => { status_filter.splice(0); academic_levels_selected.splice(0); set_active_status(); set_active_alevels(); filter_search(); }}>Zurücksetzen</span>
                <span class="show-filter stroke-style" onclick={() => { show_filter = !show_filter; setTimeout(() => { set_active_status(); set_active_alevels(); }, 10); }}>{ filter_on ? "Filter: Ein" : "Filter: Aus" }<img src={show_filter ? caretup : caretdown} alt=""></span>
                {#if show_filter}
                    <div class="filter-popup stroke-style">
                        <span class="filter-heading">Status</span>
                        <div class="filter-status">
                            {#each status_options as status}
                                <div class="ref-status" data-status="{status}" onclick={() => { toggle_status(status); }}>{status_mapping[status]}</div>
                            {/each}
                        </div>
                        <span class="filter-heading">Akademischer Grad</span>
                        <div class="filter-alevel">
                            {#each academic_levels as alevel}
                                <div class="ref-alevel" data-alevel="{alevel}" onclick={() => { toggle_alevel(alevel); }}>{alevel_mapping[alevel]}</div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
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
                    <span onclick={() => { show_connected(referent.id); }} class="ref-name">{alevel_to_title[referent.academicLevel] + referent.firstName + " " + referent.lastName}<a href="/erstellen/referent/?id={referent.id}"><img class="open-new" src={openblank} alt=""></a></span>
                    <span class="current-works">{referent.numberOfOpenWorks}</span>
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
        grid-column-end: 10;
        grid-row-start: 2;
        grid-row-end: 16;

        display: flex;
        flex-direction: column;

        padding: 12px;
        border-radius: 10px;
        padding-right: 0px;

        .search-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            box-sizing: border-box;
            padding-right: 12px;

            .search {
                padding: 6px;
                font-size: 12px;
                border-radius: 6px;

                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 60%;
                
                * {
                    padding: 6px;
                }

                input {
                    border: none;
                    font-size: 14px;
                    font-weight: 400;
                    width: 80%;
                    outline: none;
                }
            }

            .filter-container {
                display: flex;
                justify-content: flex-end;
                position: relative;

                .reset-filter {
                    background-color: #F9F9F9;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    user-select: none;
                    margin-right: 12px;
                }

                .show-filter {
                    background-color: #F9F9F9;
                    padding: 6px 12px;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    user-select: none;

                    img {
                        width: 10px;
                        padding: 0px 4px;
                    }
                }
                
                .filter-popup {
                    position: absolute;
                    width: 200px;
                    height: 230px;
                    top: 40px;
                    background-color: #FFFFFF;
                    border-radius: 6px;
                    padding: 6px 6px;
                    display: flex;
                    flex-direction: column;
                    
                    .filter-heading {
                        font-weight: 700;
                        color: #000000;
                        user-select: none;
                        padding: 4px 0px;
                    }

                    .filter-status, .filter-alevel {
                        .ref-status, .ref-alevel {
                            white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            font-size: 12px;
                            color: #3c3c3c;
                            cursor: pointer;
                            padding: 2px 0px;
                            user-select: none;
                        }
                    }
                }
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
        grid-column-start: 10;
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