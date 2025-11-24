import 'next/app';

declare module 'next/app' {
  interface PageProps<AppRoute = any> {
    params?: Record<string, string | string[] | undefined>;
    searchParams?: Record<string, string | string[] | undefined>;
  }
}
