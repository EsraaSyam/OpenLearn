import { ArgumentMetadata, FileTypeValidator, Injectable, MaxFileSizeValidator, ParseFilePipe, PipeTransform } from '@nestjs/common';

@Injectable()
export class OptionalImageFilePipe implements PipeTransform {
    private readonly validators = [ 
        new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
        new FileTypeValidator({ fileType: /image\/(jpg|jpeg|png|webp)/ }),
    ];

    async transform(file: Express.Multer.File | undefined, metadata: ArgumentMetadata): Promise<Express.Multer.File | undefined> {
        if (!file) return file; // undefined

        const pipe = new ParseFilePipe({
            fileIsRequired: false,
            validators: this.validators,
        });

        return pipe.transform(file);
    }
}
