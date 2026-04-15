import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const memberRoleEnum = pgEnum('member_role', ['OWNER', 'ADMIN', 'MEMBER']);
export const priorityEnum = pgEnum('priority', ['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export const ticketStatusEnum = pgEnum('ticket_status', [
  'TODO',
  'IN_PROGRESS',
  'IN_REVIEW',
  'DONE',
]);

export const users = pgTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  githubId: text('github_id').notNull().unique(),
  username: text('username').notNull(),
  email: text('email'),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
});

export const projects = pgTable('projects', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  description: text('description'),
  slug: text('slug').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const projectMembers = pgTable(
  'project_members',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    projectId: text('project_id')
      .notNull()
      .references(() => projects.id, { onDelete: 'cascade' }),
    role: memberRoleEnum('role').notNull().default('MEMBER'),
    joinedAt: timestamp('joined_at').defaultNow().notNull(),
  },
  (t) => [unique().on(t.userId, t.projectId)]
);

export const boards = pgTable('boards', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  projectId: text('project_id')
    .notNull()
    .references(() => projects.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const columns = pgTable('columns', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text('name').notNull(),
  position: integer('position').notNull(),
  boardId: text('board_id')
    .notNull()
    .references(() => boards.id, { onDelete: 'cascade' }),
});

export const tickets = pgTable('tickets', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text('title').notNull(),
  description: text('description'),
  priority: priorityEnum('priority').notNull().default('MEDIUM'),
  status: ticketStatusEnum('status').notNull().default('TODO'),
  position: integer('position').notNull().default(0),
  columnId: text('column_id')
    .notNull()
    .references(() => columns.id, { onDelete: 'cascade' }),
  assigneeId: text('assignee_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projectMembers),
  assignedTickets: many(tickets),
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const projectsRelations = relations(projects, ({ many }) => ({
  members: many(projectMembers),
  boards: many(boards),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  user: one(users, { fields: [projectMembers.userId], references: [users.id] }),
  project: one(projects, { fields: [projectMembers.projectId], references: [projects.id] }),
}));

export const boardsRelations = relations(boards, ({ one, many }) => ({
  project: one(projects, { fields: [boards.projectId], references: [projects.id] }),
  columns: many(columns),
}));

export const columnsRelations = relations(columns, ({ one, many }) => ({
  board: one(boards, { fields: [columns.boardId], references: [boards.id] }),
  tickets: many(tickets),
}));

export const ticketsRelations = relations(tickets, ({ one }) => ({
  column: one(columns, { fields: [tickets.columnId], references: [columns.id] }),
  assignee: one(users, { fields: [tickets.assigneeId], references: [users.id] }),
}));
