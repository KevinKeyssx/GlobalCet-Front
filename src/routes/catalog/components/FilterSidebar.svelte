<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { browser }    from '$app/environment';
	import { Tabs }       from 'bits-ui';
	import { X, SlidersHorizontal } from '@lucide/svelte';

	import ProductTab           from './ProductTab.svelte';
	import KitTab               from './KitTab.svelte';
	import MobileLabTab         from './MobileLabTab.svelte';
	import type { ProductType } from '$lib/types/product';

	// ─── Props ────────────────────────────────────────────────────────────────────
	interface Props {
		selectedSubCategories  : Set<string>;
		selectedMaterials      : Set<string>;
		selectedKitCategories? : Set<string>;
		selectedLabCategories? : Set<string>;
		selectedTypes          : Set<ProductType>;
		onSubCategoryToggle    : ( id: string ) => void;
		onMaterialToggle       : ( id: string ) => void;
		onTypeToggle           : ( type: ProductType ) => void;
		onClearAll             : () => void;
		filteredCount          : number;
		totalCount             : number;
		types                  : ProductType[];
		activeTab?             : string;
	}

	let {
		selectedSubCategories = $bindable( new Set<string>() ),
		selectedMaterials     = $bindable( new Set<string>() ),
		selectedKitCategories = $bindable( new Set<string>() ),
		selectedLabCategories = $bindable( new Set<string>() ),
		selectedTypes,
		onSubCategoryToggle,
		onMaterialToggle,
		onTypeToggle,
		onClearAll,
		filteredCount,
		totalCount,
		types,
		activeTab             = $bindable( 'productos' ),
	}: Props = $props();

	// ─── Reactive States ──────────────────────────────────────────────────────────
	let isDrawerOpen = $state( false );

	// ─── Derived: Has active filters? ─────────────────────────────────────────────
	const hasActiveFilters: boolean = $derived.by( (): boolean => {
		if ( activeTab === 'productos' ) {
			return selectedSubCategories.size > 0 || selectedMaterials.size > 0 || selectedTypes.size > 0;
		}
		if ( activeTab === 'kits' ) {
			return selectedKitCategories.size > 0;
		}
		if ( activeTab === 'lab-movil' ) {
			return selectedLabCategories.size > 0;
		}
		return false;
	} );

	// ─── Handlers ─────────────────────────────────────────────────────────────────
	function handleClear(): void {
		if ( activeTab === 'productos' ) {
			onClearAll();
		} else if ( activeTab === 'kits' ) {
			selectedKitCategories = new Set<string>();
		} else if ( activeTab === 'lab-movil' ) {
			selectedLabCategories = new Set<string>();
		}
	}

	// ─── Transition Params ────────────────────────────────────────────────────────
	const fadeParams = {
		duration : 200,
	};

	const flyParams = {
		x        : -320,
		duration : 300,
	};

	// ─── Body Scroll Lock Effect ──────────────────────────────────────────────────
	$effect( () => {
		if ( isDrawerOpen && browser ) {
			const originalOverflow: string = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	} );
</script>

{#snippet filterContent( isMobile: boolean )}
	<!-- Header section -->
	<div class="flex items-center justify-between">
		<h2 class="text-xs font-black uppercase tracking-[0.2em] text-brand drop-shadow-sm">Filtros</h2>

		<div class="flex items-center gap-2">
			{#if hasActiveFilters }
				<button
					id="filter-clear-all"
					onclick={ handleClear }
					class="
						group flex items-center gap-1.5 rounded-full px-0
						text-[11px] font-bold tracking-wider text-text-muted
						transition-all duration-300
						hover:bg-red-500/10 hover:text-red-500
					"
				>
					<svg class="h-3 w-3 transition-transform duration-300 group-hover:rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
						<line x1="18" y1="6" x2="6" y2="18"></line>
						<line x1="6" y1="6" x2="18" y2="18"></line>
					</svg>
					LIMPIAR
				</button>
			{/if}

			{#if isMobile }
				<button
					onclick={ () => isDrawerOpen = false }
					class="
						flex h-7 w-7 items-center justify-center rounded-full border border-brand/10 dark:border-white/5
						bg-brand/5 hover:bg-brand/15 dark:hover:bg-white/10 text-text-muted hover:text-text dark:text-[#6aad82] dark:hover:text-white
						transition-all duration-200 cursor-pointer
					"
					aria-label="Cerrar filtros"
				>
					<X class="size-3.5" />
				</button>
			{/if}
		</div>
	</div>

	<!-- Divider with gradient -->
	<div class="h-px w-full bg-linear-to-r from-transparent via-brand/20 to-transparent"></div>

	<!-- Categories Section -->
	<section class="flex flex-col gap-3">
		<Tabs.Root bind:value={ activeTab } class="w-full flex flex-col gap-4">
			<Tabs.List class="flex w-full items-center gap-1.5 rounded-xl bg-surface/50 border border-brand/5 p-1 backdrop-blur-md">
				<Tabs.Trigger
					value="productos"
					class="
						flex-1 flex items-center justify-center rounded-lg py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300
						data-[state=active]:bg-brand data-[state=active]:text-surface-dark data-[state=active]:shadow-md
						data-[state=inactive]:text-text-muted data-[state=inactive]:hover:bg-brand/5 data-[state=inactive]:hover:text-text
					"
				>
					Productos
				</Tabs.Trigger>
				<Tabs.Trigger
					value="kits"
					class="
						flex-1 flex items-center justify-center rounded-lg py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300
						data-[state=active]:bg-brand data-[state=active]:text-surface-dark data-[state=active]:shadow-md
						data-[state=inactive]:text-text-muted data-[state=inactive]:hover:bg-brand/5 data-[state=inactive]:hover:text-text
					"
				>
					Kits
				</Tabs.Trigger>
				<Tabs.Trigger
					value="lab-movil"
					class="
						flex-1 flex items-center justify-center rounded-lg py-2 text-[10px] font-black uppercase tracking-wider transition-all duration-300
						data-[state=active]:bg-brand data-[state=active]:text-surface-dark data-[state=active]:shadow-md
						data-[state=inactive]:text-text-muted data-[state=inactive]:hover:bg-brand/5 data-[state=inactive]:hover:text-text
					"
				>
					Lab. Móvil
				</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="productos" class="w-full">
				<ProductTab
					bind:selectedSubCategories
					bind:selectedMaterials
					isEnabled={ activeTab === 'productos' }
				/>
			</Tabs.Content>

			<Tabs.Content value="kits" class="w-full">
				<KitTab
					bind:selected={ selectedKitCategories }
					isEnabled={ activeTab === 'kits' }
				/>
			</Tabs.Content>

			<Tabs.Content value="lab-movil" class="w-full">
				<MobileLabTab
					bind:selected={ selectedLabCategories }
					isEnabled={ activeTab === 'lab-movil' }
				/>
			</Tabs.Content>
		</Tabs.Root>
	</section>
{/snippet}

<!-- Desktop Sidebar View (Hidden on mobile) -->
<aside class="
	relative z-10
	hidden md:flex w-80 shrink-0 flex-col gap-3
	rounded-2xl
	border border-brand/20 dark:border-brand/20
	bg-sidebar/90 backdrop-blur-xl
	px-5 py-6
	shadow-sidebar ring-1 ring-brand/5 dark:ring-white/5
	transition-all duration-500
">
	{@render filterContent( false )}
</aside>

<!-- Floating Filter Button (Mobile only) -->
<button
	onclick={ () => isDrawerOpen = true }
	class="
		fixed bottom-6 right-6 z-40 md:hidden
		flex h-12 w-12 items-center justify-center rounded-full
		bg-brand text-surface-dark border border-brand/35
		shadow-[0_4px_20px_rgba(0,230,118,0.3)]
		hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer
	"
	aria-label="Abrir filtros"
>
	<SlidersHorizontal class="size-5" />
</button>

<!-- Mobile Drawer Modal Overlay -->
{#if isDrawerOpen }
	<div
		transition:fade={ fadeParams }
		onclick={ () => isDrawerOpen = false }
		onkeydown={ ( e ) => { if ( e.key === ' ' || e.key === 'Enter' ) { isDrawerOpen = false; } } }
		class="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm cursor-default"
		role="button"
		tabindex="-1"
	>
		<!-- Slide-over Drawer Panel -->
		<div
			transition:fly={ flyParams }
			onclick={ ( event ) => event.stopPropagation() }
			onkeydown={ ( event ) => event.stopPropagation() }
			class="
				relative h-full w-80 flex flex-col gap-3 overflow-y-auto
				border-r border-brand/20 dark:border-brand/10
				bg-sidebar/95 dark:bg-surface-dark/95 backdrop-blur-2xl px-5 py-6
				shadow-sidebar pointer-events-auto cursor-default
			"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			{@render filterContent( true )}
		</div>
	</div>
{/if}
