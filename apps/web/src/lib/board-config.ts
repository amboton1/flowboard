export const priorityConfig = {
	LOW: { label: 'Low', class: 'bg-slate-100 text-slate-600' },
	MEDIUM: { label: 'Medium', class: 'bg-blue-100 text-blue-700' },
	HIGH: { label: 'High', class: 'bg-orange-100 text-orange-700' },
	URGENT: { label: 'Urgent', class: 'bg-red-100 text-red-700' },
} as const;

export const columnAccents = [
	{ border: 'border-t-blue-500', dot: 'bg-blue-500' },
	{ border: 'border-t-amber-500', dot: 'bg-amber-500' },
	{ border: 'border-t-emerald-500', dot: 'bg-emerald-500' },
	{ border: 'border-t-purple-500', dot: 'bg-purple-500' },
	{ border: 'border-t-rose-500', dot: 'bg-rose-500' },
];

export const statusByColumnIndex = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'] as const;
