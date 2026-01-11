<script>
    let props = $props()

    import { alevel_to_title } from "$lib/mappings";

    let swork = $derived(props.swork);
    let studmap = $derived(props.studmap);
    let progmap = $derived(props.progmap);
    let refmap = $derived(props.refmap);

    function convert_mark(mark) {
        console.log(mark);

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
</script>

<div class="overview-arbeit-container">

    <div class="effect-el-1"></div>
    <div class="effect-el-2"></div>

    <div class="overview-arbeit stroke-style">

        <div class="header">
            <div class="left">
                <p class="student">{swork ? studmap[swork.studentId].firstName + " " + studmap[swork.studentId].lastName : "-"}</p>
                <p class="title">{swork ? swork.title : "-"}</p>
            </div>
            <div class="right">
                <p class="course">{swork ? progmap[swork.studyProgramId] : "-"}</p>
            </div>
        </div>
        <div class="timeline">
        </div>
        <div class="grades">
            <div class="mark">
                <div class="referent">
                    <p class="ref-head">Referent:</p>
                    <p>{swork ?  alevel_to_title[refmap[swork.mainEvaluatorId].academicLevel] + refmap[swork.mainEvaluatorId].firstName + " " + refmap[swork.mainEvaluatorId].lastName : "-"}</p>
                </div>
                <div class="note green">{swork ? convert_mark((swork.mainEvaluatorWorkMark + swork.mainEvaluatorColloquiumMark) / 2) : "-"}</div>
            </div>
            <div class="mark">
                <div class="referent">
                    <p class="ref-head">Korreferent:</p>
                    <p>{swork ?  alevel_to_title[refmap[swork.secondEvaluatorId].academicLevel] + refmap[swork.secondEvaluatorId].firstName + " " + refmap[swork.secondEvaluatorId].lastName : "-"}</p>
                </div>
                <div class="note blue">{swork ? convert_mark((swork.secondEvaluatorWorkMark + swork.secondEvaluatorColloquiumMark) / 2) : "-"}</div>
            </div>
            <div class="mark">
                <div class="referent">
                    <p class="ref-head total-mark">Gesamtnote:</p>
                </div>
                <div class="note green">{swork ? convert_mark((swork.mainEvaluatorWorkMark + swork.mainEvaluatorColloquiumMark + swork.secondEvaluatorWorkMark + swork.secondEvaluatorColloquiumMark) / 4) : "-"}</div>
            </div>
        </div>
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
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;
    }
}

.header {
    display: flex;
    justify-content: space-between;
    
    .left {
        width: 70%;

        p {
            margin: 0px;
            padding: 6px;
        }

        .student {
            font-family: 'Inter EB';
            font-size: 30px;
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
</style>
