
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FirestorePermissionError } from '@/firebase/errors';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  const isPermissionError = error instanceof FirestorePermissionError;

  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-muted">
           <Card className="max-w-xl text-center">
              <CardHeader>
                <CardTitle className="font-headline text-3xl">
                   {isPermissionError ? 'Access Denied' : 'Something Went Wrong'}
                </CardTitle>
                <CardDescription>
                  {isPermissionError 
                    ? "You don't have permission to access this resource."
                    : "An unexpected error occurred. We've been notified and are looking into it."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                 {isPermissionError && (
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md text-left text-xs font-mono overflow-auto max-h-60">
                        <pre><code>{JSON.stringify(error.request, null, 2)}</code></pre>
                    </div>
                 )}
                <Button onClick={() => reset()} className="mt-6">
                  Try again
                </Button>
              </CardContent>
            </Card>
        </div>
      </body>
    </html>
  );
}
