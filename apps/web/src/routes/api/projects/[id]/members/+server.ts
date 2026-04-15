import { db } from '$lib/server/db';
import { projectMembers } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const { userId, role } = await request.json();

  const [member] = await db
    .insert(projectMembers)
    .values({ projectId: params.id, userId, role })
    .returning();

  return json(member, { status: 201 });
};
