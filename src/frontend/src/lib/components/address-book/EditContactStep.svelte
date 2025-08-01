<script lang="ts">
	import { isNullish } from '@dfinity/utils';
	import AddressListItem from '$lib/components/contact/AddressListItem.svelte';
	import Avatar from '$lib/components/contact/Avatar.svelte';
	import IconPencil from '$lib/components/icons/lucide/IconPencil.svelte';
	import IconPlus from '$lib/components/icons/lucide/IconPlus.svelte';
	import IconTrash from '$lib/components/icons/lucide/IconTrash.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import ButtonBack from '$lib/components/ui/ButtonBack.svelte';
	import ButtonGroup from '$lib/components/ui/ButtonGroup.svelte';
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import ContentWithToolbar from '$lib/components/ui/ContentWithToolbar.svelte';
	import Hr from '$lib/components/ui/Hr.svelte';
	import LogoButton from '$lib/components/ui/LogoButton.svelte';
	import {
		CONTACT_EDIT_DELETE_CONTACT_BUTTON,
		CONTACT_SHOW_CLOSE_BUTTON,
		CONTACT_EDIT_ADD_ADDRESS_BUTTON,
		CONTACT_HEADER_EDITING_EDIT_BUTTON
	} from '$lib/constants/test-ids.constants';
	import { i18n } from '$lib/stores/i18n.store';
	import type { ContactUi } from '$lib/types/contact';

	interface Props {
		contact: ContactUi;
		onClose: () => void;
		onEdit: (contact: ContactUi) => void;
		onEditAddress: (index: number) => void;
		onAddAddress: () => void;
		onDeleteContact: (id: bigint) => void;
		onDeleteAddress: (index: number) => void;
	}

	let {
		contact,
		onClose,
		onEdit,
		onEditAddress,
		onAddAddress,
		onDeleteContact,
		onDeleteAddress
	}: Props = $props();
</script>

<ContentWithToolbar styleClass="flex flex-col gap-1 h-full">
	<LogoButton hover={false} condensed={true}>
		{#snippet logo()}
			<Avatar name={contact.name} variant="xs" styleClass="md:text-[19.2px]"></Avatar>
		{/snippet}

		{#snippet title()}
			{contact.name}
		{/snippet}

		{#snippet action()}
			<ButtonIcon
				styleClass="-m-1 md:m-0"
				colorStyle="tertiary-alt"
				transparent
				link={false}
				ariaLabel={$i18n.core.text.edit}
				onclick={() => onEdit(contact)}
				testId={CONTACT_HEADER_EDITING_EDIT_BUTTON}
			>
				{#snippet icon()}
					<IconPencil />
				{/snippet}
			</ButtonIcon>
		{/snippet}
	</LogoButton>

	<Hr />

	{#each contact.addresses as address, index (index)}
		<AddressListItem
			{address}
			addressItemActionsProps={{
				hideCopyButton: true,
				onEdit: () => onEditAddress(index),
				onDelete: () => onDeleteAddress(index)
			}}
		/>
	{/each}

	<div class="mt-3 flex justify-start">
		<Button
			alignLeft
			ariaLabel={$i18n.address_book.edit_contact.add_address}
			transparent
			colorStyle="secondary-light"
			disabled={isNullish(onAddAddress)}
			onclick={() => onAddAddress?.()}
			testId={CONTACT_EDIT_ADD_ADDRESS_BUTTON}
		>
			<IconPlus />
			{$i18n.address_book.edit_contact.add_address}
		</Button>
	</div>

	<Hr />

	<div class="flex justify-start">
		<Button
			alignLeft
			ariaLabel={$i18n.address_book.edit_contact.delete_contact}
			transparent
			colorStyle="error"
			onclick={() => onDeleteContact?.(contact.id)}
			testId={CONTACT_EDIT_DELETE_CONTACT_BUTTON}
		>
			<IconTrash />
			{$i18n.address_book.edit_contact.delete_contact}
		</Button>
	</div>

	<div class="flex-grow"></div>

	{#snippet toolbar()}
		<ButtonGroup>
			<ButtonBack onclick={onClose} testId={CONTACT_SHOW_CLOSE_BUTTON} />
		</ButtonGroup>
	{/snippet}
</ContentWithToolbar>
