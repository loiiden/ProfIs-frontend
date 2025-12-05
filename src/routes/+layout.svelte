<script>
    import "../styles/fonts.css";

    import favicon from '$lib/assets/favicon.svg';
    import profisicon from '$lib/assets/profis-icon.png'

    import GlobalSearch from '$lib/components/global-search.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={profisicon} />
</svelte:head>

<div class="page-padding">
    <header>
        <a href="/">
                <img src={profisicon} alt="" class="profis-logo">
        </a>
        <GlobalSearch />
        <div class="page-navigation">
            <a href="/referenten">Referenten</a>
            <a href="/arbeiten">Arbeiten</a>
            <a href="/studenten">Studenten</a>
        </div>
        <div class="global-actions">
            <span class="anlegen">Anlegen+</span>
            <span class="export">Import/Export</span>
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

        grid-column-start: 6;
        grid-column-end: 10;

        font-weight: 500;
        font-size: 14px;
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

        .anlegen {
            background-color: $primary;
            color: #FFFFFF;
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        }

        .export {
            background-color: #FFFFFF;
            box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
        }

        .anlegen, .export {
            border-radius: 6px;
            padding: 12px;
        }

        span {
            margin-left: 20px;
            cursor: pointer;
        }
    }
}

</style>