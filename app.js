// ========================================
// Article Data Store
// ========================================
const articles = [
    {
        id: 1,
        title: "PictureTime: The Balloon And The Box Office",
        description: "Inflatable cinema theatres bringing Bollywood to villages that never had a screen. A beautiful example of frugal innovation meeting genuine human longing for stories and spectacle.",
        url: "https://www.tigerfeathers.in/p/picturetime-the-balloon-and-the-box",
        source: "Tigerfeathers",
        category: "interesting-businesses"
    },
    {
        id: 2,
        title: "AI and Leviathan: Part I",
        description: "What happens when intelligence becomes abundant? This series applies institutional economics to AI, asking whether we're heading toward a new state of nature or something stranger still.",
        url: "https://www.secondbest.ca/p/ai-and-leviathan-part-i",
        source: "Second Best",
        category: "ai"
    },
    {
        id: 3,
        title: "AI and Leviathan: Part II",
        description: "Regime change isn't just political—it's epistemic. Part II explores the narrow corridor between chaos and control when artificial minds enter the equation.",
        url: "https://www.secondbest.ca/p/ai-and-leviathan-part-ii",
        source: "Second Best",
        category: "ai"
    },
    {
        id: 4,
        title: "India In Charts - The House View",
        description: "A visual essay on India's trajectory—consumption patterns, infrastructure bets, demographic tailwinds. The kind of synthesis that makes you see a country differently.",
        url: "https://www.tigerfeathers.in/p/india-in-charts-the-house-view",
        source: "Tigerfeathers",
        category: "food-for-thought"
    },
    {
        id: 5,
        title: "Airbound: Delivering Abundance",
        description: "A Bangalore startup betting that drone delivery isn't a gimmick but a fundamental reimagining of logistics. If they crack it, one-rupee delivery could change everything.",
        url: "https://www.tigerfeathers.in/p/airbound-delivering-abundance",
        source: "Tigerfeathers",
        category: "interesting-businesses"
    },
    {
        id: 6,
        title: "a16z: The Power Brokers",
        description: "How a venture firm became a cultural and political force. A 16,000-word deep dive into the machine that Marc and Ben built, and what it means to broker power in Silicon Valley.",
        url: "https://www.notboring.co/p/a16z-the-power-brokers",
        source: "Not Boring",
        category: "interesting-businesses"
    },
    {
        id: 7,
        title: "AI and Leviathan: Part III",
        description: "The default future might be techno-feudalism. Part III traces where we land if no one steers—a world of AI lords and capability gaps that make today's inequalities look quaint.",
        url: "https://www.secondbest.ca/p/ai-and-leviathan-part-iii",
        source: "Second Best",
        category: "ai"
    },
    {
        id: 8,
        title: "Evolution of a Value Investor",
        description: "How value investing philosophy evolves when held seriously over decades. Not the Warren Buffett mythology, but the messy reality of changing your mind while staying principled.",
        url: "https://sagesaigal.substack.com/p/evolution-of-a-value-investor-presentation",
        source: "Anshul's Substack",
        category: "fin-econ-geopolity"
    },
    {
        id: 9,
        title: "AI 2027",
        description: "A research-backed scenario forecast that feels uncomfortably plausible. From stumbling agents to superhuman researchers in under three years—a timeline that demands you engage with it.",
        url: "https://ai-2027.com/",
        source: "AI 2027",
        category: "ai"
    },
    {
        id: 10,
        title: "Import AI 441: My Agents Are Working. Are Yours?",
        description: "We've crossed an inflection point where teams of AI agents can read thousands of papers while you hike, compiling reports better than you could. It feels surreal—like having a fleet of tireless researchers on call. The future of knowledge work may already be here.",
        url: "https://jack-clark.net/2026/01/19/import-ai-441-my-agents-are-working-are-yours/",
        source: "Import AI",
        category: "ai"
    },
    {
        id: 29,
        title: "AGI Ruin: A List of Lethalities",
        description: "A few dozen reasons why AGI alignment is an extremely difficult problem we are not on track to solve. The big ask isn't perfect alignment—it's obtaining by any strategy whatsoever a significant chance of there being any survivors.",
        url: "https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities",
        source: "LessWrong",
        category: "ai"
    },
    {
        id: 30,
        title: "Safety Is Making You Depressed",
        description: "Modern psychology treats all intense dedication as trauma response. But when you avoid all pain, you accidentally avoid all high emotions too. The positive and negative are linked. Life became electric only when I accepted the chase and let suffering have direction.",
        url: "https://conquer1.substack.com/p/safety-is-making-you-depressed",
        source: "Conquer",
        category: "intrapersonal"
    },
    {
        id: 24,
        title: "The Stable Marriage Problem",
        description: "Intelligence is choosing what you truly want, acting to get it, and learning fast. Most people drift in a 'river' of others' goals. Agency means stepping out, being honest about your nature, starting before you're ready, risking looking foolish, testing, failing, adjusting, and shipping imperfectly until results match your aims.",
        url: "https://acotra.substack.com/p/the-stable-marriage-problem",
        source: "Good Bones",
        category: "intrapersonal"
    },
    {
        id: 25,
        title: "How to Live an Intellectually Rich Life",
        description: "95% of Wikipedia paths lead to Philosophy. This isn't trivia—it's a map. Epistemic anxiety is what you feel when you sense the truth is out there but can't reach it. The antidote is structured curiosity.",
        url: "https://utsavmamoria.substack.com/p/how-to-live-an-intellectually-rich",
        source: "Tumse Na Ho Paayega",
        category: "intrapersonal"
    },
    {
        id: 26,
        title: "What Makes a Person Interesting?",
        description: "Curiosity is the root of everything interesting. It's not about Prada sneakers or Oscar films—it's whether you chew your food before swallowing. A Salt & Straw employee judges people by whether they season before tasting.",
        url: "https://angelcake.substack.com/p/what-makes-a-person-interesting",
        source: "angelcake",
        category: "intrapersonal"
    },
    {
        id: 28,
        title: "Make Something Heavy",
        description: "We create more than ever, but it weighs nothing. The internet rewards movement, so we keep going—99% dopamine, near-zero serotonin, no trace of oxytocin. You don't feel like a true creator because light things don't count, and deep down, you know it. Heavy doesn't mean big—it means dense, defining, durable.",
        url: "https://www.workingtheorys.com/p/make-something-heavy",
        source: "Working Theorys",
        category: "intrapersonal"
    },
    // Books
    {
        id: 11,
        title: "I Deliver Parcels in Beijing",
        description: "A memoir from the ground level of China's delivery economy. What it feels like to be a node in the logistical machine that powers modern consumption.",
        url: "",
        source: "Hu Anyan",
        category: "books"
    },
    {
        id: 12,
        title: "Atlas Shrugged",
        description: "Ayn Rand's sprawling philosophical novel about the producers going on strike. Love it or hate it, you can't ignore its influence on how certain people think about ambition and society.",
        url: "",
        source: "Ayn Rand",
        category: "books"
    },
    {
        id: 13,
        title: "Apple in China",
        description: "How Apple built its supply chain empire in China, and what it reveals about the real geography of innovation—not in labs, but in factories.",
        url: "",
        source: "Patrick McGee",
        category: "books"
    },
    {
        id: 14,
        title: "Sophie's World",
        description: "A novel that's secretly a history of philosophy. A teenage girl receives mysterious letters that become a journey through Western thought, from Socrates to Sartre.",
        url: "",
        source: "Jostein Gaarder",
        category: "books"
    },
    {
        id: 15,
        title: "The Defiance of the Fall (14 Books)",
        description: "LitRPG at its most addictive. When the multiverse merges with Earth, one man's path through an endless progression system becomes surprisingly compelling.",
        url: "",
        source: "TheFirstDefier",
        category: "books"
    },
    {
        id: 16,
        title: "The Last Economy",
        description: "What happens to economic systems when growth stops being the default assumption. A framework for thinking about post-growth worlds.",
        url: "",
        source: "Emad Mostaque",
        category: "books"
    },
    {
        id: 17,
        title: "If Anyone Builds It, Everyone Dies",
        description: "The game theory of existential risk. When one actor's breakthrough could mean everyone's end, how do we coordinate? A meditation on the unilateralist's curse.",
        url: "",
        source: "Eliezer Yudkowsky",
        category: "books"
    },
    {
        id: 18,
        title: "Super Agency",
        description: "Reid Hoffman on navigating the age of AI. Not fear-mongering or utopian—a practical framework for humans to maintain agency as AI capabilities explode.",
        url: "",
        source: "Reid Hoffman",
        category: "books"
    },
    {
        id: 19,
        title: "Maybe You Should Talk to Someone",
        description: "A therapist goes to therapy. Lori Gottlieb weaves her own sessions with her patients' stories into something unexpectedly moving about the universal messiness of being human.",
        url: "",
        source: "Lori Gottlieb",
        category: "books"
    },
    {
        id: 20,
        title: "Powerful",
        description: "Netflix's former Chief Talent Officer on building a culture of freedom and responsibility. The book that coined 'we're a team, not a family.'",
        url: "",
        source: "Patty McCord",
        category: "books"
    },
    {
        id: 21,
        title: "The Last Question",
        description: "Asimov's short story spanning trillions of years, asking if entropy can be reversed. In just a few pages, it captures the scale of cosmic time and humanity's ultimate question.",
        url: "",
        source: "Isaac Asimov",
        category: "books"
    },
    {
        id: 22,
        title: "Novelist as a Vocation",
        description: "Murakami on the craft and life of writing. What it takes to wake up at 4am for decades and keep producing work that feels effortlessly strange.",
        url: "",
        source: "Haruki Murakami",
        category: "books"
    },
    {
        id: 23,
        title: "The Myth of Sisyphus and Other Essays",
        description: "Camus wrestling with the absurd. If life has no meaning, why not suicide? His answer—we must imagine Sisyphus happy—is one of philosophy's great pivots.",
        url: "",
        source: "Albert Camus",
        category: "books"
    },
    // New additions
    {
        id: 31,
        title: "The Great Differentiation",
        description: "When sameness is cheap, differentiation is valuable. But how do you remain differentiated when copying is free? The salvation from slop is making copying expensive—peacocking for the AI age.",
        url: "https://www.notboring.co/p/the-great-differentiation",
        source: "Not Boring",
        category: "food-for-thought"
    },
    {
        id: 32,
        title: "The Böckenförde Dilemma",
        description: "Liberal democracies rely on shared cultural values to flourish, yet they cannot replenish those very values. A case for spiritual renewal in the West—diagnosing the malaise of American political life.",
        url: "https://jasonzhao.substack.com/p/the-bockenforde-dilemma",
        source: "Jason Zhao",
        category: "food-for-thought"
    },
    {
        id: 33,
        title: "The Broken China Dream",
        description: "Why China's embrace of capitalism gave rise to hard authoritarianism instead of democracy. A look at how the reforms of the post-Mao era have been reversed under Xi Jinping—and why the world failed to see it coming.",
        url: "",
        source: "Minxin Pei",
        category: "books"
    },
    // YT Long Form
    {
        id: 34,
        title: "David Deutsch: AGI, Quantum Computing, and the Future of Humanity",
        description: "Quantum computing pioneer David Deutsch on the nature of knowledge, the origins of quantum computing, and why he's optimistic about AGI. A mind-expanding conversation about explanations and progress.",
        url: "https://www.youtube.com/watch?v=IVA2bK9qjzE",
        source: "YouTube",
        category: "yt-long-form"
    },
    {
        id: 35,
        title: "The Only Trait for Success in the AI Era",
        description: "Po-Shen Loh on why modern education may be failing us—and what it will take for humanity to thrive in the AI era. From AI solving Olympiad problems to rethinking how we learn.",
        url: "https://www.youtube.com/watch?v=xWYb7tImErI",
        source: "YouTube",
        category: "yt-long-form"
    },
    {
        id: 36,
        title: "The Palantirization of Everything",
        description: "Everyone wants to copy Palantir—embed FDEs with customers, build custom workflows, operate like special forces. But most companies copying the aesthetic are setting themselves up to become expensive services businesses with software multiples.",
        url: "https://www.a16z.news/p/the-palantirization-of-everything",
        source: "a16z News",
        category: "interesting-businesses"
    },
    {
        id: 37,
        title: "Notes on India",
        description: "Initial observations from a week in New Delhi, Bangalore, and Darjeeling. On culture, politics, and economy—the nation as perhaps the most striking experiment in democratic history.",
        url: "https://jasonzhao.substack.com/p/notes-on-india",
        source: "Jason Zhao",
        category: "food-for-thought"
    },
    // Fin-Econ-Polity articles
    {
        id: 38,
        title: "The Puzzle of Pakistan's Poverty",
        description: "Religious fundamentalism alone doesn't explain Pakistan's economic underperformance. Structural factors—high fertility, remittance dependency creating Dutch disease, military rent extraction, and geopolitical aid dependency—matter more than ideology in explaining why reforms never stick.",
        url: "https://rshinde.substack.com/p/the-puzzle-of-pakistans-poverty",
        source: "Rohit Shinde",
        category: "fin-econ-geopolity"
    },
    {
        id: 39,
        title: "For India, Only Economic Growth Matters",
        description: "India must prioritize growth above all else to achieve developed-nation status. Currency appreciation, expensive electricity, labor unions, and restrictive construction norms hinder manufacturing. With declining fertility, there's urgency—economic growth automatically improves every other outcome you care about.",
        url: "https://rshinde.substack.com/p/for-india-only-economic-growth-matters",
        source: "Rohit Shinde",
        category: "fin-econ-geopolity"
    },
    {
        id: 40,
        title: "Is India Following China's Path to Prosperity?",
        description: "Comparing India and China's development trajectories since the 1970s. India is adopting similar strategies—infrastructure, PLI schemes, education reforms—but faces de-globalization headwinds. Sustained 8% growth for two decades is needed to reach high-income status.",
        url: "https://rshinde.substack.com/p/is-india-following-chinas-path-to",
        source: "Rohit Shinde",
        category: "fin-econ-geopolity"
    },
    {
        id: 41,
        title: "China's Broken Balance Sheet: Why China Will Invade Taiwan before 2030",
        description: "China faces an unprecedented economic crisis from investment-driven growth funded through shadow banking. With traditional engines exhausted and no access to advanced semiconductors, Beijing may pursue military action against Taiwan to seize TSMC's sub-7nm manufacturing ecosystem.",
        url: "https://substack.com/home/post/p-181489135",
        source: "Rohit Shinde",
        category: "fin-econ-geopolity"
    },
    {
        id: 42,
        title: "Compared to What?",
        description: "The Paradox of Absolutism—many seemingly absolute statements actually require comparison to be meaningful. Asking 'compared to what?' helps resolve apparent paradoxes across epistemology, color perception, and metaphysics. Absolute claims often trap people in unproductive loops; calibrating statements through comparative frameworks allows for meaningful resolution.",
        url: "https://adamgolding.substack.com/p/compared-to-what",
        source: "Adam Golding",
        category: "food-for-thought"
    },
    {
        id: 43,
        title: "Technology in 1776",
        description: "Contrasting life in 1776 with 2026 to show extraordinary material progress. Technologies transformed water, food, shelter, medicine, and energy—often invisibly making us safer, healthier, and more productive. Recognizing these achievements should inspire confidence that America can overcome current challenges.",
        url: "https://www.a16z.news/p/technology-in-1776",
        source: "a16z",
        category: "food-for-thought"
    },
    {
        id: 44,
        title: "The Adolescence of Technology",
        description: "Exploring risks as AI approaches a 'country of geniuses in a datacenter.' Five concerns: autonomy risks, misuse for destruction, misuse for power, economic disruption, and destabilizing effects. Advocates pragmatic responses through constitutional AI, interpretability research, and surgical regulation.",
        url: "https://www.darioamodei.com/essay/the-adolescence-of-technology",
        source: "Dario Amodei",
        category: "ai"
    }
];

// Category definitions
const CATEGORIES = {
    'interesting-businesses': { name: 'Interesting Businesses', emoji: '🏢' },
    'ai': { name: 'AI', emoji: '🤖' },
    'intrapersonal': { name: 'Intrapersonal', emoji: '🧘' },
    'fin-econ-geopolity': { name: 'Fin-Econ-(Geo)Polity', emoji: '📈' },
    'food-for-thought': { name: 'Food for Thought', emoji: '💭' },
    'yt-long-form': { name: 'YT Long Form', emoji: '🎬' },
    'books': { name: 'Books', emoji: '📚' }
};

// ========================================
// DOM Elements
// ========================================
const landingSection = document.getElementById('landing');
const appSection = document.getElementById('app');
const exploreBtn = document.getElementById('explore-btn');
const sidebarHomeBtn = document.getElementById('sidebar-home-btn');
const articlesGrid = document.getElementById('articles-grid');
const categoryItems = document.querySelectorAll('.category-item');
const currentCategoryTitle = document.getElementById('current-category');
const modalOverlay = document.getElementById('modal-overlay');
const addBtn = document.getElementById('add-btn');
const modalClose = document.getElementById('modal-close');
const addForm = document.getElementById('add-form');
const fetchBtn = document.getElementById('fetch-btn');
const articleUrlInput = document.getElementById('article-url');

// Stats elements
const totalArticlesEl = document.getElementById('total-articles');
const totalBooksEl = document.getElementById('total-books');
const totalYoutubeEl = document.getElementById('total-youtube');
const landingCategoriesEl = document.getElementById('landing-categories');
const booksBtn = document.getElementById('books-btn');
const userSubmissionsBtn = document.getElementById('user-submissions-btn');

// ========================================
// State
// ========================================
let currentCategory = null;

// ========================================
// Helper Functions
// ========================================
function getCategoryDisplayName(category) {
    if (category === 'articles-landing') {
        return 'Articles';
    }
    return CATEGORIES[category]?.name || category;
}

function getCategoryEmoji(category) {
    return CATEGORIES[category]?.emoji || '📚';
}

function getArticlesByCategory(category) {
    if (!category) return [];
    return articles.filter(article => article.category === category);
}

function countArticlesByCategory(category) {
    return getArticlesByCategory(category).length;
}

function getUniqueCategories() {
    const categories = new Set(articles.map(a => a.category));
    return categories.size;
}

// ========================================
// Render Functions
// ========================================
function updateStats() {
    // Count articles (not books or youtube), books, and youtube separately
    const articleCount = articles.filter(a => a.category !== 'books' && a.category !== 'yt-long-form').length;
    const bookCount = articles.filter(a => a.category === 'books').length;
    const youtubeCount = articles.filter(a => a.category === 'yt-long-form').length;

    if (totalArticlesEl) totalArticlesEl.textContent = articleCount;
    if (totalBooksEl) totalBooksEl.textContent = bookCount;
    if (totalYoutubeEl) totalYoutubeEl.textContent = youtubeCount;

    // Populate landing page category tags
    if (landingCategoriesEl) {
        landingCategoriesEl.innerHTML = '';
        Object.entries(CATEGORIES).forEach(([key, cat]) => {
            if (key !== 'books') {
                const count = countArticlesByCategory(key);
                if (count > 0) {
                    const tag = document.createElement('span');
                    tag.className = 'section-category-tag';
                    tag.textContent = `${cat.name} (${count})`;
                    landingCategoriesEl.appendChild(tag);
                }
            }
        });
    }

    // Update category counts in sidebar
    Object.keys(CATEGORIES).forEach(cat => {
        const countEl = document.getElementById(`count-${cat}`);
        if (countEl) {
            countEl.textContent = countArticlesByCategory(cat);
        }
    });

    // Update total articles count (excluding books and youtube)
    const totalArticlesCountEl = document.getElementById('count-articles-total');
    if (totalArticlesCountEl) {
        const articleCategories = ['interesting-businesses', 'ai', 'intrapersonal', 'fin-econ-geopolity', 'food-for-thought'];
        const total = articleCategories.reduce((sum, cat) => sum + countArticlesByCategory(cat), 0);
        totalArticlesCountEl.textContent = total;
    }
}

function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article-card';

    // Add curator mode class if applicable
    const user = getCurrentUser();
    if (isCuratorAccess()) {
        card.classList.add('curator-mode');
    }

    // Get read status for this article
    const readStatus = getArticleReadStatus(article.id);
    const currentUserStatus = user ? readStatus[user] : null;

    // Build scoreboard rows HTML (visible to all users)
    let scoreboardHtml = '';
    const entries = Object.entries(readStatus);
    if (entries.length > 0) {
        entries.forEach(([userName, status]) => {
            let symbol, statusClass;
            if (status === 'liked') {
                symbol = '✓';
                statusClass = 'liked';
            } else if (status === 'neutral') {
                symbol = '—';
                statusClass = 'neutral';
            } else {
                symbol = '✗';
                statusClass = 'disliked';
            }
            scoreboardHtml += `
                <div class="scoreboard-row">
                    <span class="scoreboard-name">${userName}</span>
                    <span class="scoreboard-reaction ${statusClass}">${symbol}</span>
                </div>
            `;
        });
    }

    // Build action buttons HTML (top-right, only for non-curators)
    let actionButtonsHtml = '';
    if (user && !isCuratorAccess()) {
        const likeActive = currentUserStatus === 'liked' ? 'active' : '';
        const neutralActive = currentUserStatus === 'neutral' ? 'active' : '';
        const dislikeActive = currentUserStatus === 'disliked' ? 'active' : '';
        actionButtonsHtml = `
            <div class="card-action-buttons">
                <button class="card-action-btn like-btn ${likeActive}" data-article-id="${article.id}" data-action="liked" title="I liked this">
                    <span class="btn-icon">✓</span>
                    <span class="btn-text">Nice</span>
                </button>
                <button class="card-action-btn neutral-btn ${neutralActive}" data-article-id="${article.id}" data-action="neutral" title="Neutral">
                    <span class="btn-icon">—</span>
                    <span class="btn-text">Meh</span>
                </button>
                <button class="card-action-btn dislike-btn ${dislikeActive}" data-article-id="${article.id}" data-action="disliked" title="Didn't like it">
                    <span class="btn-icon">✗</span>
                    <span class="btn-text">Disagree</span>
                </button>
            </div>
        `;
    }

    // Create card content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'article-content';
    contentDiv.innerHTML = `
        <h3 class="article-title">${article.title}</h3>
        <p class="article-description">${article.description}</p>
        <span class="article-source">${article.source}</span>
    `;

    // Handle clicks on content (open article)
    if (article.multiLink) {
        contentDiv.style.cursor = 'pointer';
        contentDiv.onclick = (e) => {
            e.stopPropagation();
            const existingPopup = card.querySelector('.multi-link-popup');
            if (existingPopup) {
                existingPopup.remove();
                return;
            }
            document.querySelectorAll('.multi-link-popup').forEach(p => p.remove());

            const popup = document.createElement('div');
            popup.className = 'multi-link-popup';
            popup.innerHTML = `
                <a href="${article.multiLink.presentation.url}" target="_blank" class="multi-link-option" onclick="event.stopPropagation()">
                    ${article.multiLink.presentation.label}
                    ${article.multiLink.presentation.recommended ? '<span class="recommended-badge">recommended</span>' : ''}
                </a>
                <a href="${article.multiLink.article.url}" target="_blank" class="multi-link-option" onclick="event.stopPropagation()">
                    ${article.multiLink.article.label}
                </a>
            `;
            card.appendChild(popup);
        };
    } else if (article.url) {
        contentDiv.onclick = () => {
            // Track article click
            if (typeof trackArticleClick === 'function') {
                trackArticleClick(article.id, article.title);
            }
            window.open(article.url, '_blank');
        };
        contentDiv.style.cursor = 'pointer';
    }

    // Add action buttons to card (top-right)
    if (actionButtonsHtml) {
        card.insertAdjacentHTML('beforeend', actionButtonsHtml);
    }

    card.appendChild(contentDiv);

    // Add scoreboard section (visible on hover for all users)
    const scoreboard = document.createElement('div');
    scoreboard.className = 'scoreboard';
    if (scoreboardHtml) {
        scoreboard.innerHTML = `<div class="scoreboard-table">${scoreboardHtml}</div>`;
    } else {
        scoreboard.innerHTML = `<div class="scoreboard-empty">React to Share what you thought</div>`;
    }
    card.appendChild(scoreboard);

    // Add click handlers for action buttons
    card.querySelectorAll('.card-action-btn').forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const articleId = btn.dataset.articleId;
            const action = btn.dataset.action;

            // If already active, remove the status
            if (btn.classList.contains('active')) {
                removeReadStatus(articleId);
            } else {
                markAsRead(articleId, action);
                // Track reaction
                if (typeof trackReaction === 'function') {
                    trackReaction(articleId);
                }
            }
        };
    });

    return card;
}

function renderArticles() {
    articlesGrid.innerHTML = '';

    // Handle Articles landing page
    if (currentCategory === 'articles-landing') {
        articlesGrid.innerHTML = `
            <div class="welcome-prompt articles-landing">
                <div class="welcome-icon">📚</div>
                <h3>Choose a Subcategory to Proceed</h3>
                <p>Select one of the article subcategories from the expanded menu on the left.</p>
            </div>
        `;
        return;
    }

    if (!currentCategory) {
        articlesGrid.innerHTML = `
            <div class="welcome-prompt">
                <div class="welcome-icon">👈</div>
                <h3>Select a Category</h3>
                <p>Choose a category from the sidebar to explore your saved articles.</p>
            </div>
        `;
        return;
    }

    const filteredArticles = getArticlesByCategory(currentCategory);

    if (filteredArticles.length === 0) {
        articlesGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No articles yet</h3>
                <p>Add some articles to this category to get started.</p>
            </div>
        `;
        return;
    }

    filteredArticles.forEach(article => {
        articlesGrid.appendChild(createArticleCard(article));
    });
}

function updateActiveCategory() {
    categoryItems.forEach(item => {
        const category = item.dataset.category;
        item.classList.toggle('active', category === currentCategory);
    });
    // Also handle clickable section labels
    document.querySelectorAll('.nav-toggle-direct').forEach(item => {
        const category = item.dataset.category;
        item.classList.toggle('active', category === currentCategory);
    });

    currentCategoryTitle.innerHTML = currentCategory
        ? getCategoryDisplayName(currentCategory)
        : 'Your Reading List';
}

// ========================================
// Auto-fetch Article Info with AI Summary
// ========================================
const GEMINI_API_KEY = 'AIzaSyBiHKkbAI323Uel2Bi5LSzC2JJTch5BCY4';

async function fetchArticleInfo(url) {
    const fetchBtn = document.getElementById('fetch-btn');
    const originalText = fetchBtn.innerHTML;

    try {
        fetchBtn.innerHTML = '<span class="spinner"></span> Fetching...';
        fetchBtn.disabled = true;

        // Step 1: Fetch the article content
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();

        if (!data.contents) {
            throw new Error('Could not fetch article');
        }

        const parser = new DOMParser();
        const doc = parser.parseFromString(data.contents, 'text/html');

        // Get title
        const ogTitle = doc.querySelector('meta[property="og:title"]');
        const title = ogTitle?.content || doc.querySelector('title')?.textContent || '';
        document.getElementById('article-title').value = title.trim();

        // Extract article text content
        const articleSelectors = [
            'article',
            '.post-content',
            '.entry-content',
            '.article-body',
            '.content',
            'main'
        ];

        let articleText = '';
        for (const selector of articleSelectors) {
            const el = doc.querySelector(selector);
            if (el) {
                articleText = el.textContent.trim();
                break;
            }
        }

        // Fallback to body if no article container found
        if (!articleText) {
            articleText = doc.body?.textContent?.trim() || '';
        }

        // Truncate to ~8000 chars to stay within token limits
        if (articleText.length > 8000) {
            articleText = articleText.substring(0, 8000);
        }

        // Step 2: Use Gemini to summarize
        fetchBtn.innerHTML = '<span class="spinner"></span> Summarizing...';

        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

        const prompt = `You are writing a description for a personal reading tracker. This is NOT a mechanical summary - it's a reflection on why this piece matters.

Write 2-4 sentences that capture the ESSENCE of what makes this piece interesting or important. Focus on:
- The core idea or inflection point being discussed
- Why someone would want to revisit this piece later
- The feeling or insight it leaves you with

Rules:
- Never start with the author's name or "This article..."
- Never start with "The author argues..." or similar
- Write as if you're telling a friend why they should read this
- Be evocative, not mechanical
- Capture the vibe and significance, not just the facts

Example of what NOT to write: "Jack Clark discusses using AI agents to do research while hiking."
Example of what TO write: "We've crossed an inflection point where teams of AI agents can work for you while you sleep, and it feels almost surreal. The future of knowledge work may already be here."

Article title: ${title}

Article content:
${articleText}`;

        const geminiResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });

        const geminiData = await geminiResponse.json();
        console.log('Gemini API response:', geminiData);

        let summary = '';

        if (geminiData.candidates && geminiData.candidates[0]?.content?.parts?.[0]?.text) {
            summary = geminiData.candidates[0].content.parts[0].text.trim();
        } else if (geminiData.error) {
            console.error('Gemini API error:', geminiData.error);
            throw new Error(geminiData.error.message || 'Gemini API failed');
        } else {
            console.error('Unexpected Gemini response format:', geminiData);
            throw new Error('Could not parse Gemini response');
        }

        document.getElementById('article-description').value = summary;

        // Step 3: Use Gemini for categorization too
        const categories = Object.keys(CATEGORIES).join(', ');
        const categoryPrompt = `Given this article summary, which ONE of these categories best fits? Categories: ${categories}

Summary: ${summary}

Reply with ONLY the category key (e.g., "ai" or "core-finance"), nothing else.`;

        const categoryResponse = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: categoryPrompt }] }]
            })
        });

        const categoryData = await categoryResponse.json();
        let suggestedCategory = 'food-for-thought';

        if (categoryData.candidates?.[0]?.content?.parts?.[0]?.text) {
            const suggested = categoryData.candidates[0].content.parts[0].text.trim().toLowerCase();
            if (CATEGORIES[suggested]) {
                suggestedCategory = suggested;
            }
        }

        document.getElementById('article-category').value = suggestedCategory;

    } catch (error) {
        console.error('Error fetching article info:', error);
        alert('Could not fetch or summarize article. Please fill in manually.');
    } finally {
        fetchBtn.innerHTML = originalText;
        fetchBtn.disabled = false;
    }
}

// ========================================
// Event Handlers
// ========================================
function showApp() {
    landingSection.classList.add('hidden');
    appSection.classList.remove('hidden');
    currentCategory = null;
    updateActiveCategory();
    renderArticles();
    updateStats();
}

function showLanding() {
    appSection.classList.add('hidden');
    landingSection.classList.remove('hidden');
}

function handleCategoryClick(event) {
    const categoryItem = event.currentTarget;
    currentCategory = categoryItem.dataset.category;
    updateActiveCategory();
    renderArticles();
    // Track page view
    if (typeof trackPageView === 'function') {
        trackPageView(currentCategory);
    }
}

function showModal() {
    modalOverlay.classList.remove('hidden');
}

function hideModal() {
    modalOverlay.classList.add('hidden');
    addForm.reset();
}

function handleAddArticle(event) {
    event.preventDefault();

    const url = document.getElementById('article-url').value;
    const title = document.getElementById('article-title').value;
    const description = document.getElementById('article-description').value;
    const category = document.getElementById('article-category').value;

    const urlObj = new URL(url);
    const source = urlObj.hostname.replace('www.', '');

    const newArticle = {
        id: Date.now(),
        title,
        description: description || 'No description provided.',
        url,
        source,
        category
    };

    articles.unshift(newArticle);
    updateStats();

    if (currentCategory === category) {
        renderArticles();
    }

    hideModal();
}

// ========================================
// Event Listeners
// ========================================
exploreBtn.addEventListener('click', showApp);
sidebarHomeBtn.addEventListener('click', showLanding);

categoryItems.forEach(item => {
    item.addEventListener('click', handleCategoryClick);
});

// Handle clickable section labels (like Books)
document.querySelectorAll('.nav-section-clickable').forEach(item => {
    item.addEventListener('click', handleCategoryClick);
});

// Handle books button on landing page
if (booksBtn) {
    booksBtn.addEventListener('click', () => {
        landingSection.classList.add('hidden');
        appSection.classList.remove('hidden');
        currentCategory = 'books';
        updateActiveCategory();
        renderArticles();
        updateStats();
    });
}

if (addBtn) addBtn.addEventListener('click', showModal);
if (modalClose) modalClose.addEventListener('click', hideModal);
if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            hideModal();
        }
    });
}

if (addForm) addForm.addEventListener('submit', handleAddArticle);

if (fetchBtn) {
    fetchBtn.addEventListener('click', () => {
        const url = articleUrlInput.value.trim();
        if (url) {
            fetchArticleInfo(url);
        } else {
            alert('Please enter a URL first');
        }
    });
}

// ========================================
// User Picker Functions
// ========================================
const userPickerOverlay = document.getElementById('user-picker-overlay');
const userButtonsContainer = document.getElementById('user-buttons');
const currentUserBadge = document.getElementById('current-user-badge');
const currentUserNameEl = document.getElementById('current-user-name');
const changeUserBtn = document.getElementById('change-user-btn');

function showUserPicker() {
    // Don't show picker if using magic link
    if (typeof isUsingMagicLink === 'function' && isUsingMagicLink()) {
        return;
    }

    if (!userButtonsContainer) return;

    // Render user buttons
    userButtonsContainer.innerHTML = '';

    // Add curator option
    const curatorBtn = document.createElement('button');
    curatorBtn.className = 'user-select-btn';
    curatorBtn.innerHTML = `📚 ${CURATOR} (Curator)`;
    curatorBtn.onclick = () => selectUser(CURATOR);
    userButtonsContainer.appendChild(curatorBtn);

    // Add regular users
    USERS.forEach(userName => {
        const btn = document.createElement('button');
        btn.className = 'user-select-btn';
        btn.innerHTML = `👤 ${userName}`;
        btn.onclick = () => selectUser(userName);
        userButtonsContainer.appendChild(btn);
    });

    userPickerOverlay.classList.remove('hidden');
}

function hideUserPicker() {
    if (userPickerOverlay) {
        userPickerOverlay.classList.add('hidden');
    }
}

function selectUser(userName) {
    setCurrentUser(userName);
    hideUserPicker();
    updateCurrentUserBadge();
    renderArticles(); // Re-render to show user-specific UI
}

function updateCurrentUserBadge() {
    const user = getCurrentUser();
    if (user && currentUserBadge && currentUserNameEl) {
        currentUserNameEl.textContent = user;
        currentUserBadge.classList.remove('hidden');
    } else if (currentUserBadge) {
        currentUserBadge.classList.add('hidden');
    }
}

function clearCurrentUser() {
    localStorage.removeItem('readlist-user');
    updateCurrentUserBadge();
    showUserPicker();
}

// Change user button handler
if (changeUserBtn) {
    changeUserBtn.addEventListener('click', clearCurrentUser);
}

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    updateStats();

    // Check if using magic link
    const usingMagicLink = typeof isUsingMagicLink === 'function' && isUsingMagicLink();

    // Check if user is set
    const user = getCurrentUser();

    if (usingMagicLink) {
        // Magic link user - auto login, hide change button
        updateCurrentUserBadge();
        if (changeUserBtn) {
            changeUserBtn.style.display = 'none';
        }
    } else if (!user) {
        showUserPicker();
    } else {
        updateCurrentUserBadge();
    }

    // Initialize Firebase read status listener
    if (typeof initReadStatusListener === 'function') {
        initReadStatusListener();
    }

    // ========================================
    // Collapsible Navigation Toggles
    // ========================================
    const navToggles = document.querySelectorAll('.nav-toggle[data-toggle]');
    navToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const section = toggle.closest('.nav-section');
            const subcategoryList = section.querySelector('.subcategory-list');
            const toggleType = toggle.dataset.toggle;

            if (subcategoryList) {
                const isExpanded = section.classList.contains('expanded');

                // Close all other sections first
                document.querySelectorAll('.nav-section.expanded').forEach(s => {
                    if (s !== section) {
                        s.classList.remove('expanded');
                        const list = s.querySelector('.subcategory-list');
                        if (list) {
                            list.classList.remove('expanded');
                            list.classList.add('collapsed');
                        }
                    }
                });

                // Toggle current section
                if (isExpanded) {
                    section.classList.remove('expanded');
                    subcategoryList.classList.remove('expanded');
                    subcategoryList.classList.add('collapsed');
                } else {
                    section.classList.add('expanded');
                    subcategoryList.classList.remove('collapsed');
                    subcategoryList.classList.add('expanded');

                    // Show Articles landing page when expanding
                    if (toggleType === 'articles') {
                        currentCategory = 'articles-landing';
                        updateActiveCategory();
                        renderArticles();
                    }
                }
            }
        });
    });

    // Direct navigation toggles (Books, YouTube)
    const directToggles = document.querySelectorAll('.nav-toggle-direct');
    directToggles.forEach(toggle => {
        toggle.addEventListener('click', () => {
            const category = toggle.dataset.category;
            if (category) {
                currentCategory = category;
                updateActiveCategory();
                renderArticles();
            }
        });
    });

    // ========================================
    // User Submissions Button Handler
    // ========================================
    if (userSubmissionsBtn) {
        userSubmissionsBtn.addEventListener('click', () => {
            openSubmissionsModal();
        });
    }
});

// ========================================
// Filmreel Scroll-Based Focus (Intersection Observer)
// ========================================
function initFilmreelObserver() {
    const cards = document.querySelectorAll('.filmreel-card');
    if (cards.length === 0) return;

    // Create intersection observer to detect which card is in center
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                // This card is mostly visible - make it active
                cards.forEach(card => {
                    card.classList.remove('filmreel-active');
                    card.classList.add('filmreel-blur');
                });
                entry.target.classList.remove('filmreel-blur');
                entry.target.classList.add('filmreel-active');
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -40% 0px', // Only trigger for cards in the center 20% of viewport
        threshold: 0.5
    });

    cards.forEach(card => observer.observe(card));
}



// ========================================
// Notice Board Functions
// ========================================
function updateNoticeBoards() {
    const activeUsersEl = document.getElementById('active-users');
    const inactiveUsersEl = document.getElementById('inactive-users');

    if (!activeUsersEl || !inactiveUsersEl) return;

    activeUsersEl.innerHTML = '';
    inactiveUsersEl.innerHTML = '';

    INVITEES.forEach(userName => {
        const hasActivity = hasUserActivity(userName);
        const targetEl = hasActivity ? activeUsersEl : inactiveUsersEl;

        const userDiv = document.createElement('div');
        userDiv.className = 'notice-board-user';
        userDiv.textContent = userName;

        // Always show reactions/thoughts popup when clicking names in list
        userDiv.onclick = () => showUserReactionsPopup(userName);

        targetEl.appendChild(userDiv);
    });
}

function initNoticeBoards() {
    // Set up toggle handlers
    const activeToggle = document.getElementById('active-toggle');
    const inactiveToggle = document.getElementById('inactive-toggle');
    const activeBoard = document.getElementById('active-board');
    const inactiveBoard = document.getElementById('inactive-board');
    const activeContent = document.getElementById('active-content');
    const inactiveContent = document.getElementById('inactive-content');

    if (activeToggle && activeBoard && activeContent) {
        activeToggle.onclick = () => {
            activeBoard.classList.toggle('expanded');
            activeContent.classList.toggle('collapsed');
        };
    }

    if (inactiveToggle && inactiveBoard && inactiveContent) {
        const booFigure = document.getElementById('boo-figure');
        inactiveToggle.onclick = () => {
            inactiveBoard.classList.toggle('expanded');
            inactiveContent.classList.toggle('collapsed');
            // Toggle boo figure visibility
            if (booFigure) {
                booFigure.classList.toggle('hidden');
            }
        };
    }

    // Initialize profile box
    initProfileBox();

    // Initial render
    updateNoticeBoards();
}

function initProfileBox() {
    // Make the entire badge clickable (not just the name)
    const badgeMain = document.getElementById('badge-main-clickable');
    const currentUser = getCurrentUser();

    if (!badgeMain || !currentUser || isCuratorAccess()) return;

    // Clicking badge opens thoughts popup
    badgeMain.onclick = (e) => {
        // Don't trigger if clicking the X button
        if (e.target.closest('.change-user-btn')) return;
        e.stopPropagation();
        showThoughtsPopup();
    };
}

function showUserReactionsPopup(userName) {
    const overlay = document.getElementById('reactions-overlay');
    const popup = document.getElementById('reactions-popup');
    const title = document.getElementById('reactions-popup-title');
    const content = document.getElementById('reactions-popup-content');

    if (!overlay || !popup || !content) return;

    // Get user's favorite article
    const userThoughts = getUserThoughts(userName);
    const favoriteArticle = userThoughts.favoriteArticleId
        ? articles.find(a => a.id === userThoughts.favoriteArticleId)
        : null;

    title.textContent = `${userName}'s Favorite`;

    if (favoriteArticle) {
        // Show the favorite article as a tile-style card
        content.innerHTML = `
            <div class="favorite-tile">
                <div class="favorite-tile-star">⭐</div>
                <div class="favorite-tile-title">${favoriteArticle.title}</div>
                <div class="favorite-tile-description">${favoriteArticle.description || ''}</div>
                ${favoriteArticle.url ? `<a href="${favoriteArticle.url}" target="_blank" rel="noopener" class="favorite-tile-link">Read Article →</a>` : ''}
            </div>
        `;
    } else {
        // User has activity but no favorite selected
        const pronoun = getPronoun(userName);
        const possessive = pronoun === 'he' ? 'his' : 'her';
        content.innerHTML = `
            <div class="favorite-tile favorite-tile-empty">
                <div class="favorite-tile-star">📖</div>
                <div class="favorite-tile-title">${userName} hasn't picked a favorite yet</div>
                <div class="favorite-tile-description">Check back later to see what ${pronoun} chooses as ${possessive} favorite article!</div>
            </div>
        `;
    }

    overlay.classList.remove('hidden');
    popup.classList.remove('hidden');
}

function hideUserReactionsPopup() {
    const overlay = document.getElementById('reactions-overlay');
    const popup = document.getElementById('reactions-popup');

    if (overlay) overlay.classList.add('hidden');
    if (popup) popup.classList.add('hidden');
}

// ========================================
// Thoughts Popup Functions
// ========================================
function showThoughtsPopup() {
    const popup = document.getElementById('thoughts-popup');
    const overlay = document.getElementById('reactions-overlay');
    const select = document.getElementById('favorite-article-select');

    if (!popup || !select) return;

    const currentUser = getCurrentUser();
    const userThoughts = getUserThoughts(currentUser);

    // Populate article select dropdown
    select.innerHTML = '<option value="">-- Select your favorite --</option>';
    articles.forEach(article => {
        if (article.category !== 'books') { // Only include articles, not books
            const option = document.createElement('option');
            option.value = article.id;
            option.textContent = article.title;
            if (userThoughts.favoriteArticleId === article.id) {
                option.selected = true;
            }
            select.appendChild(option);
        }
    });

    if (overlay) overlay.classList.remove('hidden');
    popup.classList.remove('hidden');
}

function hideThoughtsPopup() {
    const popup = document.getElementById('thoughts-popup');
    const overlay = document.getElementById('reactions-overlay');

    if (popup) popup.classList.add('hidden');
    if (overlay) overlay.classList.add('hidden');
}

function saveUserThoughtsHandler() {
    const select = document.getElementById('favorite-article-select');
    const currentUser = getCurrentUser();

    if (!currentUser || !select) return;

    const favoriteId = select.value ? parseInt(select.value) : null;

    saveUserThoughts(currentUser, '', favoriteId)
        .then(() => {
            hideThoughtsPopup();
            updateNoticeBoards();
        })
        .catch(err => {
            console.error('Failed to save favorite:', err);
        });
}

// Initialize notice boards and popup handlers on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initNoticeBoards();
    initUserThoughtsListener();

    // Close popup handlers
    const closeBtn = document.getElementById('reactions-popup-close');
    const overlay = document.getElementById('reactions-overlay');
    const thoughtsCloseBtn = document.getElementById('thoughts-popup-close');
    const saveThoughtsBtn = document.getElementById('save-thoughts-btn');

    if (closeBtn) closeBtn.onclick = hideUserReactionsPopup;
    if (overlay) overlay.onclick = () => {
        hideUserReactionsPopup();
        hideThoughtsPopup();
    };
    if (thoughtsCloseBtn) thoughtsCloseBtn.onclick = hideThoughtsPopup;
    if (saveThoughtsBtn) saveThoughtsBtn.onclick = saveUserThoughtsHandler;

    // Initialize analytics
    if (typeof initAnalytics === 'function') {
        initAnalytics();
    }
    if (typeof initAnalyticsListener === 'function') {
        initAnalyticsListener();
    }

    // Initialize analytics dashboard for curator
    initAnalyticsDashboard();
});

// ========================================
// Analytics Dashboard Functions
// ========================================
function initAnalyticsDashboard() {
    const dashboard = document.getElementById('analytics-dashboard');
    const toggle = document.getElementById('analytics-toggle');
    const content = document.getElementById('analytics-content');
    const tabs = document.querySelectorAll('.analytics-tab');
    const userSelect = document.getElementById('analytics-user-select');

    // Only show for curator
    if (!isCuratorAccess()) {
        if (dashboard) dashboard.remove();
        return;
    }

    // Show dashboard
    if (dashboard) dashboard.classList.remove('hidden');

    // Toggle expand/collapse
    if (toggle && content) {
        toggle.onclick = () => {
            dashboard.classList.toggle('expanded');
            content.classList.toggle('collapsed');
        };
    }

    // Tab switching
    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            const consolidatedPanel = document.getElementById('consolidated-panel');
            const individualPanel = document.getElementById('individual-panel');

            if (tab.dataset.tab === 'consolidated') {
                consolidatedPanel.classList.remove('hidden');
                individualPanel.classList.add('hidden');
            } else {
                consolidatedPanel.classList.add('hidden');
                individualPanel.classList.remove('hidden');
            }
        };
    });

    // Populate user select
    if (userSelect) {
        userSelect.innerHTML = '<option value="">-- Select User --</option>';
        INVITEES.forEach(userName => {
            const option = document.createElement('option');
            option.value = userName;
            option.textContent = userName;
            userSelect.appendChild(option);
        });

        userSelect.onchange = () => {
            renderUserStats(userSelect.value);
        };
    }

    // Initial render
    updateAnalyticsDashboard();
}

function updateAnalyticsDashboard() {
    if (!isCuratorAccess()) return;

    renderConsolidatedStats();

    // Also update individual user stats if one is selected
    const userSelect = document.getElementById('analytics-user-select');
    if (userSelect && userSelect.value) {
        renderUserStats(userSelect.value);
    }
}

function formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${hrs}h ${mins}m`;
}

function formatLastVisit(timestamp) {
    if (!timestamp) return 'Never';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

function renderConsolidatedStats() {
    const container = document.getElementById('consolidated-stats');
    if (!container) return;

    const stats = typeof getConsolidatedAnalytics === 'function'
        ? getConsolidatedAnalytics()
        : { totalVisits: 0, totalPageViews: 0, totalArticleClicks: 0, totalReactions: 0, avgSessionDuration: 0, activeUsers: 0 };

    container.innerHTML = `
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.activeUsers}</div>
            <div class="analytics-stat-label">Active Users</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.totalVisits}</div>
            <div class="analytics-stat-label">Total Visits</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.totalPageViews}</div>
            <div class="analytics-stat-label">Page Views</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.totalArticleClicks}</div>
            <div class="analytics-stat-label">Articles Opened</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.totalReactions}</div>
            <div class="analytics-stat-label">Reactions</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${formatDuration(stats.avgSessionDuration)}</div>
            <div class="analytics-stat-label">Avg Session</div>
        </div>
    `;
}

function renderUserStats(userName) {
    const container = document.getElementById('user-stats');
    if (!container) return;

    if (!userName) {
        container.innerHTML = '<div class="analytics-empty">Select a user to view their stats</div>';
        return;
    }

    const stats = typeof getUserAnalyticsSummary === 'function'
        ? getUserAnalyticsSummary(userName)
        : { totalVisits: 0, totalPageViews: 0, totalArticleClicks: 0, totalReactions: 0, avgSessionDuration: 0, lastVisit: null };

    if (stats.totalVisits === 0) {
        container.innerHTML = `<div class="analytics-empty">${userName} hasn't visited yet</div>`;
        return;
    }

    container.innerHTML = `
        <div class="analytics-stat full-width">
            <div class="analytics-stat-value">${formatLastVisit(stats.lastVisit)}</div>
            <div class="analytics-stat-label">Last Visit</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.totalVisits}</div>
            <div class="analytics-stat-label">Visits</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.sessionCount || 0}</div>
            <div class="analytics-stat-label">Sessions</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.totalPageViews}</div>
            <div class="analytics-stat-label">Page Views</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.totalArticleClicks}</div>
            <div class="analytics-stat-label">Articles</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${stats.totalReactions}</div>
            <div class="analytics-stat-label">Reactions</div>
        </div>
        <div class="analytics-stat">
            <div class="analytics-stat-value">${formatDuration(stats.avgSessionDuration)}</div>
            <div class="analytics-stat-label">Avg Session</div>
        </div>
    `;
}

// ========================================
// User Submissions Functions
// ========================================
function openSubmissionsModal() {
    const overlay = document.getElementById('submissions-overlay');
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    if (overlay) {
        overlay.classList.remove('hidden');
        refreshSubmissionsView(user);
    }
}

function closeSubmissionsModal() {
    const overlay = document.getElementById('submissions-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
    // Reset form state
    hideSubmissionForm();
    hideSubmissionConfirmation();
}

function refreshSubmissionsView(user) {
    const emptyState = document.getElementById('submissions-empty');
    const listEl = document.getElementById('submissions-list');
    const addSection = document.getElementById('add-submission-section');
    const limitMsg = document.getElementById('submission-limit');
    const isCurator = typeof isCuratorAccess === 'function' && isCuratorAccess();

    // Get submissions based on user type
    const allSubmissions = typeof getAllSubmissions === 'function' ? getAllSubmissions() : {};
    const hasAnySubmissions = Object.keys(allSubmissions).length > 0;

    // Reset states
    emptyState?.classList.add('hidden');
    listEl?.classList.add('hidden');
    addSection?.classList.add('hidden');
    limitMsg?.classList.add('hidden');

    if (isCurator) {
        // Curator view: show all submissions
        if (hasAnySubmissions) {
            listEl?.classList.remove('hidden');
            renderAllSubmissions(allSubmissions);
        } else {
            emptyState?.classList.remove('hidden');
        }
    } else if (user) {
        // Regular user view
        const userSubmissions = typeof getUserSubmissions === 'function' ? getUserSubmissions(user) : {};
        const userCount = Object.keys(userSubmissions).length;

        if (hasAnySubmissions) {
            listEl?.classList.remove('hidden');
            renderAllSubmissions(allSubmissions);
        } else {
            emptyState?.classList.remove('hidden');
        }

        // Show add button if under limit
        if (userCount < 2) {
            addSection?.classList.remove('hidden');
        } else {
            limitMsg?.classList.remove('hidden');
        }
    } else {
        // No user - show empty state
        emptyState?.classList.remove('hidden');
    }
}

function renderAllSubmissions(allSubmissions) {
    const listEl = document.getElementById('submissions-list');
    if (!listEl) return;

    let html = '';
    Object.entries(allSubmissions).forEach(([userName, submissions]) => {
        Object.values(submissions).forEach(sub => {
            const date = new Date(sub.submittedAt).toLocaleDateString();
            html += `
                <div class="submission-item">
                    <div class="submission-user">${userName}</div>
                    <a href="${sub.url}" target="_blank" class="submission-url">${sub.url}</a>
                    <div class="submission-date">${date}</div>
                </div>
            `;
        });
    });

    listEl.innerHTML = html || '<p>No submissions found.</p>';
}

function showSubmissionForm() {
    const form = document.getElementById('submission-form');
    const addBtn = document.getElementById('add-submission-btn');
    if (form) form.classList.remove('hidden');
    if (addBtn) addBtn.classList.add('hidden');
}

function hideSubmissionForm() {
    const form = document.getElementById('submission-form');
    const addBtn = document.getElementById('add-submission-btn');
    const input = document.getElementById('article-url-input');
    if (form) form.classList.add('hidden');
    if (addBtn) addBtn.classList.remove('hidden');
    if (input) input.value = '';
}

function showSubmissionConfirmation() {
    const conf = document.getElementById('submission-confirmation');
    const form = document.getElementById('submission-form');
    const addSection = document.getElementById('add-submission-section');
    if (conf) conf.classList.remove('hidden');
    if (form) form.classList.add('hidden');
    if (addSection) addSection.classList.add('hidden');
}

function hideSubmissionConfirmation() {
    const conf = document.getElementById('submission-confirmation');
    if (conf) conf.classList.add('hidden');
}

async function submitArticle() {
    const input = document.getElementById('article-url-input');
    const url = input?.value?.trim();
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;

    if (!url || !user) {
        alert('Please enter a valid URL');
        return;
    }

    // Validate URL format
    try {
        new URL(url);
    } catch {
        alert('Please enter a valid URL');
        return;
    }

    // Save submission
    if (typeof saveUserSubmission === 'function') {
        await saveUserSubmission(user, url);
    }

    showSubmissionConfirmation();

    // Auto-close after delay
    setTimeout(() => {
        closeSubmissionsModal();
    }, 3000);
}

// Initialize submissions modal handlers
document.addEventListener('DOMContentLoaded', () => {
    const closeBtn = document.getElementById('close-submissions-btn');
    const addBtn = document.getElementById('add-submission-btn');
    const submitBtn = document.getElementById('submit-article-btn');
    const cancelBtn = document.getElementById('cancel-submission-btn');
    const overlay = document.getElementById('submissions-overlay');

    if (closeBtn) closeBtn.addEventListener('click', closeSubmissionsModal);
    if (addBtn) addBtn.addEventListener('click', showSubmissionForm);
    if (submitBtn) submitBtn.addEventListener('click', submitArticle);
    if (cancelBtn) cancelBtn.addEventListener('click', hideSubmissionForm);

    // Close on overlay click
    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSubmissionsModal();
        });
    }

    // Initialize submissions listener
    if (typeof initUserSubmissionsListener === 'function') {
        initUserSubmissionsListener();
    }
});
