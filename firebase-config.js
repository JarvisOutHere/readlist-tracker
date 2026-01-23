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
const USERS = ["Revant", "Parthiv", "Cicily", "Avantheka"]; // Customize these names
const CURATOR = "Tanmay"; // You - the person who adds articles

// Magic link tokens - share these unique links with friends
// Example: yourapp.vercel.app/?u=r7x2k → Revant
const USER_TOKENS = {
    "r7x2k": "Revant",
    "p3m9n": "Parthiv",
    "c4w8j": "Cicily",
    "a6t3v": "Avantheka"
};

// Check URL for magic link token
function getUserFromToken() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('u');
    if (token && USER_TOKENS[token]) {
        return USER_TOKENS[token];
    }
    return null;
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
    return getCurrentUser() === CURATOR;
}

// ========================================
// Read Status Functions
// ========================================
function markAsRead(articleId, status) {
    const user = getCurrentUser();
    if (!user || user === CURATOR) return; // Curator doesn't mark

    return database.ref(`readStatus/${articleId}/${user}`).set(status);
}

function removeReadStatus(articleId) {
    const user = getCurrentUser();
    if (!user || user === CURATOR) return;

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
    });
}

function getArticleReadStatus(articleId) {
    return readStatusCache[articleId] || {};
}
