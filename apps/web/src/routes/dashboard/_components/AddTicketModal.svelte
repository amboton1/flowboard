<script lang="ts">
import { enhance } from '$app/forms';
import { priorityConfig } from '$lib/board-config';

interface Props {
  columnId: string;
  columnName: string;
  onclose: () => void;
}

let { columnId, columnName, onclose }: Props = $props();

let submitting = $state(false);

const priorities = Object.entries(priorityConfig) as [
  keyof typeof priorityConfig,
  { label: string; class: string },
][];
</script>

<div
	class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
	role="dialog"
	aria-modal="true"
	aria-labelledby="modal-title"
>
	<div class="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
		<div class="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
			<div>
				<h2 id="modal-title" class="text-sm font-semibold text-slate-800">Add ticket</h2>
				<p class="text-xs text-slate-400 mt-0.5">{columnName}</p>
			</div>
			<button
				type="button"
				onclick={onclose}
				class="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
				aria-label="Close"
			>
				<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<form
			method="POST"
			action="?/createTicket"
			use:enhance={() => {
				submitting = true;
				return async ({ result, update }) => {
					submitting = false;
					if (result.type === 'success') {
						await update();
						onclose();
					} else {
						await update();
					}
				};
			}}
			class="px-6 py-5 flex flex-col gap-4"
		>
			<input type="hidden" name="columnId" value={columnId} />

			<div class="flex flex-col gap-1.5">
				<label for="ticket-title" class="text-xs font-medium text-slate-600">Title <span class="text-red-400">*</span></label>
				<input
					id="ticket-title"
					name="title"
					type="text"
					required
					placeholder="What needs to be done?"
					class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400
					       focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition"
				/>
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="ticket-description" class="text-xs font-medium text-slate-600">Description</label>
				<textarea
					id="ticket-description"
					name="description"
					rows="3"
					placeholder="Optional details..."
					class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 resize-none
					       focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition"
				></textarea>
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="ticket-priority" class="text-xs font-medium text-slate-600">Priority</label>
				<select
					id="ticket-priority"
					name="priority"
					class="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-slate-800
					       focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition"
				>
					{#each priorities as [value, config]}
						<option {value} selected={value === 'MEDIUM'}>{config.label}</option>
					{/each}
				</select>
			</div>

			<div class="flex justify-end gap-2 pt-1">
				<button
					type="button"
					onclick={onclose}
					class="px-4 py-2 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
				>
					Cancel
				</button>
				<button
					type="submit"
					disabled={submitting}
					class="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700
					       disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
				>
					{submitting ? 'Adding...' : 'Add ticket'}
				</button>
			</div>
		</form>
	</div>
</div>
