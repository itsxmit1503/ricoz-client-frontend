export type Role = "user" | "admin";

/** The app-level user record (MongoDB), linked to the Clerk account by clerkId. */
export interface User {
  _id: string;
  clerkId?: string;
  username?: string;
  email: string;
  role: Role;
  isemailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}
