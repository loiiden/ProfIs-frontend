<script>
    import search from '$lib/assets/search.svg';
    import openblank from '$lib/assets/open-blank.svg';
    import caretdown from '$lib/assets/caret-down.svg';
    import caretup from '$lib/assets/caret-up.svg';

    import { GET } from '$lib/functions';
    import { color_mapping, status_mapping, alevel_to_title } from '$lib/mappings.js';

    let { data } = $props();

    let referent_base = data.referenten
    let referent_filtered = $state(data.referenten);

    const status_options = ["PROFESSOR", "EXTERNAL"];
    const academic_levels = ["NONE", "BACHELOR", "MASTER", "DR", "PROF", "PROF_DOCTOR", "DIPLOMA"];
    const extern_mapping = {
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

    let current_referent = $state(0);
    let connected_worksm = $state([]);
    let connected_workss = $state([]);
    let mcache = {};
    let scache = {};

    async function get_connected_works_main(id){
        return GET(`/api/scientific-work/filter/mainEvaluator/${id}`);
    }

    async function get_connected_works_second(id){
        return GET(`/api/scientific-work/filter/secondEvaluator/${id}`);
    }

    async function show_connected(ref_id){
        current_referent = referent_base.filter(ref => ref.id == ref_id)[0];

        if(ref_id in mcache){
            connected_worksm = mcache[ref_id];
            connected_workss = scache[ref_id];
        } else {
            let worksm = await get_connected_works_main(ref_id);
            let workss = await get_connected_works_second(ref_id);
            mcache[ref_id] = worksm;
            scache[ref_id] = workss;
            connected_worksm = worksm;
            connected_workss = workss;
        }
    }
</script>

<svelte:head>
    <title>Referenten - ProfIS</title>
</svelte:head>

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
                                <div class="ref-status" data-status="{status}" onclick={() => { toggle_status(status); }}>{extern_mapping[status]}</div>
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
                    <span onclick={() => { show_connected(referent.id); }} class="ref-name"><a href="/erstellen/referent/?id={referent.id}"><img class="open-new" src={openblank} alt=""></a>{alevel_to_title[referent.academicLevel] + referent.firstName + " " + referent.lastName}</span>
                    <span class="current-works">{referent.numberOfOpenWorks}</span>
                    <span class="ref-email"><a href="mailto:{referent.email}">{referent.email}</a></span>
                    <span class="ref-phone">{referent.phoneNumber}</span>
                </div>
            {/each}
        </div>
    </div>
    <div class="connected-works stroke-style">
        {#if !(current_referent == 0)}
            <div class="current-referent">
                <span class="cur-anrede">{current_referent.salutation !== null ? String(current_referent.salutation).toLowerCase().charAt(0).toUpperCase() + String(current_referent.salutation).toLowerCase().slice(1) : "-"}</span>
                <span class="cur-name">{current_referent.firstName + " " + current_referent.lastName}</span>
                <span class="cur-email">E-Mail: {current_referent.email}</span>
                <span class="cur-tel">Telefon: {current_referent.phoneNumber}</span>
                <span class="extern-status">[ {extern_mapping[current_referent.role]} ]</span>
            </div>
            <div class="aktuelle-arbeiten">Referent für</div>
            <div class="connected-works-list">
                {#each connected_worksm as work}
                    <div class="work">
                        <div class="work-status">
                            <span class="color" style:background-color="{work.status ? color_mapping[work.status.eventType]: "#3B4B55"}"></span>
                            <span class="work-event">
                                <p>{work.status ? status_mapping[work.status.eventType] : "-"}</p>
                                <p>{work.status?.eventDate ? String(work.status.eventDate.toReversed()).replaceAll(",", "."): "-"}</p>
                            </span>
                        </div>
                        <span class="work-student">{work.studentFirstName + " " + work.studentLastName}</span>
                        <span class="work-program">{work.studyProgramTitle}</span>
                        <span class="work-title" title="{work.title}">{work.title}</span>
                    </div>
                {/each}
            </div>
            <div class="aktuelle-arbeiten">Korreferent für</div>
            <div class="connected-works-list">
                {#each connected_workss as work}
                    <div class="work">
                        <div class="work-status">
                            <span class="color" style:background-color="{work.status ? color_mapping[work.status.eventType]: "#3B4B55"}"></span>
                            <span class="work-event">
                                <p>{work.status ? status_mapping[work.status.eventType] : "-"}</p>
                                <p>{work.status?.eventDate ? String(work.status.eventDate.toReversed()).replaceAll(",", "."): "-"}</p>
                            </span>
                        </div>
                        <span class="work-student">{work.studentFirstName + " " + work.studentLastName}</span>
                        <span class="work-program">{work.studyProgramTitle}</span>
                        <span class="work-title" title="{work.title}">{work.title}</span>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="not-selected">
                Noch keinen Referenten ausgewählt!
            </div>
        {/if}
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
                        user-select: none;
                        margin-right: 10px;
                        position: relative;
                        top: 2px;
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
        justify-content: flex-start;
        align-items: flex-start;
        flex-direction: column;

        padding: 12px;
        border-radius: 10px;
        overflow-y: auto;

        .not-selected {
            font-size: 14px;
            font-family: 'Inter SB';
        }

        .current-referent {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;

            width: 100%;

            .cur-anrede {
                font-size: 14px;
                font-family: 'Inter SB';
            }

            .cur-name {
                font-size: 22px;
                font-weight: bold;
                font-family: 'Inter SB';
                padding: 6px 0px;
            }

            .extern-status, .cur-email, .cur-tel {
                font-size: 14px;
                font-family: 'Inter';
            }

            .extern-status {
                font-weight: bold;
                margin-top: 10px;
            }
        }

        .aktuelle-arbeiten {
            background-color: #F9F9F9;
            padding: 8px;
            margin: 8px 0px;
            border-radius: 6px;
            font-size: 12px;
        }

        .connected-works-list {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;
            max-width: 100%;

            .work {
                padding: 6px;
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                flex-direction: column;
                max-width: 100%;

                .work-status {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 3px;

                    .color {
                        width: 40px;
                        height: 20px;
                        border-radius: 6px;
                        display: inline-block;
                        margin-right: 10px;
                    }

                    .work-event {
                        p {
                            margin: 0px;
                            font-size: 10px;
                            font-family: 'Inter SB';
                        }
                    }
                }

                .work-student {
                    width: 100%;
                    max-width: 100%;
                    font-size: 14px;
                    font-family: 'Inter SB';
                }

                .work-program {
                    font-size: 12px;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    width: 100%;
                }

                .work-title {
                    width: 100%;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                    max-width: 100%;
                    font-size: 14px;
                    font-family: 'Inter SB';
                }
            }
        }
    }
}

</style>