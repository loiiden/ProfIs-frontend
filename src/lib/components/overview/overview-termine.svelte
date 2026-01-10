<script>
    let props = $props()

    let termine = props.termine;

    function convert_date_to_text(date){
        if (date === null) return;

        const date1 = new Date();
        const date2 = new Date(String(date).replaceAll(",", "-"))
        const timeDifference = date2 - date1;
        const daysDifference = Math.ceil(timeDifference / (1000 * 3600 * 24));
        
        if(daysDifference == 0){
            return "Heute";
        } else if(daysDifference == 1){
            return "Morgen";
        } else if(daysDifference > 1) {
            return `In ${daysDifference} Tagen`;
        }

    }

    const color_mapping = {
        "PROPOSAL": "#7D8398",
        "DISCUSSION": "#24B6D8",
        "FINAL_SUBMISSION": "#65A839",
        "REVIEW": "#2e5812",
        "ARCHIVE": "#333C70",
        "ABORT": "#AF4357"
    }

    const status_mapping = {
        "PROPOSAL": "In Planung",
        "DISCUSSION": "Besprochen",
        "FINAL_SUBMISSION": "Abgegeben",
        "REVIEW": "Korrektur",
        "ARCHIVE": "Archiviert",
        "ABORT": "Abgebrochen"
    }
</script>

<div class="overview-termine-container stroke-style">
    <p class="style-med">Nächste Termine</p>
    <div class="termine">
        {#each termine as termin}
            <div class="termin">
                <p><span class="color" style:background-color="{color_mapping[termin.eventType]}"></span>
                    <span class="style-med">{convert_date_to_text(termin.eventDate)}, {String(termin.eventDate.toReversed().splice(0, 2)).replaceAll(",", ".")}</span>
                    {termin.eventType ? status_mapping[termin.eventType] : "-"},</p>
                <p>{(termin.studentFirstName ?? "") + " " + (termin.studentLastName ?? "")}</p>
            </div>
        {/each}
    </div>
</div>

<style lang="scss">
.overview-termine-container {
    grid-column-start: 3;
    grid-column-end: 6;
    grid-row-start: 12;
    grid-row-end: 16;

    box-sizing: border-box;
    background-color: #FFFFFF;
    padding: 12px;
    border-radius: 10px;
    
    p {
        margin: 0px;
    }

    .termine {
        overflow: auto;
        max-height: 80%;
        margin-top: 10px;
        box-sizing: border-box;

        .termin {
            font-size: 14px;
            padding: 6px 0px;
            
            p {
                padding: 1px 0px;
                .color {
                    width: 10px;
                    height: 15px;
                    border-radius: 3px;
                    display: inline-block;
                }
            }
        }
    }
}

.style-small {
    font-size: 14px;
    font-family: 'Inter';
}

.style-med {
    font-size: 14px;
    font-family: 'Inter SB';
}
</style>