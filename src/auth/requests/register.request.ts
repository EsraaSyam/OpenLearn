import { IsEmail, IsNotEmpty, IsOptional, Max, MaxLength, MinLength } from "class-validator";
import { Roles } from "src/user/enums/rols.enum";
import { IsNotNullOrUndefined } from "src/validators/Is-not-null-or-undefined.decorator";

export class RegisterRequest {
    @IsEmail()
    @IsNotEmpty()
    @IsNotNullOrUndefined()
    email: string;

    @IsNotEmpty()
    @IsNotNullOrUndefined()
    name: string;

    @MinLength(6)
    @MaxLength(30)
    @IsNotNullOrUndefined()
    password: string;

    @IsOptional()   
    role: Roles;
}