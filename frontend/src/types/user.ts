import type { Initiative, Like, InitiativeUpdate } from "./initiative";

type User = {
    id: string;
    email: string;
    name: string;
    password: string;
    department?: string;
    emojiAvatar: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
    initiativesAuthored: Initiative[];
    initiativesAssignedTo: Initiative[];
    initiativesAssignedBy: Initiative[];
    likes: Like[];
    comments: Comment[];
    updates: InitiativeUpdate[];
};

export type {
    User
}