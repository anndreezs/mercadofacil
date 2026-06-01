import { Link, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ShoppingBasket } from "lucide-react";

interface Props {
  title?: string;
  subtitle?: string;
  back?: boolean;
}

export function AppHeader({ title = "Mercado Fácil", subtitle, back }: Props) {
  const router = useRouter();
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
        {back ? (
          <button
            onClick={() => router.history.back()}
            className="tap-press grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground"
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <Link
            to="/"
            className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary"
          >
            <ShoppingBasket className="h-5 w-5" />
          </Link>
        )}
        <div className="min-w-0">
          <h1 className="truncate text-base font-semibold">{title}</h1>
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}