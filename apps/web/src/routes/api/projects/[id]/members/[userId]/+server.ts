import { db } from '$lib/server/db';
import { projectMembers } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { and, eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const [member] = await db
    .delete(projectMembers)
    .where(and(eq(projectMembers.projectId, params.id), eq(projectMembers.userId, params.userId)))
    .returning({ id: projectMembers.id });

  if (!member) error(404, 'Member not found');

  return new Response(null, { status: 204 });
};
