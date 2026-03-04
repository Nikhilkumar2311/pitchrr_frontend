/**
 * Dashboard Home Page
 * Main dashboard with module overview, progress tracking,
 * Generate Idea feature, and skeleton loading
 * 
 * Visual redesign — all logic, routing, and data flow preserved.
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
      color: "#4F7DF3",
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

// Status dot colors
const statusDotColor: Record<ModuleStatus, string> = {
  "not-started": "#94A3B8",
  "in-progress": "#F59E0B",
  "completed": "#22C55E",
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

  const completedCount = modulesWithProgress.filter((m) => m.status === "completed").length;

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

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="space-y-6"
      >
        {/* Welcome Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2
              className="text-2xl font-bold"
              style={{
                fontFamily: "var(--dash-font-heading)",
                color: "var(--dash-text)",
              }}
            >
              Welcome back, {user?.firstName || "Founder"} 👋
            </h2>
            <p
              className="mt-1 text-[15px]"
              style={{ color: "var(--dash-text-muted)" }}
            >
              Continue building your startup with Pitchrr
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {/* Generate Idea Button */}
            <Button
              variant="secondary"
              leftIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => setIsGenerateModalOpen(true)}
              className="!bg-[rgba(79,125,243,0.06)] !border-[rgba(79,125,243,0.15)] !text-[#4F7DF3] hover:!bg-[rgba(79,125,243,0.1)] !rounded-[8px] !text-[13px] !font-semibold"
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
              className="!rounded-[8px] !text-[13px] !font-semibold"
            >
              <span className="flex items-center gap-2">
                <span>{isExporting ? "Exporting..." : "Export All"}</span>
                {!isExporting && <CreditCost cost={15} />}
              </span>
            </Button>
            <Link to="/dashboard/idea">
              <Button
                rightIcon={<Play className="w-4 h-4" />}
                className="!rounded-[8px] !text-[13px]"
                style={{
                  background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
                }}
              >
                Continue
              </Button>
            </Link>
          </div>
        </div>

        {/* Current Idea Card - Show if idea exists */}
        {displayIdea && isIdeaBannerVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card
              className="relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(79,125,243,0.04), rgba(122,92,255,0.04))",
                border: "1px solid rgba(79,125,243,0.12)",
              }}
            >
              <button
                onClick={() => setIsIdeaBannerVisible(false)}
                className="absolute top-3 right-3 p-1 text-gray-300 hover:text-gray-500 rounded-full transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
                    boxShadow: "0 4px 12px rgba(79,125,243,0.25)",
                  }}
                >
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "#4F7DF3" }}>
                    Current Idea
                  </p>
                  <h3
                    className="font-semibold text-[15px] truncate"
                    style={{ color: "var(--dash-text)", fontFamily: "var(--dash-font-heading)" }}
                  >
                    {displayIdea.title}
                  </h3>
                  <p className="text-[13px] mt-0.5 line-clamp-1" style={{ color: "var(--dash-text-muted)" }}>
                    {displayIdea.description}
                  </p>
                </div>
                <Link to="/dashboard/idea" className="shrink-0">
                  <Button
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    className="!rounded-[8px] !text-[13px]"
                    style={{
                      background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
                    }}
                  >
                    Continue
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Progress Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: "var(--dash-font-heading)", color: "var(--dash-text)" }}
            >
              Your Progress
            </h2>
            {ideas && ideas.length > 1 && (
              <Button
                variant="secondary"
                size="sm"
                rightIcon={<ChevronRight className="w-4 h-4" />}
                onClick={() => setIsIdeasListOpen(true)}
                className="shrink-0 !rounded-[8px] !text-[12px]"
              >
                See All Ideas ({ideas.length})
              </Button>
            )}
          </div>
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <CardHeader className="!mb-0">
                  <CardDescription>
                    Complete all modules to be investor-ready
                  </CardDescription>
                </CardHeader>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  {completedCount} of {modulesWithProgress.length} completed
                </span>
                <span
                  className="text-[15px] font-bold"
                  style={{ color: "#4F7DF3" }}
                >
                  {overallProgress}%
                </span>
              </div>
            </div>
            <ProgressBar value={overallProgress} size="lg" />
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="default">
                {modulesWithProgress.filter((m) => m.status === "not-started").length}{" "}
                Not Started
              </Badge>
              <Badge variant="warning">
                {modulesWithProgress.filter((m) => m.status === "in-progress").length}{" "}
                In Progress
              </Badge>
              <Badge variant="success">
                {modulesWithProgress.filter((m) => m.status === "completed").length}{" "}
                Completed
              </Badge>
            </div>
          </Card>
        </div>

        {/* Module Cards Grid */}
        <div>
          <h2
            className="text-lg font-semibold mb-4"
            style={{ fontFamily: "var(--dash-font-heading)", color: "var(--dash-text)" }}
          >
            Your Modules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {modulesWithProgress.map((module, index) => {
              const Icon = module.icon;
              const statusBadge = getStatusBadge(module.status);
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.06, duration: 0.35 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <Link to={module.path}>
                    <Card hover className="h-full relative overflow-hidden">
                      {/* Top accent gradient line */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{
                          background: module.progress > 0
                            ? `linear-gradient(90deg, ${module.color}, ${module.color}80)`
                            : `linear-gradient(90deg, ${module.color}30, transparent)`,
                        }}
                      />
                      <div className="flex items-start justify-between mb-3 pt-1">
                        <div
                          className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                          style={{ backgroundColor: `${module.color}0D` }}
                        >
                          <Icon
                            className="w-5 h-5"
                            style={{ color: module.color }}
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: statusDotColor[module.status] }}
                          />
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                      </div>
                      <h3
                        className="font-semibold text-[14px] mb-1"
                        style={{
                          color: "var(--dash-text)",
                          fontFamily: "var(--dash-font-heading)",
                        }}
                      >
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-4">
                        <p className="text-[13px] flex-1" style={{ color: "var(--dash-text-muted)" }}>
                          {module.description}
                        </p>
                        {module.exportCost > 0 && (
                          <CreditCost cost={module.exportCost} />
                        )}
                      </div>
                      <div className="mt-auto">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px]" style={{ color: "var(--dash-text-muted)" }}>
                            Progress
                          </span>
                          <span
                            className="text-[11px] font-semibold"
                            style={{ color: "var(--dash-text-secondary)" }}
                          >
                            {module.progress}%
                          </span>
                        </div>
                        <ProgressBar value={module.progress} size="sm" />
                      </div>
                      <div className="flex items-center justify-end mt-3.5">
                        <span
                          className="text-[12px] font-semibold flex items-center gap-1 transition-colors"
                          style={{ color: "#4F7DF3" }}
                        >
                          {module.status === "not-started"
                            ? "Start"
                            : "Continue"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Don't have an idea card */}
        {!displayIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card
              style={{
                background: "linear-gradient(135deg, rgba(79,125,243,0.04), rgba(122,92,255,0.04))",
                border: "1px solid rgba(79,125,243,0.12)",
              }}
            >
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
                    boxShadow: "0 4px 12px rgba(79,125,243,0.25)",
                  }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3
                    className="font-semibold text-[15px]"
                    style={{ color: "var(--dash-text)", fontFamily: "var(--dash-font-heading)" }}
                  >
                    Don't have an idea yet?
                  </h3>
                  <p className="text-[13px] mt-0.5" style={{ color: "var(--dash-text-muted)" }}>
                    Let our AI help you discover startup ideas based on your
                    interests, skills, and market trends.
                  </p>
                </div>
                <Button
                  onClick={() => setIsGenerateModalOpen(true)}
                  rightIcon={<Sparkles className="w-4 h-4" />}
                  className="!rounded-[8px]"
                  style={{
                    background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
                  }}
                >
                  Generate Idea
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Getting Started Tip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <Card
            style={{
              background: "linear-gradient(135deg, rgba(79,125,243,0.03), rgba(122,92,255,0.03))",
              border: "1px solid rgba(79,125,243,0.08)",
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-1">
                <h3
                  className="font-semibold text-[14px]"
                  style={{ color: "var(--dash-text)", fontFamily: "var(--dash-font-heading)" }}
                >
                  💡 Getting Started Tip
                </h3>
                <p className="text-[13px] mt-1" style={{ color: "var(--dash-text-muted)" }}>
                  Start with <strong>Idea Validation</strong> to get an AI-powered
                  assessment of your startup idea. This will guide the rest of
                  your planning.
                </p>
              </div>
              <Link to="/dashboard/idea" className="shrink-0">
                <Button
                  className="!rounded-[8px] !text-[13px]"
                  style={{
                    background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
                  }}
                >
                  Start Idea Validation
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </motion.div>

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
