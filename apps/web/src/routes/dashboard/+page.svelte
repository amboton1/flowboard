<script lang="ts">
	let { data } = $props();	

	const priorityConfig = {
		LOW: { label: 'Low', class: 'bg-slate-100 text-slate-600' },
		MEDIUM: { label: 'Medium', class: 'bg-blue-100 text-blue-700' },
		HIGH: { label: 'High', class: 'bg-orange-100 text-orange-700' },
		URGENT: { label: 'Urgent', class: 'bg-red-100 text-red-700' },
	} as const;

	const columnAccents = [
		{ border: 'border-t-blue-500', dot: 'bg-blue-500' },
		{ border: 'border-t-amber-500', dot: 'bg-amber-500' },
		{ border: 'border-t-emerald-500', dot: 'bg-emerald-500' },
		{ border: 'border-t-purple-500', dot: 'bg-purple-500' },
		{ border: 'border-t-rose-500', dot: 'bg-rose-500' },
	];

	const boardsByProject = $derived(
		data.projects.map((project) => ({
			project,
			boards: data.boards.filter((b) => b.projectId === project.id),
		}))
	);

	const totalTickets = $derived(
		data.activeBoard?.columns.reduce((sum, col) => sum + col.tickets.length, 0) ?? 0
	);
</script>

<div class="flex h-screen bg-slate-50 overflow-hidden font-sans">
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
							       {data.activeBoard?.id === board.id
								? 'bg-indigo-600 text-white font-medium'
								: 'text-slate-300 hover:bg-slate-800 hover:text-white'}"
						>
							<span
								class="w-2 h-2 rounded-full flex-shrink-0
							           {data.activeBoard?.id === board.id ? 'bg-white' : 'bg-slate-500'}"
							></span>
							<span class="truncate">{board.name}</span>
						</a>
					{/each}
					{#if boards.length === 0}
						<p class="text-slate-500 text-xs px-3 py-1.5 italic">No boards</p>
					{/if}
				</div>
			{/each}

			{#if data.projects.length === 0}
				<p class="text-slate-500 text-sm px-3 py-2 italic">No projects yet</p>
			{/if}
		</nav>

		<div class="p-4 border-t border-slate-700/60">
			<div class="flex items-center gap-3">
				{#if data.user.avatarUrl}
					<img
						src={data.user.avatarUrl}
						alt={data.user.username}
						class="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-slate-600"
					/>
				{:else}
					<div
						class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0"
					>
						<span class="text-white text-xs font-bold"
							>{data.user.username[0].toUpperCase()}</span
						>
					</div>
				{/if}
				<div class="flex-1 min-w-0">
					<p class="text-white text-sm font-medium truncate">{data.user.username}</p>
					{#if data.user.email}
						<p class="text-slate-400 text-xs truncate">{data.user.email}</p>
					{/if}
				</div>
				<form method="POST" action="/logout">
					<button
						type="submit"
						title="Sign out"
						class="text-slate-400 hover:text-white transition-colors p-1 rounded"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
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

	<div class="flex-1 flex flex-col overflow-hidden">
		<header class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
			<div>
				<h1 class="text-lg font-bold text-slate-900">
					{data.activeBoard?.name ?? 'Dashboard'}
				</h1>
				{#if data.activeBoard}
					<p class="text-xs text-slate-400 mt-0.5">
						{data.activeBoard.columns.length} columns &middot; {totalTickets} tickets
					</p>
				{/if}
			</div>

			<div class="flex items-center gap-3">
				<div class="relative">
					<svg
						class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
					<input
						type="search"
						placeholder="Search tickets..."
						class="pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg w-48
						       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
					/>
				</div>

				{#if data.user.avatarUrl}
					<img
						src={data.user.avatarUrl}
						alt={data.user.username}
						class="w-8 h-8 rounded-full ring-2 ring-indigo-500"
					/>
				{/if}
			</div>
		</header>

		<div class="flex-1 overflow-x-auto overflow-y-hidden">
			{#if data.activeBoard && data.activeBoard.columns.length > 0}
				<div class="flex gap-4 h-full p-5 w-max">
					{#each data.activeBoard.columns as col, i}
						{@const accent = columnAccents[i % columnAccents.length]}
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

							<div class="flex-1 overflow-y-auto flex flex-col gap-3 pb-2 pr-0.5">
								{#each col.tickets as ticket}
									{@const priority = priorityConfig[ticket.priority]}
									<div
										class="bg-white rounded-xl shadow-sm border border-slate-100 border-t-4 p-4 cursor-pointer
										       hover:shadow-md hover:-translate-y-0.5 transition-all {accent.border}"
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

										<div
											class="flex items-center justify-between pt-2.5 border-t border-slate-50 mt-2"
										>
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
								{/each}

								<button
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
				<div class="flex items-center justify-center h-full">
					<div class="text-center max-w-sm">
						<div
							class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-7 h-7 text-indigo-500"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
								/>
							</svg>
						</div>
						<h3 class="text-base font-semibold text-slate-800 mb-1">Board is empty</h3>
						<p class="text-sm text-slate-400">Add columns to start organising your tickets.</p>
					</div>
				</div>
			{:else if data.projects.length === 0}
				<div class="flex items-center justify-center h-full">
					<div class="text-center max-w-sm">
						<div
							class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-7 h-7 text-indigo-500"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
								/>
							</svg>
						</div>
						<h3 class="text-base font-semibold text-slate-800 mb-1">No projects yet</h3>
						<p class="text-sm text-slate-400 mb-4">
							Create a project to start managing your work.
						</p>
						<button
							class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
						>
							Create project
						</button>
					</div>
				</div>
			{:else}
				<div class="flex items-center justify-center h-full">
					<div class="text-center max-w-sm">
						<div
							class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4"
						>
							<svg
								class="w-7 h-7 text-indigo-500"
								fill="none"
								stroke="currentColor"
								stroke-width="1.5"
								viewBox="0 0 24 24"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
								/>
							</svg>
						</div>
						<h3 class="text-base font-semibold text-slate-800 mb-1">No boards yet</h3>
						<p class="text-sm text-slate-400 mb-4">
							Create a board inside your project to get started.
						</p>
						<button
							class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
						>
							Create board
						</button>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
