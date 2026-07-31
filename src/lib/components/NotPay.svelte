<script lang="ts">
	import { ShieldAlert, Copy, Check, Mail } from '@lucide/svelte';

	let copied = $state( false );

	async function handleCopy() : Promise<void> {
		const info = `Banco: Banco Estado\nTipo: Chequera Electrónica\nN° Cuenta: 35770890118\nRUT: 76.537.375-6\nNombre: CET Chile SpA.\nCorreo: finanzas@globalcet.cl`;
		try {
			await navigator.clipboard.writeText( info );
			copied = true;
			setTimeout( () => {
				copied = false;
			}, 2000 );
		} catch ( err ) {
			console.error( 'Error al copiar: ', err );
		}
	}
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-surface/80 backdrop-blur-md transition-colors duration-300 p-4">
	<div class="max-w-md w-full bg-card border border-brand/20 rounded-3xl shadow-card-hover p-8 flex flex-col items-center text-center relative overflow-hidden transition-all duration-300">
		<!-- Decorative Background Glow -->
		<div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-brand/10 blur-3xl pointer-events-none"></div>
		<div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-brand/5 blur-3xl pointer-events-none"></div>

		<!-- Warning Icon -->
		<div class="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand mb-6 shadow-inner">
			<ShieldAlert class="h-8 w-8 animate-pulse" />
		</div>

		<!-- Title -->
		<h1 class="text-2xl font-extrabold tracking-tight text-text font-display mb-3">
			Actualización de Estado de Cuenta
		</h1>

		<!-- Professional Message -->
		<p class="text-text-muted text-sm leading-relaxed mb-6">
			Estimado cliente, le informamos que el acceso a la plataforma se encuentra temporalmente restringido debido a una regularización de saldo pendiente. Agradecemos su comprensión y colaboración para mantener el servicio activo.
		</p>

		<!-- Payment Info Card -->
		<!-- <div class="w-full bg-input/40 border border-brand/10 rounded-2xl p-5 text-left mb-6 space-y-3">
			<h2 class="text-xs font-black uppercase tracking-wider text-brand font-display border-b border-brand/10 pb-2">
				Datos para Transferencia
			</h2>
			<div class="grid grid-cols-2 gap-y-2 text-xs font-semibold">
				<span class="text-text-muted">Banco:</span>
				<span class="text-text text-right">Banco Estado</span>

				<span class="text-text-muted">Tipo de Cuenta:</span>
				<span class="text-text text-right">Chequera Electrónica</span>

				<span class="text-text-muted">N° Cuenta:</span>
				<span class="text-text text-right font-mono">35770890118</span>

				<span class="text-text-muted">RUT:</span>
				<span class="text-text text-right font-mono">76.537.375-6</span>

				<span class="text-text-muted">Destinatario:</span>
				<span class="text-text text-right">CET Chile SpA.</span>

				<span class="text-text-muted">Comprobantes:</span>
				<span class="text-brand text-right font-bold hover:underline">
					<a href="mailto:finanzas@globalcet.cl?subject=Comprobante%20de%20Pago%20-%20Restablecimiento%20de%20Servicio">
						finanzas@globalcet.cl
					</a>
				</span>
			</div>
		</div> -->

		<!-- Action Buttons -->
		<!-- <div class="w-full flex flex-col sm:flex-row gap-3">
			<button
				onclick={ handleCopy }
				class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-brand-bright/20 bg-input/60 hover:bg-input text-text text-sm font-bold transition-all duration-200 cursor-pointer"
			>
				{#if ( copied )}
					<Check class="h-4 w-4 text-brand" />
					<span class="text-brand">¡Copiado!</span>
				{:else}
					<Copy class="h-4 w-4" />
					<span>Copiar Datos</span>
				{/if}
			</button>

			<a
				href="mailto:finanzas@globalcet.cl?subject=Comprobante%20de%20Pago%20-%20Restablecimiento%20de%20Servicio"
				class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand hover:bg-brand-bright text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
			>
				<Mail class="h-4 w-4" />
				<span>Enviar Comprobante</span>
			</a>
		</div> -->
	</div>
</div>
