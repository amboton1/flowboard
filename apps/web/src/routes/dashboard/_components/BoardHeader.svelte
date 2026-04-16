<script lang="ts">
interface ActiveBoard {
  name: string;
  columns: unknown[];
}

interface Props {
  activeBoard: ActiveBoard | null;
  totalTickets: number;
  userAvatarUrl: string | null | undefined;
  userUsername: string;
  searchQuery: string;
}

let {
  activeBoard,
  totalTickets,
  userAvatarUrl,
  userUsername,
  searchQuery = $bindable(),
}: Props = $props();
</script>

<header
	class="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between flex-shrink-0"
>
	<div>
		<h1 class="text-lg font-bold text-slate-900">
			{activeBoard?.name ?? 'Dashboard'}
		</h1>
		{#if activeBoard}
			<p class="text-xs text-slate-400 mt-0.5">
				{activeBoard.columns.length} columns &middot; {totalTickets} tickets
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
				bind:value={searchQuery}
				placeholder="Search tickets..."
				class="pl-8 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg w-48
				       focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
			/>
		</div>

		{#if userAvatarUrl}
			<img
				src={userAvatarUrl}
				alt={userUsername}
				class="w-8 h-8 rounded-full ring-2 ring-indigo-500"
			/>
		{/if}
	</div>
</header>
