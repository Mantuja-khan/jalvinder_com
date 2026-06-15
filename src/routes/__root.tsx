import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { ReviewsProvider } from "@/context/ReviewsContext";
import { AuthProvider } from "@/context/AuthContext";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Toaster } from "@/components/ui/sonner";


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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Jalvindar Computer — Premium Laptops Online" },
      { name: "description", content: "Shop the latest ultrabooks, gaming and business laptops at Jalvindar Computer." },
      { property: "og:title", content: "Jalvindar Computer — Premium Laptops Online" },
      { name: "twitter:title", content: "Jalvindar Computer — Premium Laptops Online" },
      { property: "og:description", content: "Shop the latest ultrabooks, gaming and business laptops at Jalvindar Computer." },
      { name: "twitter:description", content: "Shop the latest ultrabooks, gaming and business laptops at Jalvindar Computer." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7633c504-6e7d-4e6e-967e-1137ceaa90b9/id-preview-81902e87--0922bc37-d768-4932-af47-0ddca50f9d33.lovable.app-1776794762673.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7633c504-6e7d-4e6e-967e-1137ceaa90b9/id-preview-81902e87--0922bc37-d768-4932-af47-0ddca50f9d33.lovable.app-1776794762673.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="font-sans">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

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
