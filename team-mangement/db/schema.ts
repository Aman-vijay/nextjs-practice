import { relations } from "drizzle-orm";
import { pgEnum, pgTable, text, timestamp, uuid,index,unique } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["ADMIN", "MANAGER", "USER", "GUEST"]);



export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  ownerId: uuid("owner_id")
  .notNull()
  .references(() => users.id, { onDelete: "cascade" }),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});


export const teamMembers = pgTable("team_members",{
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(()=>users.id,{onDelete:"cascade"}),
  teamId:uuid("team_id").notNull().references(()=>teams.id , {onDelete:"cascade"}),
  role:roleEnum("role").default("USER").notNull(),
   joinedAt: timestamp("joined_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
},
(table) => ({
    userIdx: index("idx_team_members_user_id").on(table.userId),
    teamIdx: index("idx_team_members_team_id").on(table.teamId),
    uniqueUserTeam: unique("unique_user_team").on(table.userId, table.teamId),
    userTeamIdx: index("idx_user_team").on(table.userId, table.teamId)
  }))

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(teamMembers),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teams: many(teamMembers),
}));



export type InsertTeam = typeof teams.$inferInsert;
export type SelectTeam = typeof teams.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;
