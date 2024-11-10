import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsBpDateFormat(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isBpDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const datePattern = /^\d{4}-\d{2}-\d{2}$/;
          return typeof value === 'string' && datePattern.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid date in the format YYYY-MM-DD`;
        }
      }
    });
  };
}