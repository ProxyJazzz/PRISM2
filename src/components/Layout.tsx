import { ReactNode } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import NeuralBackground from './NeuralBackground';

export default function Layout({ children }: { children?: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-prism-accent/30 selection:text-prism-glow">
      <NeuralBackground />
      <Navbar />
      <main className="grow pt-16 flex flex-col">
        {children}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}