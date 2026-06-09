<script lang="ts">
	import { createQuery }          from '@tanstack/svelte-query';
	import Pagination               from '$lib/components/shared/Pagination.svelte';
	import SoftSelect               from '$lib/components/shared/SoftSelect.svelte';
	import { untrack }              from 'svelte';
	import {
		ArrowUpAZ,
		ArrowDownAZ,
        TriangleAlert
	}                               from '@lucide/svelte';

	import type {
		GlobalSearchResponse,
		GlobalSearchProduct,
		GlobalSearchKit,
		GlobalSearchMobileLab,
	}                               from '$lib/types/search';
	import connectRequest, {
		isApiError,
	}                               from '$lib/services/fetch.service';
	import type { ProductType }     from '$lib/types/product';
	import ProductGrid              from '$lib/components/ProductGrid.svelte';
	import { INTERNAL_ENDPOINTS }   from '$lib/utils/endpoints';
	import { searchStore }          from '$lib/state/search';
	import { page as appPage }      from '$app/state';
	import { goto }                 from '$app/navigation';
	import { globalLoadingStore }   from '$lib/state/loading';
	import type { PaginationMeta }  from '$lib/types/pagination';
	import FilterSidebar            from './components/FilterSidebar.svelte';

	// ─── Constants ────────────────────────────────────────────────────────────────
	const allTypes: ProductType[] = [ 'Producto', 'Kit', 'Laboratorio Móvil' ];


	// ─── URL Query Parsing Helper ──────────────────────────────────────────────────
	function getSetFromParam( paramName: string ): Set<string> {
		const vals: string[] = appPage.url.searchParams.getAll( paramName );

        if ( vals.length === 0 ) {
			const singleVal: string | null = appPage.url.searchParams.get( paramName );

            if ( !singleVal ) {
				return new Set<string>();
			}

            return new Set<string>( singleVal.split( ',' ).filter( Boolean ) );
		}

        const items: string[] = [];

        for ( const v of vals ) {
			if ( v.includes( ',' ) ) {
				items.push( ...v.split( ',' ).filter( Boolean ) );
			} else if ( v ) {
				items.push( v );
			}
		}

        return new Set<string>( items );
	}

	let selectedSubCategories = $state( getSetFromParam( 'subcategories' ) );
	let selectedMaterials     = $state( getSetFromParam( 'materials' ) );
	let selectedKitCategories = $state( getSetFromParam( 'kitCategories' ) );
	let selectedLabCategories = $state( getSetFromParam( 'labCategories' ) );
	let activeTab             = $state( appPage.url.searchParams.get( 'tab' ) || 'productos' );
	let sortBy                = $state( appPage.url.searchParams.get( 'sort' ) || 'relevance' );
	let sortOrder             = $state( appPage.url.searchParams.get( 'order' ) || 'asc' );
	let page                  = $state( Number( appPage.url.searchParams.get( 'page' ) ) || 1 );
	let size                  = $state( 9 );
	let isMounted             = $state( false );

	const sortOptions = [
		{
			id   : 'name',
			name : 'Nombre',
		},
		{
			id   : 'createdAt',
			name : 'Lo más nuevo',
		},
		{
			id   : 'category',
			name : 'Categoría',
		},
		{
			id   : 'relevance',
			name : 'Relevancia',
		},
	];

	const backendSortField = $derived( ( sortBy === 'name' || sortBy === 'createdAt' ) ? sortBy : 'name' );
	const backendSortOrder = $derived( ( sortBy === 'name' || sortBy === 'createdAt' ) ? sortOrder : 'asc' );


	$effect( () => {
		selectedSubCategories;
		selectedMaterials;
		selectedKitCategories;
		selectedLabCategories;
		activeTab;

		if ( isMounted ) {
			if ( page !== 1 ) {
				page = 1;
			}
		} else {
			isMounted = true;
		}
	} );

	// ─── Sync local state from URL parameters (on navigation / load) ──────────────
	$effect( () => {
		const searchParams = appPage.url.searchParams;

		if ( !isMounted ) {
			return;
		}

		untrack( () => {
			// Sync tab
			const tabParam = searchParams.get( 'tab' ) || 'productos';
			if ( activeTab !== tabParam ) {
				activeTab = tabParam;
			}

			// Sync sort
			const sortParam = searchParams.get( 'sort' ) || 'relevance';
			if ( sortBy !== sortParam ) {
				sortBy = sortParam;
			}

			// Sync order
			const orderParam = searchParams.get( 'order' ) || 'asc';
			if ( sortOrder !== orderParam ) {
				sortOrder = orderParam;
			}

			// Sync page
			const pageParam = Number( searchParams.get( 'page' ) ) || 1;
			if ( page !== pageParam ) {
				page = pageParam;
			}

			// Sync subcategories
			const subCats = getSetFromParam( 'subcategories' );
			if ( Array.from( selectedSubCategories ).join( ',' ) !== Array.from( subCats ).join( ',' ) ) {
				selectedSubCategories = subCats;
			}

			// Sync materials
			const mats = getSetFromParam( 'materials' );
			if ( Array.from( selectedMaterials ).join( ',' ) !== Array.from( mats ).join( ',' ) ) {
				selectedMaterials = mats;
			}

			// Sync kitCategories
			const kitCats = getSetFromParam( 'kitCategories' );
			if ( Array.from( selectedKitCategories ).join( ',' ) !== Array.from( kitCats ).join( ',' ) ) {
				selectedKitCategories = kitCats;
			}

			// Sync labCategories
			const labCats = getSetFromParam( 'labCategories' );
			if ( Array.from( selectedLabCategories ).join( ',' ) !== Array.from( labCats ).join( ',' ) ) {
				selectedLabCategories = labCats;
			}

			// Sync query
			const queryParam = searchParams.get( 'query' ) || '';
			if ( $searchStore !== queryParam ) {
				$searchStore = queryParam;
			}
		} );
	} );

	// ─── URL Search Params Synchronization Effect ─────────────────────────────────
	$effect( () => {
		const currentTab: string       = activeTab;
		const currentSort: string      = sortBy;
		const currentOrder: string     = sortOrder;
		const currentPage: number      = page;
		const subCats: Set<string>     = selectedSubCategories;
		const mats: Set<string>        = selectedMaterials;
		const kitCats: Set<string>     = selectedKitCategories;
		const labCats: Set<string>     = selectedLabCategories;

		const params: URLSearchParams = new URLSearchParams();

		if ( currentTab !== 'productos' ) {
			params.set( 'tab', currentTab );
		}

		if ( currentSort !== 'relevance' ) {
			params.set( 'sort', currentSort );
		}

		if ( currentOrder !== 'asc' ) {
			params.set( 'order', currentOrder );
		}

		if ( currentPage !== 1 ) {
			params.set( 'page', currentPage.toString() );
		}

		if ( subCats.size > 0 ) {
			params.set( 'subcategories', Array.from( subCats ).join( ',' ) );
		}

		if ( mats.size > 0 ) {
			params.set( 'materials', Array.from( mats ).join( ',' ) );
		}

		if ( kitCats.size > 0 ) {
			params.set( 'kitCategories', Array.from( kitCats ).join( ',' ) );
		}

		if ( labCats.size > 0 ) {
			params.set( 'labCategories', Array.from( labCats ).join( ',' ) );
		}

		if ( $searchStore ) {
			params.set( 'query', $searchStore );
		}

		const newQueryString: string = params.toString();
		const currentQueryString: string = untrack( () => appPage.url.searchParams.toString() );

		if ( newQueryString !== currentQueryString ) {
			goto( `?${ newQueryString }`, {
				replaceState	: true,
				noScroll		: true,
				keepFocus		: true,
			} );
		}
	} );

	// ─── Query: Fetch Global Searches from Backend ────────────────────────────────
	const globalSearchQuery = createQuery( () => ( {
		queryKey : [ 'globalSearch', $searchStore ],
		queryFn  : async () => {
			const params = new URLSearchParams( {
				query			: $searchStore,
				limitPerEntity	: '15',
				suggestion		: 'true',
			} );

			const response = await connectRequest<GlobalSearchResponse>( {
				endpoint	: `global-search?${ params.toString() }`,
				isInternal	: true,
			} );

			if ( isApiError( response ) ) {
				throw new Error( response.message );
			}

			return response;
		},
	} ) );

	const hasActiveProductFilters = $derived( selectedSubCategories.size > 0 || selectedMaterials.size > 0 );
	const hasActiveKitFilters     = $derived( selectedKitCategories.size > 0 );
	const hasActiveLabFilters     = $derived( selectedLabCategories.size > 0 );
	const isAnyFilterActive       = $derived( hasActiveProductFilters || hasActiveKitFilters || hasActiveLabFilters );

	// ─── Query: Fetch Products paginated and filtered from Backend ──────────────
	const productsQuery = createQuery( () => ( {
		queryKey : [ 'products', Array.from( selectedSubCategories ), Array.from( selectedMaterials ), page, size, backendSortField, backendSortOrder ],
		queryFn  : async () => {
			const params = new URLSearchParams( {
				page    : page.toString(),
				size    : size.toString(),
				orderBy : backendSortField,
				order   : backendSortOrder,
			} );

			selectedSubCategories.forEach( ( id ) => params.append( 'subcategories', id ) );
			selectedMaterials.forEach( ( id ) => params.append( 'materials', id ) );

			const response = await connectRequest<PaginationMeta<GlobalSearchProduct[]>>( {
				endpoint   : `${ INTERNAL_ENDPOINTS.PRODUCTS.FILTERS }?${ params.toString() }`,
				isInternal : true,
			} );

			if ( isApiError( response ) ) {
				throw new Error( response.message );
			}

			return response;
		},
		enabled : activeTab === 'productos' && $searchStore === '' && hasActiveProductFilters,
	} ) );

	// ─── Query: Fetch Kits paginated and filtered from Backend ──────────────────
	const kitsQuery = createQuery( () => ( {
		queryKey : [ 'kits', Array.from( selectedKitCategories ), page, size, backendSortField, backendSortOrder ],
		queryFn  : async () => {
			const params = new URLSearchParams( {
				page    : page.toString(),
				size    : size.toString(),
				orderBy : backendSortField,
				order   : backendSortOrder,
			} );

			selectedKitCategories.forEach( ( id ) => params.append( 'categories', id ) );

			const response = await connectRequest<PaginationMeta<GlobalSearchKit[]>>( {
				endpoint   : `${ INTERNAL_ENDPOINTS.KITS.FILTERS }?${ params.toString() }`,
				isInternal : true,
			} );

			if ( isApiError( response ) ) {
				throw new Error( response.message );
			}

			return response;
		},
		enabled : activeTab === 'kits' && $searchStore === '' && hasActiveKitFilters,
	} ) );

	// ─── Query: Fetch Labs paginated and filtered from Backend ──────────────────
	const labsQuery = createQuery( () => ( {
		queryKey : [ 'labs', Array.from( selectedLabCategories ), page, size, backendSortField, backendSortOrder ],
		queryFn  : async () => {
			const params = new URLSearchParams( {
				page    : page.toString(),
				size    : size.toString(),
				orderBy : backendSortField,
				order   : backendSortOrder,
			} );

			selectedLabCategories.forEach( ( id ) => params.append( 'categories', id ) );

			const response = await connectRequest<PaginationMeta<GlobalSearchMobileLab[]>>( {
				endpoint   : `${ INTERNAL_ENDPOINTS.LABS.FILTERS }?${ params.toString() }`,
				isInternal : true,
			} );

			if ( isApiError( response ) ) {
				throw new Error( response.message );
			}

			console.log( '🚀 ~ response:', response )
			return response;
		},
		enabled : activeTab === 'lab-movil' && $searchStore === '' && hasActiveLabFilters,
	} ) );

	// ─── Derived: Collections from Query Data ──────────────────────────────────────
	const products   = $derived( globalSearchQuery.data?.products || [] );
	const kits       = $derived( globalSearchQuery.data?.kits || [] );
	const mobileLabs = $derived( globalSearchQuery.data?.mobileLabs || [] );
	const isSearchSuggestion = $derived( !!globalSearchQuery.data?.meta?.isSuggestion );

	// ─── Derived & Local Filtering ────────────────────────────────────────────────
	const filteredProducts = $derived.by( () => {
		return products.filter( ( p: GlobalSearchProduct ) => {
			const matchSub = selectedSubCategories.size === 0 || selectedSubCategories.has( p.subcategory?.id );
			const matchMat = selectedMaterials.size === 0 || selectedMaterials.has( p.material?.id );
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
		const direction = sortOrder === 'asc' ? 1 : -1;

		if ( sortBy === 'name' ) {
			items.sort( ( a, b ) => direction * a.name.localeCompare( b.name ) );
		} else if ( sortBy === 'createdAt' ) {
			items.sort( ( a, b ) => direction * ( new Date( a.createdAt ).getTime() - new Date( b.createdAt ).getTime() ) );
		} else if ( sortBy === 'category' ) {
			items.sort( ( a, b ) => direction * ( a.subcategory?.category?.name || '' ).localeCompare( b.subcategory?.category?.name || '' ) );
		}
		return items;
	} );

	const sortedKits = $derived.by( () => {
		const items = [ ...filteredKits ];
		const direction = sortOrder === 'asc' ? 1 : -1;

		if ( sortBy === 'name' ) {
			items.sort( ( a, b ) => direction * a.name.localeCompare( b.name ) );
		} else if ( sortBy === 'createdAt' ) {
			items.sort( ( a, b ) => direction * ( new Date( a.createdAt ).getTime() - new Date( b.createdAt ).getTime() ) );
		} else if ( sortBy === 'category' ) {
			items.sort( ( a, b ) => direction * ( a.category?.name || '' ).localeCompare( b.category?.name || '' ) );
		}
		return items;
	} );

	const sortedLabs = $derived.by( () => {
		const items = [ ...filteredLabs ];
		const direction = sortOrder === 'asc' ? 1 : -1;

		if ( sortBy === 'name' ) {
			items.sort( ( a, b ) => direction * a.name.localeCompare( b.name ) );
		} else if ( sortBy === 'createdAt' ) {
			items.sort( ( a, b ) => direction * ( new Date( a.createdAt ).getTime() - new Date( b.createdAt ).getTime() ) );
		} else if ( sortBy === 'category' ) {
			items.sort( ( a, b ) => direction * ( a.category?.name || '' ).localeCompare( b.category?.name || '' ) );
		}
		return items;
	} );

	// ─── Derived: Display Counts ─────────────────────────────────────────────────
	const currentDisplayCount = $derived(
		( $searchStore !== '' || !isAnyFilterActive )
			? ( sortedProducts.length + sortedKits.length + sortedLabs.length )
			: ( activeTab === 'productos'
				? ( hasActiveProductFilters ? ( productsQuery.data?.meta?.total || 0 ) : sortedProducts.length )
				: ( activeTab === 'kits'
					? ( hasActiveKitFilters ? ( kitsQuery.data?.meta?.total || 0 ) : sortedKits.length )
					: ( hasActiveLabFilters ? ( labsQuery.data?.meta?.total || 0 ) : sortedLabs.length )
				)
			)
	);

	const totalDisplayCount = $derived(
		( $searchStore !== '' || !isAnyFilterActive )
			? ( products.length + kits.length + mobileLabs.length )
			: ( activeTab === 'productos'
				? ( hasActiveProductFilters ? ( productsQuery.data?.meta?.total || 0 ) : products.length )
				: ( activeTab === 'kits'
					? ( hasActiveKitFilters ? ( kitsQuery.data?.meta?.total || 0 ) : kits.length )
					: ( hasActiveLabFilters ? ( labsQuery.data?.meta?.total || 0 ) : mobileLabs.length )
				)
			)
	);

	// ─── Sync global loading store with query loading state ─────────────────────
	const activeLoadingState = $derived(
		( $searchStore !== '' || !isAnyFilterActive )
			? globalSearchQuery.isFetching
			: ( activeTab === 'productos'
				? ( hasActiveProductFilters ? productsQuery.isFetching : globalSearchQuery.isFetching )
				: ( activeTab === 'kits'
					? ( hasActiveKitFilters ? kitsQuery.isFetching : globalSearchQuery.isFetching )
					: ( hasActiveLabFilters ? labsQuery.isFetching : globalSearchQuery.isFetching )
				)
			)
	);

	$effect( () => {
		$globalLoadingStore = activeLoadingState;

		return () => {
			$globalLoadingStore = false;
		};
	} );

	// Reset page to 1 when filters are toggled to avoid paginating empty pages
	function toggleSubCategory( id: string ): void {
		const next = new Set( selectedSubCategories );
		if ( next.has( id ) ) {
			next.delete( id );
		} else {
			next.add( id );
		}
		selectedSubCategories = next;
		page                  = 1;
	}

	// Reset page to 1 when filters are toggled to avoid paginating empty pages
	function toggleMaterial( id: string ): void {
		const next = new Set( selectedMaterials );
		if ( next.has( id ) ) {
			next.delete( id );
		} else {
			next.add( id );
		}
		selectedMaterials = next;
		page              = 1;
	}

	function clearAll(): void {
		selectedSubCategories = new Set();
		selectedMaterials     = new Set();
		selectedKitCategories = new Set();
		selectedLabCategories = new Set();
		$searchStore          = '';
		page                  = 1;
	}
</script>

<svelte:head>
	<title>Catálogo de Productos - Kits - Laboratorios Móbiles | GlobalCET</title>
	<meta name="description" content="Explora el catálogo de productos de bioquímica de GlobalCET: material de vidrio, reactivos, kits de laboratorio y sistemas completos." />
</svelte:head>

<!-- ─── Hero Banner ───────────────────────────────────────────────────────────── -->
<section class="relative overflow-hidden border-b border-brand/10 px-6 py-20 lg:py-6">
	<div class="relative mx-auto flex max-w-7xl flex-col items-center text-center px-6 space-y-2">
		<span class="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand backdrop-blur-md shadow-[0_0_15px_rgba(0,181,100,0.15)]">
			<span class="relative flex h-2 w-2">
				<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
				<span class="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
			</span>
			Catálogo { new Date().getFullYear() }
		</span>

		<p class="mx-auto max-w-2xl text-md text-text-muted leading-relaxed font-medium">
			Encuentra los insumos y equipos que tu laboratorio necesita. Calidad certificada para investigación y educación científica.
		</p>
	</div>
</section>

<!-- ─── Main Content ──────────────────────────────────────────────────────────── -->
<main class="mx-auto flex max-w-7xl gap-8 px-6 pt-8 pb-56">
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
		onTypeToggle={ () => {} }
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
				<div class="w-48">
					<SoftSelect
						options={ sortOptions }
						bind:value={ sortBy }
						placeholder="Ordenar por..."
					/>
				</div>

				<button
					type="button"
					onclick={ () => sortOrder = sortOrder === 'asc' ? 'desc' : 'asc' }
					class="
						flex h-9 w-9 items-center justify-center rounded-lg
						border border-brand/20 dark:border-brand/10 bg-surface/40 hover:bg-surface/60
						text-text transition-all duration-200 shadow-[0_2px_10px_rgba(0,0,0,0.02)]
					"
					title={ sortOrder === 'asc' ? 'Orden Ascendente (A-Z)' : 'Orden Descendente (Z-A)' }
					aria-label="Alternar dirección de orden"
				>
					{#if sortOrder === 'asc'}
						<ArrowUpAZ class="h-4 w-4 text-brand" />
					{:else}
						<ArrowDownAZ class="h-4 w-4 text-brand" />
					{/if}
				</button>
			</div>
		</div>

		{#if ( $searchStore !== '' && isSearchSuggestion ) }
			<div class="mb-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-text backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.1)] flex items-start gap-4 animate-fade-in">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
					<TriangleAlert class="size-5" />
				</div>

                <div class="space-y-1 flex-1">
					<p class="font-display text-base font-bold text-amber-400">No se encontraron resultados para "{ $searchStore }"</p>
					<p class="text-xs text-text-muted leading-relaxed font-medium">
						No hemos encontrado ninguna coincidencia exacta para lo que estás buscando en nuestro catálogo actual. Para ayudarte a encontrar lo que necesitas, te sugerimos los siguientes equipos y materiales científicos relacionados:
					</p>
				</div>
			</div>
		{/if}

		<!-- Unified Product & Kit & Lab Grid -->
		<ProductGrid
			products={ ( $searchStore !== '' || !isAnyFilterActive )
				? sortedProducts
				: ( activeTab === 'productos'
					? ( hasActiveProductFilters ? ( productsQuery.data?.data || [] ) : sortedProducts )
					: []
				)
			}
			kits={ ( $searchStore !== '' || !isAnyFilterActive )
				? sortedKits
				: ( activeTab === 'kits'
					? ( hasActiveKitFilters ? ( kitsQuery.data?.data || [] ) : sortedKits )
					: []
				)
			}
			mobileLabs={ ( $searchStore !== '' || !isAnyFilterActive )
				? sortedLabs
				: ( activeTab === 'lab-movil'
					? ( hasActiveLabFilters ? ( labsQuery.data?.data || [] ) : sortedLabs )
					: []
				)
			}
			loading={ ( $searchStore !== '' || !isAnyFilterActive )
				? globalSearchQuery.isLoading
				: ( activeTab === 'productos'
					? ( hasActiveProductFilters ? productsQuery.isLoading : globalSearchQuery.isLoading )
					: ( activeTab === 'kits'
						? ( hasActiveKitFilters ? kitsQuery.isLoading : globalSearchQuery.isLoading )
						: ( hasActiveLabFilters ? labsQuery.isLoading : globalSearchQuery.isLoading )
					)
				)
			}
		/>

		<!-- Interlocking Paginated Controls -->
		{#if $searchStore === '' && activeTab === 'productos' && hasActiveProductFilters && productsQuery.data && productsQuery.data.meta.totalPages > 1}
			<Pagination
				count={ productsQuery.data.meta.total }
				perPage={ size }
				bind:page={ page }
			/>
		{/if}

		{#if $searchStore === '' && activeTab === 'kits' && hasActiveKitFilters && kitsQuery.data && kitsQuery.data.meta.totalPages > 1}
			<Pagination
				count={ kitsQuery.data.meta.total }
				perPage={ size }
				bind:page={ page }
			/>
		{/if}

		{#if $searchStore === '' && activeTab === 'lab-movil' && hasActiveLabFilters && labsQuery.data && labsQuery.data.meta.totalPages > 1}
			<Pagination
				count={ labsQuery.data.meta.total }
				perPage={ size }
				bind:page={ page }
			/>
		{/if}
	</div>
</main>
