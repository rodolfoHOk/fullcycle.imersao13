import DefaultNavbar from '@/components/Navbar';
import './globals.css';
import FlowbiteContext from '@/components/FlowbiteContext';

export const metadata = {
  title: 'Home Broker',
  description: 'Home Broker - Imersão Full Cycle',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-gray-900 h-screen flex flex-col">
        <DefaultNavbar />
        <FlowbiteContext>{children}</FlowbiteContext>
      </body>
    </html>
  );
}
