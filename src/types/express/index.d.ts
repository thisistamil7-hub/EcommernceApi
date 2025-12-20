
export interface AuthUser {
  id: string;
  username: string;
  email: string;
  role?: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
