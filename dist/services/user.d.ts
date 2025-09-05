import { UserResponse, UserUpdateData } from '../models/User';
export declare class UserService {
    static getUserProfile(userId: number): Promise<UserResponse>;
    static getUserByEmail(email: string): Promise<UserResponse | null>;
    static updateUserProfile(userId: number, updateData: UserUpdateData): Promise<UserResponse>;
    static deleteUser(userId: number): Promise<void>;
}
//# sourceMappingURL=user.d.ts.map