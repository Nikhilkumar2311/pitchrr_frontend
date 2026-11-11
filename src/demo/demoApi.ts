/**
 * Demo API Adapter for Axios
 *
 * Intercepts all Axios API calls when Demo Mode is active and serves
 * realistic, stateful responses from demoStore with zero backend required.
 */

import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import {
    DEMO_CREDIT_PACKS,
    DEMO_DAILY_ANALYTICS,
    createDemoPdfDataUrl,
} from './demoData';
import {
    getDemoStore,
    saveDemoStore,
    buildGeneratedModuleData,
    getDemoChatReply,
} from './demoStore';
import type { Idea } from '@/hooks';
import type { CommunityPost, PostComment } from '@/hooks/useCommunity';
import type { DeckRecord } from '@/hooks/useDeckEditor';

const MODULE_PROGRESS_KEYS: Array<{ key: string; apiName: string }> = [
    { key: 'idea_validation', apiName: 'IDEA_VALIDATION' },
    { key: 'marketing_strategy', apiName: 'MARKETING_STRATEGY' },
    { key: 'branding', apiName: 'BRANDING' },
    { key: 'pitch_deck', apiName: 'PITCH_DECK' },
    { key: 'gtm_strategy', apiName: 'GTM_STRATEGY' },
    { key: 'competitor_analysis', apiName: 'COMPETITOR_ANALYSIS' },
    { key: 'grants', apiName: 'GRANTS' },
];

const MODULE_COSTS: Record<string, number> = {
    idea_validation: 10,
    marketing_strategy: 15,
    branding: 10,
    pitch_deck: 20,
    gtm_strategy: 15,
    competitor_analysis: 15,
    grants: 10,
};

function ok<T>(config: InternalAxiosRequestConfig, data: T, status = 200): AxiosResponse<T> {
    return {
        data,
        status,
        statusText: status === 202 ? 'Accepted' : 'OK',
        headers: {},
        config,
    };
}

function parseBody(data: unknown): any {
    if (!data) return {};
    if (typeof data === 'string') {
        try {
            return JSON.parse(data);
        } catch {
            return {};
        }
    }
    return data;
}

function normalizePath(url?: string): string {
    if (!url) return '/';
    const cleaned = url.split('?')[0];
    return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}

export async function handleDemoRequest(
    config: InternalAxiosRequestConfig
): Promise<AxiosResponse> {
    // Subtle realistic latency
    await new Promise((resolve) => setTimeout(resolve, 140));

    const method = (config.method || 'get').toUpperCase();
    const path = normalizePath(config.url);
    const body = parseBody(config.data);
    const store = getDemoStore();

    // =========================================================================
    // AUTH / USER SYNC
    // =========================================================================
    if (path === '/auth/sync' || path === '/auth/me') {
        return ok(config, store.user);
    }

    if (path === '/users/me' && method === 'POST') {
        store.user = {
            ...store.user,
            ...(body.name ? { name: body.name } : {}),
            ...(body.avatarUrl !== undefined ? { avatarUrl: body.avatarUrl } : {}),
        };
        const myProfile = store.profiles[store.user.id];
        if (myProfile) {
            if (body.name) myProfile.userName = body.name;
            if (body.avatarUrl !== undefined) myProfile.userAvatar = body.avatarUrl;
        }
        saveDemoStore(store);
        return ok(config, store.user);
    }

    // =========================================================================
    // CREDITS & BILLING
    // =========================================================================
    if (path === '/credits' && method === 'GET') {
        return ok(config, store.credits);
    }

    if (path === '/credits/use-free-logo' && method === 'POST') {
        store.credits.freeLogoUsed = true;
        saveDemoStore(store);
        return ok(config, { success: true, freeLogoUsed: true });
    }

    if (path === '/credits/use-free-card' && method === 'POST') {
        store.credits.freeCardUsed = true;
        saveDemoStore(store);
        return ok(config, { success: true, freeCardUsed: true });
    }

    if (path === '/credits/deduct' && method === 'POST') {
        const amount = Number(body.amount || 0);
        store.credits.balance = Math.max(0, store.credits.balance - amount);
        store.credits.totalUsed += amount;
        saveDemoStore(store);
        return ok(config, { success: true, newBalance: store.credits.balance });
    }

    if (path === '/credits/add-test' && method === 'POST') {
        const added = Number(body.credits || 50);
        store.credits.balance += added;
        store.credits.lifetimeCredits += added;
        saveDemoStore(store);
        return ok(config, {
            success: true,
            creditsAdded: added,
            newBalance: store.credits.balance,
        });
    }

    if (path === '/billing/packs' && method === 'GET') {
        return ok(config, DEMO_CREDIT_PACKS);
    }

    if (path === '/billing/create-order' && method === 'POST') {
        const pack = DEMO_CREDIT_PACKS.find((p) => p.id === body.packId) || DEMO_CREDIT_PACKS[0];
        return ok(config, {
            orderId: `demo-order-${Date.now()}`,
            razorpayOrderId: `order_demo_${Date.now()}`,
            amount: pack.price,
            currency: pack.currency,
            packName: pack.name,
        });
    }

    if (path === '/billing/verify-payment' && method === 'POST') {
        store.credits.balance += 100;
        store.credits.lifetimeCredits += 100;
        saveDemoStore(store);
        return ok(config, {
            success: true,
            creditsAdded: 100,
            newBalance: store.credits.balance,
        });
    }

    // =========================================================================
    // IDEAS
    // =========================================================================
    if (path === '/ideas' && method === 'GET') {
        return ok(config, store.ideas);
    }

    if (path === '/ideas/generate' && method === 'POST') {
        const interests = Array.isArray(body.interests) && body.interests.length > 0
            ? body.interests.slice(0, 2).join(' & ')
            : 'AI SaaS';
        const startupType = body.startupType || 'Digital Product / SaaS';
        const problemHint = body.problemArea?.trim();

        store.credits.balance = Math.max(0, store.credits.balance - 2);
        store.credits.totalUsed += 2;
        saveDemoStore(store);

        return ok(config, {
            ideas: [
                {
                    title: 'WorkflowPilot AI',
                    description: problemHint
                        ? `An AI copilot designed around "${problemHint}", automating repetitive operations for ${interests} teams.`
                        : `An intelligent ${startupType.toLowerCase()} copilot for ${interests} teams that turns messy operational workflows into automated, trackable playbooks.`,
                    problem: problemHint || `Teams in ${interests} waste 8+ hours per week reconciling fragmented tools and manual updates.`,
                    solution: 'Connects directly to existing calendars, docs, and team channels to automate weekly execution with zero manual entry.',
                    target_market: `Mid-market & startup teams in ${interests}`,
                },
                {
                    title: 'MetricPulse Hub',
                    description: `Real-time decision intelligence for ${interests} operators, surfacing churn risks and revenue levers before weekly reviews.`,
                    problem: 'Founders spend hours stitching spreadsheets instead of acting on early customer signals.',
                    solution: 'One-click telemetry connectors with natural-language anomaly alerts and automated weekly executive briefs.',
                    target_market: `Seed-to-Series B founders in ${interests}`,
                },
                {
                    title: 'LaunchCraft Studio',
                    description: `A collaborative launch workspace helping ${interests} creators ship campaigns, pricing experiments, and onboarding flows in half the time.`,
                    problem: 'Go-to-market launches stall across disconnected docs, design tools, and analytics sheets.',
                    solution: 'Unified AI launch templates tied directly to live conversion metrics.',
                    target_market: `Product builders and growth leads in ${interests}`,
                },
            ],
        });
    }

    if (path === '/ideas' && method === 'POST') {
        const newIdea: Idea = {
            id: `demo-idea-${Date.now()}`,
            title: body.title || 'Untitled Idea',
            description: body.description || '',
            industry: body.industry || null,
            targetAudience: body.targetAudience || null,
            problemSolved: body.problemSolved || null,
            startupStage: body.startupStage || 'Idea',
            amount: body.amount || null,
            userId: store.user.id,
            isArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        store.ideas.unshift(newIdea);
        store.modulesByIdea[newIdea.id] = {};
        saveDemoStore(store);
        return ok(config, newIdea, 201);
    }

    const singleIdeaMatch = path.match(/^\/ideas\/([^/]+)$/);
    if (singleIdeaMatch) {
        const ideaId = singleIdeaMatch[1];
        const idx = store.ideas.findIndex((i) => i.id === ideaId);

        if (method === 'GET') {
            return ok(config, idx >= 0 ? store.ideas[idx] : store.ideas[0]);
        }
        if (method === 'PUT') {
            if (idx >= 0) {
                store.ideas[idx] = {
                    ...store.ideas[idx],
                    ...body,
                    updatedAt: new Date().toISOString(),
                };
                saveDemoStore(store);
                return ok(config, store.ideas[idx]);
            }
            return ok(config, { id: ideaId, ...body });
        }
        if (method === 'DELETE') {
            if (idx >= 0) {
                store.ideas.splice(idx, 1);
                delete store.modulesByIdea[ideaId];
                saveDemoStore(store);
            }
            return ok(config, { success: true });
        }
    }

    const archiveMatch = path.match(/^\/ideas\/([^/]+)\/archive$/);
    if (archiveMatch && method === 'POST') {
        const idea = store.ideas.find((i) => i.id === archiveMatch[1]);
        if (idea) {
            idea.isArchived = true;
            idea.updatedAt = new Date().toISOString();
            saveDemoStore(store);
            return ok(config, idea);
        }
    }

    // =========================================================================
    // MODULES & PROGRESS
    // =========================================================================
    const progressMatch = path.match(/^\/ideas\/([^/]+)\/modules\/progress-summary$/);
    if (progressMatch && method === 'GET') {
        const ideaId = progressMatch[1];
        const ideaModules = store.modulesByIdea[ideaId] || {};
        const modules = MODULE_PROGRESS_KEYS.map(({ key, apiName }) => {
            const entry = ideaModules[key];
            const progress = entry?.status === 'COMPLETED' ? 100 : entry?.status === 'IN_PROGRESS' ? 50 : 0;
            return { moduleType: apiName, progress };
        });
        return ok(config, { modules });
    }

    const allModulesMatch = path.match(/^\/ideas\/([^/]+)\/modules$/);
    if (allModulesMatch && method === 'GET') {
        const ideaId = allModulesMatch[1];
        const ideaModules = store.modulesByIdea[ideaId] || {};
        const result: Record<string, any> = {};
        for (const { key } of MODULE_PROGRESS_KEYS) {
            const entry = ideaModules[key];
            result[key] = {
                moduleType: key,
                data: entry?.data || null,
                exists: Boolean(entry?.data),
                status: entry?.status || 'NOT_STARTED',
            };
        }
        return ok(config, result);
    }

    const moduleGetMatch = path.match(/^\/ideas\/([^/]+)\/modules\/([^/]+)$/);
    if (moduleGetMatch && method === 'GET') {
        const [, ideaId, moduleType] = moduleGetMatch;
        const entry = store.modulesByIdea[ideaId]?.[moduleType];
        return ok(config, {
            moduleType,
            data: entry?.data || null,
            exists: Boolean(entry?.data),
            status: entry?.status || 'NOT_STARTED',
        });
    }

    const moduleGenMatch = path.match(/^\/ideas\/([^/]+)\/modules\/([^/]+)\/generate$/);
    if (moduleGenMatch && method === 'POST') {
        const [, ideaId, moduleType] = moduleGenMatch;
        const idea = store.ideas.find((i) => i.id === ideaId) || store.ideas[0];
        const cost = MODULE_COSTS[moduleType] ?? 10;

        store.credits.balance = Math.max(0, store.credits.balance - cost);
        store.credits.totalUsed += cost;
        if (!store.modulesByIdea[ideaId]) store.modulesByIdea[ideaId] = {};

        // Mark in progress first, then populate asynchronously to show realistic skeleton
        const existingData = store.modulesByIdea[ideaId][moduleType]?.data || null;
        store.modulesByIdea[ideaId][moduleType] = {
            status: 'IN_PROGRESS',
            data: existingData,
        };
        saveDemoStore(store);

        setTimeout(() => {
            const latest = getDemoStore();
            const targetIdea = latest.ideas.find((i) => i.id === ideaId) || idea;
            if (!latest.modulesByIdea[ideaId]) latest.modulesByIdea[ideaId] = {};
            latest.modulesByIdea[ideaId][moduleType] = {
                status: 'COMPLETED',
                data: targetIdea ? buildGeneratedModuleData(targetIdea, moduleType) : existingData,
            };
            saveDemoStore(latest);
        }, 900);

        return ok(config, {
            message: 'Demo generation started',
            jobId: `demo-job-${Date.now()}`,
            moduleType,
            creditsDeducted: cost,
        }, 202);
    }

    // =========================================================================
    // DECK EDITOR
    // =========================================================================
    if (path === '/deck-editor' && method === 'GET') {
        return ok(config, store.decks);
    }

    if (path === '/deck-editor' && method === 'POST') {
        const newDeck: DeckRecord = {
            id: `demo-deck-${Date.now()}`,
            userId: store.user.id,
            ideaId: body.ideaId || null,
            title: body.title || 'Untitled Pitch Deck',
            data: body.data,
            thumbnail: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        store.decks.unshift(newDeck);
        saveDemoStore(store);
        return ok(config, newDeck, 201);
    }

    const decksByIdeaMatch = path.match(/^\/deck-editor\/idea\/([^/]+)$/);
    if (decksByIdeaMatch && method === 'GET') {
        const ideaId = decksByIdeaMatch[1];
        return ok(config, store.decks.filter((d) => d.ideaId === ideaId));
    }

    const singleDeckMatch = path.match(/^\/deck-editor\/([^/]+)$/);
    if (singleDeckMatch) {
        const deckId = singleDeckMatch[1];
        const idx = store.decks.findIndex((d) => d.id === deckId);

        if (method === 'GET') {
            return ok(config, idx >= 0 ? store.decks[idx] : store.decks[0]);
        }
        if (method === 'PUT') {
            if (idx >= 0) {
                store.decks[idx] = {
                    ...store.decks[idx],
                    ...(body.title !== undefined ? { title: body.title } : {}),
                    ...(body.data !== undefined ? { data: body.data } : {}),
                    ...(body.thumbnail !== undefined ? { thumbnail: body.thumbnail } : {}),
                    updatedAt: new Date().toISOString(),
                };
                saveDemoStore(store);
                return ok(config, store.decks[idx]);
            }
            return ok(config, { id: deckId, ...body });
        }
        if (method === 'DELETE') {
            if (idx >= 0) {
                store.decks.splice(idx, 1);
                saveDemoStore(store);
            }
            return ok(config, { success: true });
        }
    }

    // =========================================================================
    // EXPORTS (PDF / SUMMARY / PPTX)
    // =========================================================================
    if (path === '/export/pptx-from-images' && method === 'POST') {
        // Return a valid minimal empty/placeholder zip-like base64 or trigger friendly download
        const sampleText = `Pitchrr Demo Presentation Export: ${body.title || 'Pitch Deck'}\nSlides captured: ${body.slideImages?.length || 0}`;
        store.credits.balance = Math.max(0, store.credits.balance - 5);
        saveDemoStore(store);
        return ok(config, {
            buffer: btoa(sampleText),
            creditCost: 5,
            newBalance: store.credits.balance,
        });
    }

    const exportStatusMatch = path.match(/^\/export\/status\/([^/]+)$/);
    if (exportStatusMatch && method === 'GET') {
        const job = store.exportJobs[exportStatusMatch[1]];
        return ok(config, job || {
            id: exportStatusMatch[1],
            state: 'completed',
            progress: 100,
            result: null,
            downloadUrl: createDemoPdfDataUrl('Pitchrr Startup Report', [
                { heading: 'Demo Export', lines: ['Generated from Pitchrr interactive demo mode.'] },
            ]),
            failedReason: null,
        });
    }

    const exportMatch = path.match(/^\/export\/([^/]+)\/([^/]+)$/);
    if (exportMatch && method === 'POST') {
        const [, exportType, ideaId] = exportMatch;
        const idea = store.ideas.find((i) => i.id === ideaId) || store.ideas[0];
        const modKey = exportType.replace(/-/g, '_');
        const modData = store.modulesByIdea[ideaId]?.[modKey]?.data;

        const sections: Array<{ heading: string; lines: string[] }> = [
            {
                heading: `Startup: ${idea?.title || 'Startup Brief'}`,
                lines: [
                    idea?.description || 'AI-powered startup analysis export.',
                    idea?.industry ? `Industry: ${idea.industry}` : '',
                    idea?.startupStage ? `Stage: ${idea.startupStage}` : '',
                ].filter(Boolean),
            },
        ];

        if (modData?.summary) {
            sections.push({ heading: 'Executive Summary', lines: [String(modData.summary)] });
        }
        if (modData?.idea_score) {
            sections.push({ heading: 'Validation Score', lines: [`Overall Score: ${modData.idea_score} / 100`] });
        }
        if (Array.isArray(modData?.recommendations)) {
            sections.push({
                heading: 'Key Recommendations',
                lines: modData.recommendations.slice(0, 5).map((r: any) => (typeof r === 'string' ? `- ${r}` : `- ${r.title}: ${r.reason}`)),
            });
        }
        if (modData?.messaging_framework?.value_proposition) {
            sections.push({
                heading: 'Value Proposition',
                lines: [modData.messaging_framework.value_proposition],
            });
        }
        if (Array.isArray(modData?.taglines)) {
            sections.push({ heading: 'Taglines', lines: modData.taglines });
        }
        if (modData?.market_overview) {
            sections.push({ heading: 'Market Overview', lines: [modData.market_overview] });
        }

        const jobId = `demo-export-${Date.now()}`;
        store.exportJobs[jobId] = {
            state: 'completed',
            progress: 100,
            downloadUrl: createDemoPdfDataUrl(`${idea?.title || 'Pitchrr'} - ${exportType.toUpperCase()}`, sections),
        };
        store.credits.balance = Math.max(0, store.credits.balance - 2);
        saveDemoStore(store);

        return ok(config, {
            jobId,
            newBalance: store.credits.balance,
            creditCost: 2,
        });
    }

    // =========================================================================
    // AI CHATBOT (non-streaming fallback)
    // =========================================================================
    if (path === '/chat' && method === 'POST') {
        const idea = store.ideas.find((i) => i.id === body.ideaId) || store.ideas[0];
        const allModules = idea ? store.modulesByIdea[idea.id] : undefined;
        return ok(config, {
            response: {
                message: getDemoChatReply(body.message || '', idea, allModules),
                follow_up_questions: [
                    'How can I improve my pitch deck ask slide?',
                    'What marketing channel should I test first?',
                    'What grants fit my current stage?',
                ],
            },
        });
    }

    // =========================================================================
    // FEEDBACK
    // =========================================================================
    if (path === '/feedback' && method === 'POST') {
        return ok(config, { success: true, id: `demo-fb-${Date.now()}` }, 201);
    }

    // =========================================================================
    // COMMUNITY / EXPLORE / PROFILES
    // =========================================================================
    if (path === '/community/feed' || path === '/community/feed/trending') {
        const posts = path.endsWith('/trending')
            ? [...store.posts].sort((a, b) => b.likeCount - a.likeCount)
            : store.posts;
        return ok(config, { posts, nextCursor: null, hasMore: false });
    }

    if (path === '/community/post' && method === 'POST') {
        const newPost: CommunityPost = {
            id: `demo-post-${Date.now()}`,
            userId: store.user.id,
            userName: store.user.name,
            userAvatar: store.user.avatarUrl,
            ideaId: body.ideaId || null,
            ideaTitle: body.ideaTitle || null,
            industry: body.industry || 'Startup',
            content: body.content || '',
            status: 'PUBLISHED',
            isAutoPost: false,
            aiGenerated: false,
            rejectReason: null,
            likeCount: 1,
            dislikeCount: 0,
            commentCount: 0,
            shareCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        store.posts.unshift(newPost);
        saveDemoStore(store);
        return ok(config, newPost, 201);
    }

    const postDeleteMatch = path.match(/^\/community\/post\/([^/]+)$/);
    if (postDeleteMatch && method === 'DELETE') {
        store.posts = store.posts.filter((p) => p.id !== postDeleteMatch[1]);
        saveDemoStore(store);
        return ok(config, { success: true });
    }

    const postReactMatch = path.match(/^\/community\/post\/([^/]+)\/react$/);
    if (postReactMatch && method === 'POST') {
        const post = store.posts.find((p) => p.id === postReactMatch[1]);
        if (post) {
            if (body.isLike) post.likeCount += 1;
            else post.dislikeCount += 1;
            saveDemoStore(store);
        }
        return ok(config, { success: true });
    }

    const postCommentsMatch = path.match(/^\/community\/post\/([^/]+)\/comments$/);
    if (postCommentsMatch && method === 'GET') {
        const comments = store.commentsByPost[postCommentsMatch[1]] || [];
        return ok(config, { comments, nextCursor: null, hasMore: false });
    }

    const postAddCommentMatch = path.match(/^\/community\/post\/([^/]+)\/comment$/);
    if (postAddCommentMatch && method === 'POST') {
        const postId = postAddCommentMatch[1];
        const newComment: PostComment = {
            id: `demo-comment-${Date.now()}`,
            userId: store.user.id,
            userName: store.user.name,
            userAvatar: store.user.avatarUrl,
            postId,
            content: body.content || '',
            parentId: body.parentId || null,
            createdAt: new Date().toISOString(),
            replies: [],
        };
        if (!store.commentsByPost[postId]) store.commentsByPost[postId] = [];
        store.commentsByPost[postId].push(newComment);
        const post = store.posts.find((p) => p.id === postId);
        if (post) post.commentCount += 1;
        saveDemoStore(store);
        return ok(config, newComment, 201);
    }

    const deleteCommentMatch = path.match(/^\/community\/comment\/([^/]+)$/);
    if (deleteCommentMatch && method === 'DELETE') {
        const commentId = deleteCommentMatch[1];
        for (const [postId, list] of Object.entries(store.commentsByPost)) {
            const next = list.filter((c) => c.id !== commentId);
            if (next.length !== list.length) {
                store.commentsByPost[postId] = next;
                const post = store.posts.find((p) => p.id === postId);
                if (post && post.commentCount > 0) post.commentCount -= 1;
            }
        }
        saveDemoStore(store);
        return ok(config, { success: true });
    }

    const postShareMatch = path.match(/^\/community\/post\/([^/]+)\/share$/);
    if (postShareMatch && method === 'POST') {
        const post = store.posts.find((p) => p.id === postShareMatch[1]);
        if (post) {
            post.shareCount += 1;
            saveDemoStore(store);
        }
        return ok(config, { success: true });
    }

    if (path === '/community/settings/auto-post/generate-content' && method === 'POST') {
        const title = body.ideaTitle || 'our startup';
        return ok(config, {
            content: `Excited to share progress on ${title}! We're tackling ${body.problemSolved || 'a critical workflow gap'} for ${body.targetAudience || 'modern teams'}. Would love feedback from fellow founders on our positioning!`,
        });
    }

    if (path === '/community/achievements' && method === 'GET') {
        return ok(config, store.achievements);
    }

    if (path === '/community/my-posts' && method === 'GET') {
        const myPosts = store.posts.filter((p) => p.userId === store.user.id);
        return ok(config, {
            posts: myPosts,
            totals: {
                totalPosts: myPosts.length,
                totalLikes: myPosts.reduce((s, p) => s + p.likeCount, 0),
                totalDislikes: myPosts.reduce((s, p) => s + p.dislikeCount, 0),
                totalComments: myPosts.reduce((s, p) => s + p.commentCount, 0),
                totalShares: myPosts.reduce((s, p) => s + p.shareCount, 0),
            },
            dailyAnalytics: DEMO_DAILY_ANALYTICS,
        });
    }

    const bookmarkToggleMatch = path.match(/^\/community\/post\/([^/]+)\/bookmark$/);
    if (bookmarkToggleMatch && method === 'POST') {
        const postId = bookmarkToggleMatch[1];
        const exists = store.bookmarks.includes(postId);
        store.bookmarks = exists
            ? store.bookmarks.filter((id) => id !== postId)
            : [...store.bookmarks, postId];
        saveDemoStore(store);
        return ok(config, { bookmarked: !exists });
    }

    if (path === '/community/bookmarks' && method === 'GET') {
        const posts = store.posts.filter((p) => store.bookmarks.includes(p.id));
        return ok(config, { posts, nextCursor: null, hasMore: false });
    }

    const followMatch = path.match(/^\/community\/user\/([^/]+)\/follow$/);
    if (followMatch && method === 'POST') {
        const targetId = followMatch[1];
        const exists = store.following.includes(targetId);
        store.following = exists
            ? store.following.filter((id) => id !== targetId)
            : [...store.following, targetId];
        saveDemoStore(store);
        return ok(config, { following: !exists });
    }

    const followStatsMatch = path.match(/^\/community\/user\/([^/]+)\/follow-stats$/);
    if (followStatsMatch && method === 'GET') {
        const profile = store.profiles[followStatsMatch[1]];
        return ok(config, {
            followerCount: profile?.stats.followerCount ?? 42,
            followingCount: profile?.stats.followingCount ?? 18,
        });
    }

    const isFollowingMatch = path.match(/^\/community\/user\/([^/]+)\/is-following$/);
    if (isFollowingMatch && method === 'GET') {
        return ok(config, { isFollowing: store.following.includes(isFollowingMatch[1]) });
    }

    const followingListMatch = path.match(/^\/community\/user\/([^/]+)\/following$/);
    if (followingListMatch && method === 'GET') {
        return ok(config, { following: store.following });
    }

    if (path === '/community/profile/me' && method === 'PUT') {
        const me = store.profiles[store.user.id];
        if (me) {
            Object.assign(me, body);
            saveDemoStore(store);
            return ok(config, me);
        }
    }

    const profilePostsMatch = path.match(/^\/community\/profile\/([^/]+)\/posts$/);
    if (profilePostsMatch && method === 'GET') {
        const posts = store.posts.filter((p) => p.userId === profilePostsMatch[1]);
        return ok(config, { posts, nextCursor: null, hasMore: false });
    }

    const profileMatch = path.match(/^\/community\/profile\/([^/]+)$/);
    if (profileMatch && method === 'GET') {
        const userId = profileMatch[1];
        const profile = store.profiles[userId] || {
            userId,
            userName: 'Startup Founder',
            userAvatar: null,
            startupName: 'Stealth Startup',
            industry: 'Technology',
            bio: 'Building on Pitchrr.',
            headline: 'Founder',
            website: null,
            twitter: null,
            linkedin: null,
            stats: { totalPosts: 0, totalLikes: 0, totalComments: 0, followerCount: 12, followingCount: 8 },
        };
        return ok(config, profile);
    }

    // Fallback for any unhandled demo endpoint
    return ok(config, {});
}
