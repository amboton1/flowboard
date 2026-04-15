<script lang="ts">
	interface Board {
		id: string;
		name: string;
		projectId: string;
	}

	interface Project {
		id: string;
		name: string;
	}

	interface User {
		username: string;
		email: string | null;
		avatarUrl: string | null;
	}

	interface Props {
		user: User;
		activeBoardId: string | null | undefined;
		boardsByProject: Array<{ project: Project; boards: Board[] }>;
		projectsCount: number;
	}

	let { user, activeBoardId, boardsByProject, projectsCount }: Props = $props();
</script>

<aside class="w-60 bg-slate-900 flex flex-col flex-shrink-0">
	<div class="px-5 py-5 border-b border-slate-700/60">
		<div class="flex items-center gap-2.5">
			<div class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
				<svg
					class="w-4 h-4 text-white"
					fill="none"
					stroke="currentColor"
					stroke-width="2.5"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
					/>
				</svg>
			</div>
			<span class="text-white font-bold text-base tracking-tight">Flowboard</span>
		</div>
	</div>

	<nav class="flex-1 overflow-y-auto py-4 px-3 space-y-5">
		{#each boardsByProject as { project, boards }}
			<div>
				<p
					class="text-slate-400 text-xs font-semibold uppercase tracking-widest px-2 mb-1.5 truncate"
				>
					{project.name}
				</p>
				{#each boards as board}
					<a
						href="/dashboard?board={board.id}"
						class="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors
						       {activeBoardId === board.id
							? 'bg-indigo-600 text-white font-medium'
							: 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
					>
						<span
							class="w-2 h-2 rounded-full flex-shrink-0
						           {activeBoardId === board.id ? 'bg-white' : 'bg-slate-500'}"
						></span>
						<span class="truncate">{board.name}</span>
					</a>
				{/each}
				{#if boards.length === 0}
					<p class="text-slate-500 text-xs px-3 py-1.5 italic">No boards</p>
				{/if}
			</div>
		{/each}

		{#if projectsCount === 0}
			<p class="text-slate-500 text-sm px-3 py-2 italic">No projects yet</p>
		{/if}
	</nav>

	<div class="p-4 border-t border-slate-700/60">
		<div class="flex items-center gap-3">
			{#if user.avatarUrl}
				<img
					src={user.avatarUrl}
					alt={user.username}
					class="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-slate-600"
				/>
			{:else}
				<div
					class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0"
				>
					<span class="text-white text-xs font-bold">{user.username[0].toUpperCase()}</span>
				</div>
			{/if}
			<div class="flex-1 min-w-0">
				<p class="text-white text-sm font-medium truncate">{user.username}</p>
				{#if user.email}
					<p class="text-slate-400 text-xs truncate">{user.email}</p>
				{/if}
			</div>
			<form method="POST" action="/logout">
				<button
					type="submit"
					title="Sign out"
					class="text-slate-400 hover:text-white transition-colors p-1 rounded"
				>
					<svg
						class="w-4 h-4"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
				</button>
			</form>
		</div>
	</div>
</aside>
