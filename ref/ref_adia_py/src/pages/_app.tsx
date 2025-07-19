import type { AppProps } from 'next/app';

// Import global styles
import '../styles/pdf.css';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default MyApp;
