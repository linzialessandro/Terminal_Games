/**
 * Vite injects BASE_URL from vite.config `base` (e.g. "/Terminal_Games/").
 * React Router basename must not have a trailing slash (except root "/").
 */
export function routerBasename(baseUrl: string = import.meta.env.BASE_URL): string {
  if (!baseUrl || baseUrl === '/') return '/';
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}
