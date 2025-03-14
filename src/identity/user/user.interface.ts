export interface User {
  name: string;
  lastname: string;
  username: string;
  id?: string;
  email: string;
  authProvider: "Local" | "Google";
  password?: string;
}