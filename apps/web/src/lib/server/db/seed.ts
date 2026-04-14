import 'dotenv/config';
import { createId } from '@paralleldrive/cuid2';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');
const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  // Users
  const aliceId = createId();
  const bobId = createId();

  await db.insert(schema.users).values([
    {
      id: aliceId,
      githubId: '1001',
      username: 'alice',
      email: 'alice@example.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1001',
    },
    {
      id: bobId,
      githubId: '1002',
      username: 'bob',
      email: 'bob@example.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/1002',
    },
  ]);
  console.log('  ✓ Users');

  // Project
  const projectId = createId();

  await db.insert(schema.projects).values({
    id: projectId,
    name: 'Flowboard Development',
    description: 'Building the Flowboard app itself.',
    slug: 'flowboard-dev',
  });
  console.log('  ✓ Project');

  // Project members
  await db.insert(schema.projectMembers).values([
    { id: createId(), userId: aliceId, projectId, role: 'OWNER' },
    { id: createId(), userId: bobId, projectId, role: 'MEMBER' },
  ]);
  console.log('  ✓ Project members');

  // Board
  const boardId = createId();

  await db.insert(schema.boards).values({
    id: boardId,
    name: 'Main Board',
    projectId,
  });
  console.log('  ✓ Board');

  // Columns
  const todoId = createId();
  const inProgressId = createId();
  const inReviewId = createId();
  const doneId = createId();

  await db.insert(schema.columns).values([
    { id: todoId, name: 'Todo', position: 0, boardId },
    { id: inProgressId, name: 'In Progress', position: 1, boardId },
    { id: inReviewId, name: 'In Review', position: 2, boardId },
    { id: doneId, name: 'Done', position: 3, boardId },
  ]);
  console.log('  ✓ Columns');

  // Tickets
  await db.insert(schema.tickets).values([
    {
      id: createId(),
      title: 'Set up monorepo structure',
      description: 'Initialize the npm workspace with apps/web and apps/api.',
      priority: 'HIGH',
      status: 'DONE',
      position: 0,
      columnId: doneId,
      assigneeId: aliceId,
    },
    {
      id: createId(),
      title: 'Add Drizzle ORM',
      description: 'Replace Prisma with Drizzle for database access.',
      priority: 'HIGH',
      status: 'DONE',
      position: 1,
      columnId: doneId,
      assigneeId: aliceId,
    },
    {
      id: createId(),
      title: 'Implement GitHub OAuth',
      description: 'Allow users to sign in with their GitHub account.',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      position: 0,
      columnId: inProgressId,
      assigneeId: aliceId,
    },
    {
      id: createId(),
      title: 'Build Kanban board UI',
      description: 'Drag-and-drop columns and tickets using SvelteKit.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      position: 1,
      columnId: inProgressId,
      assigneeId: bobId,
    },
    {
      id: createId(),
      title: 'Design database schema',
      description: 'Review and finalise all tables and relations.',
      priority: 'MEDIUM',
      status: 'IN_REVIEW',
      position: 0,
      columnId: inReviewId,
      assigneeId: bobId,
    },
    {
      id: createId(),
      title: 'Write seed script',
      description: 'Populate the database with realistic test data.',
      priority: 'LOW',
      status: 'IN_REVIEW',
      position: 1,
      columnId: inReviewId,
      assigneeId: aliceId,
    },
    {
      id: createId(),
      title: 'Add ticket priority labels',
      description: 'Show colour-coded priority badges on each ticket card.',
      priority: 'MEDIUM',
      status: 'TODO',
      position: 0,
      columnId: todoId,
    },
    {
      id: createId(),
      title: 'Project settings page',
      description: 'Let owners rename projects and manage members.',
      priority: 'LOW',
      status: 'TODO',
      position: 1,
      columnId: todoId,
    },
  ]);
  console.log('  ✓ Tickets');

  console.log('\nDone!');
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
