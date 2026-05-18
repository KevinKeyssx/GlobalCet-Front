<script lang="ts">
	import type { ProductCategory, ProductType } from '$lib/types/product';

	// ─── Props ────────────────────────────────────────────────────────────────────
	interface Props {
		categories         : ProductCategory[];
		types              : ProductType[];
		selectedCategories : Set<ProductCategory>;
		selectedTypes      : Set<ProductType>;
		onCategoryToggle   : ( cat: ProductCategory ) => void;
		onTypeToggle       : ( type: ProductType ) => void;
		onClearAll         : () => void;
		filteredCount      : number;
		totalCount         : number;
	}

	const {
		categories,
		types,
		selectedCategories,
		selectedTypes,
		onCategoryToggle,
		onTypeToggle,
		onClearAll,
		filteredCount,
		totalCount,
	}: Props = $props();

	// ─── Derived: has active filters? ─────────────────────────────────────────────
	const hasActiveFilters = $derived(
		selectedCategories.size > 0 || selectedTypes.size > 0
	);

	// ─── Category icon map ─────────────────────────────────────────────────────────
	const categoryIcons: Record<string, string> = {
		'Material de Vidrio'  : '🧪',
		'Kits de Laboratorio' : '🧰',
		'Sistemas Completos'  : '🔬',
		'Reactivos'           : '⚗️',
		'Equipos de Medición' : '📏',
	};

	const typeIcons: Record<string, string> = {
		'Producto'          : '📦',
		'Kit'               : '🗃️',
		'Laboratorio Móvil' : '🚛',
	};
</script>

<!-- ─── Sidebar Premium ──────────────────────────────────────────────────────────── -->
<aside class="
	flex w-72 shrink-0 flex-col gap-6
	rounded-2xl
	border border-brand/20 dark:border-brand/15
	bg-sidebar/90 backdrop-blur-xl
	p-6
	shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-white/50
	transition-all duration-500
">

	<!-- Header section -->
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-xs font-black uppercase tracking-[0.2em] text-brand drop-shadow-sm">Filtros</h2>
			<div class="mt-1.5 flex items-center gap-2">
				<span class="flex h-5 items-center justify-center rounded-full bg-brand/10 px-2 text-[10px] font-bold text-brand ring-1 ring-brand/20">
					{filteredCount} / {totalCount}
				</span>
				<span class="text-[11px] font-medium tracking-wide text-text-muted">PRODUCTOS</span>
			</div>
		</div>

		{#if hasActiveFilters}
			<button
				id="filter-clear-all"
				onclick={onClearAll}
				class="
					group flex items-center gap-1.5 rounded-full px-3 py-1.5
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

	<!-- Categories -->
	<section class="flex flex-col gap-3">
		<h3 class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted/80">
			<div class="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_var(--color-brand)]"></div>
			Categoría
		</h3>
		<ul class="flex flex-col gap-1">
			{#each categories as category}
				{@const isActive = selectedCategories.has( category )}
				<li>
					<button
						id="filter-cat-{category.toLowerCase().replace( /\s+/g, '-' )}"
						onclick={() => onCategoryToggle( category )}
						class="
							group relative flex w-full items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5
							text-sm font-medium text-left
							transition-all duration-300 ease-out
							{isActive
								? 'bg-linear-to-r from-brand/15 to-transparent text-brand'
								: 'bg-transparent text-text-muted hover:bg-brand/5 hover:text-text hover:translate-x-1'
							}
						"
					>
						<!-- Active indicator line -->
						<div class="
							absolute left-0 top-0 h-full w-1 rounded-r-full bg-brand
							transition-all duration-300
							{isActive ? 'opacity-100' : 'opacity-0 -translate-x-full'}
						"></div>

						<span class="relative z-10 flex h-7 w-7 items-center justify-center rounded-lg bg-surface shadow-sm ring-1 ring-brand/10 transition-transform duration-300 group-hover:scale-110 group-hover:ring-brand/30">
							{categoryIcons[category] ?? '🔹'}
						</span>

                        <span class="relative z-10 flex-1 leading-tight tracking-tight">{category}</span>

						<!-- Checkbox icon -->
						<div class="
							relative z-10 flex h-4 w-4 items-center justify-center rounded
							border transition-all duration-300
							{isActive 
								? 'border-brand bg-brand text-surface-dark shadow-[0_0_10px_var(--color-brand-muted)]' 
								: 'border-brand/30 bg-surface text-transparent group-hover:border-brand/50'
							}
						">
							<svg class="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
						</div>
					</button>
				</li>
			{/each}
		</ul>
	</section>

	<!-- Types -->
	<section class="flex flex-col gap-3 mt-2">
		<h3 class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-text-muted/80">
			<div class="h-1.5 w-1.5 rounded-full bg-brand-muted shadow-[0_0_8px_var(--color-brand-muted)]"></div>
			Tipo de Ítem
		</h3>
		<div class="flex flex-wrap gap-2">
			{#each types as type}
				{@const isActive = selectedTypes.has( type )}
				<button
					id="filter-type-{type.toLowerCase().replace( /\s+/g, '-' )}"
					onclick={() => onTypeToggle( type )}
					class="
						group relative flex items-center gap-2 rounded-full px-3.5 py-1.5
						text-[13px] font-semibold tracking-wide
						transition-all duration-300
						{isActive
							? 'bg-brand text-surface-dark shadow-[0_4px_12px_var(--color-brand-muted)] ring-2 ring-brand ring-offset-2 ring-offset-sidebar scale-105'
							: 'bg-surface text-text-muted ring-1 ring-brand/20 hover:bg-brand/10 hover:text-brand hover:ring-brand/40'
						}
					"
				>
					<span class="opacity-80">{typeIcons[type] ?? '📋'}</span>
					{type}
				</button>
			{/each}
		</div>
	</section>

</aside>
