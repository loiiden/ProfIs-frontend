<script>
    import '$lib/styles/fonts.css';

    import favicon from '$lib/assets/favicon.svg';
    import profisicon from '$lib/assets/profis-icon.png'
    import settingsicon from '$lib/assets/settings.svg'

    import GlobalSearch from '$lib/components/global-search.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<header>
    <div class="left-nav">
        <a href="/">
            <img src={profisicon} alt="" class="profis-logo">
        </a>
        <GlobalSearch />
    </div>
    <div class="right-nav">
        <div class="page-navigation">
            <a href="/referenten">Referenten</a>
            <a href="/arbeiten">Arbeiten</a>
            <a href="/studenten">Studenten</a>
        </div>
        <div class="global-actions">
            <span class="anlegen">Anlegen+</span>
            <span class="export">Import/Export</span>
            <span>
                <img src={settingsicon} alt="">
            </span>
        </div>
    </div>
</header>

<style lang="scss">
:global(body) {
    margin: 0px;
    padding: 0px;
}


header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-family: "Roboto", sans-serif;
    background: #F9F9F9;

    padding: 10px 20px;
}

.left-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    
    a {
        margin-right: 30px;

        img {
            width: 5em;
        }
    }
}

.right-nav {
    display: flex;
    justify-content: center;
    align-items: center;

    .page-navigation {
        margin-right: 70px;
        font-weight: 500;
        font-size: 14px;
        font-family: "Inter";

        a {
            text-decoration: none;
            color: black;
            margin: 0px 10px;
        }
    }

    .global-actions {
        display: flex;
        align-items: center;

        font-weight: 600;
        font-size: 14px;
        font-family: "Inter";

        .anlegen {
            background-color: #24B6D8;
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
            margin: 0px 10px;
            cursor: pointer;

            img {
                width: 2em;
            }
        }
    }
}
</style>

{@render children()}
