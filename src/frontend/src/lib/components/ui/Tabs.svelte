<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { TabVariant } from '$lib/types/style';
	import type { NonEmptyArray } from '$lib/types/utils';

	interface Props {
		tabs: NonEmptyArray<{ label: string; id: string }>;
		activeTab: string;
		children?: Snippet;
		styleClass?: string;
		tabVariant?: TabVariant;
	}

	let {
		children,
		activeTab = $bindable(),
		tabs,
		styleClass,
		tabVariant = 'default'
	}: Props = $props();
</script>

<div class={`flex items-center ${styleClass ?? ''}`}>
	{#each tabs as { label, id }, index (id)}
		<button
			onclick={() => (activeTab = id)}
			aria-label={label}
			class="justify-center rounded-none border-0 text-sm font-semibold transition hover:border-brand-primary sm:text-base"
			class:ml-4={index !== 0}
			class:p-2={tabVariant === 'default'}
			class:w-full={tabVariant === 'default'}
			class:h-6={tabVariant === 'menu'}
			class:text-tertiary-inverted={activeTab !== id && tabVariant === 'default'}
			class:text-tertiary={activeTab !== id && tabVariant === 'menu'}
			class:border-b-2={activeTab === id || tabVariant === 'default'}
			class:border-primary={activeTab !== id}
			class:text-brand-primary={activeTab === id && tabVariant === 'default'}
			class:border-brand-primary={activeTab === id}
			class:hover:text-brand-primary={tabVariant === 'default'}
			class:hover:text-black={tabVariant === 'menu'}
		>
			{label}
		</button>
	{/each}
</div>

<div class="mt-6">
	{@render children?.()}
</div>
