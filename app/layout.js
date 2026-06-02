import "./globals.css";
import ClientWrapper from "@/components/ui/ClientWrapper";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata = {
  title: "FineFoods EM | Employee Hours Management",
  description: "Sophisticated employee management and hours tracking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
