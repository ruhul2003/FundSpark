import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'FundSpark - Next-Gen Crowdfunding Platform',
  description: 'Empowering creators, supporters, and global innovators through transparent credit-based crowdfunding.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans antialiased min-h-screen flex flex-col justify-between transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
