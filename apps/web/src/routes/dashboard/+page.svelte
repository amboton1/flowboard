<script lang="ts">
	import { columnAccents } from '$lib/board-config';
	import { createDragDrop } from '$lib/drag-drop.svelte';
	import BoardColumn from './_components/BoardColumn.svelte';
	import BoardHeader from './_components/BoardHeader.svelte';
	import EmptyState from './_components/EmptyState.svelte';
	import Sidebar from './_components/Sidebar.svelte';

	let { data } = $props();
	let searchQuery = $state('');
	let boardColumns = $state(data.activeBoard?.columns ?? []);

	$effect(() => {
		boardColumns = data.activeBoard?.columns ?? [];
	});

	const drag = createDragDrop(
		() => boardColumns,
		(cols) => {
			boardColumns = cols as typeof boardColumns;
		},
		() => {
			boardColumns = data.activeBoard?.columns ?? [];
		}
	);

	const filteredColumns = $derived(() => {
		return boardColumns.map((col) => ({
			...col,
			tickets: col.tickets.filter(
				(ticket) =>
					!searchQuery ||
					ticket.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
					ticket.description?.toLowerCase().includes(searchQuery.toLowerCase())
			),
		}));
	});

	const boardsByProject = $derived(
		data.projects.map((project) => ({
			project,
			boards: data.boards.filter((b) => b.projectId === project.id),
		}))
	);

	const totalTickets = $derived(boardColumns.reduce((sum, col) => sum + col.tickets.length, 0) ?? 0);
</script>

<div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
	<Sidebar
		user={data.user}
		activeBoardId={data.activeBoard?.id}
		{boardsByProject}
		projectsCount={data.projects.length}
	/>

	<div class="flex-1 flex flex-col overflow-hidden">
		<BoardHeader
			activeBoard={data.activeBoard}
			{totalTickets}
			userAvatarUrl={data.user.avatarUrl}
			userUsername={data.user.username}
			bind:searchQuery
		/>

		<div class="flex-1 overflow-x-auto overflow-y-hidden">
			{#if data.activeBoard && data.activeBoard.columns.length > 0}
				<div class="flex gap-4 h-full p-5 w-max">
					{#each filteredColumns() as col, i}
						{@const accent = columnAccents[i % columnAccents.length]}
						<BoardColumn
							{col}
							{accent}
							draggingTicketId={drag.draggingTicketId}
							dragOverColumnId={drag.dragOverColumnId}
							onDragStart={drag.onDragStart}
							onDragOver={drag.onDragOver}
							onDragLeave={drag.onDragLeave}
							onDragEnd={drag.onDragEnd}
							onDrop={drag.onDrop}
						/>
					{/each}

					<div class="w-72 flex-shrink-0 pt-9">
						<button
							class="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-sm text-slate-400
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
							Add column
						</button>
					</div>
				</div>
			{:else if data.activeBoard && data.activeBoard.columns.length === 0}
				<EmptyState
					icon="board"
					title="Board is empty"
					description="Add columns to start organising your tickets."
				/>
			{:else if data.projects.length === 0}
				<EmptyState
					icon="layers"
					title="No projects yet"
					description="Create a project to start managing your work."
					buttonLabel="Create project"
				/>
			{:else}
				<EmptyState
					icon="board"
					title="No boards yet"
					description="Create a board inside your project to get started."
					buttonLabel="Create board"
				/>
			{/if}
		</div>
	</div>
</div>
