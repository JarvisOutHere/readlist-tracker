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
const USERS = ["Avantheka", "Cicily", "Himadri", "Kashvi", "Achyut", "Rupak", "Shreyas"]; // Friends list (excluding Tanmay who is curator)
const CURATOR = "Tanmay"; // You - the person who adds articles

// User info with gender for pronouns
const USER_INFO = {
    "Tanmay": { gender: "male", token: "t9m4x" },
    "Avantheka": { gender: "female", token: "a6t3v" },
    "Cicily": { gender: "female", token: "c4w8j" },
    "Himadri": { gender: "male", token: "h5d2m" },
    "Kashvi": { gender: "female", token: "k7v9f" },
    "Achyut": { gender: "male", token: "y3m8q" },
    "Shubhangi": { gender: "female", token: "s8h4n" },
    "Rupak":     { gender: "male",   token: "r5p3k" },
    "Shreyas":   { gender: "male",   token: "s7r3y" }
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
    "r5p3k": "Rupak",
    "s7r3y": "Shreyas",
    "guest": "Guest"
};

// Curator/parent access token
const CURATOR_TOKEN = "curator_x7z9q";

// All invitees for the notice board
const INVITEES = ["Tanmay", "Avantheka", "Cicily", "Himadri", "Kashvi", "Achyut", "Vibhu", "Shubhangi", "Rupak", "Shreyas"];


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
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('u');

    // Curator access always takes priority
    if (token === CURATOR_TOKEN) return CURATOR;

    // Named (non-guest) token: trusted user, skip localStorage
    if (token && USER_TOKENS[token] && USER_TOKENS[token] !== 'Guest') {
        return USER_TOKENS[token];
    }

    // Guest link or no token: check localStorage saved login
    const saved = getSavedLogin();
    if (saved && saved.name) return saved.name;

    // Any remaining case (guest link or bare URL with no saved login): anon key
    return getOrCreateAnonKey();
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


// ============================================
// Perpetual Connection: Keep Firebase Always Synced
// ============================================
// The Firebase SDK auto-reconnects on network drops, but browsers aggressively
// throttle WebSockets in backgrounded tabs and may silently let the socket die.
// The block below adds three layers of resilience:
//   1. keepSynced(true) — SDK maintains a live subscription to these paths even
//      when no UI listener is attached, so the cache never goes stale.
//   2. Visibility / online event handlers — force a reconnect cycle the moment
//      the tab becomes visible or the network returns.
//   3. Keep-alive ping — a cheap roundtrip every 4 minutes prevents idle
//      intermediaries (ISPs, proxies) from closing the WebSocket.


// ========================================
// LocalStorage: Saved Login & Anon Key
// ========================================
const SAVED_LOGIN_KEY = 'readingArchive_login';
const ANON_KEY_STORAGE = 'readingArchive_anonKey';

function getSavedLogin() {
    try {
        return JSON.parse(localStorage.getItem(SAVED_LOGIN_KEY) || 'null');
    } catch (e) {
        return null;
    }
}

function setSavedLogin(name) {
    localStorage.setItem(SAVED_LOGIN_KEY, JSON.stringify({ name, timestamp: Date.now() }));
}

function clearSavedLogin() {
    localStorage.removeItem(SAVED_LOGIN_KEY);
}

function getOrCreateAnonKey() {
    let key = localStorage.getItem(ANON_KEY_STORAGE);
    if (!key) {
        key = 'anon-' + Math.random().toString(36).substr(2, 8);
        localStorage.setItem(ANON_KEY_STORAGE, key);
    }
    return key;
}

// ========================================
// Registered Users (guest self-registration)
// ========================================
let registeredUsersCache = {};

function subscribeToRegisteredUsers(callback) {
    database.ref('registeredUsers').on('value', (snapshot) => {
        registeredUsersCache = snapshot.val() || {};
        if (callback) callback(registeredUsersCache);
    });
}

function getRegisteredUsersCache() {
    return registeredUsersCache;
}

function saveUserRegistration(name, oneLiner) {
    return database.ref('registeredUsers/' + name).set({
        name: name,
        oneLiner: oneLiner || '',
        joinedAt: Date.now()
    });
}

function checkUserExists(name) {
    return database.ref('registeredUsers/' + name).once('value').then(function(s) { return s.exists(); });
}

// ========================================
// User Submissions
// ========================================
let userSubmissionsCache = {};

function subscribeToUserSubmissions(callback) {
    database.ref('userSubmissions').on('value', (snapshot) => {
        userSubmissionsCache = snapshot.val() || {};
        if (callback) callback(userSubmissionsCache);
    });
}

function getUserSubmissionsCache() {
    return userSubmissionsCache;
}

function getUserSubmissionsForCategory(categoryKey) {
    const all = userSubmissionsCache;
    return Object.values(all).filter(function(s) { return s.category === categoryKey; });
}

function saveUserSubmission(submission) {
    return database.ref('userSubmissions/' + submission.id).set(submission);
}

function deleteUserSubmissionFromFirebase(submissionId) {
    return database.ref('userSubmissions/' + submissionId).remove();
}

// ========================================
// Hidden Articles (Tanmay can hide/delete any article)
// ========================================
let hiddenArticlesCache = {};

function subscribeToHiddenArticles(callback) {
    database.ref('hiddenArticles').on('value', (snapshot) => {
        hiddenArticlesCache = snapshot.val() || {};
        if (callback) callback(hiddenArticlesCache);
    });
}

function getHiddenArticlesCache() {
    return hiddenArticlesCache;
}

function hideArticleInFirebase(articleId) {
    return database.ref('hiddenArticles/' + articleId).set(true);
}

// ========================================
// Image Upload to Firebase Storage
// ========================================
function uploadImageToStorage(file, submissionId) {
    const storage = firebase.storage();
    const ref = storage.ref('submissions/' + submissionId + '/' + file.name);
    return ref.put(file).then(function(snapshot) { return snapshot.ref.getDownloadURL(); });
}

// 1. Keep the reaction + favorites tree synced globally.
database.ref('readStatus').keepSynced(true);
database.ref('userThoughts').keepSynced(true);

// 2. Track and log connection state.
let firebaseIsConnected = false;
database.ref('.info/connected').on('value', (snapshot) => {
    const wasConnected = firebaseIsConnected;
    firebaseIsConnected = snapshot.val() === true;
    if (firebaseIsConnected && !wasConnected) {
        console.log('[Firebase] Connected');
    } else if (!firebaseIsConnected && wasConnected) {
        console.warn('[Firebase] Disconnected — SDK will auto-reconnect');
    }
});

// Force reconnection when the tab becomes visible again.
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        database.goOffline();
        database.goOnline();
    }
});

// Force reconnection on network recovery.
window.addEventListener('online', () => {
    database.goOffline();
    database.goOnline();
});

// 3. Keep-alive ping every 4 minutes.
setInterval(() => {
    database.ref('.info/serverTimeOffset').once('value').catch(() => {});
}, 4 * 60 * 1000);

// Expose for manual debugging from the console.
window.firebaseDebug = {
    isConnected: () => firebaseIsConnected,
    reconnect: () => { database.goOffline(); database.goOnline(); },
    db: database
};
