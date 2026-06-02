import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { AuthProvider } from "@/components/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";
import ClientWrapper from "@/components/ui/ClientWrapper";
import { SearchProvider } from "@/components/SearchContext";

export const metadata = {
  title: "FineFoods EM | Employee Hours Management",
  description: "Sophisticated employee management and hours tracking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <SearchProvider>
                <ClientWrapper>
                  {children}
                </ClientWrapper>
              </SearchProvider>
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
