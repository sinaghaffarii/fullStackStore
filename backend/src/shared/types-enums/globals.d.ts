import type { AuthUser } from '../../middlewares/auth.middleware';

declare module 'melipayamak';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}
