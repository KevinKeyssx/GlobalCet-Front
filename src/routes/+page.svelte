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
<section class="relative overflow-hidden border-b border-brand/10 px-6 py-20 lg:py-24">
	<!-- Dynamic Animated Background Elements -->
	<div class="pointer-events-none absolute -top-32 -left-10 h-[500px] w-[500px] animate-pulse rounded-full bg-brand/15 blur-[100px] duration-10000"></div>
	<div class="pointer-events-none absolute top-10 right-0 h-[400px] w-[400px] animate-pulse rounded-full bg-brand/10 blur-[80px] duration-7000" style="animation-delay: 2s;"></div>
	<div class="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-linear-to-r from-brand/0 via-brand/10 to-brand/0 blur-3xl"></div>

	<div class="relative mx-auto flex max-w-7xl flex-col items-center text-center px-6">
		<span class="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand backdrop-blur-md shadow-[0_0_15px_rgba(0,181,100,0.15)]">
			<span class="relative flex h-2 w-2">
			  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
			  <span class="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
			</span>
			Catálogo {new Date().getFullYear()}
		</span>
		
		<h1 class="font-display mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-text sm:text-6xl md:text-7xl">
			Equipamiento Científico
			<br />
			<span class="bg-linear-to-r from-brand-muted via-brand to-brand-bright bg-clip-text text-transparent drop-shadow-sm">
				de Precisión
			</span>
		</h1>
		
		<p class="mx-auto mt-6 max-w-2xl text-lg text-text-muted leading-relaxed font-medium">
			Encuentra los insumos y equipos que tu laboratorio necesita. Calidad certificada para investigación y educación científica.
		</p>
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
