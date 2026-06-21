<script lang="ts">
	import './layout.css';
	import { dev, browser } from '$app/environment';
	import { page }         from '$app/state';
	import { goto }         from '$app/navigation';

	import { SvelteQueryDevtools }  from '@tanstack/svelte-query-devtools';
	import { QueryClientProvider }  from '@tanstack/svelte-query';
	import { Toaster }              from 'svelte-french-toast';
	import { ArrowUp }              from '@lucide/svelte';

    import Header           from '$lib/components/home/Header.svelte';
    import Footer           from '$lib/components/home/Footer.svelte';
	import { searchStore }  from '$lib/state/search';

	// ─── Dark Mode State ──────────────────────────────────────────────────────────
	const initialDark = browser ? ( localStorage.getItem( 'theme' ) === 'dark' || ( !localStorage.getItem( 'theme' ) && window.matchMedia( '(prefers-color-scheme: dark)' ).matches ) ) : false;

	// ─── Props ────────────────────────────────────────────────────────────────────
	let { data, children } = $props();
    let darkMode = $state( initialDark );
	let showScrollButton = $state( false );

	// ─── Effect: sync dark class and localStorage ─────────────────────────────────
	$effect( () => {
		if ( darkMode ) {
			document.documentElement.classList.add( 'dark' );
			localStorage.setItem( 'theme', 'dark' );
		} else {
			document.documentElement.classList.remove( 'dark' );
			localStorage.setItem( 'theme', 'light' );
		}
	});


	function handleSearch( value: string ): void {
		$searchStore = value;

		if ( value && page.url.pathname !== '/catalog' ) {
			goto( `/catalog?query=${ encodeURIComponent( value ) }` );
		}
	}

	function handleScroll() : void {
		if ( typeof window !== 'undefined' ) {
			showScrollButton = window.scrollY > 300;
		}
	}

	function scrollToTop() : void {
		if ( typeof window !== 'undefined' ) {
			window.scrollTo( {
				top      : 0,
				behavior : 'smooth',
			} );
		}
	}
</script>

<svelte:head>
	<link rel="icon" href="/favicon.avif" type="image/avif" />
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

<svelte:window onscroll={ handleScroll } />

<QueryClientProvider client={ data.queryClient }>
    <div class="fixed pointer-events-none top-48 left-10 h-[500px] w-[500px] animate-pulse rounded-full bg-brand/15 blur-[100px] duration-10000"></div>
	<div class="fixed pointer-events-none top-10 right-0 h-[400px] w-[400px] animate-pulse rounded-full bg-brand/10 blur-[80px] duration-7000" style="animation-delay: 2s;"></div>
	<div class="fixed pointer-events-none bottom-40 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-linear-to-r from-brand/0 via-brand/10 to-brand/0 blur-3xl"></div>

	<!-- ─── App Shell ─────────────────────────────────────────────────────────────── -->
	<main class="min-h-screen bg-surface text-text transition-colors duration-300 font-sans">
		<Header
			search={ $searchStore }
			{ darkMode }
			onSearch={ handleSearch }
			onToggle={ () => { darkMode = !darkMode; } }
		/>

		{@render children()}

		<Footer />
	</main>

	<Toaster
		toastOptions={ {
			style : 'background: var( --color-card ); color: var( --color-text ); border: 1px solid color-mix( in srgb, var( --color-brand ) 20%, transparent ); font-family: var( --font-sans ); font-size: 0.875rem; border-radius: 1rem; box-shadow: var( --shadow-card-hover );'
		} }
        position= "bottom-right"
	/>

	{#if dev }
		<SvelteQueryDevtools initialIsOpen={ false } />
	{/if}

	{#if ( showScrollButton )}
		<button
			onclick = { scrollToTop }
			class   = "fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-brand-bright/20 bg-brand text-white shadow-lg transition-all duration-300 scale-100 hover:scale-110 active:scale-95 hover:bg-brand-bright hover:shadow-[ 0_0_20px_var(--color-brand) ] cursor-pointer animate-fade-in"
			title   = "Subir al inicio"
		>
			<ArrowUp class="h-5 w-5" />
		</button>
	{/if}
</QueryClientProvider>

<style>
	@keyframes fadeInScale {
		from {
			opacity   : 0;
			transform : scale( 0.8 );
		}
		to {
			opacity   : 1;
			transform : scale( 1 );
		}
	}

	.animate-fade-in {
		animation : fadeInScale 0.2s cubic-bezier( 0.16, 1, 0.3, 1 ) forwards;
	}
</style>
