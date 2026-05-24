<script lang="ts">
	import './layout.css';
	import { dev, browser } from '$app/environment';

	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { QueryClientProvider } from '@tanstack/svelte-query';

    import Header   from '$lib/components/Header.svelte';
	import favicon  from '$lib/assets/favicon.svg';

	// ─── Dark Mode State ──────────────────────────────────────────────────────────
	const initialDark = browser ? ( localStorage.getItem( 'theme' ) === 'dark' || ( !localStorage.getItem( 'theme' ) && window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) ) : false;

	// ─── Props ────────────────────────────────────────────────────────────────────
	let { data, children } = $props();
    let darkMode = $state( initialDark );
	let search   = $state( '' );

	// ─── Effect: sync dark class and localStorage ─────────────────────────────────
	$effect( () => {
		if ( darkMode ) {
			document.documentElement.classList.add( 'dark' );
			localStorage.setItem( 'theme', 'dark' );
		} else {
			document.documentElement.classList.remove( 'dark' );
			localStorage.setItem( 'theme', 'light' );
		}
	} );

	function handleSearch( value: string ) {
		search = value;
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
	<script>
		( function() {
			const theme = localStorage.getItem( 'theme' ) || ( window.matchMedia( '(prefers-color-scheme: dark)' ).matches ? 'dark' : 'light' );
			if ( theme === 'dark' ) {
				document.documentElement.classList.add( 'dark' );
			} else {
				document.documentElement.classList.remove( 'dark' );
			}
		} )();
	</script>
</svelte:head>

<QueryClientProvider client={ data.queryClient }>
	<!-- ─── App Shell ─────────────────────────────────────────────────────────────── -->
	<div class="min-h-screen bg-surface text-text transition-colors duration-300 font-sans">
		<Header
			{ search }
			{ darkMode }
			onSearch={ handleSearch }
			onToggle={ () => { darkMode = !darkMode; } }
		/>

		{@render children()}
	</div>

	{#if dev }
		<SvelteQueryDevtools initialIsOpen={ false } />
	{/if}
</QueryClientProvider>
