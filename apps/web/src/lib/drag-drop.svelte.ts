import type { BoardColumn } from './types';
import { statusByColumnIndex } from './board-config';

export function createDragDrop(
	getColumns: () => BoardColumn[],
	setColumns: (cols: BoardColumn[]) => void,
	resetColumns: () => void
) {
	let draggingTicketId = $state<string | null>(null);
	let draggingFromColumnId = $state<string | null>(null);
	let dragOverColumnId = $state<string | null>(null);

	function deriveStatus(columnId: string) {
		const index = getColumns().findIndex((c) => c.id === columnId);
		return statusByColumnIndex[Math.min(index, statusByColumnIndex.length - 1)] ?? 'TODO';
	}

	function onDragStart(e: DragEvent, ticketId: string, columnId: string) {
		draggingTicketId = ticketId;
		draggingFromColumnId = columnId;
		if (e.dataTransfer) {
			e.dataTransfer.effectAllowed = 'move';
		}
	}

	function onDragOver(e: DragEvent, columnId: string) {
		e.preventDefault();
		if (e.dataTransfer) {
			e.dataTransfer.dropEffect = 'move';
		}
		dragOverColumnId = columnId;
	}

	function onDragLeave(e: DragEvent) {
		if (!(e.currentTarget as Element).contains(e.relatedTarget as Node)) {
			dragOverColumnId = null;
		}
	}

	function onDragEnd() {
		draggingTicketId = null;
		draggingFromColumnId = null;
		dragOverColumnId = null;
	}

	async function onDrop(e: DragEvent, targetColumnId: string) {
		e.preventDefault();
		dragOverColumnId = null;

		if (!draggingTicketId || !draggingFromColumnId) return;
		if (draggingFromColumnId === targetColumnId) return;

		const ticketId = draggingTicketId;
		const fromColumnId = draggingFromColumnId;
		const columns = getColumns();

		const fromCol = columns.find((c) => c.id === fromColumnId);
		const ticket = fromCol?.tickets.find((t) => t.id === ticketId);
		if (!ticket) return;

		const toCol = columns.find((c) => c.id === targetColumnId);
		const newPosition = (toCol?.tickets.length ?? 0) + 1;
		const newStatus = deriveStatus(targetColumnId);

		setColumns(
			columns.map((col) => {
				if (col.id === fromColumnId) {
					return { ...col, tickets: col.tickets.filter((t) => t.id !== ticketId) };
				}
				if (col.id === targetColumnId) {
					return {
						...col,
						tickets: [
							...col.tickets,
							{ ...ticket, columnId: targetColumnId, position: newPosition, status: newStatus },
						],
					};
				}
				return col;
			})
		);

		draggingTicketId = null;
		draggingFromColumnId = null;

		try {
			const res = await fetch(`/api/tickets/${ticketId}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ columnId: targetColumnId, position: newPosition, status: newStatus }),
			});
			if (!res.ok) throw new Error('Failed');
		} catch {
			resetColumns();
		}
	}

	return {
		get draggingTicketId() {
			return draggingTicketId;
		},
		get dragOverColumnId() {
			return dragOverColumnId;
		},
		onDragStart,
		onDragOver,
		onDragLeave,
		onDragEnd,
		onDrop,
	};
}
