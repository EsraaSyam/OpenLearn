import { IsNumber, IsOptional, IsPositive, IsString, MaxLength } from "class-validator";
import { IsNotNullOrUndefined } from "src/validator/Is-not-null-or-undefined.decorator";

export class UpdateSectionRequest {
    @IsNotNullOrUndefined()
    @IsString()
    @MaxLength(80)
    @IsOptional()
    title?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    order?: number;
}