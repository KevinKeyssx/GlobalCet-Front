<script lang="ts">
	import { untrack } from 'svelte';

	import {
        ArrowUpAZ,
		ArrowDownAZ,
        TriangleAlert
	}                       from '@lucide/svelte';
    import { createQuery }  from '@tanstack/svelte-query';

	import type {
        GlobalSearchResponse,
	}                               from '$lib/types/search';
	import connectRequest, {
		isApiError,
	}                               from '$lib/services/fetch.service';
	import ProductGrid              from '$lib/components/ProductGrid.svelte';
    import SoftSelect               from '$lib/components/shared/SoftSelect.svelte';
	import { INTERNAL_ENDPOINTS }   from '$lib/utils/endpoints';
    import Pagination               from '$lib/components/shared/Pagination.svelte';
	import { searchStore }          from '$lib/state/search';
	import { page as appPage }      from '$app/state';
	import { goto }                 from '$app/navigation';
	import { globalLoadingStore }   from '$lib/state/loading';
	import FilterSidebar            from './components/FilterSidebar.svelte';

	// ─── Constants ────────────────────────────────────────────────────────────────
	const DEFAULT_PAGE_SIZE = 48;

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
	let activeTab             = $state( appPage.url.searchParams.get( 'tab' ) || '' );
	let sortBy                = $state( appPage.url.searchParams.get( 'sort' ) || 'relevance' );
	let sortOrder             = $state( appPage.url.searchParams.get( 'order' ) || 'asc' );
	let page                  = $state( Number( appPage.url.searchParams.get( 'page' ) ) || 1 );
	let size                  = $state( DEFAULT_PAGE_SIZE );
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
	});

	// ─── Sync local state from URL parameters (on navigation / load) ──────────────
	$effect( ( ) => {
		const searchParams = appPage.url.searchParams;

		if ( !isMounted ) return;

		untrack( ( ) => {
			// Sync tab
			const tabParam = searchParams.get( 'tab' ) || '';

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
	$effect( ( ) => {
		const currentTab: string       = activeTab;
		const currentSort: string      = sortBy;
		const currentOrder: string     = sortOrder;
		const currentPage: number      = page;
		const subCats: Set<string>   = selectedSubCategories;
		const mats: Set<string>      = selectedMaterials;
		const kitCats: Set<string>   = selectedKitCategories;
		const labCats: Set<string>   = selectedLabCategories;

		const params: URLSearchParams = new URLSearchParams( );

		if ( currentTab ) {
			params.set( 'tab', currentTab );
		}

		if ( currentSort !== 'relevance' ) {
			params.set( 'sort', currentSort );
		}

		if ( currentOrder !== 'asc' ) {
			params.set( 'order', currentOrder );
		}

		if ( currentPage !== 1 ) {
			params.set( 'page', currentPage.toString( ) );
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

		const newQueryString: string = params.toString( );
		const currentQueryString: string = untrack( ( ) => appPage.url.searchParams.toString( ) );

		if ( newQueryString !== currentQueryString ) {
			goto( `?${ newQueryString }`, {
				replaceState : true,
				noScroll     : true,
				keepFocus    : true,
			} );
		}
	} );

	// ─── Query: Fetch Global Searches from Backend ────────────────────────────────
	const globalSearchQuery = createQuery( ( ) => {
		const activeFilter = activeTab === 'productos'
			? 'products'
			: activeTab === 'kits'
				? 'kits'
				: activeTab === 'lab-movil'
					? 'mobileLabs'
					: '';

		const categoriesList    = [ ...selectedKitCategories, ...selectedLabCategories ].join( ',' );
		const subcategoriesList = [ ...selectedSubCategories ].join( ',' );
		const materialsList     = [ ...selectedMaterials ].join( ',' );

		// Si no hay tab seleccionado (vista unificada), la página siempre se fija a 1
		const queryPage = activeTab === '' ? 1 : page;

		const queryParams = new URLSearchParams( {
			query      : $searchStore,
			suggestion : 'true',
			page       : queryPage.toString( ),
			size       : size.toString( ),
			orderBy    : backendSortField,
			order      : backendSortOrder,
		});

		if ( activeFilter ) {
			queryParams.set( 'filter', activeFilter );
		}

        if ( categoriesList ) {
			queryParams.set( 'categories', categoriesList );
		}

        if ( subcategoriesList ) {
			queryParams.set( 'subcategories', subcategoriesList );
		}

        if ( materialsList ) {
			queryParams.set( 'materialIds', materialsList );
		}

		return {
			queryKey : [
				'globalSearch',
				$searchStore,
				activeFilter,
				categoriesList,
				subcategoriesList,
				materialsList,
				queryPage,
				size,
				backendSortField,
				backendSortOrder,
			],
			queryFn  : async ( ) => {
				const response = await connectRequest< GlobalSearchResponse >( {
					endpoint   : `${INTERNAL_ENDPOINTS.GLOBAL_SEARCH.BASE}?${ queryParams.toString( ) }`,
					isInternal : true,
				} );

				if ( isApiError( response ) ) {
					throw new Error( response.message );
				}

				return response;
			},
		};
	} );

	// ─── Derived: Collections from Query Data ──────────────────────────────────────
	const products           = $derived( globalSearchQuery.data?.suggestions?.products || globalSearchQuery.data?.products || [] );
	const kits               = $derived( globalSearchQuery.data?.suggestions?.kits || globalSearchQuery.data?.kits || [] );
	const mobileLabs         = $derived( globalSearchQuery.data?.suggestions?.mobileLabs || globalSearchQuery.data?.mobileLabs || [] );
	const isSearchSuggestion = $derived( !!globalSearchQuery.data?.meta?.isSuggestion );

	// ─── Derived: Display Counts ─────────────────────────────────────────────────
	const currentDisplayCount = $derived(
		( activeTab === 'productos' )
			? ( globalSearchQuery.data?.meta?.totalProducts || 0 )
			: ( activeTab === 'kits' )
				? ( globalSearchQuery.data?.meta?.totalKits || 0 )
				: ( activeTab === 'lab-movil' )
					? ( globalSearchQuery.data?.meta?.totalMobileLabs || 0 )
					: ( ( globalSearchQuery.data?.meta?.totalProducts || 0 ) + ( globalSearchQuery.data?.meta?.totalKits || 0 ) + ( globalSearchQuery.data?.meta?.totalMobileLabs || 0 ) )
	);

	// ─── Sync global loading store with query loading state ─────────────────────
	const activeLoadingState = $derived( globalSearchQuery.isFetching );

	$effect( ( ) => {
		$globalLoadingStore = activeLoadingState;

		return ( ) => {
			$globalLoadingStore = false;
		};
	} );

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
	<title>Catálogo Científico | GlobalCET</title>
	<meta name="description" content="Explora el catálogo de GlobalCET: reactivos de alta pureza, material de vidrio certificado de borosilicato, kits de laboratorio y laboratorios móviles en Chile." />
</svelte:head>

<!-- ─── Hero Banner ───────────────────────────────────────────────────────────── -->
<section class="relative overflow-hidden border-b border-brand/10 px-6 py-6 lg:py-8">
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
		bind:selectedSubCategories
		bind:selectedMaterials
		bind:selectedKitCategories
		bind:selectedLabCategories
		bind:activeTab
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

		{#if isSearchSuggestion }
			<div class="overflow-hidden rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-text backdrop-blur-md shadow-[0_0_20px_rgba(245,158,11,0.1)] flex items-start gap-4 animate-fade-in">
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
					<TriangleAlert class="size-5" />
				</div>

				<div class="space-y-1 flex-1">
					{#if $searchStore !== '' }
						<p class="font-display text-base font-bold text-amber-400">No se encontraron resultados para "{ $searchStore }"</p>
					{:else}
						<p class="font-display text-base font-bold text-amber-400">No se encontraron resultados que coincidan con los filtros seleccionados</p>
					{/if}
					<p class="text-xs text-text-muted leading-relaxed font-medium">
						No hemos encontrado ninguna coincidencia exacta en nuestro catálogo actual. Para ayudarte a encontrar lo que necesitas, te sugerimos los siguientes equipos y materiales científicos relacionados:
					</p>
				</div>
			</div>

            <p class="font-display text-sm font-bold text-brand/50 mx-auto uppercase tracking-wider">Resultados sugeridos:</p>
		{/if}

		<!-- Unified Product & Kit & Lab Grid -->
		<ProductGrid
			products   = { products }
			kits       = { kits }
			mobileLabs = { mobileLabs }
			loading    = { globalSearchQuery.isFetching }
		/>

		<!-- Interlocking Paginated Controls -->
		{#if ( activeTab && globalSearchQuery.data && !isSearchSuggestion ) }
			{@const totalCount = activeTab === 'productos'
				? globalSearchQuery.data.meta.totalProducts
				: activeTab === 'kits'
					? globalSearchQuery.data.meta.totalKits
					: globalSearchQuery.data.meta.totalMobileLabs
			}
			{#if ( totalCount > size ) }
				<Pagination
					count   = { totalCount }
					perPage = { size }
					bind:page
				/>
			{/if}
		{/if}
	</div>
</main>
