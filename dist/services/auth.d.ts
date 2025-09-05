import { UserResponse } from '../models/User';
export interface RegisterUserData {
    email: string;
    password: string;
    name: string;
}
export interface LoginUserData {
    email: string;
    password: string;
}
export interface AuthResponse {
    user: UserResponse;
    token: string;
}
export declare class AuthService {
    static registerUser(userData: RegisterUserData): Promise<AuthResponse>;
    static loginUser(loginData: LoginUserData): Promise<AuthResponse>;
}
//# sourceMappingURL=auth.d.ts.map