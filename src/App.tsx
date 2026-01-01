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
import { AuthModal } from '@/components/common/AuthModal';
import { useDBUser } from '@/hooks/useUser';

// Helper to sync Clerk user to DB
function AuthSync() {
  useDBUser();
  return null;
}

function App() {
  return (
    <Providers>
      <AuthSync />
      <AppRouter />
      <AuthModal />
    </Providers>
  );
}

export default App;
