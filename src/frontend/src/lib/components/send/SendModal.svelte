<script lang="ts">
	import { WizardModal, type WizardStep, type WizardSteps } from '@dfinity/gix-components';
	import { createEventDispatcher, setContext } from 'svelte';
	import { enabledErc20Tokens } from '$eth/derived/erc20.derived';
	import { enabledEthereumTokens } from '$eth/derived/tokens.derived';
	import { decodeQrCode as decodeQrCodeETH } from '$eth/utils/qr-code.utils';
	import SendDestinationWizardStep from '$lib/components/send/SendDestinationWizardStep.svelte';
	import SendQrCodeScan from '$lib/components/send/SendQrCodeScan.svelte';
	import SendTokenContext from '$lib/components/send/SendTokenContext.svelte';
	import SendTokensList from '$lib/components/send/SendTokensList.svelte';
	import SendWizard from '$lib/components/send/SendWizard.svelte';
	import ModalNetworksFilter from '$lib/components/tokens/ModalNetworksFilter.svelte';
	import { allSendWizardSteps, sendWizardStepsWithQrCodeScan } from '$lib/config/send.config';
	import { SEND_TOKENS_MODAL } from '$lib/constants/test-ids.constants';
	import {
		btcAddressMainnetNotLoaded,
		ethAddressNotLoaded,
		btcAddressRegtestNotLoaded,
		btcAddressTestnetNotLoaded,
		solAddressLocalnetNotLoaded,
		solAddressDevnetNotLoaded,
		solAddressMainnetNotLoaded
	} from '$lib/derived/address.derived';
	import { selectedNetwork } from '$lib/derived/network.derived';
	import { enabledTokens } from '$lib/derived/tokens.derived';
	import { ProgressStepsSend } from '$lib/enums/progress-steps';
	import { WizardStepsSend } from '$lib/enums/wizard-steps';
	import { waitWalletReady } from '$lib/services/actions.services';
	import { loadTokenAndRun } from '$lib/services/token.services';
	import { i18n } from '$lib/stores/i18n.store';
	import {
		initModalTokensListContext,
		MODAL_TOKENS_LIST_CONTEXT_KEY,
		type ModalTokensListContext
	} from '$lib/stores/modal-tokens-list.store';
	import { token } from '$lib/stores/token.store';
	import type { ContactUi } from '$lib/types/contact';
	import type { QrResponse, QrStatus } from '$lib/types/qr-code';
	import type { SendDestinationTab } from '$lib/types/send';
	import type { OptionToken, Token } from '$lib/types/token';
	import { closeModal } from '$lib/utils/modal.utils';
	import {
		isNetworkIdBTCMainnet,
		isNetworkIdBTCTestnet,
		isNetworkIdEthereum,
		isNetworkIdEvm,
		isNetworkIdBTCRegtest,
		isNetworkIdSOLMainnet,
		isNetworkIdSOLDevnet,
		isNetworkIdSOLLocal
	} from '$lib/utils/network.utils';
	import { decodeQrCode } from '$lib/utils/qr-code.utils';
	import { goToWizardStep } from '$lib/utils/wizard-modal.utils';

	export let isTransactionsPage: boolean;

	let destination = '';
	let activeSendDestinationTab: SendDestinationTab = 'recentlyUsed';
	let selectedContact: ContactUi | undefined = undefined;
	let amount: number | undefined = undefined;
	let sendProgressStep: string = ProgressStepsSend.INITIALIZATION;

	let steps: WizardSteps<WizardStepsSend>;
	$: steps = isTransactionsPage
		? sendWizardStepsWithQrCodeScan({ i18n: $i18n })
		: allSendWizardSteps({ i18n: $i18n });

	let currentStep: WizardStep<WizardStepsSend> | undefined;
	let modal: WizardModal<WizardStepsSend>;

	const dispatch = createEventDispatcher();

	setContext<ModalTokensListContext>(
		MODAL_TOKENS_LIST_CONTEXT_KEY,
		initModalTokensListContext({
			tokens: $enabledTokens,
			filterZeroBalance: true,
			filterNetwork: $selectedNetwork
		})
	);

	const reset = () => {
		destination = '';
		activeSendDestinationTab = 'recentlyUsed';
		selectedContact = undefined;
		amount = undefined;

		sendProgressStep = ProgressStepsSend.INITIALIZATION;

		currentStep = undefined;
	};

	const close = () =>
		closeModal(() => {
			reset();

			dispatch('nnsClose');
		});

	const isDisabled = ({ network: { id } }: Token): boolean =>
		isNetworkIdEthereum(id) || isNetworkIdEvm(id)
			? $ethAddressNotLoaded
			: isNetworkIdBTCMainnet(id)
				? $btcAddressMainnetNotLoaded
				: isNetworkIdBTCTestnet(id)
					? $btcAddressTestnetNotLoaded
					: isNetworkIdBTCRegtest(id)
						? $btcAddressRegtestNotLoaded
						: isNetworkIdSOLMainnet(id)
							? $solAddressMainnetNotLoaded
							: isNetworkIdSOLDevnet(id)
								? $solAddressDevnetNotLoaded
								: isNetworkIdSOLLocal(id)
									? $solAddressLocalnetNotLoaded
									: false;

	const onIcSendToken = async ({ detail: token }: CustomEvent<Token>) => {
		if (isDisabled(token)) {
			const status = await waitWalletReady(() => isDisabled(token));

			if (status === 'timeout') {
				return;
			}
		}

		// eslint-disable-next-line require-await
		const callback = async () => {
			goToStep(WizardStepsSend.DESTINATION);
		};

		await loadTokenAndRun({ token, callback });
	};

	const goToStep = (stepName: WizardStepsSend) =>
		goToWizardStep({
			modal,
			steps,
			stepName
		});

	const onDecodeQrCode = ({
		status,
		code,
		expectedToken
	}: {
		status: QrStatus;
		code?: string;
		expectedToken: OptionToken;
	}): QrResponse => {
		const params = {
			status,
			code,
			expectedToken
		};

		return isNetworkIdEthereum($token?.network.id)
			? decodeQrCodeETH({
					...params,
					ethereumTokens: $enabledEthereumTokens,
					erc20Tokens: $enabledErc20Tokens
				})
			: decodeQrCode(params);
	};
</script>

<SendTokenContext token={$token}>
	<WizardModal
		{steps}
		bind:currentStep
		bind:this={modal}
		onClose={close}
		disablePointerEvents={currentStep?.name === WizardStepsSend.SENDING ||
			currentStep?.name === WizardStepsSend.FILTER_NETWORKS}
		testId={SEND_TOKENS_MODAL}
	>
		{#snippet title()}{currentStep?.title ?? ''}{/snippet}

		{#if currentStep?.name === WizardStepsSend.TOKENS_LIST}
			<SendTokensList
				on:icSendToken={onIcSendToken}
				on:icSelectNetworkFilter={() => goToStep(WizardStepsSend.FILTER_NETWORKS)}
			/>
		{:else if currentStep?.name === WizardStepsSend.FILTER_NETWORKS}
			<ModalNetworksFilter on:icNetworkFilter={() => goToStep(WizardStepsSend.TOKENS_LIST)} />
		{:else if currentStep?.name === WizardStepsSend.DESTINATION}
			<SendDestinationWizardStep
				bind:destination
				bind:activeSendDestinationTab
				bind:selectedContact
				formCancelAction={isTransactionsPage ? 'close' : 'back'}
				on:icBack={() => goToStep(WizardStepsSend.TOKENS_LIST)}
				on:icNext={modal.next}
				on:icClose={close}
				on:icQRCodeScan={() => goToStep(WizardStepsSend.QR_CODE_SCAN)}
			/>
		{:else if currentStep?.name === WizardStepsSend.QR_CODE_SCAN}
			<SendQrCodeScan
				expectedToken={$token}
				bind:destination
				bind:amount
				{onDecodeQrCode}
				onIcQrCodeBack={() => goToStep(WizardStepsSend.DESTINATION)}
			/>
		{:else}
			<SendWizard
				{currentStep}
				{destination}
				{selectedContact}
				bind:amount
				bind:sendProgressStep
				on:icBack={modal.back}
				on:icSendBack={() => goToStep(WizardStepsSend.DESTINATION)}
				on:icTokensList={() => goToStep(WizardStepsSend.TOKENS_LIST)}
				on:icNext={modal.next}
				on:icClose={close}
			/>
		{/if}
	</WizardModal>
</SendTokenContext>
