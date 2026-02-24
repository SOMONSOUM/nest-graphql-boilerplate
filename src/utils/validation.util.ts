import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError, ValidatorOptions } from 'class-validator';
import { ValidationErrorItem } from 'src/common/response';

/**
 * Format class-validator errors into a flat list of field/message pairs.
 *
 * @param {ValidationError[]} errors - Raw validation errors from class-validator.
 * @param {string} parentPath - Optional parent path for nested properties.
 * @returns {ValidationErrorItem[]} Flattened list of validation errors.
 */
export function formatValidationErrors(
  errors: ValidationError[],
  parentPath = '',
): ValidationErrorItem[] {
  const formatted: ValidationErrorItem[] = [];

  // Recursively process each validation error, including nested errors for complex objects
  errors.forEach((error) => {
    const field = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;
    const messages = error.constraints ? Object.values(error.constraints) : [];

    // Only include fields that have validation messages, and recursively format any child errors for nested objects or arrays
    if (messages.length > 0) {
      formatted.push({ field, messages });
    }

    // If there are child errors (e.g., for nested objects or arrays), recursively format them with the current field as the parent path
    if (error.children && error.children.length > 0) {
      formatted.push(...formatValidationErrors(error.children, field));
    }
  });

  return formatted;
}

/**
 * Validate an unknown payload against a DTO class and return typed input and errors.
 *
 * @template T - DTO type to validate against.
 * @param {ClassConstructor<T>} classRef - DTO class reference.
 * @param {unknown} payload - Raw payload to validate.
 * @param {ValidatorOptions} options - Optional validator settings.
 * @returns {Promise<{ input: T; errors: ValidationErrorItem[] }>} Validation result.
 */
export async function validateInput<T extends object>(
  classRef: ClassConstructor<T>,
  payload: unknown,
  options: ValidatorOptions = { stopAtFirstError: true },
): Promise<{ input: T; errors: ValidationErrorItem[] }> {
  // Transform the plain payload into an instance of the DTO class and validate it, returning both the typed input and any validation errors in a structured format.
  const input = plainToInstance(classRef, payload);

  // Validate the input using class-validator with the provided options, and format any validation errors into a consistent structure for easier handling in responses.
  const errors = await validate(input, options);

  return {
    input,
    errors: formatValidationErrors(errors),
  };
}
