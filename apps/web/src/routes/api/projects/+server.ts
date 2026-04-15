import { db } from '$lib/server/db';
import { projectMembers, projects } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const result = await db.select().from(projects).orderBy(projects.createdAt);
  return json(result);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) error(401, 'Unauthorized');

  const { name, description, slug } = await request.json();

  const [project] = await db.insert(projects).values({ name, description, slug }).returning();

  await db.insert(projectMembers).values({
    projectId: project.id,
    userId: locals.user.id,
    role: 'OWNER',
  });

  return json(project, { status: 201 });
};
