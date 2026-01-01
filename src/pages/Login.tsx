import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "@/store";
import { useAuth } from "@clerk/clerk-react";

export default function Login() {
  const navigate = useNavigate();
  const { setAuthModalOpen } = useUIStore();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      navigate("/dashboard", { replace: true });
    } else {
      setAuthModalOpen(true);
      navigate("/", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate, setAuthModalOpen]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
