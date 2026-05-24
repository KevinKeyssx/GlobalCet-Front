<script lang="ts">
	import { Tabs } from 'bits-ui';

	import ProductTab                       from './ProductTab.svelte';
	import KitTab                           from './KitTab.svelte';
	import MobileLabTab                     from './MobileLabTab.svelte';
	import type { ProductType }             from '$lib/types/product';

	// ─── Props ────────────────────────────────────────────────────────────────────
	interface Props {
		selectedSubCategories : Set<string>;
		selectedMaterials     : Set<string>;
		selectedTypes         : Set<ProductType>;
		onSubCategoryToggle   : ( id: string ) => void;
		onMaterialToggle      : ( id: string ) => void;
		onTypeToggle          : ( type: ProductType ) => void;
		onClearAll            : () => void;
		filteredCount         : number;
		totalCount            : number;
		types                 : ProductType[];
	}

	let {
		selectedSubCategories = $bindable( new Set<string>() ),
		selectedMaterials     = $bindable( new Set<string>() ),
		selectedTypes,
		onSubCategoryToggle,
		onMaterialToggle,
		onTypeToggle,
		onClearAll,
		filteredCount,
		totalCount,
		types,
	}: Props = $props();

	// ─── Filter State (Tabs) ──────────────────────────────────────────────────────
	let activeTab = $state( 'productos' );

	// ─── Derived: Has active filters? ─────────────────────────────────────────────
	const hasActiveFilters = $derived(
		selectedSubCategories.size > 0 || selectedMaterials.size > 0 || selectedTypes.size > 0
	);
</script>

<!-- ─── Sidebar Premium ──────────────────────────────────────────────────────────── -->
<aside class="
	flex w-72 shrink-0 flex-col gap-3
	rounded-2xl
	border border-brand/20 dark:border-brand/15
	bg-sidebar/90 backdrop-blur-xl
	p-6
	shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-white/50
	transition-all duration-500
">
	<!-- Header section -->
	<div class="flex items-center justify-between">
		<h2 class="text-xs font-black uppercase tracking-[0.2em] text-brand drop-shadow-sm">Filtros</h2>

		{#if hasActiveFilters}
			<button
				id="filter-clear-all"
				onclick={onClearAll}
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
	</div>

	<!-- Divider with gradient -->
	<div class="h-px w-full bg-linear-to-r from-transparent via-brand/20 to-transparent"></div>

	<!-- Categories Section -->
	<section class="flex flex-col gap-3">
		<Tabs.Root bind:value={activeTab} class="w-full flex flex-col gap-4">
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
					isEnabled={activeTab === 'productos'}
				/>
			</Tabs.Content>

			<Tabs.Content value="kits" class="w-full">
				<KitTab />
			</Tabs.Content>

			<Tabs.Content value="lab-movil" class="w-full">
				<MobileLabTab />
			</Tabs.Content>
		</Tabs.Root>
	</section>

	<div class="mt-auto pt-4">
		<button
			id="filter-search-btn"
			class="
				w-full flex items-center justify-center gap-2 rounded-xl py-3
				bg-brand text-surface-dark font-black tracking-wider text-xs uppercase
				shadow-[0_4px_20px_rgba(0,230,118,0.25)] hover:shadow-[0_4px_25px_rgba(0,230,118,0.4)]
				border border-brand-bright/20 hover:border-brand-bright/40
				transition-all duration-300 transform active:scale-[0.98]
			"
		>
			<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
				<circle cx="11" cy="11" r="8"></circle>
				<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
			</svg>
			Buscar
		</button>
	</div>
</aside>
