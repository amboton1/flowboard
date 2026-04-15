import { db } from '$lib/server/db';
import { columns } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const body = await request.json();
  const updates = Object.fromEntries(
    Object.entries(body as Record<string, unknown>).filter(([, v]) => v !== undefined)
  );

  const [column] = await db
    .update(columns)
    .set(updates)
    .where(eq(columns.id, params.columnId))
    .returning();

  if (!column) error(404, 'Column not found');

  return json(column);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const [column] = await db
    .delete(columns)
    .where(eq(columns.id, params.columnId))
    .returning({ id: columns.id });

  if (!column) error(404, 'Column not found');

  return new Response(null, { status: 204 });
};
