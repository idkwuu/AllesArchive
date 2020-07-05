const authorization = process.env.NEXT_PUBLIC_AUTH;

export async function fetcher<T = any>(
  input: RequestInfo,
  init?: RequestInit
): Promise<T> {
  return await fetch(input, {
    ...init,
    headers: { authorization },
  }).then((res) => res.json());
}
