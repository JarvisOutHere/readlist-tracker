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
    "Achyut": { gender: "male", token: "y3m8q" },
    "Shubhangi": { gender: "female", token: "s8h4n" }
};

// Magic link tokens - share these unique links with friends
const USER_TOKENS = {
    "t9m4x": "Tanmay",    // Tanmay (regular user access, not curator)
    "tanmay": "Tanmay",   // Tanmay alias for convenience
    "a6t3v": "Avantheka",
    "c4w8j": "Cicily",
    "h5d2m": "Himadri",
    "k7v9f": "Kashvi",
    "y3m8q": "Achyut",
    "v1bhu": "Vibhu",
    "s8h4n": "Shubhangi",
    "guest": "Guest"
};

// Curator/parent access token
const CURATOR_TOKEN = "curator_x7z9q";

// All invitees for the notice board
const INVITEES = ["Tanmay", "Avantheka", "Cicily", "Himadri", "Kashvi", "Achyut", "Vibhu", "Shubhangi"];


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
    // Fallback to Tanmay if no token provided
    return "Tanmay";
}

function isCurator() {
    return isCuratorAccess();
}

// ========================================
// Firebase Read Status Functions
// ========================================
let readStatusCache = {};

function subscribeToReadStatus(callback) {
    database.ref('readStatus').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        callback(data);
    });
}

function initReadStatusListener(callback) {
    subscribeToReadStatus((data) => {
        readStatusCache = data;
        if (callback) callback(data);
    });
}

function getReadStatusCache() {
    return readStatusCache;
}

// Save reaction to Firebase with article metadata for robustness
// Stores: { reaction: "liked", title: "...", author: "...", timestamp: ... }
function saveReactionToFirebase(itemId, userName, reactionType, articleTitle, articleAuthor) {
    const reactionData = {
        reaction: reactionType,
        title: articleTitle || null,
        author: articleAuthor || null,
        updatedAt: Date.now()
    };

    // Also backup to localStorage
    backupReactionToLocalStorage(itemId, userName, reactionData);

    return database.ref(`readStatus/${itemId}/${userName}`).set(reactionData);
}

// Remove reaction from Firebase
function removeReactionFromFirebase(itemId, userName) {
    // Also remove from localStorage backup
    removeReactionFromLocalStorage(itemId, userName);

    return database.ref(`readStatus/${itemId}/${userName}`).remove();
}

// Remove entire item from Firebase (for cleanup)
function removeItemFromFirebase(itemId) {
    return database.ref(`readStatus/${itemId}`).remove();
}

// ========================================
// LocalStorage Backup for Reactions
// ========================================
const REACTIONS_BACKUP_KEY = 'readingArchive_reactionsBackup';

function getReactionsBackup() {
    try {
        return JSON.parse(localStorage.getItem(REACTIONS_BACKUP_KEY) || '{}');
    } catch {
        return {};
    }
}

function backupReactionToLocalStorage(itemId, userName, reactionData) {
    const backup = getReactionsBackup();
    if (!backup[itemId]) backup[itemId] = {};
    backup[itemId][userName] = reactionData;
    localStorage.setItem(REACTIONS_BACKUP_KEY, JSON.stringify(backup));
}

function removeReactionFromLocalStorage(itemId, userName) {
    const backup = getReactionsBackup();
    if (backup[itemId]) {
        delete backup[itemId][userName];
        if (Object.keys(backup[itemId]).length === 0) {
            delete backup[itemId];
        }
        localStorage.setItem(REACTIONS_BACKUP_KEY, JSON.stringify(backup));
    }
}

// Export backup for manual recovery (call from console: exportReactionsBackup())
function exportReactionsBackup() {
    const backup = getReactionsBackup();
    console.log('Reactions Backup:', JSON.stringify(backup, null, 2));
    return backup;
}


// ========================================
// User Thoughts & Favorites (from old app)
// ========================================
let userThoughtsCache = {};

function subscribeToUserThoughts(callback) {
    database.ref('userThoughts').on('value', (snapshot) => {
        const data = snapshot.val() || {};
        callback(data);
    });
}

function initUserThoughtsListener(onUpdate) {
    subscribeToUserThoughts((data) => {
        userThoughtsCache = data;
        if (onUpdate) onUpdate();
    });
}

function getUserThoughts(userName) {
    return userThoughtsCache[userName] || { thoughts: '', favoriteArticleId: null };
}

// Save favorite article to Firebase
function saveFavoriteToFirebase(userName, articleId) {
    return database.ref(`userThoughts/${userName}/favoriteArticleId`).set(articleId);
}

// Clear favorite article from Firebase
function clearFavoriteFromFirebase(userName) {
    return database.ref(`userThoughts/${userName}/favoriteArticleId`).remove();
}

