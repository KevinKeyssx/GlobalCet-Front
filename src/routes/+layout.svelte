<script lang="ts">
	import './layout.css';
	import Header from '$lib/components/Header.svelte';
	import favicon from '$lib/assets/favicon.svg';

	// ─── Props ────────────────────────────────────────────────────────────────────
	let { children } = $props();

	// ─── Dark Mode State ──────────────────────────────────────────────────────────
	let darkMode = $state( false );
	let search   = $state( '' );

	// ─── Effect: sync dark class to <html> ────────────────────────────────────────
	$effect( () => {
		if ( darkMode ) {
			document.documentElement.classList.add( 'dark' );
		} else {
			document.documentElement.classList.remove( 'dark' );
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
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
</svelte:head>

<!-- ─── App Shell ─────────────────────────────────────────────────────────────── -->
<div class="min-h-screen bg-surface text-text transition-colors duration-300 font-sans">
	<Header
		{search}
		{darkMode}
		onSearch={handleSearch}
		onToggle={() => { darkMode = !darkMode; }}
	/>

	{@render children()}
</div>
