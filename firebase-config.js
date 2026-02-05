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
    "tanmay": "Tanmay",   // Tanmay alias for convenience
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

// Save reaction to Firebase
function saveReactionToFirebase(itemId, userName, reactionType) {
    return database.ref(`readStatus/${itemId}/${userName}`).set(reactionType);
}

// Remove reaction from Firebase
function removeReactionFromFirebase(itemId, userName) {
    return database.ref(`readStatus/${itemId}/${userName}`).remove();
}

// Remove entire item from Firebase (for cleanup)
function removeItemFromFirebase(itemId) {
    return database.ref(`readStatus/${itemId}`).remove();
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

function initUserThoughtsListener() {
    subscribeToUserThoughts((data) => {
        userThoughtsCache = data;
    });
}

function getUserThoughts(userName) {
    return userThoughtsCache[userName] || { thoughts: '', favoriteArticleId: null };
}
