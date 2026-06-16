import { Outlet, createRootRoute, Link } from "@tanstack/react-router";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";
import "../styles.css";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <AuthProvider>
      <ProductsProvider>
        <ReviewsProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col pb-16 lg:pb-0">
              <SiteHeader />
              <main className="flex-1">
                <Outlet />
              </main>
              <SiteFooter />
              <MobileBottomNav />
              <Toaster />
            </div>
          </CartProvider>
        </ReviewsProvider>
      </ProductsProvider>
    </AuthProvider>
  );
}
