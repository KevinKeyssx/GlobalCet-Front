<script lang="ts">
	import { FileText, Trash2, CircleCheckBig } from '@lucide/svelte';
	import confetti from 'canvas-confetti';

	import connectRequest, { isApiError }   from '$lib/services/fetch.service';
	import type { CreateQuoteResponse }     from '$lib/types/search';
	import { quoteStore }                   from '$lib/state/quote';
	import { formatCLP }                    from '$lib/utils/price';
	import { INTERNAL_ENDPOINTS }           from '$lib/utils/endpoints';
	import InputNumber                      from '$lib/components/shared/inputs/InputNumber.svelte';
	import DataForm                         from './components/DataForm.svelte';

	// Form bindings
	let companyName  = $state( '' );
	let rut          = $state( '' );
	let address      = $state( '' );
	let email        = $state( '' );
	let contactName  = $state( '' );
	let phoneNumber  = $state( '' );
	let isSubmitting = $state( false );
	let createdQuote = $state<CreateQuoteResponse | null>( null );
	let submitError  = $state( '' );

	// Calculate total for items that have price
	const estimatedTotal = $derived.by( ( ) => {
		return $quoteStore.reduce( ( sum, item ) => {
			const price = item.currentPrice || 0;
			return sum + ( price * item.quantity );
		}, 0 );
	});

	const hasSomePrice = $derived.by(() => {
		return $quoteStore.some( ( item ) => !!item.currentPrice && item.currentPrice > 0 );
	});

	async function handleSubmit( ): Promise<void> {
		if ( $quoteStore.length === 0 ) {
			submitError = 'No hay elementos en tu lista de cotización.';
			return;
		}

		isSubmitting = true;
		submitError = '';

		// Prepare products, kits, and labs quantities
		const products = $quoteStore
			.filter( ( item ) => item.type === 'product' )
			.map( ( item ) => ( {
				id       : item.id,
				quantity : item.quantity,
			}));

		const kits = $quoteStore
			.filter( ( item ) => item.type === 'kit' )
			.map( ( item ) => ( {
				id       : item.id,
				quantity : item.quantity,
			}));

		const mobileLabs = $quoteStore
			.filter( ( item ) => item.type === 'lab' )
			.map( ( item ) => ( {
				id       : item.id,
				quantity : item.quantity,
			}));

		const requestBody = {
			clientData : {
				companyName : companyName,
				rut         : rut,
				address     : address,
				email       : email,
				contactName : contactName,
				phoneNumber : phoneNumber,
			},
			items      : {
				products   : products,
				kits       : kits,
				mobileLabs : mobileLabs,
			}
		};

		try {
			const response = await connectRequest<CreateQuoteResponse>( {
				endpoint   : INTERNAL_ENDPOINTS.QUOTES.CREATE,
				method     : 'POST' as any,
				body       : requestBody,
				isInternal : true,
			} );

			if ( isApiError( response ) ) {
				throw response;
			}

			// Clear store cart
			quoteStore.clear();

			// Trigger confetti celebration
			confetti( {
				particleCount : 100,
				spread        : 70,
				origin        : { y : 0.6 },
			} );

			createdQuote = response;
		} catch ( err: any ) {
			submitError = err.message || 'Error al enviar la cotización. Inténtalo de nuevo.';
		} finally {
			isSubmitting = false;
		}
	}

	function handleQuantityChange( id: string, newQty: number ): void {
		quoteStore.updateQuantity( id, newQty );
	}

	function handleRemoveItem( id: string ): void {
		quoteStore.removeItem( id );
	}
</script>

<svelte:head>
	<title>Mi Lista de Cotización | GlobalCET | CET</title>
	<meta name="description" content="Genera tu solicitud de cotización científica personalizada en GlobalCET." />
</svelte:head>

<main class="mx-auto max-w-7xl px-6 py-10 sm:py-16">
	<!-- Page Header -->
	<div class="mb-10 flex flex-col gap-2">
		<h1 class="text-3xl font-extrabold font-display leading-tight text-text sm:text-4xl">
			Mi Lista de Cotización
		</h1>
		<p class="text-sm text-text-muted">
			Gestiona los elementos que deseas cotizar y completa el formulario para enviar la solicitud.
		</p>
	</div>

	{#if ( createdQuote )}
		<!-- Success view -->
		<div class="max-w-2xl mx-auto rounded-3xl border border-brand/20 bg-card/50 p-8 md:p-12 text-center shadow-card-hover backdrop-blur-md space-y-6 animate-fade-in">
			<div class="flex justify-center">
				<div class="relative flex items-center justify-center w-20 h-20 rounded-full bg-brand/10 border border-brand/30 shadow-[0_0_20px_rgba(5,150,105,0.2)]">
                    <CircleCheckBig class="size-10 text-brand-bright" />
				</div>
			</div>

			<div class="space-y-2">
				<h2 class="text-2xl font-black font-display text-text">
					¡Solicitud Enviada con Éxito!
				</h2>

                <p class="text-sm text-text-muted leading-relaxed">
					Hemos recibido tu solicitud de cotización. Se ha enviado un correo de confirmación a <strong class="text-brand">{ email }</strong> con todos los detalles y las instrucciones para seguir su estado.
				</p>
			</div>

			<div class="rounded-2xl bg-input p-4 border border-brand/10 inline-block font-mono text-sm font-black text-text">
				Código de Cotización: #{ createdQuote.quoteNumber }
			</div>

			<div class="pt-4 flex justify-center gap-4">
				<a
					href  = "/catalog"
					class = "
						rounded-xl bg-brand text-surface-dark px-8 py-3.5
						text-xs font-black uppercase tracking-wider
						hover:bg-brand-bright hover:scale-[1.03] active:scale-95
						transition-all duration-300 shadow-md shadow-brand/15 cursor-pointer
					"
				>
					Volver a la Tienda
				</a>
			</div>
		</div>

	{:else if ( $quoteStore.length === 0 )}
		<!-- Empty state -->
		<div class="flex flex-col items-center justify-center gap-6 py-20 text-center max-w-xl mx-auto rounded-3xl border border-brand/10 bg-card/25 p-8 backdrop-blur-xs">
			<div class="relative flex items-center justify-center w-20 h-20 rounded-full bg-brand/5 border border-brand/10 animate-pulse">
				<FileText class="size-10 text-brand/70" />
			</div>

			<div class="space-y-2">
				<h2 class="text-xl font-black font-display text-text">
					Tu lista de cotización está vacía
				</h2>

                <p class="text-sm leading-relaxed text-text-muted">
					Explora nuestro catálogo y agrega productos, kits o laboratorios móviles para generar una solicitud de cotización detallada.
				</p>
			</div>

			<div class="pt-2">
				<a
					href  = "/catalog"
					class = "
						rounded-xl bg-brand text-surface-dark px-6 py-3
						text-xs font-black uppercase tracking-wider
						hover:bg-brand-bright hover:scale-[1.03] active:scale-95
						transition-all duration-300 shadow-md shadow-brand/10 cursor-pointer
					"
				>
					Explorar Catálogo
				</a>
			</div>
		</div>

	{:else}
		<!-- Form & Cart content layout -->
		<div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
			<!-- Left side: Cart Items List -->
			<div class="lg:col-span-7 space-y-6">
				<h3 class="text-xs font-black uppercase tracking-widest text-brand mb-2">
					Elementos Seleccionados ({ $quoteStore.length })
				</h3>

				<div class="space-y-4">
					{#each $quoteStore as item ( item.id ) }
						<div class="
							flex flex-col sm:flex-row gap-4 p-4 rounded-2xl
							border border-brand/10 bg-card shadow-card
							transition-all duration-300 hover:border-brand/25
						">
							<!-- Thumbnail Image -->
							<div class="h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-surface border border-brand/5 flex items-center justify-center">
								<img
									src   = { item.imageUrl }
									alt   = { item.name }
									class = "h-full w-full object-cover"
								/>
							</div>

							<!-- Item Details -->
							<div class="flex-1 flex flex-col justify-between gap-2">
								<div class="space-y-1">
									<div class="flex items-center justify-between gap-2">
										<span class="
											rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-wider
											{ item.type === 'lab'
												? 'border border-blue-400/30 bg-blue-400/20 text-blue-300'
												: item.type === 'kit'
													? 'border border-emerald-400/30 bg-emerald-400/20 text-emerald-300'
													: 'border border-brand/30 bg-brand/20 text-brand-bright'
											}
										">
											{ item.type === 'lab' ? 'Laboratorio Móvil' : item.type === 'kit' ? 'Kit' : 'Producto' }
										</span>

										<button
											onclick    = { ( ) => handleRemoveItem( item.id ) }
											class      = "text-text-muted hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-500/5 cursor-pointer"
											aria-label = "Eliminar de la cotización"
										>
											<Trash2 class="size-4" />
										</button>
									</div>

									<a
										href  = "/products/{ item.type }/{ item.id }"
										class = "block text-sm font-bold text-text hover:text-brand transition-colors line-clamp-1"
									>
										{ item.name }
									</a>

									<p class="text-[11px] font-mono text-text-muted">SKU: { item.sku }</p>
								</div>

								<div class="flex flex-wrap items-center justify-between gap-4 border-t border-brand/5 pt-2">
									<!-- Quantity controls -->
									<InputNumber
										value       = { item.quantity }
										min         = { 1 }
										max         = { 9999 }
										onchange    = { ( val ) => handleQuantityChange( item.id, val ) }
										class       = "scale-90 origin-left"
                                        width       = "w-12"
									/>

									<!-- Price display -->
									<div class="text-right">
										{#if ( item.formattedPrice )}
											<span class="text-xs font-black text-brand-bright font-mono">
												{ formatCLP( item.currentPrice! * item.quantity ) }
											</span>

                                            <span class="block text-[8px] text-text-muted mt-0.5">
												(Unitario: { item.formattedPrice })
											</span>
										{:else}
											<span class="text-xs font-bold text-text-muted italic">Por Cotizar</span>
										{/if}
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Right side: Form & Total Card -->
			<div class="lg:col-span-5 space-y-6">
				<h3 class="text-xs font-black uppercase tracking-widest text-brand mb-2">
					Datos del Solicitante
				</h3>

				<div class="rounded-3xl border border-brand/15 bg-card p-6 shadow-card space-y-6 backdrop-blur-xs">
					<DataForm
						bind:companyName = { companyName }
						bind:rut         = { rut }
						bind:contactName = { contactName }
						bind:email       = { email }
						bind:phoneNumber = { phoneNumber }
						bind:address     = { address }
						isSubmitting     = { isSubmitting }
						submitError      = { submitError }
						hasSomePrice     = { hasSomePrice }
						estimatedTotal   = { estimatedTotal }
						onsubmit         = { handleSubmit }
					/>
				</div>
			</div>
		</div>
	{/if}
</main>

<style>
	@keyframes fadeIn {
		from {
			opacity   : 0;
			transform : translateY( 10px );
		}
		to {
			opacity   : 1;
			transform : translateY( 0 );
		}
	}

	.animate-fade-in {
		animation : fadeIn 0.4s cubic-bezier( 0.16, 1, 0.3, 1 ) forwards;
	}
</style>
