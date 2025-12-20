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

function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  );
}

export default App;
