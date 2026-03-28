import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "MANAGER", "USER", "GUEST"]);

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: roleEnum("role").default("USER").notNull(),
  teamId: uuid("team_id").references(() => teams.id, {
    onDelete: "set null",
    onUpdate: "cascade",
  }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(users),
}));

export const usersRelations = relations(users, ({ one }) => ({
  team: one(teams, {
    fields: [users.teamId],
    references: [teams.id],
  }),
}));

export type InsertTeam = typeof teams.$inferInsert;
export type SelectTeam = typeof teams.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
