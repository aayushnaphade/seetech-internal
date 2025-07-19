import { useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * Root page that redirects to projects list
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/projects');
  }, [router]);

  return null;
}
