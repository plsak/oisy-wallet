<script lang="ts">
	import LoaderEthBalances from '$eth/components/loaders/LoaderEthBalances.svelte';
	import CkBTCUpdateBalanceListener from '$icp/components/core/CkBTCUpdateBalanceListener.svelte';
	import BalancesIdbSetter from '$lib/components/balances/BalancesIdbSetter.svelte';
	import ExchangeWorker from '$lib/components/exchange/ExchangeWorker.svelte';
	import AddressGuard from '$lib/components/guard/AddressGuard.svelte';
	import RewardGuard from '$lib/components/guard/RewardGuard.svelte';
	import ShortcutGuard from '$lib/components/guard/ShortcutGuard.svelte';
	import UrlGuard from '$lib/components/guard/UrlGuard.svelte';
	import Loader from '$lib/components/loaders/Loader.svelte';
	import LoaderContacts from '$lib/components/loaders/LoaderContacts.svelte';
	import LoaderMetamask from '$lib/components/loaders/LoaderMetamask.svelte';
	import LoaderUserProfile from '$lib/components/loaders/LoaderUserProfile.svelte';
	import LoaderWallets from '$lib/components/loaders/LoaderWallets.svelte';
	import UserSnapshotWorker from '$lib/components/rewards/UserSnapshotWorker.svelte';
	import TransactionsIdbSetter from '$lib/components/transactions/TransactionsIdbSetter.svelte';
</script>

<LoaderUserProfile>
	<AddressGuard>
		<Loader>
			<UrlGuard>
				<ShortcutGuard>
					<RewardGuard>
						<LoaderEthBalances>
							<LoaderWallets>
								<ExchangeWorker>
									<LoaderMetamask>
										<UserSnapshotWorker>
											<LoaderContacts>
												<TransactionsIdbSetter>
													<BalancesIdbSetter>
														<slot />
													</BalancesIdbSetter>
												</TransactionsIdbSetter>
											</LoaderContacts>
										</UserSnapshotWorker>
									</LoaderMetamask>
								</ExchangeWorker>
							</LoaderWallets>
						</LoaderEthBalances>
					</RewardGuard>
				</ShortcutGuard>
			</UrlGuard>
		</Loader>
	</AddressGuard>
</LoaderUserProfile>

<!-- This listener is kept outside of the Loaders tree to prevent slow page loading on localhost/e2e -->
<CkBTCUpdateBalanceListener />
