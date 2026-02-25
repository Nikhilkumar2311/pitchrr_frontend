/**
 * Dashboard Home Page
 * Main dashboard with module overview, progress tracking,
 * Generate Idea feature, and skeleton loading
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import {
  Lightbulb,
  Megaphone,
  Palette,
  Presentation,
  Rocket,
  Users,
  ArrowRight,
  Download,
  Play,
  Sparkles,
  X,
  Loader2,
  ChevronRight,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardDescription,
  Button,
  ProgressBar,
  Badge,
} from "@/components/ui";
import { useIdeaStore, getStoredActiveIdeaId } from "@/store";
import { GenerateIdeaModal } from "@/components/common/GenerateIdeaModal";
import { IdeasListModal } from "@/components/common/IdeasListModal";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { useIdeas, useCreateIdea, type Idea } from "@/hooks";
import api from "@/services/api";
import { downloadFile } from "@/utils/download";
import { CreditCost, SEO } from "@/components/common";

type ModuleStatus = "not-started" | "in-progress" | "completed";

const modules: {
  id: string;
  icon: typeof Lightbulb;
  title: string;
  description: string;
  path: string;
  color: string;
  progress: number;
  status: ModuleStatus;
  exportCost: number;
}[] = [
    {
      id: "idea",
      icon: Lightbulb,
      title: "Idea Validation",
      description: "Validate your startup idea with AI-powered analysis",
      path: "/dashboard/idea",
      color: "#3B82F6",
      progress: 0,
      status: "not-started",
      exportCost: 2,
    },
    {
      id: "marketing",
      icon: Megaphone,
      title: "Marketing Strategy",
      description: "30-day marketing plan and customer personas",
      path: "/dashboard/marketing",
      color: "#10B981",
      progress: 0,
      status: "not-started",
      exportCost: 2,
    },
    {
      id: "branding",
      icon: Palette,
      title: "Branding",
      description: "Logo, colors, fonts, and brand identity",
      path: "/dashboard/branding",
      color: "#8B5CF6",
      progress: 0,
      status: "not-started",
      exportCost: 2,
    },
    {
      id: "pitch",
      icon: Presentation,
      title: "Pitch Deck",
      description: "Professional pitch deck with AI assistance",
      path: "/dashboard/pitch",
      color: "#F59E0B",
      progress: 0,
      status: "not-started",
      exportCost: 5,
    },
    {
      id: "gtm",
      icon: Rocket,
      title: "GTM Strategy",
      description: "Go-to-market plan with launch timeline",
      path: "/dashboard/gtm",
      color: "#EF4444",
      progress: 0,
      status: "not-started",
      exportCost: 2,
    },
    {
      id: "competitors",
      icon: Users,
      title: "Competitor Analysis",
      description: "Compare features and find your edge",
      path: "/dashboard/competitors",
      color: "#06B6D4",
      progress: 0,
      status: "not-started",
      exportCost: 2,
    }
  ];

const getStatusBadge = (status: ModuleStatus) => {
  switch (status) {
    case "not-started":
      return { variant: "default" as const, label: "Not Started" };
    case "in-progress":
      return { variant: "warning" as const, label: "In Progress" };
    case "completed":
      return { variant: "success" as const, label: "Completed" };
  }
};

export default function Dashboard() {
  const { user } = useUser();
  const {
    setIdea,
    currentIdea,
    setActiveIdeaId,
    activeIdeaId: storedActiveIdeaId
  } = useIdeaStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isIdeasListOpen, setIsIdeasListOpen] = useState(false);
  const [isIdeaBannerVisible, setIsIdeaBannerVisible] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [moduleProgress, setModuleProgress] = useState<Record<string, number>>(
    {}
  );
  const queryClient = useQueryClient();

  // Fetch user's ideas
  const { data: ideas } = useIdeas();

  // Read from localStorage directly on initial render to avoid async hydration delay
  const initialStoredId = useMemo(() => getStoredActiveIdeaId(), []);

  // Use stored active idea from zustand (now syncs properly with localStorage)
  // Fall back to localStorage sync read, then first idea if no active idea is set
  const activeIdeaId = storedActiveIdeaId || initialStoredId || ideas?.[0]?.id;
  const activeIdea = ideas?.find(idea => idea.id === activeIdeaId) || ideas?.[0];

  // Derive currentIdea display from activeIdea if store is empty
  const displayIdea = currentIdea || (activeIdea ? {
    title: activeIdea.title,
    description: activeIdea.description,
    problem: activeIdea.problemSolved || undefined,
    targetMarket: activeIdea.targetAudience || undefined,
    industry: activeIdea.industry || undefined,
  } : null);

  // Map module types to API names
  const moduleApiNames: Record<string, string> = {
    idea: "IDEA_VALIDATION",
    marketing: "MARKETING_STRATEGY",
    branding: "BRANDING",
    pitch: "PITCH_DECK",
    gtm: "GTM_STRATEGY",
    competitors: "COMPETITOR_ANALYSIS",
  };

  // Fetch progress when idea changes
  useEffect(() => {
    async function fetchProgress() {
      if (!activeIdeaId) {
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await api.get(
          `/ideas/${activeIdeaId}/modules/progress-summary`
        );
        const progressMap: Record<string, number> = {};
        data.modules?.forEach((m: { moduleType: string; progress: number }) => {
          // Find matching module id
          const entry = Object.entries(moduleApiNames).find(
            ([, v]) => v === m.moduleType
          );
          if (entry) progressMap[entry[0]] = m.progress;
        });
        setModuleProgress(progressMap);
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProgress();
  }, [activeIdeaId]);

  // Calculate modules with real progress
  const modulesWithProgress = useMemo(
    () =>
      modules.map((m) => ({
        ...m,
        progress: moduleProgress[m.id] ?? 0,
        status: (moduleProgress[m.id] === 100
          ? "completed"
          : moduleProgress[m.id] > 0
            ? "in-progress"
            : "not-started") as ModuleStatus,
      })),
    [moduleProgress]
  );

  const overallProgress = Math.round(
    modulesWithProgress.reduce((acc, m) => acc + m.progress, 0) /
    modulesWithProgress.length
  );

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Check for 'generate=true' query param on mount
  useEffect(() => {
    if (searchParams.get('generate') === 'true') {
      setIsGenerateModalOpen(true);
      // Clean up the URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('generate');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Create idea mutation
  const { mutate: createIdea } = useCreateIdea();

  // Handle generated idea - save to database AND store, then navigate
  const handleIdeaGenerated = (idea: {
    title: string;
    description: string;
    problem?: string;
    solution?: string;
    targetMarket?: string;
    industry?: string;
  }) => {
    // Create idea in database first
    createIdea(
      {
        title: idea.title,
        description: idea.description,
        problemSolved: idea.problem,
        targetAudience: idea.targetMarket,
        industry: idea.industry,
      },
      {
        onSuccess: (newIdea) => {
          // Save to local store with the database ID
          setIdea({
            id: newIdea.id,
            title: newIdea.title,
            description: newIdea.description,
            problem: newIdea.problemSolved || undefined,
            targetMarket: newIdea.targetAudience || undefined,
            industry: newIdea.industry || idea.industry || undefined,
          });
          // Set as active idea
          setActiveIdeaId(newIdea.id);
          // Navigate to Idea Validation
          navigate("/dashboard/idea");
        },
      }
    );
  };

  // Export All handler
  const handleExportAll = useCallback(async () => {
    if (!activeIdeaId) {
      toast.error("No idea found. Please create one first.");
      return;
    }
    setIsExporting(true);
    try {
      const { data } = await api.post(`/export/all/${activeIdeaId}`);
      const jobId = data.jobId;

      // Update credits cache directly with new balance from response
      if (data.newBalance !== undefined) {
        queryClient.setQueryData(["credits", "stats"], (old: any) => ({
          ...old,
          balance: data.newBalance,
        }));
      }

      // Poll for completion
      const pollStatus = async () => {
        const { data: status } = await api.get(`/export/status/${jobId}`);
        if (status.state === "completed" && status.downloadUrl) {
          await downloadFile(status.downloadUrl, "complete_export.zip");
          toast.success("Export completed!");
          setIsExporting(false);
        } else if (status.state === "failed") {
          toast.error(
            "Export failed: " + (status.failedReason || "Unknown error")
          );
          setIsExporting(false);
        } else {
          setTimeout(pollStatus, 2000);
        }
      };
      pollStatus();
    } catch (err) {
      toast.error("Failed to start export");
      setIsExporting(false);
    }
  }, [activeIdeaId]);

  // Show skeleton while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <>
      <SEO
        title="Dashboard"
        description="Your startup command center. Track progress across all modules, generate AI-powered ideas, and export investor-ready materials."
        canonical="/dashboard"
      />
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "Founder"}! 👋
            </h2>
            <p className="mt-1 text-gray-600">
              Continue building your startup with Pitchrr
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Generate Idea Button - Primary Blue */}
            <Button
              variant="secondary"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => setIsGenerateModalOpen(true)}
              className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <span className="flex items-center gap-2">
                <span>Generate Idea</span>
                <CreditCost cost={2} />
              </span>
            </Button>
            <Button
              variant="secondary"
              leftIcon={
                isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Download className="w-4 h-4" />
                )
              }
              onClick={handleExportAll}
              disabled={isExporting || !activeIdeaId}
            >
              <span className="flex items-center gap-2">
                <span>{isExporting ? "Exporting..." : "Export All"}</span>
                {!isExporting && <CreditCost cost={15} />}
              </span>
            </Button>
            <Link to="/dashboard/idea">
              <Button rightIcon={<Play className="w-4 h-4" />}>Continue</Button>
            </Link>
          </div>
        </div>

        {/* Current Idea Card - Show if idea exists */}
        {displayIdea && isIdeaBannerVisible && (
          <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200 relative">
            <button
              onClick={() => setIsIdeaBannerVisible(false)}
              className="absolute top-2 right-2 p-1 text-blue-300 hover:text-blue-600 hover:bg-white/50 rounded-full transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shrink-0">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">
                  Your Current Idea
                </h3>
                <p className="text-lg font-bold text-gray-900">
                  {displayIdea.title}
                </p>
                <p className="text-sm text-blue-700 mt-1 line-clamp-2">
                  {displayIdea.description}
                </p>
              </div>
              <Link to="/dashboard/idea">
                <Button rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Continue Validation
                </Button>
              </Link>
            </div>
          </Card>
        )}

        {/* See All Ideas + Overall Progress */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
          {ideas && ideas.length > 1 && (
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ChevronRight className="w-4 h-4" />}
              onClick={() => setIsIdeasListOpen(true)}
              className="shrink-0"
            >
              See All Ideas ({ideas.length})
            </Button>
          )}
        </div>
        <Card>
          <CardHeader>
            <CardDescription>
              Complete all 7 modules to be investor-ready
            </CardDescription>
          </CardHeader>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Completion
              </span>
              <span className="text-sm font-bold text-blue-600">
                {overallProgress}%
              </span>
            </div>
            <ProgressBar value={overallProgress} size="lg" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="default">
              {
                modulesWithProgress.filter((m) => m.status === "not-started")
                  .length
              }{" "}
              Not Started
            </Badge>
            <Badge variant="warning">
              {
                modulesWithProgress.filter((m) => m.status === "in-progress")
                  .length
              }{" "}
              In Progress
            </Badge>
            <Badge variant="success">
              {
                modulesWithProgress.filter((m) => m.status === "completed")
                  .length
              }{" "}
              Completed
            </Badge>
          </div>
        </Card>

        {/* Module Cards Grid */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {modulesWithProgress.map((module, index) => {
              const Icon = module.icon;
              const statusBadge = getStatusBadge(module.status);
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={module.path}>
                    <Card hover className="h-full">
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${module.color}15` }}
                        >
                          <Icon
                            className="w-6 h-6"
                            style={{ color: module.color }}
                          />
                        </div>
                        <Badge variant={statusBadge.variant}>
                          {statusBadge.label}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <p className="text-sm text-gray-600 flex-1">
                          {module.description}
                        </p>
                        {module.exportCost > 0 && (
                          <span className="text-xs font-medium text-amber-700 bg-amber-50 px-2 py-1 rounded-full border border-amber-200 whitespace-nowrap">
                            {module.exportCost} credits
                          </span>
                        )}
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-1 text-xs">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-gray-700">
                            {module.progress}%
                          </span>
                        </div>
                        <ProgressBar value={module.progress} size="sm" />
                      </div>
                      <div className="flex items-center justify-end mt-4 text-blue-600">
                        <span className="text-sm font-medium mr-1">
                          {module.status === "not-started"
                            ? "Start"
                            : "Continue"}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Don't have an idea card - Primary Blue */}
        {!displayIdea && (
          <Card className="bg-linear-to-r from-blue-50 to-indigo-50 border-blue-200">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">
                  Don't have an idea yet?
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Let our AI help you discover startup ideas based on your
                  interests, skills, and market trends.
                </p>
              </div>
              <Button
                onClick={() => setIsGenerateModalOpen(true)}
                rightIcon={<Sparkles className="w-4 h-4" />}
              >
                Generate Idea
              </Button>
            </div>
          </Card>
        )}

        {/* Getting Started Tip */}
        <Card className="bg-linear-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-blue-800">
                💡 Getting Started Tip
              </h3>
              <p className="text-sm text-blue-700 mt-1">
                Start with <strong>Idea Validation</strong> to get an AI-powered
                assessment of your startup idea. This will guide the rest of
                your planning.
              </p>
            </div>
            <Link to="/dashboard/idea">
              <Button>Start Idea Validation</Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* Generate Idea Modal */}
      <GenerateIdeaModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onIdeaGenerated={handleIdeaGenerated}
      />

      {/* Ideas List Modal */}
      <IdeasListModal
        isOpen={isIdeasListOpen}
        onClose={() => setIsIdeasListOpen(false)}
        onSelectIdea={(idea: Idea) => {
          setActiveIdeaId(idea.id);
          setIdea({
            id: idea.id,
            title: idea.title,
            description: idea.description,
            problem: idea.problemSolved || undefined,
            targetMarket: idea.targetAudience || undefined,
            industry: idea.industry || undefined,
          });
        }}
        onCreateNew={() => setIsGenerateModalOpen(true)}
      />
    </>
  );
}
