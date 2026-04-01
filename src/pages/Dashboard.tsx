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
import { useAuth } from "@/context/AuthContext";
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
  Loader2,
  ChevronRight,
  FileText,
  Upload,
  X,
} from "lucide-react";
import {
  Card,
  Button,
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



// Status dot colors
const statusDotColor: Record<ModuleStatus, string> = {
  "not-started": "#94A3B8",
  "in-progress": "#F59E0B",
  "completed": "#22C55E",
};

export default function Dashboard() {
  const { user } = useAuth();
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
  const [isExporting, setIsExporting] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryLogo, setSummaryLogo] = useState<string | null>(null);
  const [summaryLogoName, setSummaryLogoName] = useState<string | null>(null);
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
        startupStage: 'Idea',
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
            startupStage: 'Idea',
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

  // Startup Summary handler
  const handleGenerateSummary = useCallback(async () => {
    if (!activeIdeaId) {
      toast.error("No idea found. Please create one first.");
      return;
    }
    setIsGeneratingSummary(true);
    setIsSummaryModalOpen(false);
    try {
      const { data } = await api.post(`/export/startup-summary/${activeIdeaId}`, {
        logoBase64: summaryLogo || undefined,
      });
      const jobId = data.jobId;

      // Update credits cache
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
          await downloadFile(status.downloadUrl, "startup_summary.pdf");
          toast.success("Startup summary downloaded!");
          setIsGeneratingSummary(false);
        } else if (status.state === "failed") {
          toast.error(
            "Summary generation failed: " + (status.failedReason || "Unknown error")
          );
          setIsGeneratingSummary(false);
        } else {
          setTimeout(pollStatus, 2000);
        }
      };
      pollStatus();
    } catch (err) {
      toast.error("Failed to generate startup summary");
      setIsGeneratingSummary(false);
    }
  }, [activeIdeaId, summaryLogo]);

  // Logo upload handler
  const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setSummaryLogo(reader.result as string);
      setSummaryLogoName(file.name);
    };
    reader.readAsDataURL(file);
  }, []);

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
        className="space-y-8"
      >
        {/* ═══════════════════════════════════════════════
            HERO STRIP — Welcome + Current Idea (no card)
         ═══════════════════════════════════════════════ */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
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

              {/* Current idea info — inline with switch button */}
              {displayIdea ? (
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
                    style={{
                      background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
                    }}
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="text-[13px] font-medium truncate"
                      style={{ color: "var(--dash-text-secondary)" }}
                    >
                      Working on: <strong style={{ color: "var(--dash-text)" }}>{displayIdea.title}</strong>
                    </span>
                    {ideas && ideas.length > 1 && (
                      <button
                        onClick={() => setIsIdeasListOpen(true)}
                        className="shrink-0 flex items-center gap-1.5 cursor-pointer"
                        style={{
                          padding: "4px 10px 4px 12px",
                          borderRadius: 8,
                          background: "rgba(79,125,243,0.06)",
                          border: "1px solid rgba(79,125,243,0.12)",
                          fontSize: 12,
                          fontWeight: 600,
                          color: "#4F7DF3",
                          transition: "all 0.15s ease",
                          fontFamily: "var(--dash-font-body, 'Inter', sans-serif)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "rgba(79,125,243,0.1)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "rgba(79,125,243,0.06)";
                        }}
                      >
                        Switch
                        <span
                          style={{
                            background: "rgba(79,125,243,0.12)",
                            borderRadius: 5,
                            padding: "1px 5px",
                            fontSize: 10,
                            fontWeight: 700,
                          }}
                        >
                          {ideas.length}
                        </span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <p
                  className="mt-1 text-[14px]"
                  style={{ color: "var(--dash-text-muted)" }}
                >
                  Continue building your startup with Pitchrr
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <Button
                variant="secondary"
                leftIcon={<Sparkles className="w-4 h-4" />}
                onClick={() => setIsGenerateModalOpen(true)}
                className="!bg-[rgba(79,125,243,0.06)] !border-[rgba(79,125,243,0.15)] !text-[#4F7DF3] hover:!bg-[rgba(79,125,243,0.1)]"
              >
                <span className="flex items-center gap-2">
                  <span>Generate Idea</span>
                  <CreditCost cost={2} />
                </span>
              </Button>
              <Button
                variant="secondary"
                leftIcon={
                  isGeneratingSummary ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileText className="w-4 h-4" />
                  )
                }
                onClick={() => setIsSummaryModalOpen(true)}
                disabled={isGeneratingSummary || !activeIdeaId}
              >
                <span className="flex items-center gap-2">
                  <span>{isGeneratingSummary ? "Generating..." : "Startup Summary"}</span>
                  {!isGeneratingSummary && <CreditCost cost={2} />}
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
                <Button
                  rightIcon={<Play className="w-4 h-4" />}
                  style={{
                    background: "linear-gradient(135deg, #4F7DF3, #7A5CFF)",
                  }}
                >
                  Continue
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            INLINE PROGRESS STRIP (no card wrapper)
         ═══════════════════════════════════════════════ */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-3">
              <h3
                className="text-[14px] font-semibold"
                style={{ fontFamily: "var(--dash-font-heading)", color: "var(--dash-text)" }}
              >
                Progress
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-[12px]"
                style={{ color: "var(--dash-text-muted)" }}
              >
                {completedCount}/{modulesWithProgress.length} modules
              </span>
              <span
                className="text-[14px] font-bold"
                style={{ color: "#4F7DF3" }}
              >
                {overallProgress}%
              </span>
            </div>
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.04)" }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              style={{
                background: "linear-gradient(90deg, #4F7DF3, #7A5CFF)",
              }}
            />
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            MODULE ROWS — Compact, not cards
         ═══════════════════════════════════════════════ */}
        <div>
          <h3
            className="text-[14px] font-semibold mb-3"
            style={{ fontFamily: "var(--dash-font-heading)", color: "var(--dash-text)" }}
          >
            Modules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {modulesWithProgress.map((module, index) => {
              const Icon = module.icon;
              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04, duration: 0.3 }}
                >
                  <Link to={module.path}>
                    <div
                      className="group relative flex items-center gap-4 py-4 px-4 rounded-[12px] transition-all duration-200 cursor-pointer"
                      style={{
                        background: 'rgba(0,0,0,0.015)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${module.color}08`;
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(0,0,0,0.015)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {/* Accent edge on hover */}
                      <div
                        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        style={{ background: module.color }}
                      />

                      {/* Icon */}
                      <div
                        className="w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${module.color}0D` }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{ color: module.color }}
                        />
                      </div>

                      {/* Title + description + progress */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[14px] font-semibold truncate"
                            style={{
                              color: "var(--dash-text)",
                              fontFamily: "var(--dash-font-heading)",
                            }}
                          >
                            {module.title}
                          </span>
                          <CreditCost cost={module.exportCost} />
                        </div>
                        <p
                          className="text-[12px] mt-0.5 truncate"
                          style={{ color: "var(--dash-text-muted)" }}
                        >
                          {module.description}
                        </p>
                        {/* Progress bar */}
                        <div className="w-full h-1 rounded-full overflow-hidden mt-2.5" style={{ background: "rgba(0,0,0,0.05)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${module.progress}%`,
                              background: module.progress > 0
                                ? `linear-gradient(90deg, ${module.color}, ${module.color}80)`
                                : "transparent",
                            }}
                          />
                        </div>
                      </div>

                      {/* Status + arrow */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ background: statusDotColor[module.status] }}
                          />
                          <span
                            className="text-[12px] font-medium"
                            style={{ color: "var(--dash-text-muted)" }}
                          >
                            {module.progress}%
                          </span>
                        </div>
                        <ArrowRight
                          className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ color: module.color }}
                        />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            "NO IDEA" CTA — only card on the page
         ═══════════════════════════════════════════════ */}
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

        {/* ═══════════════════════════════════════════════
            IDEA OVERVIEW — fills space with useful context
         ═══════════════════════════════════════════════ */}
        {displayIdea && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            <h3
              className="text-[14px] font-semibold mb-3"
              style={{ fontFamily: "var(--dash-font-heading)", color: "var(--dash-text)" }}
            >
              Idea Overview
            </h3>
            <div
              className="rounded-[12px] p-5"
              style={{
                background: "linear-gradient(135deg, rgba(79,125,243,0.02), rgba(122,92,255,0.02))",
                border: "1px solid rgba(79,125,243,0.08)",
              }}
            >
              {/* Description */}
              {displayIdea.description && (
                <p
                  className="text-[13px] leading-relaxed mb-4"
                  style={{ color: "var(--dash-text-secondary)" }}
                >
                  {displayIdea.description}
                </p>
              )}

              {/* Meta tags */}
              <div className="flex flex-wrap gap-2">
                {displayIdea.industry && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-[8px]"
                    style={{
                      background: "rgba(79,125,243,0.06)",
                      color: "#4F7DF3",
                      border: "1px solid rgba(79,125,243,0.1)",
                    }}
                  >
                    🏢 {displayIdea.industry}
                  </span>
                )}
                {displayIdea.targetMarket && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-[8px]"
                    style={{
                      background: "rgba(16,185,129,0.06)",
                      color: "#059669",
                      border: "1px solid rgba(16,185,129,0.1)",
                    }}
                  >
                    🎯 {displayIdea.targetMarket}
                  </span>
                )}
                {displayIdea.problem && (
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-[8px]"
                    style={{
                      background: "rgba(245,158,11,0.06)",
                      color: "#D97706",
                      border: "1px solid rgba(245,158,11,0.1)",
                    }}
                  >
                    ⚡ {displayIdea.problem}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* ═══════════════════════════════════════════════
            NEXT STEPS — more prominent than a one-liner
         ═══════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
        >
          <h3
            className="text-[14px] font-semibold mb-3"
            style={{ fontFamily: "var(--dash-font-heading)", color: "var(--dash-text)" }}
          >
            Recommended Next Steps
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                step: "1",
                title: "Validate Your Idea",
                desc: "Get an AI-powered assessment and SWOT analysis",
                path: "/dashboard/idea",
                color: "#4F7DF3",
              },
              {
                step: "2",
                title: "Build Your Brand",
                desc: "Define identity, logo strategy, and voice",
                path: "/dashboard/branding",
                color: "#8B5CF6",
              },
              {
                step: "3",
                title: "Plan Go-To-Market",
                desc: "Launch timeline, channels, and first 100 users",
                path: "/dashboard/gtm",
                color: "#EF4444",
              },
            ].map((item) => (
              <Link key={item.step} to={item.path}>
                <div
                  className="group flex items-start gap-3 p-4 rounded-[12px] transition-all duration-200 cursor-pointer"
                  style={{ background: "rgba(0,0,0,0.015)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${item.color}06`;
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(0,0,0,0.015)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <span
                    className="w-7 h-7 rounded-[8px] flex items-center justify-center text-[12px] font-bold shrink-0"
                    style={{
                      background: `${item.color}0D`,
                      color: item.color,
                    }}
                  >
                    {item.step}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-[13px] font-semibold block"
                      style={{ color: "var(--dash-text)", fontFamily: "var(--dash-font-heading)" }}
                    >
                      {item.title}
                    </span>
                    <span
                      className="text-[12px] mt-0.5 block"
                      style={{ color: "var(--dash-text-muted)" }}
                    >
                      {item.desc}
                    </span>
                  </div>
                  <ArrowRight
                    className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-0.5 shrink-0"
                    style={{ color: item.color }}
                  />
                </div>
              </Link>
            ))}
          </div>
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

      {/* Startup Summary Modal */}
      {isSummaryModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(15, 23, 42, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
            }}
            onClick={() => setIsSummaryModalOpen(false)}
          />
          {/* Modal */}
          <div
            className="fixed inset-0 z-50 grid place-items-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsSummaryModalOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: "spring", damping: 28, stiffness: 350 }}
              className="relative w-full max-w-md overflow-hidden"
              style={{
                background: 'white',
                borderRadius: 'var(--dash-radius, 14px)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)' }}
                  >
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <h2
                    className="text-[15px] font-semibold"
                    style={{
                      color: 'var(--dash-text, #0F172A)',
                      fontFamily: 'var(--dash-font-heading, Sora, sans-serif)',
                    }}
                  >
                    Generate Startup Summary
                  </h2>
                </div>
                <button
                  onClick={() => setIsSummaryModalOpen(false)}
                  className="p-1.5 rounded-lg transition-colors cursor-pointer"
                  style={{ color: '#94A3B8' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#64748B';
                    e.currentTarget.style.background = 'rgba(0,0,0,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#94A3B8';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ color: 'var(--dash-text-secondary, #64748B)' }}
                >
                  Generate a professional PDF summary of{' '}
                  <strong style={{ color: 'var(--dash-text, #0F172A)' }}>
                    {displayIdea?.title || 'your startup'}
                  </strong>. 
                  This includes all your generated modules — idea validation, branding, marketing, GTM, and more.
                </p>

                {/* Logo Upload */}
                <div>
                  <label
                    className="text-[12px] font-semibold block mb-2"
                    style={{ color: 'var(--dash-text, #0F172A)' }}
                  >
                    Upload Your Logo <span style={{ color: '#94A3B8', fontWeight: 400 }}>(optional)</span>
                  </label>
                  {summaryLogo ? (
                    <div
                      className="flex items-center gap-3 p-3 rounded-[10px]"
                      style={{
                        background: 'rgba(79,125,243,0.04)',
                        border: '1px solid rgba(79,125,243,0.12)',
                      }}
                    >
                      <img
                        src={summaryLogo}
                        alt="Logo preview"
                        className="w-10 h-10 rounded-[6px] object-contain"
                        style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.06)' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium truncate" style={{ color: 'var(--dash-text)' }}>
                          {summaryLogoName}
                        </div>
                        <div className="text-[11px]" style={{ color: '#94A3B8' }}>Will appear on cover page</div>
                      </div>
                      <button
                        onClick={() => { setSummaryLogo(null); setSummaryLogoName(null); }}
                        className="p-1 rounded cursor-pointer"
                        style={{ color: '#94A3B8' }}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-[10px] cursor-pointer transition-all"
                      style={{
                        border: '1.5px dashed rgba(79,125,243,0.2)',
                        background: 'rgba(79,125,243,0.02)',
                        color: '#4F7DF3',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(79,125,243,0.05)';
                        e.currentTarget.style.borderColor = 'rgba(79,125,243,0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(79,125,243,0.02)';
                        e.currentTarget.style.borderColor = 'rgba(79,125,243,0.2)';
                      }}
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload logo (PNG, JPG, SVG — max 2MB)</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="text-[11px] mt-1.5" style={{ color: '#94A3B8' }}>
                    Your logo will replace the default Pitchrr logo on the cover page
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
              >
                <CreditCost cost={2} size="md" />
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setIsSummaryModalOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleGenerateSummary}
                    rightIcon={<FileText className="w-4 h-4" />}
                    style={{
                      background: 'linear-gradient(135deg, #4F7DF3, #7A5CFF)',
                    }}
                  >
                    Generate Summary
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </>
  );
}
