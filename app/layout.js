import "./globals.css";
import { ThemeProvider } from "@/components/ThemeContext";
import { AuthProvider } from "@/components/AuthProvider";
import ClientWrapper from "@/components/ui/ClientWrapper";

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
            <ClientWrapper>
              {children}
            </ClientWrapper>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
