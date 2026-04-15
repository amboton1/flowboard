import { db } from '$lib/server/db';
import { tickets } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.id, params.id),
    with: {
      assignee: true,
      column: { with: { board: true } },
    },
  });

  if (!ticket) error(404, 'Ticket not found');

  return json(ticket);
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const body = await request.json();

  const updates = Object.fromEntries(
    Object.entries(body as Record<string, unknown>).filter(([, v]) => v !== undefined)
  );

  const [ticket] = await db
    .update(tickets)
    .set(updates)
    .where(eq(tickets.id, params.id))
    .returning();

  if (!ticket) error(404, 'Ticket not found');

  return json(ticket);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const [ticket] = await db
    .delete(tickets)
    .where(eq(tickets.id, params.id))
    .returning({ id: tickets.id });

  if (!ticket) error(404, 'Ticket not found');

  return new Response(null, { status: 204 });
};
