<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();
</script>

<div role="toolbar" class="flex w-full justify-between gap-2">
	{@render children()}
</div>
