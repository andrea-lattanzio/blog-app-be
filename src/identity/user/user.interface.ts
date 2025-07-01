export interface User {
  name: string;
  lastname: string;
  id?: string;
  email: string;
  authProvider: "Local" | "Google";
  password?: string;
}