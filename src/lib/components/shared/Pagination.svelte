<script lang="ts">
	import { Pagination as BitsPagination } from 'bits-ui';
	import { ChevronLeft, ChevronRight }  from '@lucide/svelte';

	interface Props {
		count   : number;
		perPage : number;
		page    : number;
	}

	let {
		count,
		perPage,
		page = $bindable( 1 ),
	}: Props = $props();
</script>

<BitsPagination.Root
	{ count }
	{ perPage }
	bind:page={ page }
>
	{#snippet children( { pages } )}
		<div class="flex items-center justify-center gap-2 mt-8">
			<BitsPagination.PrevButton
				class="
					inline-flex h-9 w-9 items-center justify-center rounded-xl
					border border-brand/10 bg-surface/30 text-text
					transition-all duration-300
					hover:bg-brand/10 hover:text-brand
					disabled:pointer-events-none disabled:opacity-40
				"
			>
				<ChevronLeft class="size-4" />
			</BitsPagination.PrevButton>

			{#each pages as p ( p.key )}
				{#if p.type === 'ellipsis'}
					<span class="inline-flex h-9 w-9 items-center justify-center text-xs font-bold text-text-muted">...</span>
				{:else}
					<BitsPagination.Page
						page={ p }
						class="
							inline-flex h-9 w-9 items-center justify-center rounded-xl
							border border-brand/10 bg-surface/30 text-xs font-bold text-text-muted
							transition-all duration-300
							hover:bg-brand/10 hover:text-brand
							data-selected:bg-brand data-selected:text-surface-dark data-selected:border-brand data-selected:shadow-md
						"
					>
						{ p.value }
					</BitsPagination.Page>
				{/if}
			{/each}

			<BitsPagination.NextButton
				class="
					inline-flex h-9 w-9 items-center justify-center rounded-xl
					border border-brand/10 bg-surface/30 text-text
					transition-all duration-300
					hover:bg-brand/10 hover:text-brand
					disabled:pointer-events-none disabled:opacity-40
				"
			>
				<ChevronRight class="size-4" />
			</BitsPagination.NextButton>
		</div>
	{/snippet}
</BitsPagination.Root>
