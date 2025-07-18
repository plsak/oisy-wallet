<script lang="ts">
	import { IconCheckCircleFill } from '@dfinity/gix-components';
	import { nonNullish } from '@dfinity/utils';
	import { RewardCriterionType } from '$lib/enums/reward-criterion-type';
	import { i18n } from '$lib/stores/i18n.store';
	import type {
		CampaignCriterion,
		HangoverCriterion,
		MinLoginsCriterion,
		MinTotalAssetsUsdCriterion,
		MinTransactionsCriterion
	} from '$lib/types/reward';
	import { replacePlaceholders } from '$lib/utils/i18n.utils';

	interface Props {
		criterion: CampaignCriterion;
		testId?: string;
	}

	let { criterion, testId }: Props = $props();

	const getCriterionText = (criterion: CampaignCriterion): string | undefined => {
		if (RewardCriterionType.MIN_LOGINS === criterion.type) {
			const minLoginCriterion = criterion as MinLoginsCriterion;

			return replacePlaceholders($i18n.rewards.requirements.min_logins, {
				$logins: minLoginCriterion.count.toString(),
				$days: minLoginCriterion.days.toString()
			});
		}
		if (RewardCriterionType.MIN_TRANSACTIONS === criterion.type) {
			const minTransactionsCriterion = criterion as MinTransactionsCriterion;

			return replacePlaceholders($i18n.rewards.requirements.min_transactions, {
				$transactions: minTransactionsCriterion.count.toString(),
				$days: minTransactionsCriterion.days.toString()
			});
		}
		if (RewardCriterionType.MIN_TOTAL_ASSETS_USD === criterion.type) {
			const minTotalAssetsUsdCriterion = criterion as MinTotalAssetsUsdCriterion;

			return replacePlaceholders($i18n.rewards.requirements.min_total_assets_usd, {
				$usd: minTotalAssetsUsdCriterion.usd.toString()
			});
		}
		if (RewardCriterionType.HANGOVER === criterion.type) {
			const hangoverCriterion = criterion as HangoverCriterion;

			return replacePlaceholders($i18n.rewards.requirements.hangover, {
				$days: hangoverCriterion.days.toString()
			});
		}
	};

	const criterionText = $derived(getCriterionText(criterion));
</script>

{#if nonNullish(criterionText)}
	<span
		class="flex w-full flex-row"
		class:transition={!criterion.satisfied}
		class:duration-500={!criterion.satisfied}
		class:ease-in-out={!criterion.satisfied}
	>
		<span
			data-tid={testId}
			class="-mt-0.5 mr-2"
			class:text-success-primary={criterion.satisfied}
			class:text-disabled={!criterion.satisfied}
		>
			<IconCheckCircleFill size={32} />
		</span>
		<span>
			{criterionText}
		</span>
	</span>
{/if}
