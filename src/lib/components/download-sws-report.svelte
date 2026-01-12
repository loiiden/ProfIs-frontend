<script>
    import { POST } from '$lib/functions';
    import { api_url } from '$lib/constants';
    //I habe decided to do it though props because if I use api call,
    //it's going to do api call only at start, that means if main user changes, it won't be noticed, because it's not reactive
    //it should be active only when main user is selected in system 
    let { active } = $props();
    let chosenSemester = $state("");
    async function getSemestersToChoose(){
        try{
            let res = await fetch(`${api_url}/api/sws/semestersToSelect`, {
                method: 'GET'
            });
            if (!res.ok) throw new Error('Fetch failed');
            const data = await res.json();
            console.log(data);
            if (data.length > 0){
                chosenSemester = data[0];
            }
            return data;

        }
        catch(error){
            console.error('Error fetching semesters:', error);
        }
    }
    async function downloadSwsReports() {
        try{
            if (chosenSemester === "") {
                alert('Bitte wählen Sie ein Semester aus.');
                return;
            }
            let res = await fetch(`${api_url}/api/sws/main-user/report/${chosenSemester}`, {
                method: 'GET'
            });
            if (!res.ok) throw new Error('Download failed');
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `SWS_Bericht_${chosenSemester}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('PDF-Bericht konnte nicht erstellt werden.');
        }
    }
</script>
<div class="card report-section">
    <div class="headline-s">Bericht erstellen</div>
    <p class="description">
        Hier können Sie Semesterwochenstunden-Berichte erstellen.<br>
    </p>
    <div class="row select-and-button-wrapper" style="justify-content: space-between;">
        <div style="width: 70%;">
            {#await getSemestersToChoose()}
                <p>Lädt...</p>
            {:then semesters}
                <select style="width: 100%" bind:value={chosenSemester}>
                    {#each semesters as semester}
                            <option value={semester}>{semester}</option>
                    {/each}
                </select>
            {/await}
        </div>
        <div>
            <button class="btn" onclick = {downloadSwsReports} disabled={!active}>Bericht herunterladen</button>
        </div>
    </div>
    
</div>
<style lang="scss">
    @import 'src/styles/colors.scss'; // Für $primary, $error etc.
    .select-and-button-wrapper{
        height: 38px;
        justify-content: space-between;
    }
    select{
        height: 100%;
        flex-grow: 1;
        background: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 6px;
        display: flex;
        align-items: center;
        padding: 0 16px;
        box-sizing: border-box;
        transition: border-color 0.2s;
    }
    .report-section {
        grid-column: 1 / 7;
        grid-row: auto;
        justify-content: center; /* Inhalt vertikal mittig, wenn Platz da ist */
        z-index: 100;
    }
    .card {
        background-color: #FFFFFF;
        border: 1px solid #E9E9E9;
        border-radius: 10px;
        padding: 24px;
        display: flex;
        flex-direction: column;
    }
    .row{
        display: flex;
        flex-direction: row;
    }
    .col{
        display: flex;
        flex-direction: column;
    }
    .headline-s {
        font-weight: 700;
        font-size: 18px;
        margin-bottom: 10px;
    }
    .description {

        color: $tertiary; /* Grau aus colors.scss */
        font-size: 14px;
        margin-bottom: 20px;
        margin-top: 0;
        line-height: 1.5;
    }
    button {
        cursor: pointer;
        border-radius: 6px;
        font-family: "Inter";
        font-size: 14px;
        font-weight: 600;
        border: none;
        padding: 10px 16px;
        transition: background 0.2s;
        background-color: $primary;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 10px 16px;
        height: 38px;
        box-sizing: border-box;

        &:hover { opacity: 0.9; }
    }
    button:disabled {
        background-color: $tertiary;
        cursor: not-allowed;
        opacity: 0.6;
    }
</style>