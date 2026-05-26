<script lang="ts">
	import type { Product } from '$lib/types/product';
	import type { GlobalSearchProduct } from '$lib/types/search';

	// ─── Props ────────────────────────────────────────────────────────────────────
	interface Props {
		product : GlobalSearchProduct | Product;
	}

	const { product }: Props = $props();

	// ─── Derived Properties (compatible with both Mock and Live schemas) ─────────
	const categoryName = $derived(
		'category' in product
			? product.category
			: ( product.subcategory?.category?.name || 'Producto' )
	);

	const imageUrl = $derived(
		'image' in product ? product.image : product.files[ 0 ].url
	);

	const specs = $derived(
		'specs' in product
			? product.specs
			: {
					SKU          : product.sku,
					Material     : product.material?.name || 'N/A',
					Subcategoría : product.subcategory?.name || 'N/A',
				}
	);

	const specEntries = $derived(
		Object.entries( specs ).filter( ( [ , v ] ) => v !== undefined )
	);

	const typeName = $derived(
		'type' in product ? product.type : 'Producto'
	);
</script>

<!-- ─── Card ──────────────────────────────────────────────────────────────────── -->
<article
	id="product-card-{ product.id }"
	class="
		group relative flex flex-col overflow-hidden rounded-2xl
		border border-brand/10
		bg-card
		shadow-sm shadow-brand/5
		transition-all duration-300
		hover:border-brand/35 hover:shadow-xl hover:shadow-brand/10
		hover:-translate-y-1
	"
>
	<!-- Image wrapper -->
	<div class="relative h-48 overflow-hidden bg-surface">
		<img
			src={ imageUrl }
			alt={ product.name }
			loading="lazy"
			class="
				h-full w-full object-cover
				transition-transform duration-500
				group-hover:scale-105
			"
		/>

		<!-- Gradient overlay (visible on hover) -->
		<div class="
			absolute inset-0
			bg-linear-to-t from-brand-dark/85 via-transparent to-transparent
			opacity-0 transition-opacity duration-300
			group-hover:opacity-100
		"></div>

		<!-- Specs overlay (appears on hover) -->
		<div class="
			absolute inset-0 flex flex-col justify-end p-4
			opacity-0 translate-y-3
			transition-all duration-300
			group-hover:opacity-100 group-hover:translate-y-0
		">
			<ul class="flex flex-col gap-1">
				{#each specEntries as [ key, value ]}
					<li class="flex items-center gap-2 text-xs">
						<span class="font-semibold capitalize text-brand/80">{ key }:</span>
						<span class="text-white/90">{ value }</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Type pill -->
		<span class="
			absolute right-3 top-3
			rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5
			text-xs font-medium text-white/80 backdrop-blur-sm
		">
			{ typeName }
		</span>
	</div>

	<!-- Card body -->
	<div class="flex flex-1 flex-col gap-4 p-5">
		<!-- Category label -->
		<span class="text-xs font-medium uppercase tracking-widest text-brand/70">
			{ categoryName }
		</span>

		<!-- Product name & description -->
		<div class="flex-1 space-y-1">
			<h3 class="
				text-base font-semibold leading-snug text-text
				transition-colors duration-200
				group-hover:text-brand
			">
				{ product.name }
			</h3>
			{#if 'description' in product}
				<p class="line-clamp-2 text-[11px] leading-relaxed text-text-muted">
					{ product.description }
				</p>
			{/if}
		</div>

		<!-- Footer actions -->
		<div class="flex items-center justify-between border-t border-brand/10 pt-3">
			<button
				id="card-detail-{ product.id }"
				class="
					rounded-lg px-3 py-1.5 text-xs font-medium
					border border-brand/25 text-brand
					transition-all duration-200
					hover:bg-brand hover:text-surface-dark hover:border-brand
				"
			>
				Ver detalle
			</button>

			<button
				id="card-quote-{ product.id }"
				aria-label="Agregar a cotización"
				class="
					flex h-8 w-8 items-center justify-center rounded-lg
					bg-brand/10 text-brand
					transition-all duration-200
					hover:bg-brand hover:text-surface-dark hover:scale-110
				"
			>
				<svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
					<line x1="3" y1="6" x2="21" y2="6"/>
					<path d="M16 10a4 4 0 0 1-8 0"/>
				</svg>
			</button>
		</div>
	</div>
</article>
