export class UserResponse {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.role = user.role;
    }
}