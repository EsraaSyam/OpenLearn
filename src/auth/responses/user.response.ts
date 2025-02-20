export class UserResponse {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;

    constructor(user: any) {
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = user.role;
    }
}