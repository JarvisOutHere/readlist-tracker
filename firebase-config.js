// Firebase configuration
// ReadList Tracker - Tanmay's Firebase Project

const firebaseConfig = {
    apiKey: "AIzaSyBJQ8aAO0lLFk3YqdsXf8uqem4lX8biM_Q",
    authDomain: "readlist-tracker.firebaseapp.com",
    databaseURL: "https://readlist-tracker-default-rtdb.firebaseio.com",
    projectId: "readlist-tracker",
    storageBucket: "readlist-tracker.firebasestorage.app",
    messagingSenderId: "272478552918",
    appId: "1:272478552918:web:30737b439d3a22c4210cf7",
    measurementId: "G-SKP4S04248"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// ========================================
// User Management with Magic Links
// ========================================
const USERS = ["Avantheka", "Cicily", "Himadri", "Kashvi", "Achyut"]; // Friends list (excluding Tanmay who is curator)
const CURATOR = "Tanmay"; // You - the person who adds articles

// User info with gender for pronouns
const USER_INFO = {
    "Tanmay": { gender: "male", token: "t9m4x" },
    "Avantheka": { gender: "female", token: "a6t3v" },
    "Cicily": { gender: "female", token: "c4w8j" },
    "Himadri": { gender: "male", token: "h5d2m" },
    "Kashvi": { gender: "female", token: "k7v9f" },
    "Achyut": { gender: "male", token: "y3m8q" }
};

// Magic link tokens - share these unique links with friends
const USER_TOKENS = {
    "t9m4x": "Tanmay",    // Tanmay (regular user access, not curator)
    "a6t3v": "Avantheka",
    "c4w8j": "Cicily",
    "h5d2m": "Himadri",
    "k7v9f": "Kashvi",
    "y3m8q": "Achyut"
};

// Curator/parent access token
const CURATOR_TOKEN = "curator_x7z9q";

// All invitees for the notice board
const INVITEES = ["Tanmay", "Avantheka", "Cicily", "Himadri", "Kashvi", "Achyut"];

// Check URL for magic link token
function getUserFromToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('u');

    // Check for curator access
    if (token === CURATOR_TOKEN) {
        return CURATOR;
    }

    if (token && USER_TOKENS[token]) {
        return USER_TOKENS[token];
    }
    return null;
}

// Check if user is accessing as curator (parent access)
function isCuratorAccess() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('u') === CURATOR_TOKEN;
}

// Check if user came via magic link
function isUsingMagicLink() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('u');
}

function getCurrentUser() {
    // First check for magic link token
    const tokenUser = getUserFromToken();
    if (tokenUser) {
        return tokenUser;
    }
    return localStorage.getItem('readlist-user');
}

function setCurrentUser(userName) {
    localStorage.setItem('readlist-user', userName);
}

function isCurator() {
    return isCuratorAccess();
}

function getGender(userName) {
    return USER_INFO[userName]?.gender || "male";
}

function getPronoun(userName) {
    return getGender(userName) === "female" ? "she" : "he";
}

// ========================================
// Read Status Functions
// ========================================
function markAsRead(articleId, status) {
    const user = getCurrentUser();
    if (!user || isCuratorAccess()) return; // Curator doesn't mark

    return database.ref(`readStatus/${articleId}/${user}`).set(status);
}

function removeReadStatus(articleId) {
    const user = getCurrentUser();
    if (!user || isCuratorAccess()) return;

    return database.ref(`readStatus/${articleId}/${user}`).remove();
}

function subscribeToReadStatus(callback) {
    database.ref('readStatus').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        callback(data);
    });
}

// Global read status cache
let readStatusCache = {};

function initReadStatusListener() {
    subscribeToReadStatus((data) => {
        readStatusCache = data;
        // Re-render articles if we're in the app view
        if (!appSection.classList.contains('hidden')) {
            renderArticles();
        }
        // Update notice boards when data changes
        if (typeof updateNoticeBoards === 'function') {
            updateNoticeBoards();
        }
    });
}

function getArticleReadStatus(articleId) {
    return readStatusCache[articleId] || {};
}

// Get all reactions for a specific user across all articles
function getUserReactions(userName) {
    const liked = [];
    const neutral = [];
    const disliked = [];

    Object.entries(readStatusCache).forEach(([articleId, reactions]) => {
        if (reactions[userName]) {
            const status = reactions[userName];
            const article = articles.find(a => a.id === parseInt(articleId));
            if (article) {
                if (status === 'liked') liked.push(article);
                else if (status === 'neutral') neutral.push(article);
                else if (status === 'disliked') disliked.push(article);
            }
        }
    });

    return { liked, neutral, disliked };
}

// Check if user has any activity
function hasUserActivity(userName) {
    const reactions = getUserReactions(userName);
    return reactions.liked.length > 0 || reactions.neutral.length > 0 || reactions.disliked.length > 0;
}

// ========================================
// User Thoughts & Favorites
// ========================================
let userThoughtsCache = {};

function subscribeToUserThoughts(callback) {
    database.ref('userThoughts').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        callback(data);
    });
}

function initUserThoughtsListener() {
    subscribeToUserThoughts((data) => {
        userThoughtsCache = data;
    });
}

function saveUserThoughts(userName, thoughts, favoriteArticleId) {
    return database.ref(`userThoughts/${userName}`).set({
        thoughts: thoughts || '',
        favoriteArticleId: favoriteArticleId || null,
        updatedAt: Date.now()
    });
}

function getUserThoughts(userName) {
    return userThoughtsCache[userName] || { thoughts: '', favoriteArticleId: null };
}

// ========================================
// Analytics Tracking
// ========================================
let analyticsCache = {};
let sessionId = null;
let sessionStartTime = null;

function generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function initAnalytics() {
    const user = getCurrentUser();
    if (!user || isCuratorAccess()) return; // Don't track curator

    sessionId = generateSessionId();
    sessionStartTime = Date.now();

    // Record session start
    const sessionRef = database.ref(`analytics/${user}/sessions/${sessionId}`);
    sessionRef.set({
        startTime: sessionStartTime,
        endTime: null,
        duration: 0,
        pageViews: 0,
        articleClicks: 0,
        reactionsGiven: 0
    });

    // Update end time periodically and on page unload
    const updateSession = () => {
        if (!sessionId) return;
        const now = Date.now();
        const duration = Math.floor((now - sessionStartTime) / 1000); // in seconds
        sessionRef.update({
            endTime: now,
            duration: duration
        });
    };

    // Update every 30 seconds
    setInterval(updateSession, 30000);

    // Update on page visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') {
            updateSession();
        }
    });

    // Update on beforeunload
    window.addEventListener('beforeunload', updateSession);

    // Increment visit count
    database.ref(`analytics/${user}/totalVisits`).transaction(count => (count || 0) + 1);
    database.ref(`analytics/${user}/lastVisit`).set(Date.now());
}

function trackPageView(pageName) {
    const user = getCurrentUser();
    if (!user || isCuratorAccess() || !sessionId) return;

    // Increment page views for this session
    database.ref(`analytics/${user}/sessions/${sessionId}/pageViews`).transaction(count => (count || 0) + 1);
    database.ref(`analytics/${user}/totalPageViews`).transaction(count => (count || 0) + 1);
}

function trackArticleClick(articleId, articleTitle) {
    const user = getCurrentUser();
    if (!user || isCuratorAccess() || !sessionId) return;

    // Increment article clicks for this session
    database.ref(`analytics/${user}/sessions/${sessionId}/articleClicks`).transaction(count => (count || 0) + 1);
    database.ref(`analytics/${user}/totalArticleClicks`).transaction(count => (count || 0) + 1);

    // Log the specific article clicked
    database.ref(`analytics/${user}/clickedArticles/${articleId}`).transaction(data => {
        if (!data) {
            return { title: articleTitle, clicks: 1, lastClicked: Date.now() };
        }
        return { ...data, clicks: (data.clicks || 0) + 1, lastClicked: Date.now() };
    });
}

function trackReaction(articleId) {
    const user = getCurrentUser();
    if (!user || isCuratorAccess() || !sessionId) return;

    database.ref(`analytics/${user}/sessions/${sessionId}/reactionsGiven`).transaction(count => (count || 0) + 1);
    database.ref(`analytics/${user}/totalReactions`).transaction(count => (count || 0) + 1);
}

// Analytics data subscription for curator dashboard
function subscribeToAnalytics(callback) {
    database.ref('analytics').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        callback(data);
    });
}

function initAnalyticsListener() {
    subscribeToAnalytics((data) => {
        analyticsCache = data;
        // Update dashboard if visible
        if (typeof updateAnalyticsDashboard === 'function') {
            updateAnalyticsDashboard();
        }
    });
}

function getAnalyticsForUser(userName) {
    return analyticsCache[userName] || null;
}

function getAllAnalytics() {
    return analyticsCache;
}

// Calculate summary stats for a user
function getUserAnalyticsSummary(userName) {
    const data = analyticsCache[userName];
    if (!data) {
        return {
            totalVisits: 0,
            totalPageViews: 0,
            totalArticleClicks: 0,
            totalReactions: 0,
            avgSessionDuration: 0,
            lastVisit: null
        };
    }

    // Calculate average session duration
    let totalDuration = 0;
    let sessionCount = 0;
    if (data.sessions) {
        Object.values(data.sessions).forEach(session => {
            if (session.duration) {
                totalDuration += session.duration;
                sessionCount++;
            }
        });
    }

    return {
        totalVisits: data.totalVisits || 0,
        totalPageViews: data.totalPageViews || 0,
        totalArticleClicks: data.totalArticleClicks || 0,
        totalReactions: data.totalReactions || 0,
        avgSessionDuration: sessionCount > 0 ? Math.floor(totalDuration / sessionCount) : 0,
        lastVisit: data.lastVisit || null,
        sessionCount: sessionCount
    };
}

// Get consolidated analytics across all users
function getConsolidatedAnalytics() {
    let totals = {
        totalVisits: 0,
        totalPageViews: 0,
        totalArticleClicks: 0,
        totalReactions: 0,
        totalSessionDuration: 0,
        sessionCount: 0,
        activeUsers: 0
    };

    Object.entries(analyticsCache).forEach(([userName, data]) => {
        totals.totalVisits += data.totalVisits || 0;
        totals.totalPageViews += data.totalPageViews || 0;
        totals.totalArticleClicks += data.totalArticleClicks || 0;
        totals.totalReactions += data.totalReactions || 0;

        if (data.sessions) {
            Object.values(data.sessions).forEach(session => {
                if (session.duration) {
                    totals.totalSessionDuration += session.duration;
                    totals.sessionCount++;
                }
            });
        }

        if (data.totalVisits > 0) {
            totals.activeUsers++;
        }
    });

    totals.avgSessionDuration = totals.sessionCount > 0
        ? Math.floor(totals.totalSessionDuration / totals.sessionCount)
        : 0;

    return totals;
}
