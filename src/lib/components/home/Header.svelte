<script lang="ts">
	// ─── Props ────────────────────────────────────────────────────────────────────
	interface Props {
		search   : string;
		darkMode : boolean;
		onSearch : ( value: string ) => void;
		onToggle : () => void;
	}

	const { search, darkMode, onSearch, onToggle }: Props = $props();

	let localSearch = $state( '' );

	// Keep localSearch in sync if search prop changes from parent (e.g. clearAll)
	$effect( () => {
		localSearch = search;
	} );

	let timeoutId: any;

	function handleInput( value: string ): void {
		localSearch = value;
		clearTimeout( timeoutId );
		timeoutId = setTimeout( () => {
			onSearch( value );
		}, 300 );
	}
</script>

<!-- ─── Header Shell ─────────────────────────────────────────────────────────── -->
<header class="
	sticky top-0 z-50 w-full
	border-b border-brand/20
	bg-surface/80 backdrop-blur-lg
	transition-colors duration-300
">
	<div class="mx-auto flex max-w-7xl items-center gap-6 px-6 py-4">

		<!-- Logo -->
		<a href="/" id="header-logo" class="flex shrink-0 items-center gap-3 group">
			<!-- <div class="
				flex h-9 w-9 items-center justify-center rounded-lg
				bg-brand/20 ring-1 ring-brand/40
				transition-all duration-300 group-hover:bg-brand/35
			">
				<svg viewBox="0 0 24 24" class="h-5 w-5 fill-brand" xmlns="http://www.w3.org/2000/svg">
					<path d="M7 2v2H5a2 2 0 0 0-2 2v1h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm-4 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9H3zm9 2a5 5 0 1 1 0 10A5 5 0 0 1 12 11zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"/>
				</svg>
			</div> -->
            <div class="flex items-center justify-center rounded-xl border border-brand/10 bg-white p-0.5 size-10 transition-all duration-300 hover:border-brand/30 hover:scale-105">
							<img src="/logo/logo.avif" alt="GlobalCET" class="h-full w-full object-contain" />
						</div> 
			<!-- <div class="leading-tight">
				<span class="block text-sm font-bold tracking-widest text-brand uppercase">Global</span>
				<span class="block text-xs font-semibold tracking-wider text-text-muted uppercase">CET</span>
			</div> -->
		</a>

		<!-- Search Bar -->
		<div class="relative flex-1 max-w-xl">
			<svg class="
				absolute left-3.5 top-1/2 -translate-y-1/2
				h-4 w-4 text-text-muted
				transition-colors duration-200
				peer-focus:text-brand
			" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<circle cx="11" cy="11" r="8"/>
				<path d="m21 21-4.35-4.35"/>
			</svg>

            <!-- Global Search -->
            <input
				id          = "header-search"
				type        = "search"
				placeholder = "Buscar productos, reactivos, equipos..."
				value       = { localSearch }
				oninput     = { ( e ) => handleInput(( e.target as HTMLInputElement ).value )}
				class       = "
					peer w-full rounded-xl
					border border-brand/25 bg-input
					py-2.5 pl-10 pr-4 text-sm text-text
					placeholder:text-text-muted
					outline-none ring-0
					transition-all duration-300
					focus:border-brand focus:ring-2 focus:ring-brand/25
				"
			/>
		</div>

		<!-- Nav links -->
		<nav class="hidden items-center gap-1 md:flex">
			<a
				href="/filters"
				id="nav-catalogo"
				class="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
			>Catálogo</a>
			<a
				href="/nosotros"
				id="nav-nosotros"
				class="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
			>Nosotros</a>
			<a
				href="/contacto"
				id="nav-contacto"
				class="rounded-lg px-3 py-2 text-sm font-medium text-text-muted transition-colors duration-200 hover:bg-brand/10 hover:text-brand"
			>Contacto</a>
		</nav>

		<!-- Dark Mode Toggle -->
		<button
			id="dark-mode-toggle"
			onclick={onToggle}
			aria-label="Alternar modo oscuro"
			class="
				flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
				border border-brand/20 bg-brand/10
				text-brand
				transition-all duration-300
				hover:bg-brand/25 hover:scale-105
			"
		>
			{#if darkMode}
				<!-- Sun icon -->
				<svg viewBox="0 0 24 24" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2">
					<circle cx="12" cy="12" r="5"/>
					<line x1="12" y1="1" x2="12" y2="3"/>
					<line x1="12" y1="21" x2="12" y2="23"/>
					<line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
					<line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
					<line x1="1" y1="12" x2="3" y2="12"/>
					<line x1="21" y1="12" x2="23" y2="12"/>
					<line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
					<line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
				</svg>
			{:else}
				<!-- Moon icon -->
				<svg viewBox="0 0 24 24" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
				</svg>
			{/if}
		</button>

	</div>
</header>
