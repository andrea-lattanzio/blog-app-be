export interface User {
  id?: string;
  email: string;
  authProvider: "Local" | "Google";
  password?: string;
}