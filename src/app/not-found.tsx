import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-3">
        <p className="text-4xl font-bold">404</p>
        <p className="text-muted-foreground">Page not found</p>
        <Link href="/" className="text-primary text-sm underline underline-offset-4">
          Go home
        </Link>
      </div>
    </div>
  );
}
