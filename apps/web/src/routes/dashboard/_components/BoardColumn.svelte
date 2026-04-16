<script lang="ts">
import TicketCard from './TicketCard.svelte';
import AddTicketModal from './AddTicketModal.svelte';
import type { BoardColumn as BoardColumnType } from '$lib/types';

interface Accent {
  border: string;
  dot: string;
}

interface Props {
  col: BoardColumnType;
  accent: Accent;
  draggingTicketId: string | null;
  dragOverColumnId: string | null;
  onDragStart: (e: DragEvent, ticketId: string, columnId: string) => void;
  onDragOver: (e: DragEvent, columnId: string) => void;
  onDragLeave: (e: DragEvent) => void;
  onDragEnd: () => void;
  onDrop: (e: DragEvent, columnId: string) => Promise<void>;
}

let {
  col,
  accent,
  draggingTicketId,
  dragOverColumnId,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDragEnd,
  onDrop,
}: Props = $props();

let modalOpen = $state(false);
</script>

<div class="w-72 flex-shrink-0 flex flex-col max-h-full">
	<div class="flex items-center justify-between mb-3 px-0.5">
		<div class="flex items-center gap-2">
			<span class="w-2.5 h-2.5 rounded-full {accent.dot}"></span>
			<h2 class="text-sm font-semibold text-slate-700">{col.name}</h2>
			<span
				class="bg-slate-100 text-slate-500 text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center"
			>
				{col.tickets.length}
			</span>
		</div>
		<button
			class="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
			title="Add ticket"
		>
			<svg
				class="w-3.5 h-3.5"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
			</svg>
		</button>
	</div>

	<div
		class="flex-1 overflow-y-auto flex flex-col gap-3 pb-2 pr-0.5 rounded-xl transition-colors
		       {dragOverColumnId === col.id ? 'bg-indigo-50/40 ring-2 ring-inset ring-indigo-300' : ''}"
		ondragover={(e) => onDragOver(e, col.id)}
		ondragleave={onDragLeave}
		ondrop={(e) => onDrop(e, col.id)}
		role="list"
	>
		{#each col.tickets as ticket}
			<TicketCard
				{ticket}
				{accent}
				isDragging={draggingTicketId === ticket.id}
				ondragstart={(e) => onDragStart(e, ticket.id, col.id)}
				ondragend={() => onDragEnd()}
			/>
		{/each}

		<button
			onclick={() => (modalOpen = true)}
			class="w-full py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400
			       hover:border-indigo-300 hover:text-indigo-500 transition-colors flex items-center justify-center gap-1.5"
		>
			<svg
				class="w-3.5 h-3.5"
				fill="none"
				stroke="currentColor"
				stroke-width="2.5"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
			</svg>
			Add ticket
		</button>
	</div>
</div>

{#if modalOpen}
	<AddTicketModal
		columnId={col.id}
		columnName={col.name}
		onclose={() => (modalOpen = false)}
	/>
{/if}
