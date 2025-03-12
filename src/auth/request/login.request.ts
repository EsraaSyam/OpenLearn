import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { IsNotNullOrUndefined } from "src/validator/Is-not-null-or-undefined.decorator";

export class LoginRequest {
    @IsEmail()
    @IsNotEmpty()
    @IsNotNullOrUndefined()
    @ApiProperty({ example: 'esraa@example.com', description: 'User email' })
    email: string;

    @IsNotEmpty()
    @IsNotNullOrUndefined()
    @ApiProperty({ example: 'password123', description: 'Password' })
    password: string;
}