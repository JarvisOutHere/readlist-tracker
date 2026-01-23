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
        category: "institution-building"
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
        category: "core-finance"
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
    {
        id: 27,
        title: "State of Markets",
        description: "Snapshots from the public and private markets on AI, company-building, and more. Unicorns are real, they run in herds, and tech is its own supercycle.",
        url: "https://www.a16z.news/p/state-of-markets",
        source: "a16z",
        category: "ai",
        multiLink: {
            presentation: {
                url: "https://docs.google.com/presentation/d/e/2PACX-1vQXsMMv5ZCWm77za7oXJcz1X-Th5Mz15g5nYBxbUjnomStVcjn8lXPjE5LzAlvc_hg4yHKgwASWLo5a/pub?start=false&loop=false&delayms=3000&slide=id.g3b6e2578ab2_8_4858",
                label: "Presentation",
                recommended: true
            },
            article: {
                url: "https://www.a16z.news/p/state-of-markets",
                label: "Article"
            }
        }
    },
    // Books
    {
        id: 11,
        title: "I Deliver Parcels in Beijing",
        description: "A memoir from the ground level of China's delivery economy. What it feels like to be a node in the logistical machine that powers modern consumption.",
        url: "",
        source: "Book",
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
        title: "Apple in China: A Story of Innovation",
        description: "How Apple built its supply chain empire in China, and what it reveals about the real geography of innovation—not in labs, but in factories.",
        url: "",
        source: "Book",
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
        title: "The Defiance of the Fall",
        description: "LitRPG at its most addictive. When the multiverse merges with Earth, one man's path through an endless progression system becomes surprisingly compelling.",
        url: "",
        source: "TheFirstDefier",
        category: "books"
    },
    {
        id: 16,
        title: "The Last Economy",
        description: "Iman Mustaq's exploration of what happens to economic systems when growth stops being the default assumption. A framework for thinking about post-growth worlds.",
        url: "",
        source: "Iman Mustaq",
        category: "books"
    },
    {
        id: 17,
        title: "If Anyone Builds It, Everyone Dies",
        description: "The game theory of existential risk. When one actor's breakthrough could mean everyone's end, how do we coordinate? A meditation on the unilateralist's curse.",
        url: "",
        source: "Book",
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
    }
];

// Category definitions
const CATEGORIES = {
    'interesting-businesses': { name: 'Interesting Businesses', emoji: '🏢' },
    'ai': { name: 'AI', emoji: '🤖' },
    'intrapersonal': { name: 'Intrapersonal', emoji: '🧘' },
    'core-finance': { name: 'Core Finance', emoji: '📈' },
    'institution-building': { name: 'Institution Building', emoji: '🏛️' },
    'food-for-thought': { name: 'Food for Thought', emoji: '💭' },
    'books': { name: 'Books', emoji: '📚' }
};

// ========================================
// DOM Elements
// ========================================
const landingSection = document.getElementById('landing');
const appSection = document.getElementById('app');
const exploreBtn = document.getElementById('explore-btn');
const backBtn = document.getElementById('back-btn');
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
const landingCategoriesEl = document.getElementById('landing-categories');
const booksBtn = document.getElementById('books-btn');

// ========================================
// State
// ========================================
let currentCategory = null;

// ========================================
// Helper Functions
// ========================================
function getCategoryDisplayName(category) {
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
    // Count articles (not books) and books separately
    const articleCount = articles.filter(a => a.category !== 'books').length;
    const bookCount = articles.filter(a => a.category === 'books').length;

    if (totalArticlesEl) totalArticlesEl.textContent = articleCount;
    if (totalBooksEl) totalBooksEl.textContent = bookCount;

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
}

function createArticleCard(article) {
    const card = document.createElement('article');
    card.className = 'article-card';

    // Add curator mode class if applicable
    const user = getCurrentUser();
    if (user === CURATOR) {
        card.classList.add('curator-mode');
    }

    // Get read status for this article
    const readStatus = getArticleReadStatus(article.id);
    const currentUserStatus = user ? readStatus[user] : null;

    // Build read status indicators HTML
    let indicatorsHtml = '';
    Object.entries(readStatus).forEach(([userName, status]) => {
        const emoji = status === 'liked' ? '👍' : '👎';
        const statusClass = status === 'liked' ? 'liked' : 'disliked';
        indicatorsHtml += `<span class="read-indicator ${statusClass}">${userName} ${emoji}</span>`;
    });

    // Build action buttons HTML (only for non-curators)
    let actionsHtml = '';
    if (user && user !== CURATOR) {
        const likeActive = currentUserStatus === 'liked' ? 'active' : '';
        const dislikeActive = currentUserStatus === 'disliked' ? 'active' : '';
        actionsHtml = `
            <div class="action-buttons">
                <button class="action-btn like-btn ${likeActive}" data-article-id="${article.id}" data-action="liked" title="I liked this">👍</button>
                <button class="action-btn dislike-btn ${dislikeActive}" data-article-id="${article.id}" data-action="disliked" title="Didn't like it">👎</button>
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
        contentDiv.onclick = () => window.open(article.url, '_blank');
        contentDiv.style.cursor = 'pointer';
    }

    card.appendChild(contentDiv);

    // Add actions section if there's anything to show
    if (indicatorsHtml || actionsHtml) {
        const actionsSection = document.createElement('div');
        actionsSection.className = 'article-actions';
        actionsSection.innerHTML = `
            <div class="read-status-indicators">${indicatorsHtml}</div>
            ${actionsHtml}
        `;
        card.appendChild(actionsSection);

        // Add click handlers for action buttons
        actionsSection.querySelectorAll('.action-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.stopPropagation();
                const articleId = btn.dataset.articleId;
                const action = btn.dataset.action;

                // If already active, remove the status
                if (btn.classList.contains('active')) {
                    removeReadStatus(articleId);
                } else {
                    markAsRead(articleId, action);
                }
            };
        });
    }

    return card;
}

function renderArticles() {
    articlesGrid.innerHTML = '';

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
    document.querySelectorAll('.nav-section-clickable').forEach(item => {
        const category = item.dataset.category;
        item.classList.toggle('active', category === currentCategory);
    });
    currentCategoryTitle.textContent = currentCategory
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
backBtn.addEventListener('click', showLanding);

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
});
