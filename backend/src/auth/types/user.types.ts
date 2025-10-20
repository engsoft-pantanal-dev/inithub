// auth/types/user.types.ts
export interface UserWithPassword {
  id: string;
  name: string;
  email: string;
  password: string;
  department: string;
  emojiAvatar: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserWithoutPassword {
  id: string;
  name: string;
  email: string;
  department: string;
  emojiAvatar: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}