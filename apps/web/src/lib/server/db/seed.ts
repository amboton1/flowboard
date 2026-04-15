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

  await db.delete(schema.tickets);
  await db.delete(schema.columns);
  await db.delete(schema.boards);
  await db.delete(schema.projectMembers);
  await db.delete(schema.projects);
  await db.delete(schema.sessions);
  await db.delete(schema.users);
  console.log('  ✓ Cleaned up existing data');


  const ammarId = 'p91auohqpqsl1x3stnn6c4m5';
  const aliceId = createId();
  const bobId = createId();

  await db.insert(schema.users).values([
    {
      id: ammarId,
      githubId: '19265409',
      username: 'amboton1',
      email: 'akaunt20@gmail.com',
      avatarUrl: 'https://avatars.githubusercontent.com/u/19265409?v=4',
    },
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

  const flowboardProjectId = createId();

  await db.insert(schema.projects).values({
    id: flowboardProjectId,
    name: 'Flowboard Development',
    description: 'Building the Flowboard app itself.',
    slug: 'flowboard-dev',
  });

  await db.insert(schema.projectMembers).values([
    { id: createId(), userId: ammarId, projectId: flowboardProjectId, role: 'OWNER' },
    { id: createId(), userId: aliceId, projectId: flowboardProjectId, role: 'ADMIN' },
    { id: createId(), userId: bobId, projectId: flowboardProjectId, role: 'MEMBER' },
  ]);

  const board1Id = createId();
  await db.insert(schema.boards).values({ id: board1Id, name: 'Main Board', projectId: flowboardProjectId });

  const b1Todo = createId();
  const b1InProgress = createId();
  const b1InReview = createId();
  const b1Done = createId();

  await db.insert(schema.columns).values([
    { id: b1Todo, name: 'Todo', position: 0, boardId: board1Id },
    { id: b1InProgress, name: 'In Progress', position: 1, boardId: board1Id },
    { id: b1InReview, name: 'In Review', position: 2, boardId: board1Id },
    { id: b1Done, name: 'Done', position: 3, boardId: board1Id },
  ]);

  await db.insert(schema.tickets).values([
    {
      id: createId(),
      title: 'Set up monorepo structure',
      description: 'Initialize the npm workspace with apps/web.',
      priority: 'HIGH',
      status: 'DONE',
      position: 0,
      columnId: b1Done,
      assigneeId: ammarId,
    },
    {
      id: createId(),
      title: 'Add Drizzle ORM',
      description: 'Replace Prisma with Drizzle for database access.',
      priority: 'HIGH',
      status: 'DONE',
      position: 1,
      columnId: b1Done,
      assigneeId: ammarId,
    },
    {
      id: createId(),
      title: 'Implement GitHub OAuth',
      description: 'Allow users to sign in with their GitHub account.',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      position: 0,
      columnId: b1InProgress,
      assigneeId: ammarId,
    },
    {
      id: createId(),
      title: 'Build Kanban board UI',
      description: 'Drag-and-drop columns and tickets using SvelteKit.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      position: 1,
      columnId: b1InProgress,
      assigneeId: bobId,
    },
    {
      id: createId(),
      title: 'Design database schema',
      description: 'Review and finalise all tables and relations.',
      priority: 'MEDIUM',
      status: 'IN_REVIEW',
      position: 0,
      columnId: b1InReview,
      assigneeId: aliceId,
    },
    {
      id: createId(),
      title: 'Write seed script',
      description: 'Populate the database with realistic test data.',
      priority: 'LOW',
      status: 'IN_REVIEW',
      position: 1,
      columnId: b1InReview,
      assigneeId: ammarId,
    },
    {
      id: createId(),
      title: 'Add ticket priority labels',
      description: 'Show colour-coded priority badges on each ticket card.',
      priority: 'MEDIUM',
      status: 'TODO',
      position: 0,
      columnId: b1Todo,
    },
    {
      id: createId(),
      title: 'Project settings page',
      description: 'Let owners rename projects and manage members.',
      priority: 'LOW',
      status: 'TODO',
      position: 1,
      columnId: b1Todo,
    },
  ]);
  console.log('  ✓ Project 1: Flowboard Development');

  const marketingProjectId = createId();

  await db.insert(schema.projects).values({
    id: marketingProjectId,
    name: 'Marketing Website',
    description: 'Landing page and blog for the Flowboard product.',
    slug: 'marketing-website',
  });

  await db.insert(schema.projectMembers).values([
    { id: createId(), userId: ammarId, projectId: marketingProjectId, role: 'OWNER' },
    { id: createId(), userId: aliceId, projectId: marketingProjectId, role: 'MEMBER' },
  ]);

  const board2Id = createId();
  await db.insert(schema.boards).values({ id: board2Id, name: 'Website Launch', projectId: marketingProjectId });

  const b2Backlog = createId();
  const b2InProgress = createId();
  const b2Done = createId();

  await db.insert(schema.columns).values([
    { id: b2Backlog, name: 'Backlog', position: 0, boardId: board2Id },
    { id: b2InProgress, name: 'In Progress', position: 1, boardId: board2Id },
    { id: b2Done, name: 'Done', position: 2, boardId: board2Id },
  ]);

  await db.insert(schema.tickets).values([
    {
      id: createId(),
      title: 'Design hero section',
      description: 'Create a compelling above-the-fold layout with CTA.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      position: 0,
      columnId: b2InProgress,
      assigneeId: ammarId,
    },
    {
      id: createId(),
      title: 'Write product copy',
      description: 'Draft value proposition and feature descriptions.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      position: 1,
      columnId: b2InProgress,
      assigneeId: aliceId,
    },
    {
      id: createId(),
      title: 'Set up analytics',
      description: 'Integrate Plausible for privacy-friendly page tracking.',
      priority: 'MEDIUM',
      status: 'TODO',
      position: 0,
      columnId: b2Backlog,
    },
    {
      id: createId(),
      title: 'SEO meta tags',
      description: 'Add Open Graph and Twitter card metadata.',
      priority: 'LOW',
      status: 'TODO',
      position: 1,
      columnId: b2Backlog,
    },
    {
      id: createId(),
      title: 'Buy domain & configure DNS',
      description: 'Register flowboard.app and point it to Vercel.',
      priority: 'URGENT',
      status: 'DONE',
      position: 0,
      columnId: b2Done,
      assigneeId: ammarId,
    },
  ]);
  console.log('  ✓ Project 2: Marketing Website');

  const mobileProjectId = createId();

  await db.insert(schema.projects).values({
    id: mobileProjectId,
    name: 'Mobile App',
    description: 'React Native companion app for Flowboard.',
    slug: 'mobile-app',
  });

  await db.insert(schema.projectMembers).values([
    { id: createId(), userId: ammarId, projectId: mobileProjectId, role: 'OWNER' },
    { id: createId(), userId: bobId, projectId: mobileProjectId, role: 'ADMIN' },
  ]);

  const board3Id = createId();
  const board3SprintId = createId();

  await db.insert(schema.boards).values([
    { id: board3Id, name: 'Roadmap', projectId: mobileProjectId },
    { id: board3SprintId, name: 'Sprint 1', projectId: mobileProjectId },
  ]);

  const b3Planned = createId();
  const b3InProgress = createId();
  const b3Shipped = createId();

  await db.insert(schema.columns).values([
    { id: b3Planned, name: 'Planned', position: 0, boardId: board3Id },
    { id: b3InProgress, name: 'In Progress', position: 1, boardId: board3Id },
    { id: b3Shipped, name: 'Shipped', position: 2, boardId: board3Id },
  ]);

  await db.insert(schema.tickets).values([
    {
      id: createId(),
      title: 'Scaffold React Native project',
      description: 'Bootstrap with Expo and configure navigation.',
      priority: 'HIGH',
      status: 'DONE',
      position: 0,
      columnId: b3Shipped,
      assigneeId: ammarId,
    },
    {
      id: createId(),
      title: 'Auth screen (GitHub OAuth)',
      description: 'Deep-link OAuth flow using expo-auth-session.',
      priority: 'URGENT',
      status: 'IN_PROGRESS',
      position: 0,
      columnId: b3InProgress,
      assigneeId: ammarId,
    },
    {
      id: createId(),
      title: 'Board list screen',
      description: 'Show all boards for the current project.',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      position: 1,
      columnId: b3InProgress,
      assigneeId: bobId,
    },
    {
      id: createId(),
      title: 'Offline support',
      description: 'Cache board data locally with MMKV.',
      priority: 'MEDIUM',
      status: 'TODO',
      position: 0,
      columnId: b3Planned,
    },
    {
      id: createId(),
      title: 'Push notifications',
      description: 'Notify users when they are assigned a ticket.',
      priority: 'LOW',
      status: 'TODO',
      position: 1,
      columnId: b3Planned,
    },
  ]);

  const s1Todo = createId();
  const s1InProgress = createId();
  const s1Done = createId();

  await db.insert(schema.columns).values([
    { id: s1Todo, name: 'Todo', position: 0, boardId: board3SprintId },
    { id: s1InProgress, name: 'In Progress', position: 1, boardId: board3SprintId },
    { id: s1Done, name: 'Done', position: 2, boardId: board3SprintId },
  ]);

  await db.insert(schema.tickets).values([
    {
      id: createId(),
      title: 'Configure ESLint & Prettier',
      description: 'Enforce consistent code style across the RN codebase.',
      priority: 'LOW',
      status: 'DONE',
      position: 0,
      columnId: s1Done,
      assigneeId: bobId,
    },
    {
      id: createId(),
      title: 'Set up CI pipeline',
      description: 'Run tests on every PR with GitHub Actions.',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      position: 0,
      columnId: s1InProgress,
      assigneeId: ammarId,
    },
    {
      id: createId(),
      title: 'Write unit tests for auth utils',
      description: 'Cover token refresh logic with Jest.',
      priority: 'MEDIUM',
      status: 'TODO',
      position: 0,
      columnId: s1Todo,
    },
  ]);
  console.log('  ✓ Project 3: Mobile App (2 boards)');

  console.log('\nDone!');
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
