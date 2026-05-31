<script lang="ts">
	// ─── GlobalCET Footer Component ──────────────────────────────────────────────
	// A beautifully structured, highly responsive footer that automatically
	// adapts to light and dark modes using theme variables, optimized for readability.
</script>

<footer class="relative overflow-hidden border-t border-brand/10 bg-card/60 px-6 py-12 text-text-muted sm:px-12 backdrop-blur-md">
	<!-- Decorative grid background background -->
	<div class="pointer-events-none absolute inset-0 opacity-[0.02] bg-[radial-gradient(var(--color-brand)_1px,transparent_1px)] bg-size-[16px_16px]"></div>
	<div class="pointer-events-none absolute -bottom-48 left-1/3 h-[400px] w-[400px] rounded-full bg-brand/5 blur-[100px]"></div>

	<div class="relative mx-auto max-w-7xl grid grid-cols-1 gap-8 lg:grid-cols-12">
		
		<!-- ─── LEFT PORTION: 3-COLUMN STRUCTURED TEXT & LOGOS (lg:col-span-8) ───── -->
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:col-span-8">
			
			<!-- Sub-Col 1: Canales Directos & Redes -->
			<div class="space-y-6">
				<div class="space-y-3">
					<h4 class="text-xs font-black uppercase tracking-[0.2em] text-brand font-display">Canales Directos</h4>
					<div class="space-y-2 text-sm font-semibold">
						<!-- Tel -->
						<a href="tel:+5699670021" class="flex items-center gap-2 text-text transition-colors duration-200 hover:text-brand-bright">
							<svg class="h-4 w-4 text-text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
								<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
							</svg>
							+56 9 9670021
						</a>
						<!-- WSP 1 -->
						<a href="https://wa.me/56997841809" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-text transition-colors duration-200 hover:text-brand-bright">
							<svg class="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
								<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
							</svg>
							+56 9 97841809
						</a>
						<!-- WSP 2 -->
						<a href="https://wa.me/56961157681" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 text-text transition-colors duration-200 hover:text-brand-bright">
							<svg class="h-4 w-4 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
								<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
							</svg>
							+56 9 61157681
						</a>
					</div>
				</div>

				<!-- Compact Social Links -->
				<div class="space-y-3">
					<h4 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Redes</h4>
					<div class="flex items-center gap-3">
						<a
							href="https://facebook.com/cetchilespa"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Facebook de CET Chile"
							class="flex h-9 w-9 items-center justify-center rounded-xl bg-input border border-brand/10 text-text transition-all duration-300 hover:border-brand-bright/40 hover:bg-brand/5 hover:text-brand"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
							</svg>
						</a>
						<a
							href="https://instagram.com/globalcet"
							target="_blank"
							rel="noopener noreferrer"
							aria-label="Instagram de GlobalCET"
							class="flex h-9 w-9 items-center justify-center rounded-xl bg-input border border-brand/10 text-text transition-all duration-300 hover:border-brand-bright/40 hover:bg-brand/5 hover:text-brand"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
								<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
								<line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
							</svg>
						</a>
						<a
							href="https://globalcet.cl"
							aria-label="Sitio web de GlobalCET"
							class="flex h-9 w-9 items-center justify-center rounded-xl bg-input border border-brand/10 text-text transition-all duration-300 hover:border-brand-bright/40 hover:bg-brand/5 hover:text-brand"
						>
							<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="12" cy="12" r="10" />
								<line x1="2" y1="12" x2="22" y2="12" />
								<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
							</svg>
						</a>
					</div>
				</div>

				<!-- Corporate Logos (Larger & Responsive) -->
				<div class="space-y-2 pt-3 border-t border-brand/10">
					<div class="flex items-center gap-3">
						<div class="flex items-center justify-center rounded-xl border border-brand/10 bg-white p-2.5 transition-all duration-300 hover:border-brand/30 hover:scale-105">
							<img src="/logo/logo2.avif" alt="CET Chile SpA" class="h-full w-full object-contain" />
						</div>
						<!-- <div class="flex items-center justify-center rounded-xl border border-brand/10 bg-white p-2.5 transition-all duration-300 hover:border-brand/30 hover:scale-105">
							<img src="/logo/logo.avif" alt="GlobalCET" class="h-full w-full object-contain" />
						</div> -->
					</div>
				</div>
			</div>

			<!-- Sub-Col 2: Facturación & Pedido -->
			<div class="space-y-6">
				<!-- Legal Info -->
				<div class="space-y-2">
					<h4 class="text-xs font-black uppercase tracking-[0.2em] text-brand font-display">Información</h4>
					<div class="space-y-1 text-sm text-text-muted font-medium leading-relaxed">
						<p class="text-text font-bold">CET Chile SpA</p>
						<p>R.U.T. / <strong class="text-text font-bold">76.537.375-6</strong></p>
						<p>Primera Transversal N° 6370</p>
						<p>San Miguel, Santiago</p>
					</div>
				</div>

				<!-- Facturación -->
				<div class="space-y-2">
					<h4 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Datos Facturación</h4>
					<div class="rounded-xl border border-brand/10 bg-input/20 p-4 space-y-2">
						<p class="text-xs text-text-muted leading-relaxed font-semibold">
							Si su Factura tiene datos erróneos, notifíquenos a:
						</p>
						<a href="mailto:contabilidad@globalcet.cl" class="block text-sm font-bold text-brand transition-colors duration-200 hover:text-brand-bright">
							contabilidad@globalcet.cl
						</a>
					</div>
				</div>

				<!-- Pedidos & Correos -->
				<div class="space-y-3">
					<div class="space-y-1">
						<span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Información del Pedido</span>
						<a href="mailto:bodega@globalcet.cl" class="block text-sm font-bold text-text transition-colors duration-200 hover:text-brand-bright">
							bodega@globalcet.cl
						</a>
					</div>
					<div class="space-y-1">
						<span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Soporte & Ventas</span>
						<ul class="space-y-1 text-sm font-semibold">
							<li><a href="mailto:ventas@globalcet.cl" class="text-text-muted hover:text-brand">ventas@globalcet.cl</a></li>
							<li><a href="mailto:contactoweb@globalcet.cl" class="text-text-muted hover:text-brand">contactoweb@globalcet.cl</a></li>
						</ul>
					</div>
				</div>
			</div>

			<!-- Sub-Col 3: Medios de Pago & Proveedor del Estado -->
			<div class="space-y-6">
				<!-- Payment info -->
				<div class="space-y-3 rounded-xl border border-brand/10 bg-input/40 p-4 shadow-sm">
					<div class="space-y-1">
						<h4 class="text-xs font-black uppercase tracking-[0.2em] text-brand font-display">Forma de Pago</h4>
						<div class="text-sm text-text-muted leading-relaxed font-semibold">
							<p class="text-text font-bold">Transferencia Electrónica</p>
							<p>Banco Estado — Chequera Electrónica</p>
							<p class="text-brand font-mono">N° 35770890118</p>
						</div>
					</div>
					<div class="border-t border-brand/5 pt-2 space-y-1">
						<span class="text-[10px] font-black uppercase tracking-wider text-slate-500">Comprobantes a:</span>
						<a href="mailto:finanzas@globalcet.cl" class="block text-sm font-bold text-brand transition-colors duration-200 hover:text-brand-bright">
							finanzas@globalcet.cl
						</a>
					</div>
				</div>

				<!-- State Provider (Larger image) -->
				<div class="space-y-2">
					<h4 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Estado</h4>
					<div class="inline-block overflow-hidden rounded-xl border border-brand/10 bg-white p-3 shadow-sm transition-all duration-300 hover:scale-[1.02] hover:border-brand/30 w-full ">
						<img src="/logo/proveedores.avif" alt="ChileCompra Proveedores del Estado" class="h-auto w-full object-contain" />
					</div>
				</div>
			</div>
		</div>

		<!-- ─── RIGHT PORTION: BANNER & QR SCAN (lg:col-span-4) ──────────────────── -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
			
			<!-- Differentiator Banner (Larger & Premium) -->
			<div class="group relative overflow-hidden rounded-2xl border border-brand/10 bg-input/30 p-1.5 shadow-sm transition-all duration-500 hover:border-brand/20 hover:shadow-card-hover">
				<div class="relative overflow-hidden rounded-xl bg-white ">
					<img
						src="/logo/global.avif"
						alt="GlobalCET - Ciencia, Educación, Tecnología"
						class="h-auto w-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
					/>
				</div>
				<div class="p-4 space-y-2">
					<h5 class="text-xs font-bold text-text tracking-wider uppercase">Ciencia Con Conciencia</h5>
					<p class="text-xs leading-relaxed text-text-muted font-medium">
						Sistemas integrados de alta pureza diseñados para mitigar el riesgo en investigación científica y docencia académica en Latinoamérica.
					</p>
				</div>
			</div>

			<!-- QR Code, Callout Direct & Layout Balance -->
			<div class="flex flex-col gap-4">
				<!-- Compact Somos Directos Callout -->
				<div class="rounded-xl border border-brand/10 bg-input/40 p-4 transition-all duration-300">
					<p class="text-xs font-black text-brand uppercase tracking-wider">¡Somos directos!</p>
					<p class="text-xs text-text-muted mt-1 leading-relaxed font-semibold">¿Proyecta implementar su laboratorio? Llámenos directamente.</p>
				</div>

				<!-- QR Code (Larger QR representation) -->
				<div class="flex items-center gap-4 rounded-xl border border-brand/10 bg-input/20 p-3">
					<div class="shrink-0 overflow-hidden rounded-lg bg-white p-2 border border-brand/10 shadow-sm">
						<img src="/logo/qr.avif" alt="Contacto WhatsApp QR" class="h-16 w-16 object-contain" />
					</div>
					<div class="space-y-1">
						<h5 class="text-[10px] font-black uppercase tracking-widest text-slate-500">Escanee Código QR</h5>
						<p class="text-xs leading-snug text-text-muted font-semibold">Enlace de comunicación rápida a soporte técnico y cotizaciones por WhatsApp.</p>
					</div>
				</div>
			</div>

		</div>
	</div>

	<!-- ─── Bottom copyright row ────────────────────────────────────────────────── -->
	<div class="mx-auto max-w-7xl mt-12 pt-6 border-t border-brand/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-black tracking-widest text-slate-500 uppercase">
		<p>© { new Date().getFullYear() } CET Chile SpA / GlobalCET. Todos los derechos reservados.</p>
		<p class="flex items-center gap-1.5">
        <span>Desarrollado por KevinKeyssx</span>
			<!-- <span>Hecho en Chile</span>
			<span class="inline-block h-3 w-4 rounded-sm bg-linear-to-r from-red-600 via-white to-blue-600"></span> -->
		</p>
	</div>
</footer>
