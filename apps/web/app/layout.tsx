import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'Nordic Verse',
  description: 'Sosial 3D hub, parkour og UGC-editor for Nordic Verse'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
