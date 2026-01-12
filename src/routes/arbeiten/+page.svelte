<script>
    import { invalidateAll } from '$app/navigation';
    import { api_url } from '$lib/constants.js';
    import search from '$lib/assets/search.svg';
    import openblank from '$lib/assets/open-blank.svg';
    import caretdown from '$lib/assets/caret-down.svg';
    import caretup from '$lib/assets/caret-up.svg';
    import trash from '$lib/assets/trash.svg'; // Löschen-Icon (Mülltonne)
    import { color_mapping, status_mapping, img_mapping, alevel_to_title } from '$lib/mappings';
    import { GET } from '$lib/functions.js';
    import pen from '$lib/assets/pen.svg';

    let { data } = $props();

    let sworks_base = data.sworks
    let sworks_filtered = $state(data.sworks);

    let study_programs = data.study_programs;
    let study_programs_mapping = {};
    data.study_programs.forEach(program => {
        study_programs_mapping[program.id] = (program.degreeType ?? "-") + " in " + (program.title ?? "-");
    });

    let student_mapping = {};
    data.students.forEach(student => {
        student_mapping[student.id] = student;
    });

    let referent_mapping = {};
    data.referenten.forEach(referent => {
        referent_mapping[referent.id] = referent;
    });

    let search_value = $state("");
    let study_programs_selected = $state([]);
    let status_selected = $state([]);
    let show_filter = $state(false);
    let filter_on = $derived(study_programs_selected.length > 0);

    function filter_search(){
        sworks_filtered = sworks_base.filter((work) => (work.title + " " + (study_programs_mapping[work.studyProgramId]) + ", " + (student_mapping[work.studentId]?.firstName ?? "") + " " + (student_mapping[work.studentId]?.lastName ?? "")).includes(search_value))
        if(study_programs_selected.length > 0)
            sworks_filtered = sworks_filtered.filter((work) => study_programs_selected.includes(work.studyProgramId));
        if(status_selected.length > 0)
            sworks_filtered = sworks_filtered.filter((work) => {
                return work.status ? status_selected.includes(work.status.eventType) : false;
            });
    }

    function set_active_programs(){
        let root = document.querySelector(".filter-study-program");
        
        if (root == null) return;
        
        for(let child of root.children){
            let id = Number(child.getAttribute("data-st-id"));
            if(study_programs_selected.includes(id)){
                child.style.fontWeight = "700";
                child.style.color = "#000000";
            } else {
                child.style.fontWeight = "400";
                child.style.color = "#3c3c3c";
            }
        }
    }

    function toggle_study_program(sp_id){
        if(study_programs_selected.includes(sp_id)){
            study_programs_selected.splice(study_programs_selected.indexOf(sp_id), 1)
        } else {
            study_programs_selected.push(sp_id);
        }

        set_active_programs();
        filter_search();
    }

    function set_active_status(){
        let root = document.querySelector(".filter-status");
        
        if (root == null) return;
        
        for(let child of root.children){
            let status = child.getAttribute("data-status");
            if(status_selected.includes(status)){
                child.style.fontWeight = "700";
                child.style.color = "#000000";
            } else {
                child.style.fontWeight = "400";
                child.style.color = "#3c3c3c";
            }
        }
    }

    function toggle_status(status){
        if(status_selected.includes(status)){
            status_selected.splice(status_selected.indexOf(status), 1)
        } else {
            status_selected.push(status);
        }

        set_active_status();
        filter_search();
    }

    let current_swork = $state(0);
    let events = $state(0);

    async function get_events(id){
        return GET(`/api/scientific-work/${id}/events`);
    }

    async function show_connected(sw_id){
        current_swork = sworks_base.filter(sw => sw.id == sw_id)[0];
        events = await get_events(sw_id);
    }

    // Löscht eine Arbeit über API und aktualisiert die Listen
    async function delete_swork(sw_id){
        if(!confirm("Arbeit wirklich löschen?")) return;
        await fetch(`${api_url}/api/scientific-work/${sw_id}`, { method: 'DELETE' });
        sworks_base = sworks_base.filter(sw => sw.id != sw_id); // aus Basisliste entfernen
        sworks_filtered = sworks_filtered.filter(sw => sw.id != sw_id); // aus gefilterter Liste entfernen
        current_swork = 0; // setzt variable zurück, sodass rechts nicht mehr angezeigt wird
        await invalidateAll();
    }

    const status_list = [
        "PROPOSAL",
        "DISCUSSION",
        "FINAL_SUBMISSION",
        "REVIEW",
        "ARCHIVE",
        "ABORT"
    ]
</script>

<div class="sworks-filter-table-container">
    <div class="headline-s">ARBEITEN</div>
    <div class="sworks-table-container stroke-style">
        <div class="search-bar">
            <div class="search">
                <img src={search} alt="">
                <input type="text" class="search-input" placeholder="Arbeit suchen"
                    bind:value={search_value} oninput={filter_search}>
            </div>
            <div class="filter-container">
                <span class="reset-filter stroke-style" onclick={() => { study_programs_selected.splice(0); status_selected.splice(0); set_active_programs(); set_active_status(); filter_search(); }}>Zurücksetzen</span>
                <span class="show-filter stroke-style" onclick={() => { show_filter = !show_filter; setTimeout(() => { set_active_programs(); set_active_status(); }, 10); }}>{ filter_on ? "Filter: Ein" : "Filter: Aus" }<img src={show_filter ? caretup : caretdown} alt=""></span>
                {#if show_filter}
                    <div class="filter-popup stroke-style">
                        <span class="filter-heading">Status</span>
                        <div class="filter-status">
                            {#each status_list as status}
                                <div class="status" data-status="{status}" onclick={() => { toggle_status(status); }}>{status_mapping[status]}</div>
                            {/each}
                        </div>
                        <span class="filter-heading">Studiengang</span>
                        <div class="filter-study-program">
                            {#each study_programs as study_program}
                                <div class="study-program" data-st-id="{study_program.id}" onclick={() => { toggle_study_program(study_program.id); }}>{study_program.degreeType + " in " + study_program.title}</div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
            </div>
        <div class="table-head">
            <span class="head-name">Titel, Studiengang, Name</span>
            <span class="head-status">Status</span>
            <span class="head-start">Startdatum</span>
            <span class="head-end">Abgabedatum</span>
            <span class="head-kolloq">Kolloquiumsdatum</span>
        </div>
        <div class="sworks-table">
            {#each sworks_filtered as swork}
                <div class="sworks-row">
                    <span class="swork-name" onclick={() => { show_connected(swork.id); }}>
                        <p>{swork.title}</p>
                        <span>{study_programs_mapping[swork.studyProgramId]}, {(student_mapping[swork.studentId]?.firstName ?? "") + " " + (student_mapping[swork.studentId]?.lastName ?? "-")}</span>
                    </span>
                    <span class="swork-status" style:color="{swork.status ? color_mapping[swork.status.eventType] : "#3B4B55"}">
                        <p><img src={swork.status?.eventType ? img_mapping[swork.status.eventType] : bookmark} alt=""></p>
                        <p>{swork.status?.eventType ? status_mapping[swork.status.eventType] : "-"}</p>
                        <p>{swork.status?.eventDate ? String(swork.status.eventDate.toReversed()).replaceAll(",", ".") : "-"}</p>
                    </span>
                    <span class="swork-start">{swork.startDate ? String(swork.startDate.toReversed()).replaceAll(",", ".") : "-"}</span>
                    <span class="swork-end">{swork.endDate ? String(swork.endDate.toReversed()).replaceAll(",", ".") : "-"}</span>
                    <span class="swork-kolloq">
                        <p>{swork.colloquium ? String(swork.colloquium.toReversed().splice(2)).replaceAll(",", ".") : "-"}</p>
                        <p>{(swork.presentationStart ?? "") + " " + (swork.colloquiumLocation ?? "")}</p>
                    </span>
                </div>
            {/each}
        </div>
    </div>
    <div class="sworks-short stroke-style">
        {#if !(current_swork == 0)}
        <div class="current-swork">
            <!-- Bearbeiten und Löschen Buttons -->
            <div class="action-btns">
                <span class="action-label">Bearbeiten / Löschen?</span>
                <a class="edit-btn" href="/erstellen/arbeit?id={current_swork.id}"><img src={pen} alt="Bearbeiten"></a>
                <button class="delete-btn" onclick={() => delete_swork(current_swork.id)}><img src={trash} alt="Löschen"></button>
            </div>
            <span class="style-med">{current_swork.title ?? "-"}</span>
            <span class="style-small ellipsis">{study_programs_mapping[current_swork.studyProgramId]}</span>
            <span class="style-small">{(student_mapping[current_swork.studentId]?.firstName ?? "") + " " + (student_mapping[current_swork.studentId]?.lastName ?? "-")}</span>
            
            <span class="style-med top-gap">Verlauf:</span>
            <div class="events-verlauf">
                {#each events as event}
                    <div class="work-status">
                        <span class="color" style:background-color="{event.eventType ? color_mapping[event.eventType]: "#3B4B55"}"></span>
                        <span class="work-event">
                            <p>{event.eventType ? status_mapping[event.eventType] : "-"}</p>
                            <p>{event.eventDate ? String(event.eventDate.toReversed()).replaceAll(",", "."): "-"}</p>
                        </span>
                    </div>
                {/each}
            </div>

            <span class="style-med top-gap">Kommentar: </span>
            <span class="style-small">{current_swork.comment ?? "-"}</span>

            <span class="style-med top-gap">Termine: </span>
            <span class="style-small">Startdatum: {current_swork.startDate ? String(current_swork.startDate.toReversed()).replaceAll(",", ".") : "-"}</span>
            <span class="style-small">Abgabedatum: {current_swork.endDate ? String(current_swork.endDate.toReversed()).replaceAll(",", ".") : "-"}</span>
            
            <span class="style-small top-gap">Kolloquiumsdatum: {current_swork.colloquium ? String(current_swork.colloquium.toReversed().splice(2)).replaceAll(",", ".") : "-"}</span>
            <span class="style-small">Kolloquiumsort: {current_swork.colloquiumLocation ?? "-"}</span>
            <span class="style-small">Präsentation: {current_swork.presentationStart ?? "-"} - {current_swork.presentationEnd ?? "-"}</span>
            <span class="style-small">Diskussions: {current_swork.discussionStart ?? "-"} - {current_swork.discussionEnd ?? "-"}</span>
            
            <span class="style-med top-gap">Referent: {current_swork.mainEvaluatorId ? alevel_to_title[referent_mapping[current_swork.mainEvaluatorId].academicLevel] + referent_mapping[current_swork.mainEvaluatorId].firstName + " " + referent_mapping[current_swork.mainEvaluatorId].lastName : "-"}</span>
            <span class="style-small">Punkte Arbeit: {current_swork.mainEvaluatorWorkMark ?? "-"}</span>
            <span class="style-small">Punkte Kolloquium: {current_swork.mainEvaluatorColloquiumMark ?? "-"}</span>
            
            <span class="style-med top-gap">Korreferent: {current_swork.secondEvaluatorId ? alevel_to_title[referent_mapping[current_swork.secondEvaluatorId].academicLevel] + referent_mapping[current_swork.secondEvaluatorId].firstName + " " + referent_mapping[current_swork.secondEvaluatorId].lastName : "-"}</span>
            <span class="style-small">Punkte Arbeit: {current_swork.secondEvaluatorWorkMark ?? "-"}</span>
            <span class="style-small">Punkte Kolloquium: {current_swork.secondEvaluatorColloquiumMark ?? "-"}</span>
        </div>
        {/if}
    </div>
</div>

<style lang="scss">
.sworks-filter-table-container {
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

    .sworks-table-container {
        grid-column-start: 1;
        grid-column-end: 10;
        grid-row-start: 2;
        grid-row-end: 16;

        display: flex;
        flex-direction: column;

        padding: 12px;
        border-radius: 10px;
        padding-right: 0px;
        box-sizing: border-box;
        padding-bottom: 20px;

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
                    height: 300px;
                    top: 40px;
                    overflow: auto;
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

                    .filter-study-program, .filter-status {
                        .study-program, .status {
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
                width: 55%;
            }

            .head-status {
                width: 10%;
            }

            .head-start {
                width: 8%;
            }

            .head-end {
                width: 8%;
            }

            .head-kolloq {
                width: 11%;
            }
        }

        .sworks-table {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            overflow: scroll;

            .sworks-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 99%;
                box-sizing: border-box;
                padding: 6px 12px;
                font-size: 12px;
                font-weight: 600;
                min-height: 65px;

                .swork-name {
                    width: 55%;
                    cursor: pointer;
                    
                    p {
                        margin: 0px;
                    }

                    span {
                        font-weight: 400;
                    }

                    * {
                        padding: 2px 0px;
                    }
                }

                .swork-status {
                    width: 10%;

                    p {
                        margin: 0px;

                        img {
                            width: 12px;
                        }
                    }

                    * {
                        padding: 1px 0px;
                    }
                }

                .swork-start {
                    width: 8%;
                }

                .swork-end {
                    width: 8%;
                }

                .swork-kolloq {
                    width: 11%;

                    p {
                        margin: 0px;
                    }

                    * {
                        padding: 1px 0px;
                    }
                }
            }
        }


        
    }

    .sworks-short {
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

        .current-swork {
            display: flex;
            justify-content: center;
            align-items: flex-start;
            flex-direction: column;

            width: 100%;

            .action-btns {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 10px;
                margin-bottom: 10px;
                width: 100%;

                .action-label {
                    margin-right: auto;
                    font-size: 12px;
                    color: #666;
                }

                .edit-btn, .delete-btn {
                    cursor: pointer;
                    background: #F9F9F9;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    padding: 8px 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;

                    &:hover {
                        background: #eee;
                    }

                    img {
                        width: 18px;
                        height: 18px;
                    }
                }
            }

            .events-verlauf {
                display: flex;
                flex-direction: column;
                align-items: flex-start;

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
            }

            .ellipsis {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 100%;
            }

            .top-gap {
                margin-top: 10px;
            }

            .style-small {
                font-size: 14px;
                font-family: 'Inter';
            }

            .style-med {
                font-size: 14px;
                font-family: 'Inter SB';
            }

            .style-large {
                font-size: 22px;
                font-weight: bold;
                font-family: 'Inter SB';
                padding: 6px 0px;
            }
        }
    }
}

</style>