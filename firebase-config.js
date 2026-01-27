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
const USERS = ["Avantheka", "Cicily", "Himadri"]; // Friends list (excluding Tanmay who is curator)
const CURATOR = "Tanmay"; // You - the person who adds articles

// User info with gender for pronouns
const USER_INFO = {
    "Tanmay": { gender: "male", token: "t9m4x" },
    "Avantheka": { gender: "female", token: "a6t3v" },
    "Cicily": { gender: "female", token: "c4w8j" },
    "Himadri": { gender: "male", token: "h5d2m" }
};

// Magic link tokens - share these unique links with friends
const USER_TOKENS = {
    "t9m4x": "Tanmay",    // Tanmay (regular user access, not curator)
    "a6t3v": "Avantheka",
    "c4w8j": "Cicily",
    "h5d2m": "Himadri"
};

// Curator/parent access token
const CURATOR_TOKEN = "curator_x7z9q";

// All invitees for the notice board
const INVITEES = ["Tanmay", "Avantheka", "Cicily", "Himadri"];

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
