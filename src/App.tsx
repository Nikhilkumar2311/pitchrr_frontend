/**
 * Main Application Entry Point
 * 
 * This is where the React application starts.
 * 
 * STRUCTURE:
 * - Providers: Wraps app with React Query, Toast, etc.
 * - AppRouter: Handles all routing
 */

import { Providers } from '@/app/providers';
import { AppRouter } from '@/app/router';
import { useDBUser } from '@/hooks/useUser';
import { FeedbackWidget } from '@/components/FeedbackWidget';
import { FeedbackProvider } from '@/context/FeedbackContext';

// Helper to sync Clerk user to DB
function AuthSync() {
  useDBUser();
  return null;
}

function App() {
  return (
    <Providers>
      <FeedbackProvider>
        <AuthSync />
        <AppRouter />
        <FeedbackWidget />
      </FeedbackProvider>
    </Providers>
  );
}

export default App;
