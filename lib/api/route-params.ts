type RouteParams<T extends Record<string, string>> = T | Promise<T>;

export async function resolveRouteParams<T extends Record<string, string>>(
  params: RouteParams<T>
): Promise<T> {
  return params instanceof Promise ? await params : params;
}
