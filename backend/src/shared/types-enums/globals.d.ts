import type { AuthUser } from '../../infrastructure/http/middlewares/auth.middleware';

declare module 'melipayamak';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
