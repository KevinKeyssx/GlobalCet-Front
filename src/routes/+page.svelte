<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';

	import type {
        GlobalSearchResponse,
		GlobalSearchProduct,
		GlobalSearchKit,
		GlobalSearchMobileLab,
	}                           from '$lib/types/search';
	import
    connectRequest, {
        isApiError
    }                           from '$lib/services/fetch.service';
    import type { ProductType } from '$lib/types/product';
	import FilterSidebar        from './filters/components/FilterSidebar.svelte';
	import ProductGrid          from '$lib/components/ProductGrid.svelte';

	// ─── Constants ────────────────────────────────────────────────────────────────
	const allTypes: ProductType[] = [ 'Producto', 'Kit', 'Laboratorio Móvil' ];

	// ─── Filter State (Svelte 5 Runes) ────────────────────────────────────────────
	let search                = $state( '' );
	let selectedSubCategories = $state( new Set<string>() );
	let selectedMaterials     = $state( new Set<string>() );
	let selectedKitCategories = $state( new Set<string>() );
	let selectedLabCategories = $state( new Set<string>() );
	let activeTab             = $state( 'productos' );
	let sortBy                = $state( 'relevance' );

	// ─── Query: Fetch Global Searches from Backend ────────────────────────────────
	const globalSearchQuery = createQuery( () => ({
		queryKey : [ 'globalSearch', search ],
		queryFn  : async () => {
			const params = new URLSearchParams( {
				query          : search,
				limitPerEntity : '10',
				suggestion     : 'false',
			} );

			const response = await connectRequest<GlobalSearchResponse>( {
				endpoint   : `global-search?${params.toString()}`,
				isInternal : true,
			});

			if ( isApiError( response )) {
				throw new Error( response.message );
			}

			return response;
		},
	}));

	// ─── Derived: Collections from Query Data ──────────────────────────────────────
	const products   = $derived( globalSearchQuery.data?.products || [] );
	const kits       = $derived( globalSearchQuery.data?.kits || [] );
	const mobileLabs = $derived( globalSearchQuery.data?.mobileLabs || [] );

	// ─── Derived & Local Filtering ────────────────────────────────────────────────
	const filteredProducts = $derived.by( () => {
		return products.filter( ( p: GlobalSearchProduct ) => {
			const matchSub  = selectedSubCategories.size === 0 || selectedSubCategories.has( p.subcategory?.id );
			const matchMat  = selectedMaterials.size === 0 || selectedMaterials.has( p.material?.id );
			return matchSub && matchMat;
		} );
	} );

	const filteredKits = $derived.by( () => {
		return kits.filter( ( k: GlobalSearchKit ) => {
			return selectedKitCategories.size === 0 || selectedKitCategories.has( k.category?.id );
		} );
	} );

	const filteredLabs = $derived.by( () => {
		return mobileLabs.filter( ( l: GlobalSearchMobileLab ) => {
			return selectedLabCategories.size === 0 || selectedLabCategories.has( l.category?.id );
		} );
	} );

	// ─── Derived: Local Sorting ──────────────────────────────────────────────────
	const sortedProducts = $derived.by( () => {
		const items = [ ...filteredProducts ];
		if ( sortBy === 'name' ) {
			items.sort( ( a, b ) => a.name.localeCompare( b.name ) );
		} else if ( sortBy === 'category' ) {
			items.sort( ( a, b ) => ( a.subcategory?.category?.name || '' ).localeCompare( b.subcategory?.category?.name || '' ) );
		}
		return items;
	} );

	const sortedKits = $derived.by( () => {
		const items = [ ...filteredKits ];
		if ( sortBy === 'name' ) {
			items.sort( ( a, b ) => a.name.localeCompare( b.name ) );
		} else if ( sortBy === 'category' ) {
			items.sort( ( a, b ) => ( a.category?.name || '' ).localeCompare( b.category?.name || '' ) );
		}
		return items;
	} );

	const sortedLabs = $derived.by( () => {
		const items = [ ...filteredLabs ];
		if ( sortBy === 'name' ) {
			items.sort( ( a, b ) => a.name.localeCompare( b.name ) );
		} else if ( sortBy === 'category' ) {
			items.sort( ( a, b ) => ( a.category?.name || '' ).localeCompare( b.category?.name || '' ) );
		}
		return items;
	} );

	// ─── Derived: Display Counts ─────────────────────────────────────────────────
	const currentDisplayCount = $derived(
		sortedProducts.length + sortedKits.length + sortedLabs.length
	);

	const totalDisplayCount = $derived(
		products.length + kits.length + mobileLabs.length
	);

	// ─── Handlers ─────────────────────────────────────────────────────────────────
	function handleSearch( value: string ): void {
		search = value;
	}

	function toggleSubCategory( id: string ): void {
		const next = new Set( selectedSubCategories );
		if ( next.has( id ) ) {
			next.delete( id );
		} else {
			next.add( id );
		}
		selectedSubCategories = next;
	}

	function toggleMaterial( id: string ): void {
		const next = new Set( selectedMaterials );
		if ( next.has( id ) ) {
			next.delete( id );
		} else {
			next.add( id );
		}
		selectedMaterials = next;
	}

	function toggleType( type: ProductType ): void {
		// No-op or type selector logic if type pill clicked
	}

	function clearAll(): void {
		selectedSubCategories = new Set();
		selectedMaterials     = new Set();
		selectedKitCategories = new Set();
		selectedLabCategories = new Set();
		search                = '';
	}
</script>

<svelte:head>
	<title>Catálogo de Productos - Kits - Laboratorios Móbiles | GlobalCET</title>
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
			Catálogo { new Date().getFullYear() }
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
		types={ allTypes }
		bind:selectedSubCategories
		bind:selectedMaterials
		bind:selectedKitCategories
		bind:selectedLabCategories
		bind:activeTab
		selectedTypes={ new Set() }
		filteredCount={ currentDisplayCount }
		totalCount={ totalDisplayCount }
		onSubCategoryToggle={ toggleSubCategory }
		onMaterialToggle={ toggleMaterial }
		onTypeToggle={ toggleType }
		onClearAll={ clearAll }
	/>

	<!-- Content area -->
	<div class="flex flex-1 min-w-0 flex-col gap-6">
		<!-- Toolbar row -->
		<div class="flex items-center justify-between">
			<p class="text-sm text-text-muted">
				Mostrando
				<span class="font-semibold text-text">{ currentDisplayCount }</span>
				resultado{ currentDisplayCount !== 1 ? 's' : '' }
			</p>

			<div class="flex items-center gap-2 text-xs text-text-muted">
				<span class="hidden sm:inline">Ordenar por:</span>
				<select
					id="sort-select"
					bind:value={ sortBy }
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

		<!-- Unified Product & Kit & Lab Grid -->
		<ProductGrid
			products={ sortedProducts }
			kits={ sortedKits }
			mobileLabs={ sortedLabs }
			loading={ globalSearchQuery.isLoading }
		/>
	</div>
</main>
