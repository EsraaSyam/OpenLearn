import { Transform } from "class-transformer";
import { IsDefined, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, ValidateIf } from "class-validator";
import { AtLeastOneRequired } from "src/validator/at-least-one-required.decorator";
import { IsNotNullOrUndefined } from "src/validator/Is-not-null-or-undefined.decorator";

export class UpdateSectionRequest {
    @IsNotNullOrUndefined()
    @IsString()
    @MaxLength(80)
    @IsOptional()
    @Transform(({ value }) => value.trim())
    title?: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    order?: number;

    @AtLeastOneRequired(['title', 'order'])
    _atLeastOneRequired?: string;
}