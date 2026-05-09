<script lang="ts">
	import type { ProductCategory, ProductType } from '$lib/types/product';
	import { products as allProducts, allCategories, allTypes } from '$lib/data/products';
	import FilterSidebar from '$lib/components/FilterSidebar.svelte';
	import ProductGrid from '$lib/components/ProductGrid.svelte';

	// ─── Filter State (Svelte 5 Runes) ────────────────────────────────────────────
	let search             = $state( '' );
	let selectedCategories = $state( new Set<ProductCategory>() );
	let selectedTypes      = $state( new Set<ProductType>() );
	let loading            = $state( false );

	// ─── Derived: Filtered products ───────────────────────────────────────────────
	const filteredProducts = $derived( () => {
		const q    = search.trim().toLowerCase();
		const cats = selectedCategories;
		const typs = selectedTypes;

		return allProducts.filter( ( p ) => {
			const matchSearch   = !q || p.name.toLowerCase().includes( q ) || p.category.toLowerCase().includes( q );
			const matchCategory = cats.size === 0 || cats.has( p.category );
			const matchType     = typs.size === 0 || typs.has( p.type );

			return matchSearch && matchCategory && matchType;
		} );
	} );

	// ─── Handlers ─────────────────────────────────────────────────────────────────
	function handleSearch( value: string ) {
		search = value;
	}

	function toggleCategory( cat: ProductCategory ) {
		const next = new Set( selectedCategories );
		if ( next.has( cat ) ) {
			next.delete( cat );
		} else {
			next.add( cat );
		}
		selectedCategories = next;
	}

	function toggleType( type: ProductType ) {
		const next = new Set( selectedTypes );
		if ( next.has( type ) ) {
			next.delete( type );
		} else {
			next.add( type );
		}
		selectedTypes = next;
	}

	function clearAll() {
		selectedCategories = new Set();
		selectedTypes      = new Set();
		search             = '';
	}
</script>

<svelte:head>
	<title>Catálogo de Productos | GlobalCET</title>
	<meta name="description" content="Explora el catálogo de productos de bioquímica de GlobalCET: material de vidrio, reactivos, kits de laboratorio y sistemas completos." />
</svelte:head>

<!-- ─── Hero Banner ───────────────────────────────────────────────────────────── -->
<section class="relative overflow-hidden border-b border-brand/10 bg-surface px-6 py-12">
	<!-- Decorative background glow -->
	<div class="pointer-events-none absolute -top-24 left-1/3 h-72 w-72 rounded-full bg-brand/10 blur-3xl"></div>
	<div class="pointer-events-none absolute -bottom-12 right-1/4 h-48 w-48 rounded-full bg-brand/8 blur-2xl"></div>

	<div class="relative mx-auto max-w-7xl px-6">
		<div class="flex flex-col gap-3 max-w-2xl">
			<span class="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-brand">
				<span class="inline-block h-1.5 w-5 rounded-full bg-brand"></span>
				Catálogo {new Date().getFullYear()}
			</span>
			<h1 class="text-3xl font-bold leading-tight text-text sm:text-4xl">
				Equipamiento Científico
				<span class="text-brand"> de Precisión</span>
			</h1>
			<p class="text-base text-text-muted leading-relaxed">
				Encuentra los insumos y equipos que tu laboratorio necesita. Calidad certificada para investigación y educación científica.
			</p>
		</div>
	</div>
</section>

<!-- ─── Main Content ──────────────────────────────────────────────────────────── -->
<main class="mx-auto flex max-w-7xl gap-8 px-6 py-8">

	<!-- Sidebar -->
	<FilterSidebar
		categories={allCategories}
		types={allTypes}
		{selectedCategories}
		{selectedTypes}
		filteredCount={filteredProducts().length}
		totalCount={allProducts.length}
		onCategoryToggle={toggleCategory}
		onTypeToggle={toggleType}
		onClearAll={clearAll}
	/>

	<!-- Content area -->
	<div class="flex flex-1 min-w-0 flex-col gap-6">
		<!-- Toolbar row -->
		<div class="flex items-center justify-between">
			<p class="text-sm text-text-muted">
				Mostrando
				<span class="font-semibold text-text">{filteredProducts().length}</span>
				resultado{filteredProducts().length !== 1 ? 's' : ''}
			</p>
			<div class="flex items-center gap-2 text-xs text-text-muted">
				<span class="hidden sm:inline">Ordenar por:</span>
				<select
					id="sort-select"
					class="
						rounded-lg border border-brand/20 bg-input
						px-3 py-1.5 text-xs text-text
						outline-none transition-colors duration-200
						focus:border-brand focus:ring-1 focus:ring-brand/25
					"
				>
					<option value="relevance">Relevancia</option>
					<option value="name">Nombre A–Z</option>
					<option value="category">Categoría</option>
				</select>
			</div>
		</div>

		<!-- Product Grid -->
		<ProductGrid
			products={filteredProducts()}
			{loading}
		/>
	</div>
</main>
