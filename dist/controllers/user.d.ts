import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
export declare class UserController {
    static getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    static deleteProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=user.d.ts.map