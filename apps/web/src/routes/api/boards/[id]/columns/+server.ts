import { db } from '$lib/server/db';
import { columns } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const { name, position } = await request.json();

  const [column] = await db
    .insert(columns)
    .values({ name, position, boardId: params.id })
    .returning();

  return json(column, { status: 201 });
};
