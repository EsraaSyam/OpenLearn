import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

export function IsAlpha(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: {
                validate(value: any) {
                    return typeof value === "string" && /^[a-zA-Z\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s]+$/.test(value);

                },
                defaultMessage: () => 'Value must contain only letters',
            }
        });
    };
}
