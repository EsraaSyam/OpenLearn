import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString, Max, MaxLength, MinLength, ValidateIf } from "class-validator";
import { Roles } from "src/user/enum/rols.enum";
import { IsAlpha } from "src/validator/is-alpha.decorator";
import { IsNotNullOrUndefined } from "src/validator/Is-not-null-or-undefined.decorator";

export class RegisterRequest {
    @IsEmail()
    @IsNotEmpty()
    @IsNotNullOrUndefined()
    @ApiProperty({ example: 'esraa@example.com', description: 'User email' })
    email: string;

    @IsNotEmpty()
    @IsNotNullOrUndefined()
    @IsAlpha({message: 'First name must contain only letters'})
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: 'Esraa', description: 'First Name' })
    firstName: string;

    @IsNotEmpty()
    @IsNotNullOrUndefined()
    @IsAlpha({message: 'Last name must contain only letters'})
    @Transform(({ value }) => value.trim())
    @ApiProperty({ example: 'Syam', description: 'Last Name' })
    lastName: string;

    @MinLength(6)
    @MaxLength(30)
    @IsNotNullOrUndefined()
    @ValidateIf(o => !o.isOAuthUser)
    @ApiProperty({ example: 'password123', description: 'Password' })
    password?: string;

    @IsOptional()   
    @ApiProperty({ enum: Roles, example: Roles.USER, description: 'User role', default: Roles.USER, required: false })
    role: Roles;

    @Transform(({ value }) => value ?? false)
    isOAuthUser?: boolean;
}