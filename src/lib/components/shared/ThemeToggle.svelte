<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';

	interface Props {
		darkMode    : boolean;
		onToggle    : ( ) => void;
		variant?    : 'icon' | 'menuitem';
        className?  : string;
	}

	const {
        darkMode,
        onToggle,
        variant = 'icon',
        className = 'flex'
    }: Props = $props();
</script>

{#if ( variant === 'icon' ) }
	<button
		id         = "dark-mode-toggle"
		onclick    = { onToggle }
		aria-label = "Alternar modo oscuro"
		class      = "
			{ className } h-9 w-9 shrink-0 items-center justify-center rounded-lg
			border border-brand/20 bg-brand/10
			text-brand
			transition-all duration-300
			hover:bg-brand/25 hover:scale-105
		"
	>
		{#if ( darkMode ) }
			<Sun class="size-4.5" />
		{:else}
			<Moon class="size-4.5" />
		{/if}
	</button>
{:else}
	<button
		onclick    = { onToggle }
		aria-label = "Alternar modo oscuro"
		class      = "group { className } items-center gap-3 w-full text-left outline-none cursor-pointer"
	>
		<div class="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-brand/10 bg-brand/5 text-base group-hover:border-brand/20 group-hover:bg-brand/15 transition-all duration-200">
			{#if ( darkMode ) }
				<Moon class="size-4 text-brand" />
			{:else}
				<Sun class="size-4 text-brand" />
			{/if}
		</div>

		<div class="flex items-center gap-1.5 text-sm font-semibold text-text group-hover:text-brand transition-colors">
			{#if ( darkMode ) }
				Oscuro
			{:else}
				Brillante
			{/if}
		</div>
	</button>
{/if}
