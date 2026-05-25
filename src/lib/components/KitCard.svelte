<script lang="ts">
	import type { GlobalSearchKit } from '$lib/types/search';
	import { getImageUrl } from '$lib/utils/image';

	interface Props {
		kit : GlobalSearchKit;
	}

	const { kit }: Props = $props();

	// Find the main file or use the first available file
	const mainFile = $derived(
		kit.files.find( ( f ) => f.isMain ) || kit.files[ 0 ]
	);
	const imageUrl = $derived(
		getImageUrl( mainFile?.url, kit.id, 'kits', kit.name )
	);
</script>

<article
	id="kit-card-{ kit.id }"
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
			alt={ kit.name }
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

		<!-- Products listing overlay (appears on hover) -->
		<div class="
			absolute inset-0 flex flex-col justify-end p-4
			opacity-0 translate-y-3
			transition-all duration-300
			group-hover:opacity-100 group-hover:translate-y-0
		">
			{#if kit.products.length > 0}
				<div class="space-y-1">
					<span class="text-[10px] font-bold uppercase tracking-wider text-brand/80">Componentes ({ kit.products.length }):</span>
					<ul class="flex flex-col gap-0.5 max-h-24 overflow-y-auto custom-scrollbar">
						{#each kit.products as kp}
							<li class="flex items-center gap-1.5 text-[11px] text-white/95">
								<span class="inline-flex h-3.5 w-3.5 items-center justify-center rounded-sm bg-brand/20 text-[9px] font-bold text-brand">{ kp.quantity }x</span>
								<span class="truncate font-medium">{ kp.product.name }</span>
							</li>
						{/each}
					</ul>
				</div>
			{:else}
				<span class="text-xs text-white/70 italic">Sin productos asociados</span>
			{/if}
		</div>

		<!-- Kit badge -->
		<span class="
			absolute left-3 top-3
			rounded-full border border-emerald-400/30 bg-emerald-400/20 px-2.5 py-0.5
			text-xs font-semibold text-emerald-300 backdrop-blur-sm
		">
			Kit Científico
		</span>

		<!-- SKU pill -->
		<span class="
			absolute right-3 top-3
			rounded-full border border-white/20 bg-black/30 px-2.5 py-0.5
			text-xs font-medium text-white/80 backdrop-blur-sm
		">
			{ kit.sku }
		</span>
	</div>

	<!-- Card body -->
	<div class="flex flex-1 flex-col gap-4 p-5">
		<!-- Category name -->
		<span class="text-xs font-medium uppercase tracking-widest text-brand/70">
			{ kit.category.name }
		</span>

		<!-- Kit name and description -->
		<div class="flex-1 space-y-1">
			<h3 class="
				text-base font-semibold leading-snug text-text
				transition-colors duration-200
				group-hover:text-brand
			">
				{ kit.name }
			</h3>
			<p class="line-clamp-2 text-[11px] leading-relaxed text-text-muted">
				{ kit.description }
			</p>
		</div>

		<!-- Footer actions -->
		<div class="flex items-center justify-between border-t border-brand/10 pt-3">
			<button
				id="kit-detail-{ kit.id }"
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
				id="kit-quote-{ kit.id }"
				aria-label="Agregar kit a cotización"
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

<style>
	/* Premium Scrollbar */
	.custom-scrollbar::-webkit-scrollbar {
		width: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-track {
		background: transparent;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background: var(--color-brand-muted, rgba(0, 230, 118, 0.2));
		border-radius: 4px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb:hover {
		background: var(--color-brand, #00e676);
	}
</style>
