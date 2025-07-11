// src/types/User.ts

export interface User {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  profilePicture?: string | null;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
