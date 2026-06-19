<script lang="ts">
	import { Menubar }  from 'bits-ui';
	import { Menu }     from '@lucide/svelte';
	import { fade }     from 'svelte/transition';

	import {
        navItems,
        ourItems
    }                   from './navItems';
    import ThemeToggle  from '$lib/components/shared/ThemeToggle.svelte';

	// ─── Props ────────────────────────────────────────────────────────────────────
	interface Props {
		darkMode : boolean;
		onToggle : ( ) => void;
	}

	const { darkMode, onToggle }: Props = $props();
</script>

<Menubar.Root class="md:hidden">
	<Menubar.Menu>
		<Menubar.Trigger
			id    = "mobile-menu-trigger"
			class = "
				flex h-9 w-9 shrink-0 items-center justify-center rounded-lg
				border border-brand/20 bg-brand/10
				text-brand
				transition-all duration-300
				hover:bg-brand/25 hover:scale-105
				data-[state=open]:bg-brand/25
				outline-none cursor-pointer
			"
		>
			<Menu class="size-5" />
		</Menubar.Trigger>

		<Menubar.Portal>
			<Menubar.Content
				class="z-50 focus:outline-none"
				align="end"
				sideOffset={ 8 }
			>
				<div
					transition:fade={ { duration : 150 } }
					class="mobile-menu-content w-[250px] rounded-2xl border border-brand/15 bg-card/95 backdrop-blur-xl shadow-card-hover p-2 space-y-1"
				>
					<!-- 1. Catálogo -->
					<Menubar.Item
						class="group rounded-xl px-4 py-2.5 text-sm font-semibold text-text-muted hover:text-brand transition-all duration-300 focus:bg-brand/10 focus:text-brand focus:outline-none"
					>
						<a href="/catalog" class="block w-full text-left">
							Ir a Tienda
						</a>
					</Menubar.Item>

					<Menubar.Separator class="my-1 h-px bg-brand/10" />

					<!-- 2. Nosotros Section Header -->
					<div class="px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-brand/80">
						Nosotros
					</div>

					<!-- Nosotros Items -->
					{#each ourItems as item ( item.title ) }
						<Menubar.Item
							class="group rounded-xl py-2 pl-6 pr-3 hover:bg-brand/5 dark:hover:bg-brand/10 transition-all duration-200 focus:bg-brand/5 dark:focus:bg-brand/10 focus:outline-none"
						>
							<a
								href  = { item.href }
								class = "group flex items-center gap-3 w-full"
							>
								{#if ( item.icon ) }
									<div class="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-brand/10 bg-brand/5 text-base group-hover:border-brand/20 group-hover:bg-brand/15 transition-all duration-200">
										{ item.icon }
									</div>
								{/if}

								<div class="flex items-center gap-1.5 text-sm font-semibold text-text group-hover:text-brand transition-colors">
									{ item.title }
									<!-- Sliding mini arrow -->
									<svg
										class          = "h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand"
										viewBox        = "0 0 24 24"
										fill           = "none"
										stroke         = "currentColor"
										stroke-width   = "3"
										stroke-linecap = "round"
									>
										<line x1="5" y1="12" x2="19" y2="12"></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
							</a>
						</Menubar.Item>
					{/each}

					<Menubar.Separator class="my-1 h-px bg-brand/10" />

					<!-- 3. Antecedentes Section Header -->
					<div class="px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-brand/80">
						Antecedentes
					</div>

					<!-- Antecedentes Items -->
					{#each navItems as item ( item.title ) }
						<Menubar.Item
							class="group rounded-xl py-2 pl-6 pr-3 hover:bg-brand/5 dark:hover:bg-brand/10 transition-all duration-200 focus:bg-brand/5 dark:focus:bg-brand/10 focus:outline-none"
						>
							<a
								href  = { item.href }
								class = "group flex items-center gap-3 w-full"
							>
								{#if ( item.icon ) }
									<div class="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-brand/10 bg-brand/5 text-base group-hover:border-brand/20 group-hover:bg-brand/15 transition-all duration-200">
										{ item.icon }
									</div>
								{/if}

								<div class="flex items-center gap-1.5 text-sm font-semibold text-text group-hover:text-brand transition-colors">
									{ item.title }
									<!-- Sliding mini arrow -->
									<svg
										class          = "h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-brand"
										viewBox        = "0 0 24 24"
										fill           = "none"
										stroke         = "currentColor"
										stroke-width   = "3"
										stroke-linecap = "round"
									>
										<line x1="5" y1="12" x2="19" y2="12"></line>
										<polyline points="12 5 19 12 12 19"></polyline>
									</svg>
								</div>
							</a>
						</Menubar.Item>
					{/each}

					<Menubar.Separator class="my-1 h-px bg-brand/10" />

					<!-- 4. Tema (Modo Oscuro/Claro) -->
					<Menubar.Item
						class="group rounded-xl py-2 pl-6 pr-3 hover:bg-brand/5 dark:hover:bg-brand/10 transition-all duration-200 focus:bg-brand/5 dark:focus:bg-brand/10 focus:outline-none"
					>
						<ThemeToggle variant="menuitem" { darkMode } { onToggle } />
					</Menubar.Item>
				</div>
			</Menubar.Content>
		</Menubar.Portal>
	</Menubar.Menu>
</Menubar.Root>

<style>
	:global(.mobile-menu-content) {
		border           : 1px solid color-mix( in srgb, var( --color-brand ) 15%, transparent ) !important;
		background-color : color-mix( in srgb, var( --color-card ) 95%, transparent ) !important;
		backdrop-filter  : blur( 24px ) !important;
		box-shadow       : var( --shadow-card-hover ) !important;
	}
</style>
