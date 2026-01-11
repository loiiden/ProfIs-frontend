<script>
    import { color_mapping, status_mapping } from '$lib/mappings.js';

    import search from '$lib/assets/search.svg';
    import openblank from '$lib/assets/open-blank.svg';
    import caretdown from '$lib/assets/caret-down.svg';
    import caretup from '$lib/assets/caret-up.svg';

    import { GET } from '$lib/functions.js';

    let { data } = $props();

    let students_base = data.students
    let students_filtered = $state(data.students);

    let study_programs = data.study_programs;
    let study_programs_mapping = {};
    data.study_programs.forEach(program => {
        study_programs_mapping[program.id] = program.title;
    });

    let search_value = $state("");
    let study_programs_selected = $state([]);
    let show_filter = $state(false);
    let filter_on = $derived(study_programs_selected.length > 0);

    function filter_search(){
        students_filtered = students_base.filter((stu) => (stu.firstName + " " + stu.lastName + " " + stu.email).includes(search_value))
        if(study_programs_selected.length > 0)
            students_filtered = students_filtered.filter((stu) => study_programs_selected.includes(stu.studyProgramId));
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

    let current_student = $state(0);
    let connected_works = $state([]);
    let cache = {};

    async function get_connected_works(id){
        return GET(`/api/student/${id}/shortWorks`);
    }

    async function show_connected(stu_id){
        current_student = students_base.filter(stu => stu.id == stu_id)[0];

        if(stu_id in cache){
            connected_works = cache[stu_id];
        } else {
            let works = await get_connected_works(stu_id);
            cache[stu_id] = works;
            connected_works = works;
        }
    }
</script>

<div class="student-filter-table-container">
    <div class="headline-s">STUDENTEN</div>
    <div class="student-table-container stroke-style">
        <div class="search-bar">
            <div class="search">
                <img src={search} alt="">
                <input type="text" class="search-input" placeholder="Studenten suchen"
                    bind:value={search_value} oninput={filter_search}>
            </div>
            <div class="filter-container">
                <span class="reset-filter stroke-style" onclick={() => { study_programs_selected.splice(0); set_active_programs(); filter_search(); }}>Zurücksetzen</span>
                <span class="show-filter stroke-style" onclick={() => { show_filter = !show_filter; setTimeout(() => { set_active_programs(); }, 10); }}>{ filter_on ? "Filter: Ein" : "Filter: Aus" }<img src={show_filter ? caretup : caretdown} alt=""></span>
                {#if show_filter}
                    <div class="filter-popup stroke-style">
                        <span class="filter-heading">Studiengang</span>
                        <div class="filter-study-program">
                            {#each study_programs as study_program}
                                <div class="study-program" data-st-id="{study_program.id}" onclick={() => { toggle_study_program(study_program.id); }}>{study_program.title}</div>
                            {/each}
                        </div>
                    </div>
                {/if}
            </div>
        </div>
        <div class="table-head">
            <span class="head-name">Student</span>
            <span class="head-num">Matrikel</span>
            <span class="head-program">Studiengang</span>
            <span class="head-email">E-Mail</span>
        </div>
        <div class="student-table">
            {#each students_filtered as student}
                <div class="student-row">
                    <span onclick={() => { show_connected(student.id); }} class="stu-name">{student.firstName + " " + student.lastName}<a href="/erstellen/student/?id={student.id}"><img class="open-new" src={openblank} alt=""></a></span>
                    <span class="stu-num">{student.studentNumber}</span>
                    <span class="stu-program" title="{study_programs_mapping[student.studyProgramId]}">{study_programs_mapping[student.studyProgramId]}</span>
                    <span class="stu-email"><a href="mailto:{student.email}">{student.email}</a></span>
                </div>
            {/each}
        </div>
    </div>
    <div class="connected-works stroke-style">
        {#if !(current_student == 0)}
            <div class="current-student">
                <span class="cur-anrede">{current_student.salutation !== null ? String(current_student.salutation).toLowerCase().charAt(0).toUpperCase() + String(current_student.salutation).toLowerCase().slice(1) : "-"}</span>
                <span class="cur-name">{current_student.firstName + " " + current_student.lastName}</span>
                <span class="cur-mat">Matrikelnummer: {current_student.studentNumber}</span>
                <span class="cur-email">E-Mail: {current_student.email}</span>
                <span class="cur-tel">Telefon: {current_student.phoneNumber}</span>
            </div>
            <div class="aktuelle-arbeiten">Aktive Arbeiten</div>
            <div class="connected-works-list">
                {#each connected_works as work}
                    <div class="work">
                        <div class="work-status">
                            <span class="color" style:background-color="{work.status ? color_mapping[work.status.eventType]: "#3B4B55"}"></span>
                            <span class="work-event">
                                <p>{work.status?.eventType ? status_mapping[work.status.eventType] : "-"}</p>
                                <p>{work.status?.eventDate ? String(work.status.eventDate.toReversed()).replaceAll(",", "."): "-"}</p>
                            </span>
                        </div>
                        <span class="work-program">{work.StudyProgramTitle}</span>
                        <span class="work-title">{work.title}</span>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
.student-filter-table-container {
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

    .student-table-container {
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

                    .filter-study-program {
                        .study-program {
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
            justify-content: flex-start;
            align-items: center;
            width: 99%;
            box-sizing: border-box;
            padding: 12px;
            font-size: 12px;
            font-weight: 600;
            
            .head-name {
                width: 30%;
            }

            .head-num {
                width: 9%;
            }

            .head-program {
                width: 31%;
            }

            .head-email {
                width: 28%;
            }
        }

        .student-table {
            display: flex;
            align-items: flex-start;
            flex-direction: column;
            overflow: scroll;

            .student-row {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 99%;
                box-sizing: border-box;
                padding: 12px;
                font-size: 12px;

                .stu-name {
                    width: 30%;
                    cursor: pointer;

                    .open-new {
                        width: 14px;
                        margin-left: 10px;
                        user-select: none;
                    }
                }

                .stu-num {
                    width: 9%;
                }

                .stu-program {
                    width: 31%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    padding-right: 10px;
                    box-sizing: border-box;
                }

                .stu-email {
                    width: 30%;
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

        .current-student {
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

            .cur-mat, .cur-email, .cur-tel {
                font-size: 14px;
                font-family: 'Inter';
            }
        }

        .aktuelle-arbeiten {
            background-color: #F9F9F9;
            padding: 8px;
            margin: 8px 0px;
            border-radius: 6px;
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