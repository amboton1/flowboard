import { redirect } from '@sveltejs/kit';
import { eq, inArray } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { boards, projectMembers, projects } from '$lib/server/db/schema';
import type { PageServerLoad } from './$types';

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
