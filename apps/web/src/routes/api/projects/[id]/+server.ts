import { db } from '$lib/server/db';
import { projects } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const project = await db.query.projects.findFirst({
    where: eq(projects.id, params.id),
    with: {
      members: { with: { user: true } },
      boards: true,
    },
  });

  if (!project) error(404, 'Project not found');

  return json(project);
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const body = await request.json();
  const updates = Object.fromEntries(
    Object.entries(body as Record<string, unknown>).filter(([, v]) => v !== undefined)
  );

  const [project] = await db
    .update(projects)
    .set(updates)
    .where(eq(projects.id, params.id))
    .returning();

  if (!project) error(404, 'Project not found');

  return json(project);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const [project] = await db
    .delete(projects)
    .where(eq(projects.id, params.id))
    .returning({ id: projects.id });

  if (!project) error(404, 'Project not found');

  return new Response(null, { status: 204 });
};
