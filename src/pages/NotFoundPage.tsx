
import { Link } from 'react-router-dom';
import { Home, MoveLeft } from 'lucide-react';

export default function NotFoundPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="text-center">
                <p className="text-base font-semibold text-indigo-600">404</p>
                <h1 className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">Page not found</h1>
                <p className="mt-4 text-base text-gray-500">Sorry, we couldn't find the page you're looking for.</p>

                <div className="mt-10 flex cursor-pointer items-center justify-center gap-x-6">
                    <Link
                        to="/"
                        className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 flex items-center gap-2"
                    >
                        <Home className="w-4 h-4" /> Go back home
                    </Link>
                    <a href="#" onClick={() => window.history.back()} className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <MoveLeft className="w-4 h-4" /> Go back
                    </a>
                </div>
            </div>
        </div>
    );
}
