export interface User {
    id?: number;
    email: string;
    password: string;
    name: string;
    created_at?: Date;
    updated_at?: Date;
}
export interface UserResponse {
    id: number;
    email: string;
    name: string;
    created_at: Date;
    updated_at: Date;
}
export interface UserUpdateData {
    name?: string;
    email?: string;
    password?: string;
}
export declare class UserModel {
    static create(userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<UserResponse>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: number): Promise<UserResponse | null>;
    static update(id: number, updateData: UserUpdateData): Promise<UserResponse | null>;
    static validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    static delete(id: number): Promise<boolean>;
}
//# sourceMappingURL=User.d.ts.map