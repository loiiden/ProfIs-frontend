<script>
    let props = $props()

    import pen from '$lib/assets/pen.svg';

    import { alevel_to_title } from "$lib/mappings";
	import { onMount } from "svelte";
    import { date_to_string } from "$lib/functions";
    import { status_mapping } from "$lib/mappings";
	import { page } from "$app/state";

    let swork = $derived(props.swork);
    let studmap = $derived(props.studmap);
    let progmap = $derived(props.progmap);
    let refmap = $derived(props.refmap);

    function convert_mark(mark) {
        let gmark = 0;

        if (mark >= 95)
            gmark = 1.0;
        if (mark < 50)
            gmark = 5.0;

        gmark = 1.0;
        let n = 95;
        while (mark < n) {
            n -= 1.5;
            gmark += 0.1;
        }

        let multiple = Math.pow(10, 1);
        let num = Math.round(gmark * multiple) / multiple;
        return num.toFixed(1);
    }

    function position_events(){
        let ev_container = document.querySelector(".events-container");

        if(ev_container === null) return;

        let step = 100;
        let i = 0;
        for (const child of ev_container.children) {
            child.style.left = `${i * step}px`;
            i++;
        }

        set_bar_width(step);
    }

    function set_bar_width(step){
        let pbar = document.querySelector(".progress-bar");
        let pbarb = document.querySelector(".progress-bar-back");
        if(pbar === null) return;

        let snapshot = $state.snapshot(swork);
        let events = snapshot.events;
        if(snapshot.colloquium !== null){
            if(typeof snapshot.colloquium === "string"){
                let splitted = snapshot.colloquium.split("T");
                let colq = splitted[0].split("-").map(x => parseInt(x, 10));
                
                events.push({eventDate: colq});
            } else {
                events.push({eventDate: snapshot.colloquium.splice(0, 3)});
            }
        }

        const today = new Date();
        let events_count = events.length + 2;
        let progress_count = 0;
        
        for(const event of events){
            const ev_date = new Date(String(event.eventDate).replaceAll(",", "-"))
            const timediff = ev_date - today;
            const day_diff = Math.ceil(timediff / (1000 * 3600 * 24));

            if(day_diff <= 0) progress_count++;
        }
        
        pbarb.style.width = `${(events_count - 2) * step + 3}px`;
        events_count = Math.min(progress_count, events_count)
        pbar.style.width = `${(events_count) * step + 3}px`;
    }

    onMount(() => {
        let timeline = document.querySelector(".timeline");
        position_events();

        let observer = new MutationObserver((mutations) => {
            position_events();
        });

        let config = { childList: true, subtree:true };
        observer.observe(timeline, config);
    })

    function format_datestring(datestring){
        return datestring.split("-").toReversed().toString().replaceAll(",", ".");
    }

    function format_datetime(datetime){
        let splitted = datetime.split("T");

        return [
            format_datestring(splitted[0]),
            splitted[1]
        ]
    }
</script>

<div class="overview-arbeit-container {page.url.pathname == "/" ? "grid-layout-home": "grid-layout-preview"}">

    <div class="effect-el-1" style:display={page.url.pathname == "/" ? "" : "none"}></div>
    <div class="effect-el-2" style:display={page.url.pathname == "/" ? "" : "none"}></div>

    <div class="overview-arbeit stroke-style" style:width={page.url.pathname == "/"  ? "94%" : "100%"}>
        <div class="header">
            {#if swork}
                <div class="left">
                    <p class="student">
                        {swork.studentId ? studmap[swork.studentId].firstName + " " + studmap[swork.studentId].lastName : "-"}
                        {#if page.url.pathname == "/"}
                            <a href="{`/erstellen/arbeit?id=${swork.id}`}"><img src={pen} alt="Löschen"></a>
                        {/if}
                    </p>
                    <p class="title">{swork ? swork.title : "-"}</p>
                </div>
                <div class="right">
                    <p class="course">{swork ? progmap[swork.studyProgramId] : "-"}</p>
                </div>
            {/if}
        </div>
        <div class="timeline">
            {#if swork}
                <div class="progress-bar-back grey"></div>
                <div class="progress-bar green"></div>
                <div class="events-container">
                    <div class="event">
                        <div class="line"></div>
                        <p class="ev-head">Startdatum:</p>
                        <p>{swork.startDate ? (typeof swork.startDate === "string" ? format_datestring(swork.startDate) : date_to_string(swork.startDate)) : "-"}</p>
                    </div>
                    {#each swork.events as event}
                        <div class="event">
                            <div class="line"></div>
                            <p class="ev-head">{event.eventType ? status_mapping[event.eventType] + ":" : "-"}</p>
                            <p>{event.eventDate ? (typeof event.eventDate === "string" ? format_datestring(event.eventDate) : date_to_string(event.eventDate)) : "-"}</p>
                        </div>
                    {/each}
                    <div class="event">
                        <div class="line"></div>
                        <p class="ev-head">Kolloquium:</p>
                        <p>{swork.colloquium ? (typeof swork.colloquium === "string" ? format_datetime(swork.colloquium)[0]: String(swork.colloquium.toReversed().splice(2)).replaceAll(",", ".")) : "-"}, {swork.colloquiumLocation ? swork.colloquiumLocation : "-"}, {swork.colloquium ? (typeof swork.colloquium === "string" ? format_datetime(swork.colloquium)[1] : String(swork.colloquium.slice().splice(3)).replaceAll(",", ":")) : "-"}</p>
                    </div>
                </div>
            {/if}
        </div>
        <div class="grades">
            {#if swork}
                <div class="mark">
                    <div class="referent">
                        <p class="ref-head">Referent:</p>
                        <p>{swork.mainEvaluatorId ?  alevel_to_title[refmap[swork.mainEvaluatorId].academicLevel] + refmap[swork.mainEvaluatorId].firstName + " " + refmap[swork.mainEvaluatorId].lastName : (swork.mainEvaluator ? swork.mainEvaluator.firstName + " " + swork.mainEvaluator.lastName : "-")}</p>
                    </div>
                    <div class="note green">{swork.mainEvaluatorWorkMark !== null && swork.mainEvaluatorColloquiumMark !== null ? convert_mark((swork.mainEvaluatorWorkMark + swork.mainEvaluatorColloquiumMark) / 2) : "-"}</div>
                </div>
                <div class="mark">
                    <div class="referent">
                        <p class="ref-head">Korreferent:</p>
                        <p>{swork.secondEvaluatorId ?  alevel_to_title[refmap[swork.secondEvaluatorId].academicLevel] + refmap[swork.secondEvaluatorId].firstName + " " + refmap[swork.secondEvaluatorId].lastName : (swork.secondEvaluator ? swork.secondEvaluator.firstName + " " + swork.secondEvaluator.lastName : "-")}</p>
                    </div>
                    <div class="note blue">{swork.secondEvaluatorWorkMark !== null && swork.secondEvaluatorColloquiumMark !== null ? convert_mark((swork.secondEvaluatorWorkMark + swork.secondEvaluatorColloquiumMark) / 2) : "-"}</div>
                </div>
                <div class="mark">
                    <div class="referent">
                        <p class="ref-head total-mark">Gesamtnote:</p>
                    </div>
                    <div class="note green">{swork.mainEvaluatorWorkMark !== null && swork.mainEvaluatorColloquiumMark !== null && swork.secondEvaluatorWorkMark !== null && swork.secondEvaluatorColloquiumMark !== null ? convert_mark((swork.mainEvaluatorWorkMark + swork.mainEvaluatorColloquiumMark + swork.secondEvaluatorWorkMark + swork.secondEvaluatorColloquiumMark) / 4) : "-"}</div>
                </div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
.grid-layout-home {
    grid-column-start: 1;
    grid-column-end: 8;
    grid-row-start: 2;
    grid-row-end: 10;
}

.grid-layout-preview {
    grid-column-start: 1;
    grid-column-end: 8;
    grid-row-start: 3;
    grid-row-end: 19;
}

.overview-arbeit-container {
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
        height: 87%;
        background-color: #FFFFFF;
        padding: 12px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }
}

.header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    
    .left {
        width: 70%;

        p {
            margin: 0px;
            padding: 6px;
        }

        .student {
            font-family: 'Inter EB';
            font-size: 30px;
            display: flex;
            align-items: center;
            
            a {
                display: flex;
                align-items: center;
                cursor: pointer;
            }
            
            img {
                width: 18px;
                height: 18px;
                background: #F9F9F9;
                border: 1px solid #ddd;
                border-radius: 6px;
                padding: 5px 8px;
                margin-left: 10px;
            }
        }

        .title {
            font-size: 16px;
            font-family: 'Inter MB';
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2; /* number of lines to show */
            line-clamp: 2;
            -webkit-box-orient: vertical;
        }
    }

    .right {
        width: 25%;

        .course {
            font-family: 'Inter MB';
            margin-top: 25px;
            font-size: 14px;
            color: #4a4f58;
        }
    }
}

.timeline {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50%;
    width: 100%;
    position: relative;
    overflow-x: scroll;
    overflow-y: hidden;
    box-sizing: border-box;

    .progress-bar, .progress-bar-back {
        position: absolute;
        height: 10px;
        left: 27px;
        border-radius: 4px;
    }

    .events-container {
        position: absolute;
        width: 90%;
        height: 10px;

        .event:nth-child(even) {
            top: 30px;

            .line {
                position: absolute;
                top: -19px;
                left: -10px;
                width: 1px;
                height: 55px;
                background-color: #41525A;
            }
        }
        
        .event:nth-child(odd) {
            top: -60px;
            
            .line {
                position: absolute;
                top: 5px;
                left: -10px;
                width: 1px;
                height: 54px;
                background-color: #41525A;
            }
        }

        .event {
            position: absolute;
            width: 150px;

            .ev-head {
                font-family: 'Inter SB';
                font-size: 16px;
            }

            p {
                margin: 0px;
                font-size: 14px;
            }
        }
    }
}

.grades {
    display: flex;
    margin-bottom: 10px;
    margin-left: 10px;
    padding: 6px;
    width: 95%;

    .mark {
        display: flex;
        align-items: center;

        .referent {
            position: relative;

            .ref-head {
                font-family: 'Inter MB';
            }

            .total-mark {
                position: relative;
                top: -10px;
            }

            p {
                font-size: 15px;
                margin: 0px;
            }
        }

        .note {
            width: 40px;
            height: 40px;
            margin: 0px 25px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter EB';
            color: #FFFFFF;
        }
    }
}

.green {
    background-color: #317B3B;
}

.blue {
    background-color: #24B6D8;
}

.grey {
    background-color: #F6F6F6;
}
</style>
