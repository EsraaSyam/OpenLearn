import { Transform } from "class-transformer";
import { IsNotNullOrUndefined } from "src/validator/Is-not-null-or-undefined.decorator";

export class GetFilePathRequest {
    @IsNotNullOrUndefined()
    @Transform(({ value }) => value.trim())
    folderPath: string;

    @IsNotNullOrUndefined()
    @Transform(({ value }) => value.trim())
    shareUrl: string;

}