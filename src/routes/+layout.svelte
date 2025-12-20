<script>
    import "../styles/fonts.css";

    import favicon from '$lib/assets/favicon.svg';
    import profisicon from '$lib/assets/profis-icon.png'

    import GlobalSearch from '$lib/components/global-search.svelte';

	let { children } = $props();

    let anlegen_toggle = $state(false);

    function toggle() {
        anlegen_toggle = !anlegen_toggle;
    }
</script>

<svelte:head>
	<link rel="icon" href={profisicon} />
</svelte:head>

<div class="page-padding">
    <header>
        <a href="/">
                <img src={profisicon} alt="" class="profis-logo">
        </a>
        <div class="page-navigation">
            <a href="/referenten">Referenten</a>
            <a href="/arbeiten">Arbeiten</a>
            <a href="/studenten">Studenten</a>
        </div>
        <div class="global-actions">
            <div class="anlegen-menu">
                <button class="anlegen" onclick={toggle}>Anlegen+</button>
                <div class="anlegen-options" style="display: {anlegen_toggle ? "flex" : "none"}">
                    <a href="/erstellen/referent" onclick={toggle}>Referent</a>
                    <a href="/erstellen/arbeit" onclick={toggle}>Arbeit</a>
                    <a href="/erstellen/student" onclick={toggle}>Student</a>
                </div>
            </div>
            <button class="export">Import/Export</button>
        </div>
    </header>

    {@render children()}
</div>

<style lang="scss">
:global(html, body) {
    margin: 0px;
    padding: 0px;
    background: #F9F9F9;
}

.page-padding {
    margin: 0% auto;
    width: 1440px;
}

header {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: repeat(12, 1fr);

    font-family: "Roboto", sans-serif;
    padding: 20px 0px;
    padding-bottom: 10px;

    a {
        grid-column-start: 1;
        grid-column-end: 2;

        img {
            width: 5em;
        }
    }

    .page-navigation {
        display: flex;
        justify-content: left;
        align-items: center;

        grid-column-start: 2;
        grid-column-end: 6;

        font-weight: 600;
        font-size: 18px;
        font-family: "Inter";

        a {
            text-decoration: none;
            color: black;
            margin: 0px 30px;
        }
    }

    .global-actions {
        grid-column-start: 10;
        grid-column-end: 13;

        display: flex;
        justify-content: right;
        align-items: center;

        font-weight: 600;
        font-size: 14px;
        font-family: "Inter";

        .anlegen-menu {
            position: relative;

            .anlegen {
                background-color: $primary;
                color: #FFFFFF;
                box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
            }

            .anlegen-options {
                display: none;
                position: absolute;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                width: 100%;
                margin-top: 8px;

                a {
                    padding: 8px 6px;
                    text-decoration: none;
                    color: black;
                }
            }
        }

        .export {
            margin-left: 20px;
            background-color: #FFFFFF;
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        }

        .anlegen, .export {
            border: none;
            border-radius: 6px;
            padding: 12px;
        }

        button {
            cursor: pointer;
        }
    }
}

</style>