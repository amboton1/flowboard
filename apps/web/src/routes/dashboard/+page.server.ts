import { fail, redirect } from '@sveltejs/kit';
import { eq, inArray, max } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { boards, columns, projectMembers, projects, tickets } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user) {
    redirect(302, '/');
  }

  const memberRows = await db
    .select({ project: projects })
    .from(projectMembers)
    .innerJoin(projects, eq(projectMembers.projectId, projects.id))
    .where(eq(projectMembers.userId, locals.user.id));

  const userProjects = memberRows.map((r) => r.project);

  let allBoards: Array<{
    id: string;
    name: string;
    projectId: string;
    createdAt: Date;
  }> = [];
  if (userProjects.length > 0) {
    allBoards = await db.query.boards.findMany({
      where: inArray(
        boards.projectId,
        userProjects.map((p) => p.id)
      ),
    });
  }

  const selectedBoardId = url.searchParams.get('board') ?? allBoards[0]?.id;

  let activeBoard = null;
  if (selectedBoardId) {
    activeBoard = await db.query.boards.findFirst({
      where: eq(boards.id, selectedBoardId),
      with: {
        columns: {
          orderBy: (col, { asc }) => [asc(col.position)],
          with: {
            tickets: {
              orderBy: (ticket, { asc }) => [asc(ticket.position)],
              with: { assignee: true },
            },
          },
        },
      },
    });
  }

  return {
    user: locals.user,
    projects: userProjects,
    boards: allBoards,
    activeBoard: activeBoard ?? null,
  };
};

export const actions: Actions = {
  createTicket: async ({ request, locals }) => {
    if (!locals.user) return fail(401, { error: 'Unauthorized' });

    const data = await request.formData();
    const title = data.get('title')?.toString().trim();
    const description = data.get('description')?.toString().trim() || null;
    const priority = data.get('priority')?.toString() as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    const columnId = data.get('columnId')?.toString();

    if (!title || !columnId) return fail(400, { error: 'Title and column are required' });

    const column = await db.query.columns.findFirst({ where: eq(columns.id, columnId) });
    if (!column) return fail(404, { error: 'Column not found' });

    const result = await db
      .select({ maxPosition: max(tickets.position) })
      .from(tickets)
      .where(eq(tickets.columnId, columnId));

    const nextPosition = (result[0]?.maxPosition ?? -1) + 1;

    await db.insert(tickets).values({
      title,
      description,
      priority: priority ?? 'MEDIUM',
      status: 'TODO',
      position: nextPosition,
      columnId,
    });

    return { success: true };
  },
};
