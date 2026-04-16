<script lang="ts">
import { priorityConfig } from '$lib/board-config';
import type { Ticket } from '$lib/types';

interface Accent {
  border: string;
  dot: string;
}

interface Props {
  ticket: Ticket;
  accent: Accent;
  isDragging: boolean;
  ondragstart: (e: DragEvent) => void;
  ondragend: () => void;
}

let { ticket, accent, isDragging, ondragstart, ondragend }: Props = $props();

const priority = $derived(priorityConfig[ticket.priority]);
</script>

<div
	draggable="true"
	{ondragstart}
	ondragend={() => ondragend()}
	role="none"
	class="bg-white rounded-xl shadow-sm border border-slate-100 border-t-4 p-4 cursor-pointer
	       hover:shadow-md hover:-translate-y-0.5 transition-all {accent.border}
	       {isDragging ? 'opacity-40 scale-95' : ''}"
>
	<span
		class="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full mb-2.5 {priority.class}"
	>
		{priority.label}
	</span>

	<p class="text-sm font-semibold text-slate-800 leading-snug mb-1">
		{ticket.title}
	</p>

	{#if ticket.description}
		<p class="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
			{ticket.description}
		</p>
	{/if}

	<div class="flex items-center justify-between pt-2.5 border-t border-slate-50 mt-2">
		<span class="text-xs font-mono text-slate-300">
			#{ticket.id.slice(-6).toUpperCase()}
		</span>

		{#if ticket.assignee}
			<div class="flex items-center gap-1.5">
				{#if ticket.assignee.avatarUrl}
					<img
						src={ticket.assignee.avatarUrl}
						alt={ticket.assignee.username}
						class="w-5 h-5 rounded-full"
						title={ticket.assignee.username}
					/>
				{:else}
					<div
						class="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center"
						title={ticket.assignee.username}
					>
						<span class="text-indigo-600 text-xs font-bold">
							{ticket.assignee.username[0].toUpperCase()}
						</span>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
