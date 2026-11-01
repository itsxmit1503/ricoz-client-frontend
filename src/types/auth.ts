export type Role = "user" | "admin" | "supervisor" | "operator";

/** The app-level user record (MongoDB), linked to the Clerk account by clerkId. */
export interface User {
  _id: string;
  clerkId?: string;
  username?: string;
  name?: string;
  email: string;
  role: Role;
  isActive?: boolean;
  isemailVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}
