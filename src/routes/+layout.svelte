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
            <span>Anlagen+</span>
            <span>Import/Export</span>
            <span>
                <img src={settingsicon} alt="">
            </span>
        </div>
    </div>
</header>

<style lang="scss">
header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-family: "Roboto", sans-serif;
    background: green;

    padding: 20px 40px;
}

.left-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    
    a {
        margin-right: 20px;

        img {
            width: 3em;
        }
    }
}

.right-nav {
    display: flex;
    justify-content: center;
    align-items: center;

    .page-navigation {
        margin-right: 70px;

        a {
            text-decoration: none;
            color: black;
            margin: 0px 10px;
        }
    }

    .global-actions {
        span {
            margin: 0px 10px;
        }
    }
}
</style>

{@render children()}
