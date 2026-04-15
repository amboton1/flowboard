import { db } from '$lib/server/db';
import { boards } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const board = await db.query.boards.findFirst({
    where: eq(boards.id, params.id),
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

  if (!board) error(404, 'Board not found');

  return json(board);
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const body = await request.json();
  const updates = Object.fromEntries(
    Object.entries(body as Record<string, unknown>).filter(([, v]) => v !== undefined)
  );

  const [board] = await db.update(boards).set(updates).where(eq(boards.id, params.id)).returning();

  if (!board) error(404, 'Board not found');

  return json(board);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const [board] = await db
    .delete(boards)
    .where(eq(boards.id, params.id))
    .returning({ id: boards.id });

  if (!board) error(404, 'Board not found');

  return new Response(null, { status: 204 });
};
