/**
 * Register Page - Uses standard Tailwind classes
 */

import { Button } from "@/components/ui";
import { useUIStore } from "@/store";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import toast from "react-hot-toast";

export default function Register() {
  const { setAuthModalOpen, setAuthModalView } = useUIStore();
  const { loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const handleDemo = () => {
    loginAsDemo();
    toast.success("Demo mode loaded!");
    navigate("/dashboard");
  };

  // Redirect to modal on mount or just show a button to open it
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600 mb-8">Start building your startup today</p>

            <Button
              size="lg"
              className="w-full mb-3"
              onClick={() => {
                setAuthModalView('signup');
                setAuthModalOpen(true);
              }}
            >
              Sign Up with Pitchrr
            </Button>

            <button
              type="button"
              onClick={handleDemo}
              className="w-full h-11 mb-4 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
              style={{
                background: "rgba(16, 185, 129, 0.1)",
                color: "#059669",
                border: "1px solid rgba(16, 185, 129, 0.3)",
              }}
            >
              <Play className="w-4 h-4 fill-current" />
              Try Instant Demo (No Sign-Up)
            </button>

            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setAuthModalView('signin');
                  setAuthModalOpen(true);
                }}
                className="text-blue-600 font-medium hover:underline"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
