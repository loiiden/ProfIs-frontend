<script>
    import search from '$lib/assets/search.svg';

    let { data } = $props();

    let students_base = data.students
    let students_filtered = $state(data.students);

    let search_value = $state("");

    function filter_search(){
        students_filtered = students_base.filter((stu) => (stu.firstName + " " + stu.lastName + " " + stu.email).includes(search_value))
    }
</script>

<div class="student-filter-table-container">
    <div class="headline-s">Studenten</div>
    <div class="student-table-container stroke-style">
        <div class="search-bar stroke-style">
            <img src={search} alt="">
            <input type="text" class="search-input" placeholder="Studenten suchen"
                bind:value={search_value} oninput={filter_search}>
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
                    <span class="stu-name">{student.firstName + " " + student.lastName}</span>
                    <span class="stu-num">{student.studentNumber}</span>
                    <span class="stu-program">B. Sc. Softwaretechnologie</span>
                    <span class="stu-email"><a href="mailto:{student.email}">{student.email}</a></span>
                </div>
            {/each}
        </div>
    </div>
    <div class="connected-works stroke-style">
    </div>
</div>

<style lang="scss">
.student-filter-table-container {
    display: grid;
    grid-template-rows: repeat(15, 9px);
    grid-template-columns: repeat(12, 1fr);
    column-gap: 20px;
    row-gap: 45px;

    font-family: 'Roboto';

    .headline-s {
        grid-column-start: 1;
        grid-column-end: 4;
        grid-row-start: 1;
        grid-row-end: 2;

        padding: 0px 30px;
        font-size: 2em;
    }

    .student-table-container {
        grid-column-start: 1;
        grid-column-end: 9;
        grid-row-start: 2;
        grid-row-end: 16;

        display: flex;
        flex-direction: column;

        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
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
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;

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
                }

                .stu-num {
                    width: 8%;
                }

                .stu-program {
                    width: 30%;
                }

                .stu-email {
                    width: 30%;
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

        box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        padding: 12px;
        border-radius: 10px;
    }
}

</style>