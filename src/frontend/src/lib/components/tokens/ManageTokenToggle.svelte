<script lang="ts">
	import { Toggle } from '@dfinity/gix-components';
	import { createEventDispatcher } from 'svelte';
	import type { EthereumUserToken } from '$eth/types/erc20-user-token';
	import type { Erc721TokenToggleable } from '$eth/types/erc721-token-toggleable';
	import { isDefaultEthereumToken } from '$eth/utils/eth.utils';
	import { MANAGE_TOKENS_MODAL_TOKEN_TOGGLE } from '$lib/constants/test-ids.constants';
	import { i18n } from '$lib/stores/i18n.store';
	import type { SplTokenToggleable } from '$sol/types/spl-token-toggleable';

	export let token: EthereumUserToken | SplTokenToggleable | Erc721TokenToggleable;
	export let testIdPrefix = MANAGE_TOKENS_MODAL_TOKEN_TOGGLE;

	let disabled = false;
	$: disabled = isDefaultEthereumToken(token);

	let checked: boolean;
	$: checked = token.enabled ?? false;

	const dispatch = createEventDispatcher();

	const toggle = () => {
		if (disabled) {
			return;
		}

		checked = !checked;

		dispatch('icShowOrHideToken', {
			...token,
			enabled: checked
		});
	};

	const onClick = () => {};
</script>

<!-- svelte-ignore a11y-interactive-supports-focus -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div role="button" on:click={onClick}>
	<Toggle
		ariaLabel={checked ? $i18n.tokens.text.hide_token : $i18n.tokens.text.show_token}
		testId={`${testIdPrefix}-${token.symbol}-${token.network.id.description}`}
		{disabled}
		bind:checked
		on:nnsToggle={toggle}
	/>
</div>
