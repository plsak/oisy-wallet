<script lang="ts">
	import { erc20UserTokensNotInitialized } from '$eth/derived/erc20.derived';
	import IconManage from '$lib/components/icons/lucide/IconManage.svelte';
	import { MANAGE_TOKENS_MODAL_BUTTON } from '$lib/constants/test-ids.constants';
	import { authNotSignedIn } from '$lib/derived/auth.derived';
	import { pseudoNetworkICPTestnet } from '$lib/derived/network.derived';
	import { i18n } from '$lib/stores/i18n.store';
	import { modalStore } from '$lib/stores/modal.store';

	let disabled = $derived(
		$erc20UserTokensNotInitialized || $authNotSignedIn || $pseudoNetworkICPTestnet
	);

	const manageTokensId = $state(Symbol());
</script>

<button
	class="tertiary"
	data-tid={MANAGE_TOKENS_MODAL_BUTTON}
	onclick={() => modalStore.openManageTokens({ id: manageTokensId })}
	{disabled}
>
	<IconManage />
	{$i18n.tokens.manage.text.manage_list}
</button>
