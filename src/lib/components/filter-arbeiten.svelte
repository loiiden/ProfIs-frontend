<script>
    import searchimg from '$lib/assets/search.svg';

    import OverviewArbeit from "$lib/components/overview-arbeit.svelte";
    import CommentArbeit from "$lib/components/overview/comment-arbeit.svelte";
    import { color_mapping, status_mapping, img_mapping } from '$lib/mappings';

    let props = $props();

    let study_programs_mapping = {};
    props.study_programs.forEach(program => {
        study_programs_mapping[program.id] = program.degreeType + " in " + program.title;
    });

    let student_mapping = {};
    props.students.forEach(student => {
        student_mapping[student.id] = student;
    });

    let referent_mapping = {};
    props.referents.forEach(referent => {
        referent_mapping[referent.id] = referent;
    });

    let search = $state("");
    let index = $state(0);
    let current_item = $derived(index !== null ? filtered_items[index] : null)

    let items_base = $derived(props.sworks)
    let filtered_items = $state(props.sworks);

    function showDetails(item) {
        current_item = item;
    }

    function prev() {
        if (index > 0) index--;
    }

    function next() {
        if (index < filtered_items.length - 1) index++;
    }
</script>

<div class="filter-arbeiten-container stroke-style">
    <div class="search">
        <img src={searchimg} alt="">
        <input
                type="text"
                class="search-input"
                placeholder="Suche nach Studenten"
                bind:value={search}
                oninput={() => {
                    filtered_items = items_base.filter((swork) => {
                        let student_name = student_mapping[swork.studentId].firstName + " " + student_mapping[swork.studentId].lastName;
                        return student_name.toLowerCase().includes(search.toLowerCase())
                    });
                }}
        />
    </div>

    <div class="scroll-area">
        {#each filtered_items as swork, i}
            <div class="list-item {index === i ? 'active' : ''}" onclick={() => {
                index = i;
            }}>
                <div class="left-side">
                    <div class="style-large">{student_mapping[swork.studentId].firstName + " " + student_mapping[swork.studentId].lastName}</div>
                    <div  class="style-small">{study_programs_mapping[swork.studyProgramId]}</div>
                    <div  class="style-small">{swork.title}</div>
                </div>
                
                <span class="swork-status" style:color="{swork.status ? color_mapping[swork.status.eventType] : "#3B4B55"}">
                        <p><img src={swork.status ? img_mapping[swork.status.eventType] : bookmark} alt=""></p>
                        <p>{swork.status?.eventType ? status_mapping[swork.status.eventType] : "-"}</p>
                        <p>{swork.status?.eventDate ? String(swork.status.eventDate.toReversed()).replaceAll(",", ".") : "-"}</p>
                    </span>
            </div>
        {/each}
    </div>
</div>

<OverviewArbeit swork={current_item} studmap={student_mapping}
    progmap={study_programs_mapping} refmap={referent_mapping}/>

<CommentArbeit kommentar="{current_item ? current_item.comment : ""}"/>

<style lang="scss">
  .filter-arbeiten-container {
    grid-column-start: 8;
    grid-column-end: 13;
    grid-row-start: 2;
    grid-row-end: 12;

    box-sizing: border-box;
    background-color: #FFFFFF;
    padding: 12px 0px;
    border-radius: 10px;

    h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 700;
        color: #000;
    }

    .search {
        font-size: 14px;
        border-radius: 6px;

        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 60%;
        padding: 12px;
        padding-top: 0px;
        
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
  }

  .scroll-area {
    height: 89%;
    overflow: auto;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 12px;
    margin-bottom: 8px;
    background: white;
    cursor: pointer;
  }

  .list-item.active {
    background-color: #d4d4d480;
  }

  .left-side {
    width: 73%;
  }

  input {
    width: 60%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
  }

.swork-status {
    width: 15%;
    font-size: 12px;
    font-weight: 600;

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

  .detail-btn {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background: #ddd;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
  }

  .planning {
    color: $note2;
  }

  .correction {
    color: $note4;
  }

  .done {
    color: $note1;
  }

  .progress {
    color: $note3;
  }

  .canceled {
    color: $note5;
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
    font-size: 16px;
    font-family: 'Inter SB';
}
</style>