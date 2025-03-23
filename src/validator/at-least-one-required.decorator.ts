import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function AtLeastOneRequired(properties: string[], validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'AtLeastOneRequired',
            target: object.constructor,
            propertyName: propertyName,
            constraints: properties,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const object = args.object as any;
                    return properties.some(prop => object[prop] !== undefined);
                },
                defaultMessage(args: ValidationArguments) {
                    return `At least one of ${args.constraints.join(', ')} must be provided.`;
                },
            },
        });
    };
}
