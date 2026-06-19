<script lang="ts">
	import {
        PUBLIC_IMAGE_INDEX_1,
        PUBLIC_IMAGE_INDEX_2,
        PUBLIC_IMAGE_SUB_INDEX_1,
        PUBLIC_IMAGE_SUB_INDEX_2,
        PUBLIC_IMAGE_SUB_INDEX_3,
        PUBLIC_IMAGE_SUB_INDEX_4
    } from '$env/static/public';
</script>

<svelte:head>
	<title>GlobalCET | CET | Insumos y Material de Laboratorio de Ciencias y Educación</title>
	<meta name="description" content="Suministro de reactivos de alta pureza, material de vidrio certificado y laboratorios móviles en Chile. Soluciones de vanguardia para educación y ciencia con el respaldo de CET Chile SpA / GlobalCET." />
	<script type="application/ld+json">
		{
			"@context"		: "https://schema.org",
			"@type"			: "Organization",
			"name"			: "GlobalCET",
			"alternateName"	: "CET",
			"legalName"		: "CET Chile SpA",
			"url"			: "https://globalcet.cl",
			"logo"			: "https://globalcet.cl/logo/logo2.avif",
			"description"	: "Reactivos de alta pureza, material de vidrio certificado de borosilicato, kits didácticos y laboratorios móviles para educación en Chile.",
			"address"		: {
				"@type"				: "PostalAddress",
				"streetAddress"		: "Primera Transversal N° 6370",
				"addressLocality"	: "San Miguel",
				"addressRegion"		: "Santiago",
				"addressCountry"	: "CL"
			},
			"contactPoint"	: {
				"@type"			: "ContactPoint",
				"telephone"		: "+56-9-9784-1809",
				"contactType"	: "ventas"
			}
		}
	</script>
</svelte:head>

<main class="relative min-h-screen overflow-hidden">
	<!-- ─── Dynamic background elements ────────────────────────────────────────── -->
	<div class="pointer-events-none absolute -top-40 -left-20 h-[600px] w-[600px] rounded-full bg-brand/5 blur-[120px] dark:bg-brand/10"></div>
	<div class="pointer-events-none absolute top-1/3 -right-20 h-[500px] w-[500px] rounded-full bg-brand-bright/5 blur-[100px] dark:bg-brand-bright/8"></div>
	<div class="pointer-events-none absolute bottom-10 left-1/4 h-[400px] w-[400px] rounded-full bg-brand/5 blur-[90px]"></div>

	<!-- ─── Hero Section ───────────────────────────────────────────────────────── -->
	<section class="relative mx-auto max-w-7xl px-6 pt-24 pb-16 sm:px-8 lg:pt-32 lg:pb-24">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 lg:items-center">
			<!-- Hero Text -->
			<div class="space-y-8 lg:col-span-7">
				<!-- Brand Pill -->
				<span class="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-surface px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand backdrop-blur-md shadow-card">
					<span class="relative flex h-2 w-2">
						<span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>

                        <span class="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
					</span>

                    Innovación Científica
				</span>

				<div class="space-y-4">
					<h1 class="font-display text-4xl font-extrabold tracking-tight text-text sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
						Ciencia

                        <br />

                        <span class="bg-linear-to-r from-brand via-brand-bright to-emerald-400 bg-clip-text text-transparent drop-shadow-sm">
							Educación & Tecnología
						</span>
					</h1>

                    <p class="max-w-2xl text-base font-medium leading-relaxed text-text-muted sm:text-lg">
                        Completo Equipamiento para sus laboratorios de ciencias: Física, Química, Biología. Con innovación en Laboratorios Móviles, Nodo Lab. Estación Descubrimiento Móvil, dirigidos a Educación Cientifica , Técnica.
					</p>
				</div>

				<!-- Hero CTA Actions -->
				<div class="flex flex-wrap items-center gap-4">
					<a
						id="hero-cta-catalog"
						href="/catalog"
						class="
							rounded-xl bg-brand px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-surface-dark
							shadow-card transition-all duration-300
							hover:-translate-y-0.5 hover:bg-brand-bright hover:shadow-lg
						"
					>
						Ir a la Tienda
					</a>

                    <a
						id="hero-cta-about"
						href="#features"
						class="
							rounded-xl border border-brand/20 bg-surface/30 px-6 py-3.5 text-sm font-bold uppercase tracking-wider text-brand
							backdrop-blur-sm transition-all duration-300
							hover:-translate-y-0.5 hover:bg-brand/10 hover:border-brand/45
						"
					>
						Nuestra Propuesta
					</a>
				</div>

				<!-- Trust Elements -->
				<div class="pt-6 border-t border-brand/10">
					<div class="grid grid-cols-3 gap-6">
						<div>
							<p class="text-xl font-bold text-text font-display">100%</p>
							<p class="text-xs font-semibold text-text-muted uppercase tracking-wider">Pureza Certificada</p>
						</div>

                        <div>
							<p class="text-xl font-bold text-text font-display">ISO 9001</p>
							<p class="text-xs font-semibold text-text-muted uppercase tracking-wider">Estándar Global</p>
						</div>

                        <div>
							<p class="text-xl font-bold text-text font-display">(OA)</p>
							<p class="text-xs font-semibold text-text-muted uppercase tracking-wider">Objetivos de apredizaje</p>
						</div>

                        <div>
							<p class="text-xl font-bold text-text font-display">(PME)</p>
							<p class="text-xs font-semibold text-text-muted uppercase tracking-wider">Procesos de mejora continúa, fortalecimiento de aprendizaje de los estudiante</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Animated Molecular / Bio Illustration (SVG) -->
			<div class="flex justify-center lg:col-span-5 lg:mb-32">
				<div class="relative w-full max-w-md aspect-square flex items-center justify-center">
					<!-- Glow behind -->
					<div class="absolute inset-0 bg-brand/10 rounded-full blur-3xl animate-pulse"></div>

					<!-- Native SVG Molecular Structure representation -->
                    <img src="/logo/logo.avif" alt="GlobalCET" class="h-full w-full object-contain" />

					<!-- floating badges -->
					<div class="absolute -top-6 -right-2 bg-card border border-brand/20 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider text-brand shadow-card backdrop-blur-sm animate-bounce duration-4000">
						H2O + Reactivos
					</div>

                    <div class="absolute -bottom-4 -left-6 bg-card border border-brand/20 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-wider text-brand-bright shadow-card backdrop-blur-sm animate-bounce duration-3000" style="animation-delay: 1.5s;">
						Purity level &gt; 99.9%
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ─── Interactive Hero Banner Showcase ─────────────────────────────────── -->
	<section class="relative mx-auto max-w-7xl px-6 py-6 sm:px-8">
		<div class="relative overflow-hidden rounded-3xl border border-brand/15 bg-card/40 shadow-card backdrop-blur-md group">
			<div class="absolute inset-0 bg-black/20 z-10 transition-opacity duration-500 group-hover:bg-black/35"></div>
			<img src={ PUBLIC_IMAGE_INDEX_1 } alt="Equipamiento Científico Avanzado" class="w-full h-80 sm:h-96 object-cover transition-transform duration-700 group-hover:scale-105" />
			<div class="absolute inset-0 z-20 flex flex-col justify-end p-8 sm:p-12 space-y-4 max-w-2xl">
				<span class="self-start rounded-full bg-brand/20 border border-brand/35 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-brand-bright backdrop-blur-md shadow-card">
					Calidad Certificada
				</span>
				<h2 class="font-display text-2xl font-black text-white sm:text-4xl drop-shadow-md leading-tight">
					Soluciones Científicas para el Aula & Investigación
				</h2>
				<p class="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed drop-shadow-sm">
					Suministros de precisión, reactivos certificados y herramientas didácticas diseñadas para potenciar el aprendizaje técnico profesional.
				</p>
				<a href="/catalog" class="self-start rounded-xl bg-brand px-6 py-3.5 text-xs font-black uppercase tracking-wider text-surface-dark shadow-card transition-all duration-300 hover:scale-105 hover:bg-brand-bright">
					Ver Catálogo Completo
				</a>
			</div>
		</div>
	</section>

	<!-- ─── Categorías Destacadas Section ──────────────────────────────────────── -->
	<section class="relative mx-auto max-w-7xl px-6 py-12 sm:px-8">
		<div class="mx-auto max-w-3xl text-center space-y-4 mb-12">
			<span class="text-xs font-black uppercase tracking-[0.25em] text-brand-bright">Explora por Categorías</span>
			<h2 class="font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
				Equipamiento Científico Destacado
			</h2>
			<p class="text-base text-text-muted max-w-xl mx-auto">
				Selecciona una de nuestras áreas principales para encontrar suministros y materiales específicos de alta calidad.
			</p>
		</div>

		<!-- Grid for Categories -->
		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<!-- Tarjeta 1: Reactivos -->
			<a href="/catalog?tab=productos&query=Reactivo" class="group relative block overflow-hidden rounded-3xl border border-brand/10 bg-card h-80 shadow-card transition-all duration-500 hover:scale-[1.02] hover:border-brand/30 hover:shadow-card-hover">
				<div class="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent z-10"></div>
				<img src={PUBLIC_IMAGE_SUB_INDEX_1} alt="Reactivos Químicos" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
				<div class="absolute inset-0 z-20 flex flex-col justify-end p-6 space-y-3">
					<h3 class="font-display text-xl font-bold text-white group-hover:text-brand transition-colors">
						Reactivos
					</h3>
					<p class="text-xs text-slate-200 leading-relaxed font-medium">
						Reactivos químicos de alta pureza y grado analítico para laboratorios.
					</p>
					<span class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand group-hover:underline">
						Ir a la categoría
						<svg class="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</span>
				</div>
			</a>

			<!-- Tarjeta 2: Ácidos -->
			<a href="/catalog?tab=productos&query=Ácido" class="group relative block overflow-hidden rounded-3xl border border-brand/10 bg-card h-80 shadow-card transition-all duration-500 hover:scale-[1.02] hover:border-brand/30 hover:shadow-card-hover">
				<div class="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent z-10"></div>
				<img src={PUBLIC_IMAGE_SUB_INDEX_2} alt="Ácidos Químicos" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
				<div class="absolute inset-0 z-20 flex flex-col justify-end p-6 space-y-3">
					<h3 class="font-display text-xl font-bold text-white group-hover:text-brand transition-colors">
						Ácidos
					</h3>
					<p class="text-xs text-slate-200 leading-relaxed font-medium">
						Ácidos de grado analítico PA y reactivos de alta precisión y seguridad.
					</p>
					<span class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand group-hover:underline">
						Ir a la categoría
						<svg class="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</span>
				</div>
			</a>

			<!-- Tarjeta 3: Vidrio -->
			<a href="/catalog?tab=productos&query=Vidrio" class="group relative block overflow-hidden rounded-3xl border border-brand/10 bg-card h-80 shadow-card transition-all duration-500 hover:scale-[1.02] hover:border-brand/30 hover:shadow-card-hover">
				<div class="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent z-10"></div>
				<img src={PUBLIC_IMAGE_SUB_INDEX_3} alt="Material de Vidrio" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
				<div class="absolute inset-0 z-20 flex flex-col justify-end p-6 space-y-3">
					<h3 class="font-display text-xl font-bold text-white group-hover:text-brand transition-colors">
						Vidrio
					</h3>
					<p class="text-xs text-slate-200 leading-relaxed font-medium">
						Material de vidrio de borosilicato 3.3 resistente a choques térmicos.
					</p>
					<span class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand group-hover:underline">
						Ir a la categoría
						<svg class="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</span>
				</div>
			</a>

			<!-- Tarjeta 4: Plástico -->
			<a href="/catalog?tab=productos&query=Plástico" class="group relative block overflow-hidden rounded-3xl border border-brand/10 bg-card h-80 shadow-card transition-all duration-500 hover:scale-[1.02] hover:border-brand/30 hover:shadow-card-hover">
				<div class="absolute inset-0 bg-linear-to-t from-black/55 via-black/20 to-transparent z-10"></div>
				<img src={PUBLIC_IMAGE_SUB_INDEX_4} alt="Material de Plástico" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
				<div class="absolute inset-0 z-20 flex flex-col justify-end p-6 space-y-3">
					<h3 class="font-display text-xl font-bold text-white group-hover:text-brand transition-colors">
						Plástico
					</h3>
					<p class="text-xs text-slate-200 leading-relaxed font-medium">
						Materiales y utensilios plásticos graduados de alta resistencia.
					</p>
					<span class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand group-hover:underline">
						Ir a la categoría
						<svg class="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
							<polyline points="9 18 15 12 9 6"></polyline>
						</svg>
					</span>
				</div>
			</a>
		</div>
	</section>

	<!-- ─── Core Pillars Section (Features Grid) ───────────────────────────────── -->
	<section id="features" class="relative border-t border-brand/10 bg-surface/10 px-6 py-20 lg:py-28">
		<div class="mx-auto max-w-7xl">
			<!-- Section Header -->
			<div class="mx-auto max-w-3xl text-center space-y-4 mb-16">
				<h2 class="text-xs font-black uppercase tracking-[0.25em] text-brand">Nuestras Divisiones</h2>
				<p class="font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
					Sistemas Integrados para el Progreso Científico
				</p>
				<p class="text-base text-text-muted max-w-xl mx-auto">
					Desarrollamos, distribuimos insumos bajo los controles de calidad más rigurosos del sector del área de la ciencia.
				</p>
			</div>

			<!-- Features Cards Grid -->
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<!-- Pillar 1: Equipos & Reactivos -->
				<article class="
					group relative flex flex-col justify-between overflow-hidden rounded-2xl
					border border-brand/10 bg-card p-8
					shadow-card transition-all duration-300
					hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover
				">
					<div class="space-y-6">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-surface-dark">
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<path d="M4.5 16.5c-1.5 1.25-2.5 3-2.5 4.5h20c0-1.5-1-3.25-2.5-4.5" />
								<path d="M12 2v16M9 8h6M8 12h8" />
								<path d="M12 2C8 6 6.5 10 6.5 15c0 .5 0 1 .5 1.5M12 2c4 4 5.5 8 5.5 13 0 .5 0 1-.5 1.5" />
							</svg>
						</div>
						<div class="space-y-2">
							<h3 class="font-display text-xl font-bold text-text transition-colors duration-200 group-hover:text-brand">Material & Reactivos</h3>
							<p class="text-sm leading-relaxed text-text-muted">
								Material de vidrio (Borosilicato 3.3). Instrumentos de medición y análisis, Reactivos Técnicos y PA para sus laboratorios.
							</p>
						</div>
					</div>
					<div class="mt-8 border-t border-brand/5 pt-4">
						<a href="/catalog?tab=productos" class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand group-hover:underline">
							Ver Equipos
							<svg class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
								<polyline points="9 18 15 12 9 6"></polyline>
							</svg>
						</a>
					</div>
				</article>

				<!-- Pillar 2: Kits Moleculares -->
				<article class="
					group relative flex flex-col justify-between overflow-hidden rounded-2xl
					border border-brand/10 bg-card p-8
					shadow-card transition-all duration-300
					hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover
				">
					<div class="space-y-6">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-bright/10 text-brand-bright transition-all duration-300 group-hover:bg-brand-bright group-hover:text-surface-dark">
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="3" y="3" width="7" height="9" rx="1" />
								<rect x="14" y="3" width="7" height="5" rx="1" />
								<rect x="14" y="12" width="7" height="9" rx="1" />
								<rect x="3" y="16" width="7" height="5" rx="1" />
							</svg>
						</div>

                        <div class="space-y-2">
							<h3 class="font-display text-xl font-bold text-text transition-colors duration-200 group-hover:text-brand">Kits de laboratorios</h3>

                            <p class="text-sm leading-relaxed text-text-muted">
                                Herramientas pedagógicas, ideales para el aula, diseñadas para transformar la teoría en experimentos prácticos mediente la metodología (ciencia y tecnología).
							</p>
						</div>
					</div>

                    <div class="mt-8 border-t border-brand/5 pt-4">
						<a href="/catalog?tab=kits" class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-bright group-hover:underline">
							Ver Kits
							<svg class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
								<polyline points="9 18 15 12 9 6"></polyline>
							</svg>
						</a>
					</div>
				</article>

				<!-- Pillar 3: Laboratorios Móviles -->
				<article class="
					group relative flex flex-col justify-between overflow-hidden rounded-2xl
					border border-brand/10 bg-card p-8
					shadow-card transition-all duration-300
					hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover
				">
					<div class="space-y-6">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-surface-dark">
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="2" y="3" width="20" height="14" rx="2" />
								<line x1="8" y1="21" x2="16" y2="21" />
								<line x1="12" y1="17" x2="12" y2="21" />
							</svg>
						</div>

                        <div class="space-y-2">
							<h3 class="font-display text-xl font-bold text-text transition-colors duration-200 group-hover:text-brand">Laboratorios Móviles</h3>

                            <p class="text-sm leading-relaxed text-text-muted">
                                Instalación completamente equipada, la cual se desplaza hacia diferentes puntos, para realizar análisis, ensayos o actividades educativas. Consiste en un carro tecnológico diseñado para moverse dentro del recinto. Cualquier lugar se convierte en ciencia.
							</p>
						</div>
					</div>

                    <div class="mt-8 border-t border-brand/5 pt-4">
						<a href="/catalog?tab=lab-movil" class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand group-hover:underline">
							Ver Laboratorios

                            <svg class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
								<polyline points="9 18 15 12 9 6"></polyline>
							</svg>
						</a>
					</div>
				</article>

                <article class="
					group relative flex flex-col justify-between overflow-hidden rounded-2xl
					border border-brand/10 bg-card p-8
					shadow-card transition-all duration-300
					hover:-translate-y-1 hover:border-brand/30 hover:shadow-card-hover
				">
					<div class="space-y-6">
						<div class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-surface-dark">
							<svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
								<rect x="2" y="3" width="20" height="14" rx="2" />
								<line x1="8" y1="21" x2="16" y2="21" />
								<line x1="12" y1="17" x2="12" y2="21" />
							</svg>
						</div>

                        <div class="space-y-2">
							<h3 class="font-display text-xl font-bold text-text transition-colors duration-200 group-hover:text-brand">Nodo Labs</h3>

                            <p class="text-sm leading-relaxed text-text-muted">
                                Son iniciativas cientificas, educativas. Laboratorios de educación digital y prototipado rápido hacia la educación para potenciar la innovación y la formatión técnico prefesional. Posee equipamiento de punta, con enfoque pedagógico para problemas reales en su entorno mediante la tecnología.
                            </p>
						</div>
					</div>

                    <div class="mt-8 border-t border-brand/5 pt-4">
						<a href="/catalog?labCategories=01KSDXKN292Y324D0XM197HN15" class="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand group-hover:underline">
							Ver NodoLabs

                            <svg class="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
								<polyline points="9 18 15 12 9 6"></polyline>
							</svg>
						</a>
					</div>
				</article>
			</div>
		</div>
	</section>

	<!-- ─── Interactive Search CTA Banner ──────────────────────────────────────── -->
	<section class="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:py-20">
		<div class="relative overflow-hidden rounded-3xl border border-brand/15 bg-card/40 px-8 py-12 shadow-card backdrop-blur-md lg:px-16 lg:py-16">
			<!-- Grid Background inside Card -->
			<div class="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_center,var(--color-brand)_0%,transparent_75%)]"></div>

			<div class="relative grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
				<div class="lg:col-span-7 space-y-4">
					<h3 class="font-display text-2xl font-extrabold tracking-tight text-text sm:text-3xl">
						¿Buscas un reactivo, insumo o equipo específico?
					</h3>
					<p class="text-sm leading-relaxed text-text-muted">
						Accede a nuestro buscador avanzado con filtros integrados y cotizador automatizado. Encuentra especificaciones químicas de precisión, dimensiones de laboratorios y componentes de kits al instante.
					</p>
				</div>
				<div class="flex flex-col sm:flex-row gap-4 lg:col-span-5 lg:justify-end">
					<a
						id="cta-search-explore"
						href="/catalog"
						class="
							inline-flex items-center justify-center rounded-xl bg-brand px-6 py-4 text-xs font-black uppercase tracking-wider text-surface-dark
							shadow-card transition-all duration-300
							hover:-translate-y-0.5 hover:bg-brand-bright
						"
					>
						Abrir Buscador Inteligente
					</a>

                    <a
						id="cta-search-contact"
						href="#app-footer"
						class="
							inline-flex items-center justify-center rounded-xl border border-brand/20 bg-surface/30 px-6 py-4 text-xs font-black uppercase tracking-wider text-brand
							backdrop-blur-sm transition-all duration-300
							hover:-translate-y-0.5 hover:bg-brand/10
						"
					>
						Contáctanos
					</a>
				</div>
			</div>
		</div>
	</section>

	<!-- ─── Secondary Showcase Banner ─────────────────────────────────────────── -->
	<section class="relative mx-auto max-w-7xl px-6 py-6 sm:px-8">
		<div class="relative overflow-hidden rounded-3xl border border-brand/15 bg-card/40 shadow-card backdrop-blur-md group">
			<div class="absolute inset-0 bg-black/10 dark:bg-black/40 z-10 transition-opacity duration-500 group-hover:bg-black/35"></div>
			<img src={ PUBLIC_IMAGE_INDEX_2 } alt="Laboratorios de Vanguardia" class="w-full h-72 sm:h-80 object-cover transition-transform duration-700 group-hover:scale-105" />
			<div class="absolute inset-0 z-20 flex flex-col justify-end p-8 sm:p-12 space-y-3 max-w-xl">
				<span class="self-start rounded-full bg-brand/20 border border-brand/35 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white backdrop-blur-md shadow-card">
					Sistemas Modulares
				</span>
				<h3 class="font-display text-xl font-black text-white sm:text-3xl drop-shadow-md leading-tight">
					Infraestructura Educativa del Futuro
				</h3>
				<p class="text-xs text-slate-200 font-medium leading-relaxed drop-shadow-sm">
					Transformamos cualquier espacio en un centro de experimentación científica autónomo e interactivo.
				</p>
			</div>
		</div>
	</section>

	<!-- ─── Value Proposition Section ────────────────────────────────────────── -->
	<section class="border-t border-brand/10 px-6 py-20 lg:py-28">
		<div class="mx-auto max-w-7xl">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20 lg:items-center">
				<!-- Column text -->
				<div class="space-y-8">
					<div class="space-y-4">
						<span class="text-xs font-black uppercase tracking-[0.25em] text-brand-bright">Calidad Sin Concesiones</span>
						<h2 class="font-display text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
							El Estándar Científicos de GlobalCET
						</h2>
						<p class="text-base leading-relaxed text-text-muted">
							En el mundo de la ciencia, la precisión no es opcional. Un mínimo error de pureza en un reactivo o una desviación térmica en un contenedor puede alterar meses de investigación. En GlobalCET, mitigamos el riesgo científico.
						</p>
					</div>

					<div class="space-y-6">
						<!-- Point 1 -->
						<div class="flex items-start gap-4">
							<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</div>

                            <div class="space-y-1">
								<h4 class="font-bold text-text text-sm">Control de Pureza Análisis</h4>
								<p class="text-xs text-text-muted leading-relaxed">Cada Lote de Reactivos cuenta con su Certificación.</p>
							</div>
						</div>

						<!-- Point 2 -->
						<div class="flex items-start gap-4">
							<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</div>
							<div class="space-y-1">
								<h4 class="font-bold text-text text-sm">Borosilicato 3.3 de Precisión</h4>
								<p class="text-xs text-text-muted leading-relaxed">Materiales de vidrio diseñados para resistir shocks térmicos elevados y resistir la corrosión ácida.</p>
							</div>
						</div>

						<!-- Point 3 -->
						<div class="flex items-start gap-4">
							<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
								<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
									<polyline points="20 6 9 17 4 12"></polyline>
								</svg>
							</div>
							<div class="space-y-1">
								<h4 class="font-bold text-text text-sm">Diseño de Ingeniería de Campo</h4>
								<p class="text-xs text-text-muted leading-relaxed">Laboratorios y kits validados por biólogos y químicos expertos para asegurar su usabilidad.</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Column illustration (SVG chemistry laboratory flask detail) -->
				<div class="flex justify-center">
					<div class="relative w-full max-w-sm aspect-square bg-card border border-brand/10 rounded-3xl shadow-card p-8 flex items-center justify-center overflow-hidden">
						<!-- Decorative chemistry grids -->
						<div class="absolute inset-0 opacity-[0.03] bg-[radial-gradient(var(--color-brand)_1px,transparent_1px)] bg-size-[16px_16px]"></div>

						<!-- flask animated SVG -->
						<svg
							class="w-3/5 h-3/5 text-brand"
							viewBox="0 0 200 200"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<!-- Flask Body -->
							<path
								d="M100 40 L100 80 L60 160 C50 180 65 190 85 190 L115 190 C135 190 150 180 140 160 L100 80 Z"
								stroke="currentColor"
								stroke-width="5"
								stroke-linejoin="round"
								stroke-linecap="round"
							/>
							<line x1="85" y1="40" x2="115" y2="40" stroke="currentColor" stroke-width="6" stroke-linecap="round" />

							<!-- Liquid Level (animated/filled SVG) -->
							<path
								d="M75 130 L125 130 L135 150 C140 160 135 170 120 170 L80 170 C65 170 60 160 65 150 Z"
								fill="var(--color-brand-bright)"
								class="opacity-40"
							/>
							<path
								d="M75 130 C85 125 95 135 105 130 C115 125 120 132 125 130"
								stroke="var(--color-brand-bright)"
								stroke-width="3"
								stroke-linecap="round"
							/>

							<!-- Floating Bubbles -->
							<circle cx="100" cy="110" r="4" fill="var(--color-brand)" class="animate-bounce" />
							<circle cx="90" cy="95" r="3" fill="var(--color-brand-bright)" class="animate-bounce" style="animation-delay: 0.5s;" />
							<circle cx="112" cy="100" r="5" fill="var(--color-brand)" class="animate-bounce" style="animation-delay: 1s;" />
							<circle cx="100" cy="70" r="2.5" fill="currentColor" class="animate-pulse" />

							<!-- Measurement tick marks -->
							<line x1="90" y1="150" x2="105" y2="150" stroke="currentColor" stroke-width="2" class="opacity-60" />
							<line x1="94" y1="130" x2="106" y2="130" stroke="currentColor" stroke-width="2" class="opacity-60" />
							<line x1="98" y1="110" x2="102" y2="110" stroke="currentColor" stroke-width="2" class="opacity-60" />
						</svg>
					</div>
				</div>
			</div>
		</div>
	</section>
</main>
