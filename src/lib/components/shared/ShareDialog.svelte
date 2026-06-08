<script lang="ts">
	import { fade, scale, fly } from 'svelte/transition';
	import { browser }           from '$app/environment';
	import { X, Copy, Check }    from '@lucide/svelte';

	// ─── Interfaces ───────────────────────────────────────────────────────────────
	interface Props {
		isOpen       : boolean;
		url?         : string;
		title?       : string;
		description? : string;
	}

	interface ShareNetwork {
		name  : string;
		color : string;
		icon  : string;
		url   : ( href: string, text: string ) => string;
	}

	interface Toast {
		id      : number;
		message : string;
		type    : 'success' | 'error';
	}

	// ─── Props & Bindings ─────────────────────────────────────────────────────────
	let {
		isOpen      = $bindable( false ),
		url         = '',
		title       = '',
		description = '',
	}: Props = $props();

	// ─── Reactive States ──────────────────────────────────────────────────────────
	let isCopied = $state( false );
	let toasts   = $state<Toast[]>( [] );

	// ─── Derived States ───────────────────────────────────────────────────────────
	const shareUrl: string = $derived.by( (): string => {
		if ( url ) return url;
		if ( browser ) return window.location.href;
		return '';
	} );

	const shareTitle: string = $derived.by( (): string => {
		if ( title ) return title;
		if ( browser ) return document.title;
		return 'CET Chile';
	} );

	// ─── Transition Options ───────────────────────────────────────────────────────
	const fadeParams = {
		duration : 200,
	};

	const scaleParams = {
		duration : 200,
		start    : 0.95,
	};

	const flyParams = {
		y        : 20,
		duration : 300,
	};

	// ─── Social Networks List ─────────────────────────────────────────────────────
	const networks: ShareNetwork[] = [
		{
			name  : 'WhatsApp',
			color : 'bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#25D366] border-[#25D366]/20',
			icon  : 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
			url   : ( href: string, text: string ): string => `https://api.whatsapp.com/send?text=${ encodeURIComponent( text + ' ' + href ) }`,
		},
		{
			name  : 'Facebook',
			color : 'bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] border-[#1877F2]/20',
			icon  : 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
			url   : ( href: string ): string => `https://www.facebook.com/sharer/sharer.php?u=${ encodeURIComponent( href ) }`,
		},
		{
			name  : 'X (Twitter)',
			color : 'bg-[#0F1419]/10 hover:bg-[#0F1419]/20 text-[#0F1419] dark:text-neutral-200 border-[#0F1419]/20 dark:border-white/10',
			icon  : 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
			url   : ( href: string, text: string ): string => `https://twitter.com/intent/tweet?url=${ encodeURIComponent( href ) }&text=${ encodeURIComponent( text ) }`,
		},
		{
			name  : 'LinkedIn',
			color : 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] border-[#0A66C2]/20',
			icon  : 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z',
			url   : ( href: string, text: string ): string => `https://www.linkedin.com/shareArticle?mini=true&url=${ encodeURIComponent( href ) }&title=${ encodeURIComponent( text ) }`,
		},
		{
			name  : 'Email',
			color : 'bg-red-500/10 hover:bg-red-500/20 text-red-500 dark:text-red-400 border-red-500/20',
			icon  : 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
			url   : ( href: string, text: string ): string => `mailto:?subject=${ encodeURIComponent( text ) }&body=${ encodeURIComponent( 'Mira este producto de CET Chile: ' + href ) }`,
		}
	];

	// ─── Actions ──────────────────────────────────────────────────────────────────
	function showToast( message: string, type: 'success' | 'error' = 'success' ): void {
		const id: number = Date.now();
		toasts = [ ...toasts, {
			id      : id,
			message : message,
			type    : type,
		} ];
		setTimeout( () => {
			toasts = toasts.filter( ( t ) => t.id !== id );
		}, 3000 );
	}

	async function copyLink(): Promise<void> {
		try {
			await navigator.clipboard.writeText( shareUrl );
			isCopied = true;
			showToast( '¡Enlace copiado con éxito!' );
			setTimeout( () => {
				isCopied = false;
			}, 2000 );
		} catch ( err ) {
			showToast( 'Error al copiar el enlace', 'error' );
		}
	}

	function handleKeyDown( event: KeyboardEvent ): void {
		if ( isOpen && event.key === 'Escape' ) {
			isOpen = false;
		}
	}

	// ─── Scroll Lock Effect ───────────────────────────────────────────────────────
	$effect( () => {
		if ( isOpen && browser ) {
			const originalOverflow: string = document.body.style.overflow;
			document.body.style.overflow = 'hidden';
			return () => {
				document.body.style.overflow = originalOverflow;
			};
		}
	} );
</script>

<svelte:window onkeydown={handleKeyDown} />

{#if isOpen }
	<!-- Backdrop Overlay -->
	<div
		transition:fade={ fadeParams }
		onclick={ () => isOpen = false }
		onkeydown={ ( e ) => { if ( e.key === ' ' || e.key === 'Enter' ) { isOpen = false; } } }
		class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-default"
		role="button"
		tabindex="-1"
	>
		<!-- Modal Box -->
		<div
			transition:scale={ scaleParams }
			onclick={ ( event ) => event.stopPropagation() }
			onkeydown={ ( event ) => event.stopPropagation() }
			class="
				relative w-full max-w-sm overflow-hidden rounded-3xl border border-brand/20 dark:border-brand/10
				bg-surface/95 dark:bg-surface-dark/95 backdrop-blur-2xl p-6
				shadow-card dark:shadow-[0_4px_20px_rgba(0,230,118,0.08)]
				transition-all duration-300 flex flex-col gap-6
			"
			role="dialog"
			aria-modal="true"
			tabindex="-1"
		>
			<!-- Header -->
			<div class="flex items-center justify-between">
				<h3 class="text-lg font-extrabold font-display text-text dark:text-white">
					Compartir
				</h3>
				<button
					onclick={ () => isOpen = false }
					class="
						flex h-8 w-8 items-center justify-center rounded-full border border-brand/10 dark:border-white/5
						bg-brand/5 hover:bg-brand/15 dark:hover:bg-white/10 text-text-muted hover:text-text dark:text-[#6aad82] dark:hover:text-white
						transition-all duration-200 cursor-pointer
					"
					aria-label="Cerrar"
				>
					<X class="size-4" />
				</button>
			</div>

			<!-- Description or Info (Optional) -->
			<div class="flex flex-col gap-1">
				<p class="text-xs text-text-muted dark:text-[#6aad82] font-semibold uppercase tracking-wider">
					Enlace de este recurso
				</p>
				<p class="text-sm font-bold text-text dark:text-[#e8f5e9] truncate font-display">
					{ shareTitle }
				</p>
			</div>

			<!-- Copy link Section -->
			<div class="flex items-center gap-2 rounded-xl border border-brand/20 dark:border-brand/10 bg-surface/50 dark:bg-surface-dark/50 p-2 pl-3">
				<span class="text-xs text-text-muted dark:text-[#6aad82]/80 truncate select-all flex-1 font-mono">
					{ shareUrl }
				</span>
				<button
					onclick={ copyLink }
					class="
						flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-bold transition-all duration-300 cursor-pointer shrink-0
						{ isCopied
							? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.35)]'
							: 'bg-brand/10 hover:bg-brand text-brand hover:text-surface-dark border border-brand/20 hover:border-brand'
						}
					"
				>
					{#if isCopied }
						<Check class="size-3.5 shrink-0" />
						<span>¡Copiado!</span>
					{:else}
						<Copy class="size-3.5 shrink-0" />
						<span>Copiar</span>
					{/if}
				</button>
			</div>

			<!-- Divider -->
			<div class="flex items-center gap-3">
				<div class="h-px flex-1 bg-brand/10 dark:bg-[#004d26]/30"></div>
				<span class="text-[10px] font-black uppercase tracking-widest text-text-muted/60 dark:text-[#6aad82]/50">
					O compartir vía
				</span>
				<div class="h-px flex-1 bg-brand/10 dark:bg-[#004d26]/30"></div>
			</div>

			<!-- Share Grid -->
			<div class="grid grid-cols-3 gap-3">
				{#each networks as net ( net.name ) }
					<a
						href={ net.url( shareUrl, shareTitle ) }
						target="_blank"
						rel="noopener noreferrer"
						class="
							flex flex-col items-center justify-center gap-2 rounded-2xl border p-3
							transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer
							{ net.color }
						"
					>
						<svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
							<path d={ net.icon } />
						</svg>
						<span class="text-[10px] font-bold tracking-wider font-display">
							{ net.name }
						</span>
					</a>
				{/each}
			</div>
		</div>
	</div>
{/if}

<!-- Toast Notifications Wrapper -->
{#if toasts.length > 0 }
	<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
		{#each toasts as toast ( toast.id ) }
			<div
				transition:fly={ flyParams }
				class="
					flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.15)] backdrop-blur-md pointer-events-auto
					{ toast.type === 'success'
						? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
						: 'border-red-500/30 bg-red-500/10 text-red-800 dark:text-red-300'
					}
				"
			>
				{#if toast.type === 'success' }
					<div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
						<Check class="size-3.5" />
					</div>
				{/if}
				<span class="text-xs font-bold font-display">{ toast.message }</span>
			</div>
		{/each}
	</div>
{/if}
