// ==========================================
// FIREBASE INTEGRATION
// ==========================================
// Note: firebase-config.js must be loaded before this file
// It provides: getCurrentUser(), getReadStatusCache(), initReadStatusListener(),
// saveReactionToFirebase(), removeReactionFromFirebase()

// Reactive state for Firebase data
let reactionsCache = {};

// Get current user from magic link
function getActiveUser() {
    return getCurrentUser(); // From firebase-config.js
}

// Load reactions from Firebase cache
function loadReactions() {
    const cache = getReadStatusCache();
    // Transform Firebase format to app format
    // Firebase: { itemId: { userName: reactionType } }
    // App expects: { itemId: { user: userName, reaction: reactionType } }
    const transformed = {};

    for (const itemId in cache) {
        const userReactions = cache[itemId];
        // Get current user's reaction for this item
        const currentUserName = getActiveUser();
        if (userReactions[currentUserName]) {
            transformed[itemId] = {
                user: currentUserName,
                reaction: mapFirebaseReactionToApp(userReactions[currentUserName])
            };
        }
    }

    return transformed;
}

// Map Firebase reaction types to app types
function mapFirebaseReactionToApp(firebaseData) {
    // Handle both new object format {reaction: 'liked', ...} and legacy string format 'liked'
    const reactionValue = (typeof firebaseData === 'object' && firebaseData !== null && firebaseData.reaction)
        ? firebaseData.reaction
        : firebaseData;

    // Firebase uses: liked, neutral, disliked
    // App uses: positive, neutral, negative
    const mapping = {
        'liked': 'positive',
        'neutral': 'neutral',
        'disliked': 'negative',
        'positive': 'positive',
        'negative': 'negative'
    };
    return mapping[reactionValue] || reactionValue;
}


// Map app reaction types to Firebase types
function mapAppReactionToFirebase(appReaction) {
    const mapping = {
        'positive': 'liked',
        'neutral': 'neutral',
        'negative': 'disliked'
    };
    return mapping[appReaction] || appReaction;
}

// Get all reactions for all users for an item (for nerd profiles)
function getAllReactionsForItem(itemId) {
    const cache = getReadStatusCache();
    return cache[itemId] || {};
}

// Get item ID for reactions
// Firebase doesn't allow: . $ # [ ] / in path keys
// Also remove: : ? and other special chars for safety
function getItemId(item) {
    return `${item.title}-${item.author}`
        .replace(/[.$#\[\]\/\:?]/g, '') // Remove Firebase-invalid chars
        .replace(/\s+/g, '-')
        .toLowerCase();
}

// ==========================================
// IMAGE PRELOADING SYSTEM
// ==========================================
// Cache for preloaded images { imagePath: { loaded: boolean, width: number, height: number } }
const imageCache = {};
let preloadingStarted = false;

// Preload all images on app init (called when landing page loads)
function preloadAllImages() {
    if (preloadingStarted) return;
    preloadingStarted = true;

    // Collect all images from all categories
    const allImages = [];
    for (const category in data.articles) {
        data.articles[category].forEach(item => {
            if (item.image) {
                allImages.push(item.image);
            }
        });
    }

    console.log(`Preloading ${allImages.length} images...`);

    allImages.forEach(imagePath => {
        if (imageCache[imagePath]) return; // Already cached

        const img = new Image();
        imageCache[imagePath] = { loaded: false, width: 0, height: 0 };

        img.onload = () => {
            imageCache[imagePath] = {
                loaded: true,
                width: img.naturalWidth,
                height: img.naturalHeight
            };
        };
        img.onerror = () => {
            imageCache[imagePath] = { loaded: true, width: 0, height: 0 };
        };
        img.src = imagePath;
    });
}

// Get cached image dimensions (returns null if not yet loaded)
function getCachedImageDimensions(imagePath) {
    const cached = imageCache[imagePath];
    if (cached && cached.loaded) {
        return { w: cached.width, h: cached.height };
    }
    return null;
}


const data = {
    articles: {
        "interesting-businesses": [
            {
                title: "PictureTime: The Balloon And The Box Office",
                author: "Tiger Feathers",
                description: "Inflatable cinema theatres bringing Bollywood to villages that never had a screen.",
                url: "https://www.tigerfeathers.in/p/picturetime-the-balloon-and-the-box",
                image: "images/picturetime.png"
            },
            {
                title: "Airbound: Delivering Abundance",
                author: "Tiger Feathers",
                description: "A Bangalore startup betting that drone delivery isn't a gimmick but a fundamental reimagining of logistics. If they crack it, one-rupee delivery could change everything.",
                url: "https://www.tigerfeathers.in/p/airbound-delivering-abundance",
                image: "images/airbound.png"
            },
            {
                title: "a16z: The Power Brokers",
                author: "Not Boring",
                description: "How a venture firm became a cultural and political force. A 16,000-word deep dive into the machine that Marc and Ben built, and what it means to broker power in Silicon Valley.",
                url: "https://www.notboring.co/p/a16z-the-power-brokers",
                image: "images/a16z.png",
                imageBg: "#f5f4f0"
            },
            {
                title: "The Palantirization of Everything",
                author: "a16z",
                description: "Everyone wants to copy Palantir—embed FDEs with customers, build custom workflows, operate like special forces. But most companies copying the aesthetic are setting themselves up to become expensive services businesses with software multiples.",
                url: "https://www.a16z.news/p/the-palantirization-of-everything",
                image: "images/palantirization.png",
                layout: "horizontal"
            }
        ],
        "ai": [
            {
                title: "AI and Leviathan: Part I",
                author: "Second Best",
                description: "What happens when intelligence becomes abundant? This series applies institutional economics to AI, asking whether we're heading toward a new state of nature or something stranger still.",
                url: "https://www.secondbest.ca/p/ai-and-leviathan-part-i",
                image: "images/leviathan.png",
                layout: "horizontal-square"
            },
            {
                title: "AI 2027",
                author: "AI 2027",
                description: "A research-backed scenario forecast that feels uncomfortably plausible. From stumbling agents to superhuman researchers in under three years—a timeline that demands you engage with it.",
                url: "https://ai-2027.com/",
                image: "images/ai2027.png",
                layout: "horizontal-square"
            },
            {
                title: "Import AI 441: My Agents Are Working. Are Yours?",
                author: "Jack Clark",
                description: "We've crossed an inflection point where teams of AI agents can read thousands of papers while you hike, compiling reports better than you could. It feels surreal—like having a fleet of tireless researchers on call. The future of knowledge work may already be here.",
                url: "https://jack-clark.net/2026/01/19/import-ai-441-my-agents-are-working-are-yours/",
                image: "images/import-ai.png"
            },
            {
                title: "AGI Ruin: A List of Lethalities",
                author: "Eliezer Yudkowsky",
                description: "A few dozen reasons why AGI alignment is an extremely difficult problem we are not on track to solve. The big ask isn't perfect alignment—it's obtaining by any strategy whatsoever a significant chance of there being any survivors.",
                url: "https://www.lesswrong.com/posts/uMQ3cqWDPHhjtiesc/agi-ruin-a-list-of-lethalities",
                image: "images/agi-ruin.png"
            },
            {
                title: "The Adolescence of Technology",
                author: "Dario Amodei",
                description: "Exploring risks as AI approaches a 'country of geniuses in a datacenter.' Five concerns: autonomy risks, misuse for destruction, misuse for power, economic disruption, and destabilizing effects. Advocates pragmatic responses through constitutional AI, interpretability research, and surgical regulation.",
                url: "https://www.darioamodei.com/essay/the-adolescence-of-technology",
                image: "images/adolescence-of-tech.png",
                layout: "horizontal"
            }
        ],
        "intrapersonal": [
            {
                title: "Safety Is Making You Depressed",
                author: "Conquer",
                description: "Modern psychology treats all intense dedication as trauma response. But when you avoid all pain, you accidentally avoid all high emotions too. The positive and negative are linked. Life became electric only when I accepted the chase and let suffering have direction.",
                url: "https://conquer1.substack.com/p/safety-is-making-you-depressed"
            },
            {
                title: "The Stable Marriage Problem",
                author: "Acotra",
                description: "Intelligence is choosing what you truly want, acting to get it, and learning fast. Most people drift in a 'river' of others' goals. Agency means stepping out, being honest about your nature, starting before you're ready, risking looking foolish, testing, failing, adjusting, and shipping imperfectly until results match your aims.",
                url: "https://acotra.substack.com/p/the-stable-marriage-problem"
            },
            {
                title: "How to Live an Intellectually Rich Life",
                author: "Utsav Mamoria",
                description: "95% of Wikipedia paths lead to Philosophy. This isn't trivia—it's a map. Epistemic anxiety is what you feel when you sense the truth is out there but can't reach it. The antidote is structured curiosity.",
                url: "https://utsavmamoria.substack.com/p/how-to-live-an-intellectually-rich"
            },
            {
                title: "What Makes a Person Interesting?",
                author: "Angel Cake",
                description: "Curiosity is the root of everything interesting. It's not about Prada sneakers or Oscar films—it's whether you chew your food before swallowing. A Salt & Straw employee judges people by whether they season before tasting.",
                url: "https://angelcake.substack.com/p/what-makes-a-person-interesting"
            },
            {
                title: "Make Something Heavy",
                author: "Working Theorys",
                description: "We create more than ever, but it weighs nothing. The internet rewards movement, so we keep going—99% dopamine, near-zero serotonin, no trace of oxytocin. You don't feel like a true creator because light things don't count, and deep down, you know it. Heavy doesn't mean big—it means dense, defining, durable.",
                url: "https://www.workingtheorys.com/p/make-something-heavy"
            }
        ],
        "fin-econ-geopolity": [
            {
                title: "Evolution of a Value Investor",
                author: "Sage Saigal",
                description: "How value investing philosophy evolves when held seriously over decades. Not the Warren Buffett mythology, but the messy reality of changing your mind while staying principled.",
                url: "https://sagesaigal.substack.com/p/evolution-of-a-value-investor-presentation",
                image: "images/value-investor.png"
            },
            {
                title: "The Puzzle of Pakistan's Poverty",
                author: "Rohit Shinde",
                description: "Religious fundamentalism alone doesn't explain Pakistan's economic underperformance. Structural factors—high fertility, remittance dependency creating Dutch disease, military rent extraction, and geopolitical aid dependency—matter more than ideology in explaining why reforms never stick.",
                url: "https://rshinde.substack.com/p/the-puzzle-of-pakistans-poverty"
            },
            {
                title: "For India, Only Economic Growth Matters",
                author: "Rohit Shinde",
                description: "India must prioritize growth above all else to achieve developed-nation status. Currency appreciation, expensive electricity, labor unions, and restrictive construction norms hinder manufacturing. With declining fertility, there's urgency—economic growth automatically improves every other outcome you care about.",
                url: "https://rshinde.substack.com/p/for-india-only-economic-growth-matters"
            },
            {
                title: "Is India Following China's Path to Prosperity?",
                author: "Rohit Shinde",
                description: "Comparing India and China's development trajectories since the 1970s. India is adopting similar strategies—infrastructure, PLI schemes, education reforms—but faces de-globalization headwinds. Sustained 8% growth for two decades is needed to reach high-income status.",
                url: "https://rshinde.substack.com/p/is-india-following-chinas-path-to"
            },
            {
                title: "China's Broken Balance Sheet: Why China Will Invade Taiwan before 2030",
                author: "Rohit Shinde",
                description: "China faces an unprecedented economic crisis from investment-driven growth funded through shadow banking. With traditional engines exhausted and no access to advanced semiconductors, Beijing may pursue military action against Taiwan to seize TSMC's sub-7nm manufacturing ecosystem.",
                url: "https://substack.com/home/post/p-181489135"
            }
        ],
        "food-for-thought": [
            {
                title: "Compared to What?",
                author: "Adam Golding",
                description: "The Paradox of Absolutism—many seemingly absolute statements actually require comparison to be meaningful. Asking 'compared to what?' helps resolve apparent paradoxes across epistemology, color perception, and metaphysics. Absolute claims often trap people in unproductive loops; calibrating statements through comparative frameworks allows for meaningful resolution.",
                url: "https://adamgolding.substack.com/p/compared-to-what"
            },
            {
                title: "India In Charts - The House View",
                author: "Tiger Feathers",
                description: "A visual essay on India's trajectory—consumption patterns, infrastructure bets, demographic tailwinds. The kind of synthesis that makes you see a country differently.",
                url: "https://www.tigerfeathers.in/p/india-in-charts-the-house-view"
            },
            {
                title: "The Great Differentiation",
                author: "Not Boring",
                description: "When sameness is cheap, differentiation is valuable. But how do you remain differentiated when copying is free? The salvation from slop is making copying expensive—peacocking for the AI age.",
                url: "https://www.notboring.co/p/the-great-differentiation"
            },
            {
                title: "The Böckenförde Dilemma",
                author: "Jason Zhao",
                description: "Liberal democracies rely on shared cultural values to flourish, yet they cannot replenish those very values. A case for spiritual renewal in the West—diagnosing the malaise of American political life.",
                url: "https://jasonzhao.substack.com/p/the-bockenforde-dilemma"
            },
            {
                title: "Notes on India",
                author: "Jason Zhao",
                description: "Initial observations from a week in New Delhi, Bangalore, and Darjeeling. On culture, politics, and economy—the nation as perhaps the most striking experiment in democratic history.",
                url: "https://jasonzhao.substack.com/p/notes-on-india"
            },
            {
                title: "Technology in 1776",
                author: "Christian Keil",
                description: "Contrasting life in 1776 with 2026 to show extraordinary material progress. Technologies transformed water, food, shelter, medicine, and energy—often invisibly making us safer, healthier, and more productive. Recognizing these achievements should inspire confidence that America can overcome current challenges.",
                url: "https://www.a16z.news/p/technology-in-1776"
            }
        ]
    }
};

// Category display names
const categoryNames = {
    "interesting-businesses": "Interesting Businesses",
    "ai": "AI",
    "intrapersonal": "Intrapersonal",
    "fin-econ-geopolity": "Fin-Econ-(Geo)Polity",
    "food-for-thought": "Food for Thought"
};

// Show landing page
function showLanding() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('pillars-page').classList.add('hidden');
    document.getElementById('scroll-page').classList.add('hidden');
}

// Enter pillars view
function enterCatalog() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('pillars-page').classList.remove('hidden');
    document.getElementById('scroll-page').classList.add('hidden');
    buildPillars();
}

// Show pillars (back from scroll view)
function showPillars() {
    document.getElementById('scroll-page').classList.add('hidden');
    document.getElementById('pillars-page').classList.remove('hidden');
}

// Shuffle array (Fisher-Yates)
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Build the 5 vertical pillars
function buildPillars() {
    const container = document.getElementById('pillars-container');
    container.innerHTML = '';

    const allKeys = Object.keys(data.articles);

    // Keep first two fixed, randomize the rest
    const fixedKeys = allKeys.slice(0, 2); // interesting-businesses, ai
    const restKeys = shuffleArray(allKeys.slice(2)); // intrapersonal, fin-econ, food-for-thought
    const categories = [...fixedKeys, ...restKeys];

    // Find max article count for proportional heights
    const counts = categories.map(k => data.articles[k].length);
    const maxCount = Math.max(...counts);

    // Height range: min 40%, max 90% of container
    const minPct = 40;
    const maxPct = 90;

    categories.forEach((catKey, index) => {
        const pillar = document.createElement('div');
        pillar.className = 'pillar';
        pillar.style.animationDelay = `${index * 0.08}s`;

        const count = data.articles[catKey].length;

        // Proportional height
        const heightPct = minPct + ((count / maxCount) * (maxPct - minPct));
        pillar.style.height = heightPct + '%';

        pillar.innerHTML = `
            <div class="pillar-count">${count}</div>
            <div class="pillar-name">${categoryNames[catKey]}</div>
        `;

        pillar.addEventListener('click', () => {
            openScrollView(catKey);
        });

        container.appendChild(pillar);
    });
}

// Track current category for re-rendering
let currentCategoryKey = null;

// Open the scroll view for a category
function openScrollView(categoryKey) {
    currentCategoryKey = categoryKey;
    document.getElementById('pillars-page').classList.add('hidden');
    document.getElementById('scroll-page').classList.remove('hidden');

    const title = document.getElementById('scroll-category-title');
    title.textContent = categoryNames[categoryKey];

    renderScrollCards(categoryKey);
}

// Render scroll cards with PROGRESSIVE LOADING
// Cards render immediately using cached dimensions or placeholders
function renderScrollCards(categoryKey) {
    const container = document.getElementById('scroll-container');
    container.innerHTML = '';

    const items = data.articles[categoryKey];

    // Build all cards immediately - use cached dimensions if available
    items.forEach((item, index) => {
        let imgDims = { w: 0, h: 0 };

        if (item.image) {
            const cached = getCachedImageDimensions(item.image);
            if (cached) {
                // Image already preloaded - use cached dimensions
                imgDims = cached;
            } else {
                // Image not ready yet - use default dimensions, load in background
                imgDims = { w: 400, h: 300 }; // Default aspect ratio

                // Start loading this image and update card when ready
                const img = new Image();
                img.onload = () => {
                    // Update card dimensions when image loads
                    imageCache[item.image] = {
                        loaded: true,
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    };
                };
                img.src = item.image;
            }
        }

        const card = buildScrollCard(item, imgDims.w, imgDims.h);
        container.appendChild(card);
    });

    // Stagger entrance animation (immediate, no waiting for images)
    requestAnimationFrame(() => {
        container.querySelectorAll('.scroll-card').forEach((card, i) => {
            card.style.animationDelay = `${i * 0.08}s`; // Slightly faster stagger
            card.classList.add('visible');
        });
    });
}


// Build a single scroll card
function buildScrollCard(item, imgW, imgH) {
    const card = document.createElement('div');
    card.className = 'scroll-card';

    const itemId = getItemId(item);
    card.dataset.itemId = itemId; // Store for updateReactionButtonStates
    const currentUserName = getActiveUser();

    // Get current user's reaction from Firebase cache
    const cache = getReadStatusCache();
    const itemReactions = cache[itemId] || {};
    const userReaction = itemReactions[currentUserName];
    const mappedReaction = userReaction ? mapFirebaseReactionToApp(userReaction) : null;

    const positiveActive = mappedReaction === 'positive' ? 'active' : '';
    const neutralActive = mappedReaction === 'neutral' ? 'active' : '';
    const negativeActive = mappedReaction === 'negative' ? 'active' : '';

    const imageContent = item.image
        ? `<img src="${item.image}" alt="${item.title}">`
        : `<div class="card-image-placeholder">
                <svg width="64" height="64" viewBox="0 0 48 48" fill="none">
                    <rect x="4" y="8" width="40" height="32" rx="4" stroke="currentColor" stroke-width="2"/>
                    <circle cx="16" cy="20" r="4" stroke="currentColor" stroke-width="2"/>
                    <path d="M4 32L16 24L28 32L36 26L44 32" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
           </div>`;

    const isHorizontal = item.layout === 'horizontal' || item.layout === 'horizontal-square';

    // Check if this article is the user's favorite
    const userThoughts = getUserThoughts(currentUserName);
    const isFavorite = userThoughts.favoriteArticleId === itemId;
    const favoriteActive = isFavorite ? 'active' : '';

    card.innerHTML = `
        <div class="card-window">
            <div class="card-favorite-wrapper">
                <button class="card-favorite-btn ${favoriteActive}" title="Favorite">
                    <span class="btn-icon">★</span>
                    <span class="btn-label">Favorite</span>
                </button>
            </div>
            <div class="card-reactions">
                <button class="card-reaction-btn positive ${positiveActive}" title="Nice"><span class="btn-icon">✓</span><span class="btn-label">Nice</span></button>
                <button class="card-reaction-btn neutral ${neutralActive}" title="Meh"><span class="btn-icon">—</span><span class="btn-label">Meh</span></button>
                <button class="card-reaction-btn negative ${negativeActive}" title="Absolutely Not"><span class="btn-icon">✗</span><span class="btn-label">Absolutely Not</span></button>
            </div>
            <div class="card-image">
                ${imageContent}
            </div>
            <div class="card-bottom">
                <h2 class="card-title">${item.title}</h2>
                <p class="card-author">${item.author}</p>
                <p class="card-description">${item.description}</p>
            </div>
        </div>
    `;


    const win = card.querySelector('.card-window');

    // Apply layout mode
    if (item.layout) {
        win.classList.add(item.layout);
    }

    // Dynamically size card based on image aspect ratio
    if (imgW > 0 && imgH > 0) {
        const vw = window.innerWidth;
        const maxW = vw * 0.88;
        const maxH = window.innerHeight * 0.82;
        const textSize = 120;

        if (isHorizontal) {
            const textPanelW = 250;
            const imgAspect = imgW / imgH;
            let imgAreaH = maxH;
            let imgAreaW = imgAreaH * imgAspect;

            if (imgAreaW + textPanelW > maxW) {
                imgAreaW = maxW - textPanelW;
                imgAreaH = imgAreaW / imgAspect;
            }

            const totalW = imgAreaW + textPanelW;
            const totalH = imgAreaH;

            win.style.width = totalW + 'px';
            win.style.height = totalH + 'px';

            const imgPct = (imgAreaW / totalW * 100);
            const textPct = 100 - imgPct;
            card.querySelector('.card-image').style.width = imgPct + '%';
            card.querySelector('.card-image').style.flex = 'none';
            card.querySelector('.card-bottom').style.width = textPct + '%';
            card.querySelector('.card-bottom').style.flex = 'none';
        } else {
            const imgAspect = imgW / imgH;
            let imgAreaW = maxW;
            let imgAreaH = imgAreaW / imgAspect;

            if (imgAreaH + textSize > maxH) {
                imgAreaH = maxH - textSize;
                imgAreaW = imgAreaH * imgAspect;
            }

            const totalW = imgAreaW;
            const totalH = imgAreaH + textSize;

            win.style.width = totalW + 'px';
            win.style.height = totalH + 'px';
        }
    }

    // Apply custom background color
    if (item.imageBg) {
        card.querySelector('.card-image').style.background = item.imageBg;
    }

    // Click card to open article (except reaction/favorite buttons)
    win.addEventListener('click', (e) => {
        if (!e.target.closest('.card-reaction-btn') && !e.target.closest('.card-favorite-btn') && item.url) {
            window.open(item.url, '_blank');
        }
    });

    if (item.url) {
        win.style.cursor = 'pointer';
    }

    // Reaction handlers
    card.querySelector('.card-reaction-btn.positive').addEventListener('click', (e) => {
        e.stopPropagation();
        handleReaction(item, 'positive', card);
    });
    card.querySelector('.card-reaction-btn.neutral').addEventListener('click', (e) => {
        e.stopPropagation();
        handleReaction(item, 'neutral', card);
    });
    card.querySelector('.card-reaction-btn.negative').addEventListener('click', (e) => {
        e.stopPropagation();
        handleReaction(item, 'negative', card);
    });

    // Favorite button handler
    card.querySelector('.card-favorite-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        handleFavorite(item, card);
    });

    return card;
}


// Handle reaction - saves to Firebase
function handleReaction(item, reactionType, card) {
    const itemId = getItemId(item);
    const currentUserName = getActiveUser();

    // Get current reaction from cache
    const cache = getReadStatusCache();
    const itemReactions = cache[itemId] || {};
    const currentReaction = itemReactions[currentUserName];
    const mappedCurrentReaction = currentReaction ? mapFirebaseReactionToApp(currentReaction) : null;

    // Toggle logic: if same reaction, remove it; otherwise set new one
    if (mappedCurrentReaction === reactionType) {
        // Remove reaction
        removeReactionFromFirebase(itemId, currentUserName);
    } else {
        // Set new reaction with article metadata for robustness
        const firebaseReaction = mapAppReactionToFirebase(reactionType);
        saveReactionToFirebase(itemId, currentUserName, firebaseReaction, item.title, item.author);
    }

    // UI update will happen via Firebase listener callback
}

// Handle favorite - saves to Firebase
function handleFavorite(item, card) {
    const itemId = getItemId(item);
    const currentUserName = getActiveUser();

    // Get current favorite from cache
    const userThoughts = getUserThoughts(currentUserName);
    const currentFavorite = userThoughts.favoriteArticleId;

    // Toggle logic: if already favorite, remove it; otherwise set as new favorite
    if (currentFavorite === itemId) {
        // Remove favorite
        clearFavoriteFromFirebase(currentUserName);
    } else {
        // Set new favorite
        saveFavoriteToFirebase(currentUserName, itemId);
    }

    // Update UI immediately (don't wait for Firebase callback for responsiveness)
    updateFavoriteButtonStates();
}

// Update all favorite button states based on current user's favorite
function updateFavoriteButtonStates() {
    const currentUserName = getActiveUser();
    const userThoughts = getUserThoughts(currentUserName);
    const favoriteId = userThoughts.favoriteArticleId;

    document.querySelectorAll('.scroll-card').forEach(card => {
        const cardItemId = card.dataset.itemId;
        const favBtn = card.querySelector('.card-favorite-btn');
        if (favBtn) {
            if (cardItemId === favoriteId) {
                favBtn.classList.add('active');
            } else {
                favBtn.classList.remove('active');
            }
        }
    });
}


// ==========================================
// NERD PERSONAS (including Kashvi)
// ==========================================
// Note: favorites are now pulled from Firebase userThoughts, not hardcoded
const nerds = [
    {
        id: "tanmay",
        name: "Tanmay",
        subtitle: "Reads everything, retains nothing"
    },
    {
        id: "himadri",
        name: "Himadri",
        subtitle: "Finbro"
    },
    {
        id: "avantheka",
        name: "Avantheka",
        subtitle: "Will debate you on anything"
    },
    {
        id: "cicily",
        name: "Cicily",
        subtitle: "MBG"
    },
    {
        id: "kashvi",
        name: "Kashvi",
        subtitle: "Crochet Enthusiast"
    },
    {
        id: "achyut",
        name: "Achyut",
        subtitle: "Resident Fin-Econ-(Geo)Policy Expert"
    }
];

// Helper function to get article title by numeric ID (from old app's Firebase storage)
function getArticleTitleById(articleId) {
    // Build a flat list of all articles with their index
    const allArticles = [];
    for (const category in data.articles) {
        for (const article of data.articles[category]) {
            allArticles.push(article);
        }
    }

    // If articleId is a number or numeric string, look up by index
    const numId = parseInt(articleId, 10);
    if (!isNaN(numId) && numId >= 0 && numId < allArticles.length) {
        return allArticles[numId].title;
    }

    // If it's already a title string, return as-is
    return null;
}

// Get all valid item IDs from current article data
function getAllValidItemIds() {
    const validIds = new Set();
    for (const category in data.articles) {
        for (const article of data.articles[category]) {
            validIds.add(getItemId(article));
        }
    }
    return validIds;
}

// One-time cleanup: remove orphaned entries from Firebase
// Call this from browser console: cleanupOrphanedFirebaseEntries()
async function cleanupOrphanedFirebaseEntries() {
    const cache = getReadStatusCache();
    const validItemIds = getAllValidItemIds();

    const orphanedIds = Object.keys(cache).filter(id => !validItemIds.has(id));

    console.log(`Found ${orphanedIds.length} orphaned entries to remove:`);
    console.log(orphanedIds);

    if (orphanedIds.length === 0) {
        console.log('No orphaned entries to clean up!');
        return;
    }

    // Remove each orphaned entry
    for (const itemId of orphanedIds) {
        console.log(`Removing: ${itemId}`);
        await removeItemFromFirebase(itemId);
    }

    console.log('Cleanup complete! Refresh the page to see updated counts.');
}

// Get reviews for a specific nerd from Firebase (only counts current articles)
function getNerdReviews(nerdName) {
    const cache = getReadStatusCache();
    const reviews = { positive: 0, neutral: 0, negative: 0 };
    const validItemIds = getAllValidItemIds();

    for (const itemId in cache) {
        // Only count reactions for articles that currently exist
        if (!validItemIds.has(itemId)) continue;

        const itemReactions = cache[itemId];
        if (itemReactions[nerdName]) {
            const reaction = mapFirebaseReactionToApp(itemReactions[nerdName]);
            if (reviews[reaction] !== undefined) {
                reviews[reaction]++;
            }
        }
    }

    return reviews;
}

// Build nerd tiles (current user first)
function buildNerdTiles() {
    const grid = document.getElementById('nerds-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const currentUserName = getActiveUser();

    // Put current user first
    const sorted = [...nerds].sort((a, b) => {
        if (a.name === currentUserName) return -1;
        if (b.name === currentUserName) return 1;
        return 0;
    });

    sorted.forEach((nerd, i) => {
        const tile = document.createElement('div');
        tile.className = 'nerd-tile';
        tile.dataset.nerd = nerd.id;
        tile.style.animationDelay = `${i * 0.08}s`;

        tile.innerHTML = `
            <div class="nerd-initial">${nerd.name.charAt(0)}</div>
            <div class="nerd-name">${nerd.name}</div>
        `;

        tile.addEventListener('click', () => openNerdProfile(nerd));
        grid.appendChild(tile);
    });
}

// Open nerd profile pane
function openNerdProfile(nerd) {
    const overlay = document.getElementById('profile-overlay');
    const pane = document.getElementById('profile-pane');

    const reviews = getNerdReviews(nerd.name);
    const totalReviews = reviews.positive + reviews.neutral + reviews.negative;

    // Get favorite from Firebase userThoughts
    const userThoughts = getUserThoughts(nerd.name);
    const hasFavorite = userThoughts.favoriteArticleId !== null && userThoughts.favoriteArticleId !== undefined;

    // Find article title from favoriteArticleId
    let favoriteTitle = 'Not set yet';
    if (hasFavorite) {
        // Look up the article title from the stored ID
        favoriteTitle = getArticleTitleById(userThoughts.favoriteArticleId) || userThoughts.favoriteArticleId;
    }

    pane.innerHTML = `
        <button class="profile-close" onclick="closeNerdProfile()">&times;</button>
        <div class="profile-avatar">${nerd.name.charAt(0)}</div>
        <h3 class="profile-name">${nerd.name}</h3>
        <p class="profile-subtitle">${nerd.subtitle}</p>
        <div class="profile-divider"></div>
        ${hasFavorite ? `<div class="profile-section">
            <div class="profile-section-label">Favorite Article</div>
            <div class="profile-favorite-title">${favoriteTitle}</div>
        </div>
        <div class="profile-divider"></div>` : ''}
        <div class="profile-section">
            <div class="profile-section-label">Reviews So Far</div>
            ${totalReviews === 0
            ? `<div class="profile-empty-reviews">
                    <div class="boo-container">
                        <svg width="120" height="140" viewBox="0 0 200 180" class="boo-stick-figure">
                            <text x="20" y="25" font-size="16" fill="var(--text-muted)" font-style="italic">Booooooooooo!</text>
                            <circle cx="120" cy="60" r="18" fill="none" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="78" x2="120" y2="115" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="90" x2="98" y2="105" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="90" x2="142" y2="105" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="115" x2="102" y2="145" stroke="var(--text-muted)" stroke-width="3" />
                            <line x1="120" y1="115" x2="138" y2="145" stroke="var(--text-muted)" stroke-width="3" />
                        </svg>
                    </div>
                    <div class="profile-empty-text">No reviews yet</div>
                </div>`
            : `<div class="profile-reviews-grid">
                    <div class="profile-review-item positive">
                        <span class="profile-review-icon">✓</span>
                        <span class="profile-review-count">${reviews.positive}</span>
                        <span class="profile-review-label">Nice</span>
                    </div>
                    <div class="profile-review-item neutral">
                        <span class="profile-review-icon">—</span>
                        <span class="profile-review-count">${reviews.neutral}</span>
                        <span class="profile-review-label">Meh</span>
                    </div>
                    <div class="profile-review-item negative">
                        <span class="profile-review-icon">✗</span>
                        <span class="profile-review-count">${reviews.negative}</span>
                        <span class="profile-review-label">Nope</span>
                    </div>
                  </div>`
        }
        </div>
    `;

    overlay.classList.remove('hidden');
    requestAnimationFrame(() => overlay.classList.add('active'));
}

// Close nerd profile pane
function closeNerdProfile() {
    const overlay = document.getElementById('profile-overlay');
    overlay.classList.remove('active');
    setTimeout(() => overlay.classList.add('hidden'), 300);
}

// ==========================================
// SCROLL-AWARE CORNER BUTTON
// ==========================================
function setupCornerNav() {
    const pillarsPage = document.getElementById('pillars-page');
    const btn = document.getElementById('corner-nav-btn');
    const nerdsSection = document.getElementById('nerds-section');
    if (!btn || !pillarsPage || !nerdsSection) return;

    let isAtNerds = false;

    function updateButton() {
        const scrollTop = pillarsPage.scrollTop;
        const threshold = nerdsSection.offsetTop - window.innerHeight * 0.5;
        const nowAtNerds = scrollTop > threshold;

        if (nowAtNerds !== isAtNerds) {
            isAtNerds = nowAtNerds;
            const textEl = btn.querySelector('.corner-nav-text');
            const arrowEl = btn.querySelector('.corner-nav-arrow');

            if (isAtNerds) {
                textEl.textContent = 'Back to articles';
                arrowEl.style.transform = 'rotate(180deg)';
            } else {
                textEl.textContent = 'Meet the other nerds';
                arrowEl.style.transform = 'rotate(0deg)';
            }
        }
    }

    pillarsPage.addEventListener('scroll', updateButton);

    btn.addEventListener('click', () => {
        if (isAtNerds) {
            pillarsPage.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            nerdsSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// Close profile on backdrop click
function setupProfileOverlay() {
    const overlay = document.getElementById('profile-overlay');
    if (!overlay) return;

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeNerdProfile();
        }
    });
}

// Initialize counts on landing page
function updateCounts() {
    let articleCount = 0;
    for (const category in data.articles) {
        articleCount += data.articles[category].length;
    }
    document.getElementById('articles-count').textContent = articleCount;
}

// Update greeting with current user name
function updateGreeting() {
    const greetingEl = document.getElementById('pillars-greeting');
    if (greetingEl) {
        const userName = getActiveUser();
        greetingEl.textContent = `Hi ${userName}`;
    }
}

// Callback when Firebase data updates - update button states in-place to preserve scroll
function onFirebaseDataUpdate(data) {
    // Update reaction button states in-place (don't re-render to preserve scroll)
    if (currentCategoryKey && !document.getElementById('scroll-page').classList.contains('hidden')) {
        updateReactionButtonStates();
    }
}

// Update reaction button states without re-rendering the entire view
function updateReactionButtonStates() {
    const container = document.getElementById('scroll-container');
    if (!container) return;

    const cards = container.querySelectorAll('.scroll-card');
    const cache = getReadStatusCache();
    const currentUserName = getActiveUser();

    cards.forEach(card => {
        // Get item ID from card's data attribute (set in buildScrollCard)
        const itemId = card.dataset.itemId;
        if (!itemId) return;

        // Get current reaction for this user
        const itemReactions = cache[itemId] || {};
        const userReaction = itemReactions[currentUserName];
        const mappedReaction = userReaction ? mapFirebaseReactionToApp(userReaction) : null;

        // Update button states
        const btns = card.querySelectorAll('.card-reaction-btn');
        btns.forEach(btn => {
            btn.classList.remove('active');
            if (mappedReaction) {
                if (btn.classList.contains(mappedReaction)) {
                    btn.classList.add('active');
                }
            }
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCounts();
    updateGreeting();
    buildNerdTiles();
    setupCornerNav();
    setupProfileOverlay();

    // Start preloading all images immediately (before user clicks anything)
    preloadAllImages();

    // Initialize Firebase listeners
    initReadStatusListener(onFirebaseDataUpdate);
    initUserThoughtsListener(); // Load favorites from Firebase
});

