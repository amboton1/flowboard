<script lang="ts">
interface Props {
  icon: 'board' | 'layers';
  title: string;
  description: string;
  buttonLabel?: string;
}

let { icon, title, description, buttonLabel }: Props = $props();
</script>

<div class="flex items-center justify-center h-full">
	<div class="text-center max-w-sm">
		<div class="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
			{#if icon === 'board'}
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
			{:else}
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
			{/if}
		</div>
		<h3 class="text-base font-semibold text-slate-800 mb-1">{title}</h3>
		<p class="text-sm text-slate-400 {buttonLabel ? 'mb-4' : ''}">{description}</p>
		{#if buttonLabel}
			<button
				class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
			>
				{buttonLabel}
			</button>
		{/if}
	</div>
</div>
