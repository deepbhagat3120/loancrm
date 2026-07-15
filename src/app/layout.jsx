
import './globals.css';
export const metadata = { title: 'MyLoanCRM', description: 'CRM built with Next.js' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
