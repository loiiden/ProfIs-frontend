<script>
    let questions = [
        "Wie verändere ich den Hauptnutzer im System?",
        "Wie lege ich einen neuen Referenten an?",
        "Wie erstelle ich eine neue wissenschaftliche Arbeit?",
        "Wie wird ein neuer Student angelegt?",
        "Wie lade ich den SWS-Bericht herunter?",
        "Wie bearbeite ich einen bestehenden Referenten?",
        "Wie ändere ich Daten einer wissenschaftlichen Arbeit?",
        "Wie bearbeite ich ein Studentenprofil?",
        "Wie exportiere ich Daten nach Excel?",
        "Wie importiere ich Daten aus Excel?",
        "Wie verwalte ich die Studiengänge?"
    ];

    let videoForChosenQuestion = {
        0: "ChangeMainUserOfSystem.mp4",
        1: "CreateReferent.mp4",
        2: "CreateScientificWork.mp4",
        3: "CreateStudent.mp4",
        4: "DownloadSwsReport.mp4",
        5: "EditReferent.mp4",
        6: "EditScientificWork.mp4",
        7: "EditStudent.mp4",
        8: "ExportExcel.mp4",
        9: "ImportExcel.mp4",
        10: "ManageStudyPrograms.mp4"
    };

    let chosenIndex = $state(0);
</script>

<div class="help-wrapper">
    <h1>Anwendungsdokumentation</h1>
    <p>Falls Sie Hilfe bei der Benutzung benötigen, finden Sie hier kurze Tutorials, welche die wichtigsten Funktionalitäten abdecken.</p>
    
    <div class="row">
        <div class="col questions-block">
            {#each questions as question, index}
                <button 
                    class:active={chosenIndex === index} 
                    onclick={() => chosenIndex = index}
                >
                    {question}
                </button>
            {/each}
        </div>

        <div class="video-display">
            {#if videoForChosenQuestion[chosenIndex]}
                {#key chosenIndex}
                    <video width="100%" controls autoplay>
                        <source src={`/videos/user-documentation/${videoForChosenQuestion[chosenIndex]}`} type="video/mp4">
                        Ihr Browser unterstützt das Video-Tag nicht.
                    </video>
                {/key}
                <h3 class="video-title">{questions[chosenIndex]}</h3>
            {:else}
                <div class="no-video">
                    <p>Für diese Frage ist momentan kein Video verfügbar.</p>
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .help-wrapper {
        font-family: 'Inter', sans-serif;
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }

    .row {
        display: flex;
        flex-direction: row;
        gap: 30px;
        margin-top: 20px;
    }

    .questions-block {
        display: flex;
        flex-direction: column;
        width: 40%;
    }

    .video-display {
        width: 60%;
    }

    button {
        all: unset;
        cursor: pointer;
        padding: 12px 15px;
        margin-bottom: 8px;
        background-color: #f8f9fa;
        border-radius: 8px;
        text-align: left;
        border: 1px solid #e9ecef;
        transition: all 0.2s ease;
    }

    button:hover {
        background-color: #e9ecef;
    }

    button.active {
        color: white;
        background-color: #24B6D8;
    }

    .video-title {
        margin-top: 15px;
        font-size: 1.2rem;
        color: #333;
    }

    .no-video {
        background-color: #AF4357;
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
    }
</style>