import { SOLANA_MAINNET_NETWORK } from '$env/networks/networks.sol.env';
import type { TokenId } from '$lib/types/token';
import { parseTokenId } from '$lib/validation/token.validation';
import nvdax from '$sol/assets/nvdax.svg';
import { TOKEN_2022_PROGRAM_ADDRESS } from '$sol/constants/sol.constants';
import type { RequiredSplToken } from '$sol/types/spl';

export const NVDAX_DECIMALS = 8;

export const NVDAX_SYMBOL = 'NVDAx';

export const NVDAX_TOKEN_ID: TokenId = parseTokenId(NVDAX_SYMBOL);

export const NVDAX_TOKEN: RequiredSplToken = {
	id: NVDAX_TOKEN_ID,
	network: SOLANA_MAINNET_NETWORK,
	standard: 'spl',
	category: 'default',
	name: 'NVIDIA xStock',
	symbol: NVDAX_SYMBOL,
	decimals: NVDAX_DECIMALS,
	icon: nvdax,
	address: 'Xsc9qvGR1efVDFGLrVsmkzv3qi45LTBjeUKSPmx9qEh',
	owner: TOKEN_2022_PROGRAM_ADDRESS
};
