import "./globals.css";

export const metadata = {
  title: "FineFoods EM | Employee Hours Management",
  description: "Sophisticated employee management and hours tracking system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
