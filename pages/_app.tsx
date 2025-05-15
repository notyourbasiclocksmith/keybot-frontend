import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/ui/Layout';
import { LayoutProvider } from '../components/ui/LayoutContext';

type NextPageWithLayout = AppProps & {
  Component: AppProps['Component'] & {
    getLayout?: (page: React.ReactElement) => React.ReactNode
  }
}

function MyApp({ Component, pageProps }: NextPageWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: React.ReactElement) => page)

  return (
    <>
      <Toaster position="top-right" />
      <LayoutProvider>
        <Layout>
          {getLayout(<Component {...pageProps} />)}
        </Layout>
      </LayoutProvider>
    </>
  );
}

export default MyApp;
