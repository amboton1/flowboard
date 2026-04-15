export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
export type TicketStatus = 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';

export interface Assignee {
	id: string;
	username: string;
	avatarUrl: string | null;
	email: string | null;
}

export interface Ticket {
	id: string;
	title: string;
	description: string | null;
	priority: Priority;
	status: TicketStatus;
	position: number;
	columnId: string;
	assigneeId: string | null;
	assignee: Assignee | null;
}

export interface BoardColumn {
	id: string;
	name: string;
	position: number;
	boardId: string;
	tickets: Ticket[];
}
