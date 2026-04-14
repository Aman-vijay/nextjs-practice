export enum Role {
    ADMIN = "ADMIN",
    MANAGER = "MANAGER",
    USER = "USER",
    GUEST = "GUEST"
}

export interface TeamMember {
    id: string;
    userId: string;
    teamId: string;
    role: Role;
    joinedAt: Date;

    // optional relations
    user?: User;
    team?: Team;
}

export interface User {
    id: string;
    name: string;
    email: string;


    // ✅ NEW
    memberships?: TeamMember[];

    createdAt: Date;
    updatedAt: Date;
}

export interface Team {
    id: string;
    name: string;
    description?: string | null;
    code: string;

    ownerId: string; // ✅ added


    members?: TeamMember[];

    createdAt: Date;
    updatedAt: Date;
}