<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import { i18n } from '$lib/stores/i18n.store';

	interface Props {
		onclick: () => void;
		disabled?: boolean;
		fullWidth?: boolean;
		testId?: string;
	}

	let { onclick, disabled = false, fullWidth = false, testId }: Props = $props();
</script>

<Button colorStyle="secondary-light" type="button" {disabled} {fullWidth} {testId} {onclick}>
	{$i18n.core.text.back}
</Button>
