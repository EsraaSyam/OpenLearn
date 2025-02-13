export class UserResponse {
    id: number;
    email: string;
    name: string;
    role: string;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.name = user.name;
        this.role = user.role;
    }
}