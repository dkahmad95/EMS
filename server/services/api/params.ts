/**
 * Strips undefined / null / "" values so they are not serialized into the query string.
 * The backend ValidationPipe runs with forbidNonWhitelisted + typed DTOs, so an empty
 * `search=` or `office_id=` would otherwise fail validation or be misinterpreted.
 */
export const cleanParams = (params: Record<string, unknown> = {}): Record<string, unknown> =>
  Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
