<script lang="ts">
	import { createQuery } from '@tanstack/svelte-query';
	import { page }        from '$app/state';

    import { ChevronLeft, ChevronRight, Download, Search, Share2 } from '@lucide/svelte';

	import connectRequest, { isApiError } from '$lib/services/fetch.service';
	import { INTERNAL_ENDPOINTS }         from '$lib/utils/endpoints';
	import { getItemImages }              from '$lib/utils/image';
	import ProductSpecs                   from './components/ProductSpecs.svelte';
	import KitSpecs                       from './components/KitSpecs.svelte';
	import LabSpecs                       from './components/LabSpecs.svelte';
	import ShareDialog                    from '$lib/components/shared/ShareDialog.svelte';

	// ─── Route Params ( Reactive Svelte 5 Kit ) ────────────────────────────────────
	const itemType = $derived( page.params.item );
	const itemId   = $derived( page.params.id );

	const itemTypeLabel = $derived.by( ( ) => {
		if ( itemType === 'product' ) {
			return 'producto';
		}

		if ( itemType === 'kit' ) {
			return 'kit científico';
		}

		if ( itemType === 'lab' ) {
			return 'laboratorio móvil';
		}

		return 'recurso';
	} );

	const errorTitle = $derived.by( ( ) => {
		if ( itemType === 'product' ) {
			return 'Producto no disponible';
		}

		if ( itemType === 'kit' ) {
			return 'Kit científico no disponible';
		}

		if ( itemType === 'lab' ) {
			return 'Laboratorio móvil no disponible';
		}

		return 'Recurso no disponible';
	} );

	const errorMessage = $derived.by( ( ) => {
		return `Este ${ itemTypeLabel } no existe o ya no está disponible en nuestro catálogo. Por favor, verifica la identificación o explora otras opciones disponibles.`;
	} );

	// ─── Query: Fetch Detail using server-side proxies ─────────────────────────────
	const itemQuery = createQuery( ( ) => ( {
		queryKey : [ 'itemDetail', itemType, itemId ],
		queryFn  : async ( ) => {
			let endpoint = '';
			if ( itemType === 'product' ) {
				endpoint = INTERNAL_ENDPOINTS.PRODUCTS.GET_ONE;
			} else if ( itemType === 'kit' ) {
				endpoint = INTERNAL_ENDPOINTS.KITS.GET_ONE;
			} else if ( itemType === 'lab' ) {
				endpoint = INTERNAL_ENDPOINTS.LABS.GET_ONE;
			}

			try {
				const response = await connectRequest< any >( {
					endpoint   : `${ endpoint }?id=${ itemId }`,
					isInternal : true,
				} );

				if ( isApiError( response ) ) {
					const error : any = new Error( response.message );
					error.status      = response.status;
					throw error;
				}

				return response;
			} catch ( err : any ) {
				const error : any = new Error( err.message || 'Request failed' );
				error.status      = err.status || 500;
				throw error;
			}
		},
		enabled  : !!itemType && !!itemId,
	} ) );

	const item      = $derived( itemQuery.data );
	const isLoading = $derived( itemQuery.isLoading );
	const isError   = $derived( itemQuery.isError );
	const queryErr  = $derived( itemQuery.error as any );

	// ─── Reactivity: Large Carousel State ──────────────────────────────────────────
	let activeIndex = $state( 0 );

	// ─── Description Read-More Toggle State ────────────────────────────────────────
	let isDescriptionExpanded = $state( false );
	let isShareOpen           = $state( false );

    const maxLeghtDescription = 1500;

	const descLength = $derived( item?.description ? item.description.length : 0 );
	const shouldTruncate = $derived( descLength > maxLeghtDescription );

	const displayedDescription = $derived.by( ( ) => {
		if ( !item ) {
			return 'Sin descripción disponible para este recurso educativo.';
		}

        if ( !item.description ) {
			return 'Sin descripción disponible para este recurso educativo.';
		}

        if ( shouldTruncate && !isDescriptionExpanded ) {
			return item.description.slice( 0, maxLeghtDescription ) + '...';
		}

        return item.description;
	});

	const images = $derived( item ? getItemImages( item ) : [] );

	const documents = $derived.by( () => {
		if ( !item || !item.files ) return [];
		return item.files.filter( ( f : any ) => {
			const typeUpper = ( f.attachmentType || '' ).toUpperCase().trim();
			return typeUpper.startsWith( 'DOCUMENT' );
		} );
	} );

	// Reset index if item changes
	$effect( ( ) => {
		item;
		activeIndex = 0;
	} );

	function nextImage( ): void {
		activeIndex = ( activeIndex + 1 ) % images.length;
	}

	function prevImage( ): void {
		activeIndex = ( activeIndex - 1 + images.length ) % images.length;
	}

	function setImage( idx : number ): void {
		activeIndex = idx;
	}

	const categoryName = $derived.by( ( ) => {
		if ( !item ) return '';
		if ( itemType === 'product' ) {
			return item.category || item.subcategory?.category?.name || 'Producto';
		}
		return item.category?.name || ( itemType === 'kit' ? 'Kit Científico' : 'Laboratorio Móvil' );
	} );

	const seoTitle = $derived( item ? `${ item.name } | GlobalCET | CET` : 'Detalle de Recurso | GlobalCET | CET' );

	const seoDescription = $derived.by( ( ) => {
		if ( !item ) {
			return 'Detalle de producto y equipamiento bioquímico en GlobalCET / CET Chile. Reactivos, vidriería científica y laboratorios.';
		}
		const skuPart = item.sku ? ` SKU: ${ item.sku }.` : '';
		const baseDesc = item.description || 'Detalle del recurso científico disponible en GlobalCET / CET.';
		const combined = `${ item.name }.${ skuPart } ${ baseDesc }`;

		if ( combined.length > 155 ) {
			return combined.slice( 0, 152 ) + '...';
		}

		return combined;
	} );

	const jsonLd = $derived.by( ( ) => {
		if ( !item ) {
			return '';
		}

		const imgUrl = images.length > 0 ? images[ 0 ] : 'https://globalcet.cl/logo/logo2.avif';

		const schema = {
			"@context"		: "https://schema.org",
			"@type"			: "Product",
			"name"			: item.name,
			"image"			: imgUrl,
			"description"	: item.description || 'Detalle del recurso científico disponible en GlobalCET.',
			"sku"			: item.sku || item.id || '',
			"brand"			: {
				"@type"	: "Brand",
				"name"	: "GlobalCET"
			},
			"offers"		: {
				"@type"			: "Offer",
				"priceCurrency"	: "CLP",
				"availability"	: "https://schema.org/InStock",
				"url"			: `https://globalcet.cl/products/${ itemType }/${ itemId }`
			}
		};

		return JSON.stringify( schema );
	} );

	let smallImages = $state< Record< string, boolean > >( {} );

	function handleImageLoad( event: Event, url: string ): void {
		const img = event.currentTarget as HTMLImageElement;

		if ( img.naturalWidth < 400 && img.naturalHeight < 400 ) {
			smallImages[ url ] = true;
		}
	}
</script>

<svelte:head>
	<title>{ seoTitle }</title>
	<meta name="description" content={ seoDescription } />
	{#if jsonLd }
		<script type="application/ld+json">
			{@html jsonLd }
		</script>
	{/if}
</svelte:head>

<!-- ─── Detail View Shell ────────────────────────────────────────────────────────── -->
<main class="mx-auto max-w-7xl px-6 py-10 sm:py-16">

	<!-- ─── Breadcrumb Navigation ─── -->
	<nav class="mb-8 flex items-center gap-2 text-xs font-semibold text-text-muted">
		<a href="/" class="hover:text-brand transition-colors">Inicio</a>
		<span>/</span>
		<a href="/catalog" class="hover:text-brand transition-colors">Catálogo</a>
		<span>/</span>
		{#if item }
			<span class="text-text-muted truncate max-w-[ 150px ]">{ categoryName }</span>
			<span>/</span>
			<span class="text-brand truncate max-w-[ 200px ]">{ item.name }</span>
		{:else}
			<span class="animate-pulse w-20 h-3.5 rounded-sm bg-brand/10"></span>
		{/if}
	</nav>

	{#if isLoading }
		<!-- Premium Loading Skeleton Grid -->
		<div class="space-y-12 animate-pulse">
			<!-- Top Grid: Image and Description Skeletons -->
			<div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
				<!-- Left Column: Image Skeleton -->
				<div class="lg:col-span-6 h-[ 360px ] sm:h-[ 480px ] rounded-3xl bg-brand/5 border border-brand/5 shadow-card"></div>

				<!-- Right Column: Info & Description Skeletons -->
				<div class="lg:col-span-6 space-y-6 flex flex-col justify-center">
					<div class="h-6 w-24 rounded-full bg-brand/10"></div>
					<div class="space-y-3">
						<div class="h-10 w-3/4 rounded-full bg-brand/10"></div>
						<div class="h-4 w-1/3 rounded-full bg-brand/5"></div>
					</div>
					<div class="h-36 w-full rounded-2xl bg-brand/5"></div>
				</div>
			</div>

			<!-- Bottom: Full-Width Specs Skeleton -->
			<div class="space-y-4 pt-8 border-t border-brand/5">
				<div class="h-4 w-32 rounded-full bg-brand/10"></div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
					<div class="h-48 rounded-2xl bg-brand/5 border border-brand/5"></div>
					<div class="h-48 rounded-2xl bg-brand/5 border border-brand/5"></div>
				</div>
			</div>
		</div>

	{:else if isError || !item }
		{#if queryErr?.status === 404 }
			<!-- Premium 404 Specific Page -->
			<div class="flex flex-col items-center justify-center gap-6 py-24 text-center max-w-xl mx-auto">
				<div class="relative flex items-center justify-center w-24 h-24 rounded-full bg-brand/5 border border-brand/10 shadow-[ 0_0_20px_rgba(0,230,118,0.05) ] animate-pulse mb-2">
					<Search class="size-10 text-brand-bright" />
					<div class="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface-dark border border-brand/20 text-[ 10px ] font-black text-brand">
						404
					</div>
				</div>

				<div class="space-y-2">
					<h1 class="text-2xl font-black font-display tracking-tight text-text sm:text-3xl">
						{ errorTitle }
					</h1>
					<p class="text-sm leading-relaxed text-text-muted">
						{ errorMessage }
					</p>
				</div>

				<div class="flex flex-col sm:flex-row gap-3 mt-4 w-full justify-center">
					<a
						href  = "/catalog"
						class = "
							rounded-xl bg-brand text-surface-dark px-6 py-3
							text-xs font-black uppercase tracking-wider text-center
							hover:bg-brand-bright hover:scale-[ 1.03 ] active:scale-95
							transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer
						"
					>
						Explorar Catálogo
					</a>
					<a
						href  = "/"
						class = "
							rounded-xl bg-brand/10 border border-brand/25 text-brand px-6 py-3
							text-xs font-black uppercase tracking-wider text-center
							hover:bg-brand hover:text-surface-dark hover:scale-[ 1.03 ] active:scale-95
							transition-all duration-300 cursor-pointer
						"
					>
						Ir al Inicio
					</a>
				</div>
			</div>
		{ :else }
			<!-- Elegant Error Recovery State -->
			<div class="flex flex-col items-center justify-center gap-4 py-24 text-center">
				<span class="text-4xl">⚠️</span>
				<h1 class="text-xl font-bold text-text">Error al cargar la ficha técnica</h1>
				<p class="max-w-md text-sm text-text-muted">
					No pudimos recuperar la información molecular de este elemento. Por favor, verifica el ID o intenta de nuevo más tarde.
				</p>
				<a
					href  = "/catalog"
					class = "
						mt-4 rounded-xl bg-brand/10 border border-brand/20 px-6 py-3
						text-xs font-black uppercase tracking-wider text-brand
						hover:bg-brand hover:text-surface-dark transition-all duration-300
					"
				>
					Volver al Catálogo
				</a>
			</div>
		{ /if }

	{:else}
		<!-- Unified Detail Page Grid -->
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">

			<!-- Left Column: Premium Large Image Carousel -->
			<section class="lg:col-span-6 flex flex-col gap-4">
				<div class="relative h-[ 360px ] sm:h-[ 480px ] overflow-hidden rounded-3xl border border-brand/10 bg-surface shadow-card group">

					<!-- Sliding images row -->
					<div
						class="flex h-full w-full transition-transform duration-500 ease-out"
						style="transform: translateX( -{ activeIndex * 100 }% )"
					>
						{#each images as imgUrl ( imgUrl ) }
							<img
								src     = { imgUrl }
								alt     = { item.name }
								onload  = { ( e ) => handleImageLoad( e, imgUrl ) }
								class   = "
									h-full w-full shrink-0 transition-all duration-300
									{ smallImages[ imgUrl ] ? 'object-scale-down p-8' : 'object-cover' }
								"
							/>
						{/each}
					</div>

					<!-- Navigation chevron buttons -->
					{#if images.length > 1 }
						<button
							onclick = { prevImage }
							aria-label = "Imagen anterior"
							class = "
								absolute left-4 top-1/2 -translate-y-1/2 z-20
								flex h-10 w-10 items-center justify-center rounded-full
								bg-black/35 backdrop-blur-md text-white border border-white/10
								opacity-0 group-hover:opacity-100 transition-all duration-300
								hover:bg-black/60 hover:scale-105 cursor-pointer
							"
						>
                            <ChevronLeft class="size-5" />
						</button>

						<button
							onclick = { nextImage }
							aria-label = "Siguiente imagen"
							class = "
								absolute right-4 top-1/2 -translate-y-1/2 z-20
								flex h-10 w-10 items-center justify-center rounded-full
								bg-black/35 backdrop-blur-md text-white border border-white/10
								opacity-0 group-hover:opacity-100 transition-all duration-300
								hover:bg-black/60 hover:scale-105 cursor-pointer
							"
						>
                            <ChevronRight class="size-5" />
						</button>
					{/if}
				</div>

				<!-- Dots navigation carousel slider -->
				{#if images.length > 1 }
					<div class="flex items-center justify-center gap-2 pt-2">
						{#each images as _, idx ( idx ) }
							<button
								onclick    = { ( ) => setImage( idx ) }
								aria-label = "Ir a imagen { idx + 1 }"
								class      = "
									h-2 rounded-full transition-all duration-300 cursor-pointer
									{ idx === activeIndex
										? 'bg-brand w-6 shadow-[0_0_8px_var(--color-brand)]'
										: 'bg-text-muted/20 hover:bg-text-muted/40 w-2'
									}
								"
							></button>
						{/each}
					</div>
				{/if}
			</section>

			<!-- Right Column: Info and Technical Ficha -->
			<section class="lg:col-span-6 flex flex-col gap-6">

				<!-- Meta Type Badge -->
				<div class="flex gap-4 justify-between">
					<span class="
						rounded-full px-3 py-1
						text-[10px] font-black uppercase tracking-widest backdrop-blur-md
						{ itemType === 'lab'
							? 'border border-blue-400/30 bg-blue-400/20 text-blue-300'
							: itemType === 'kit'
								? 'border border-emerald-400/30 bg-emerald-400/20 text-emerald-300'
								: 'border border-brand/30 bg-brand/20 text-brand-bright'
						}
					">
						{ itemType === 'lab' ? 'Laboratorio Móvil' : itemType === 'kit' ? 'Kit Científico' : 'Producto Individual' }
					</span>

                    <button
						onclick     = { () => isShareOpen = true }
                        aria-label  = "Compartir este producto"
						class       = "
							flex h-7 items-center gap-1.5 rounded-full px-3 border border-brand/30 dark:border-brand/20 bg-brand/10 hover:bg-brand dark:hover:bg-brand
							text-[10px] font-bold uppercase tracking-wider text-brand hover:text-surface-dark dark:text-brand-bright dark:hover:text-surface-dark
							transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer shadow-sm
						"
					>
						<Share2 class="size-3.5" />
						<span>Compartir</span>
					</button>
				</div>

				<!-- Main Title Header -->
				<div class="space-y-1.5">
					<h1 class="text-3xl font-extrabold font-display leading-tight text-text sm:text-4xl">
						{ item.name }
					</h1>
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-x-4 gap-y-3 text-xs text-text-muted w-full">
						<div class="flex items-center gap-4">
							<span class="font-bold text-brand uppercase tracking-wider">{ categoryName }</span>
							<span class="h-3 w-[ 1px ] bg-brand/25"></span>
							<span class="font-mono">SKU: { item.sku }</span>
						</div>

						{#if documents.length > 0 }
							<div class="flex flex-col gap-1.5 items-start sm:items-end w-full sm:w-auto">
								{#each documents as doc, i ( doc.id ) }
									<a
										href        = { doc.url }
										download    = ""
										target      = "_blank"
                                        title       = { doc.alt || ( "Archivo " + ( i + 1 ))}
										class       = "
											inline-flex items-center gap-1.5 rounded-md
											bg-brand/10 border border-brand/20 px-2.5 py-1 text-[10px] font-bold text-brand
											hover:bg-brand hover:text-surface-dark transition-all duration-300 w-full sm:w-auto
										"
									>
										<Download class="size-3.5" />
										<span class="truncate max-w-[300px] sm:max-w-[200px] md:max-w-[150px]">
											{ doc.alt || ( "Archivo " + ( i + 1 ) ) }
										</span>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				</div>

				<!-- Educational Description Container -->
				<div class="rounded-2xl border border-brand/10 bg-surface/50 p-6 shadow-card space-y-3">
					<h4 class="text-[10px] font-black uppercase tracking-widest text-brand">Descripción del Recurso</h4>
					<div class="text-sm leading-relaxed text-text-muted description-content">
						{@html displayedDescription }
					</div>
					{#if shouldTruncate }
						<button
							onclick = { ( ) => isDescriptionExpanded = !isDescriptionExpanded }
							class   = "text-xs font-bold text-brand hover:text-brand-bright transition-colors duration-200 focus:outline-hidden cursor-pointer"
						>
							{ isDescriptionExpanded ? 'Leer menos' : 'Leer más...' }
						</button>
					{/if}
				</div>

			</section>
		</div>

        <div class="space-y-2 mt-12">
            <h4 class="text-xs font-black uppercase tracking-widest text-brand mb-4">Especificaciones Técnicas</h4>

            {#if itemType === 'product' }
                <ProductSpecs product={ item } />
            {:else if itemType === 'kit' }
                <KitSpecs kit={ item } />
            {:else if itemType === 'lab' }
                <LabSpecs lab={ item } />
            {/if}
        </div>
	{/if}
</main>

<ShareDialog bind:isOpen={ isShareOpen } title={ item?.name } />

<style>
	.description-content :global( ul ) {
		list-style-type : disc;
		padding-left    : 1.25rem;
		margin-top      : 0.5rem;
		margin-bottom   : 0.5rem;
	}

	.description-content :global( ol ) {
		list-style-type : decimal;
		padding-left    : 1.25rem;
		margin-top      : 0.5rem;
		margin-bottom   : 0.5rem;
	}

	.description-content :global( li ) {
		margin-bottom : 0.25rem;
	}

	.description-content :global( p ) {
		margin-bottom : 0.5rem;
	}

	.description-content :global( table ) {
		width           : 100%;
		border-collapse : collapse;
		margin          : 1.25rem 0;
	}

	.description-content :global( th ),
	.description-content :global( td ) {
		border  : 1px solid rgba( 0, 230, 118, 0.2 );
		padding : 0.625rem 0.875rem;
	}

	.description-content :global( th ) {
		background-color : rgba( 0, 230, 118, 0.08 );
		color            : #00b564;
		font-weight      : 700;
		text-align       : left;
	}

	:global( .dark ) .description-content :global( th ) {
		color : #00e676;
	}

	.description-content :global( blockquote ) {
		border-left      : 3px solid #00b564;
		background-color : rgba( 0, 230, 118, 0.06 );
		padding          : 0.75rem 1rem;
		margin           : 1.25rem 0;
		border-radius    : 0 0.5rem 0.5rem 0;
		font-style       : italic;
	}

	:global( .dark ) .description-content :global( blockquote ) {
		border-left      : 3px solid #00e676;
		background-color : rgba( 0, 230, 118, 0.1 );
	}
</style>
