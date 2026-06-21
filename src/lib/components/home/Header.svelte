<script lang="ts">
	import { fade }         from 'svelte/transition';
    import { navigating }   from '$app/state';

    import { Search, FileText }   from '@lucide/svelte';

	import { globalLoadingStore } from '$lib/state/loading';
	import { quoteStore }         from '$lib/state/quote';
	import NavigationMenu         from '$lib/components/home/NavigationMenu.svelte';
	import ThemeToggle            from '$lib/components/shared/ThemeToggle.svelte';
	import MenuBar                from './MenuBar.svelte';


    const isLoading = $derived( !!navigating || $globalLoadingStore );

	interface Props {
		search   : string;
		darkMode : boolean;
		onSearch : ( value : string ) => void;
		onToggle : ( ) => void;
	}


    const {
        search,
        darkMode,
        onSearch,
        onToggle
    }: Props = $props();


    let localSearch = $state( '' );


    let timeoutId: number;

	// Keep localSearch in sync if search prop changes from parent (e.g. clearAll)
	$effect(() => {
		localSearch = search;
	});


	function handleInput( value : string ): void {
		localSearch = value;

        clearTimeout( timeoutId );

        timeoutId = setTimeout( ( ) => {
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
	<!-- Infinite Marquee glowing loading bar -->
	{#if ( isLoading ) }
		<div class="loading-bar" transition:fade={{ duration : 250 }}></div>
	{/if}

    <div class="mx-auto flex max-w-7xl items-center gap-4 sm:gap-6 px-6 py-4">
		<!-- Logo -->
		<a href="/" id="header-logo" class="relative shrink-0 w-10 sm:w-14 md:w-18 lg:w-20 xl:w-24 h-12 group">
			<div class="absolute -top-2 sm:-top-4.5 md:-top-3 -left-5 sm:-left-4 z-50 flex size-16 sm:size-20 md:size-24 lg:size-28 xl:size-32 items-center justify-center transition-all duration-300 hover:scale-105">
				<!-- Blur glow underneath the logo image for modern depth -->
				<div class="absolute inset-4 rounded-full bg-brand/20 blur-md opacity-60"></div>

				<!-- Transparent Logo image protruding past the header edge -->
				<img src="/logo/logo.avif" alt="GlobalCET" class="relative z-10 h-full w-full object-contain" />
			</div>
		</a>

		<!-- Search Bar -->
		<div class="
			relative flex-1 max-w-xl
			transition-all duration-500 ease-out
			focus-within:max-w-2xl focus-within:scale-[1.015]
		">
            <Search class="absolute left-3.5 top-1/2 -translate-y-1/2
				size-4 text-text-muted
				transition-all duration-500 ease-out
				peer-focus:text-brand peer-focus:scale-110 peer-focus:rotate-6" />

            <!-- Global Search -->
            <input
				id          = "header-search"
				type        = "search"
				placeholder = "Buscar productos, reactivos, equipos..."
				value       = { localSearch }
				oninput     = { ( e ) => handleInput( ( e.target as HTMLInputElement ).value ) }
				class       = "
					peer w-full rounded-xl
					border border-brand/25 bg-input
					py-2.5 pl-10 pr-4 text-sm text-text
					placeholder:text-text-muted
					outline-none ring-0
					transition-all duration-500 ease-out
					focus:border-brand focus:bg-card focus:ring-4 focus:ring-brand/15
					focus:shadow-[0_0_30px_rgba( 5,150,105,0.15 )]
				"
			/>
		</div>

        <MenuBar { darkMode } { onToggle } />

		<!-- Nav links -->
		<nav class="hidden items-center gap-1.5 md:flex">
			<NavigationMenu />
		</nav>

        <div class="flex items-center gap-3">
            <!-- Dark Mode Toggle -->
            <ThemeToggle { darkMode } { onToggle } className="hidden md:flex" />

            <!-- Quote Cart Icon Button -->
            <a
                href  = "/quote"
                id    = "header-quote-cart"
                class = "
                    relative flex h-9.5 w-9.5 items-center justify-center rounded-lg
                    border border-brand/20 bg-brand/10 text-brand
                    transition-all duration-300
                    hover:bg-brand hover:text-surface-dark hover:scale-105 active:scale-95
                    cursor-pointer shrink-0
                "
                title = "Ver mi cotización"
            >
                <FileText class="size-5" />

                {#if ( $quoteStore.length > 0 )}
                    <span class="
                        absolute -top-1.5 -right-1.5
                        flex h-5 w-5 items-center justify-center rounded-full
                        bg-emerald-500 text-[10px] font-black text-white shadow-[0_0_8px_rgba(16,185,129,0.5)]
                    ">
                        { $quoteStore.length }
                    </span>
                {/if}
            </a>
        </div>
	</div>
</header>

<style>
	.loading-bar {
		position         : absolute;
		bottom           : -1px;
		left             : 0;
		right            : 0;
		height           : 2px;
		background       : linear-gradient( to right, var( --color-brand ), var( --color-brand-bright ), #00e676, var( --color-brand ));
		background-size  : 200% 100%;
		animation        : loading-marquee 1.5s linear infinite;
		box-shadow       : 0 1px 8px color-mix( in srgb, var( --color-brand ) 50%, transparent );
		z-index          : 50;
	}

	@keyframes loading-marquee {
		0% {
			background-position : 200% 0;
		}
		100% {
			background-position : -200% 0;
		}
	}
</style>
