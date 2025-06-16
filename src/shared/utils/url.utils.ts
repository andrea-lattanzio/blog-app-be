export function generateFullWebLink(
  baseUrl: string,
  paths: string[],
  queryParams?: Record<string, string | number | boolean>,
): string {
  // baseUrl validation
  if (!/^https?:\/\/.+/i.test(baseUrl)) {
    throw new Error(`Invalid base URL: ${baseUrl}`);
  }

  // Create the full path by joining the provided paths divided by /
  const urlPath: string = paths.join('/');

  // Construct the complete URL
  const url: URL = new URL(urlPath, baseUrl);

  // Append query parameters, if provided
  if (queryParams) {
    Object.keys(queryParams).forEach((key: string) => {
      url.searchParams.append(key, String(queryParams[key]));
    });
  }

  return url.toString();
}
