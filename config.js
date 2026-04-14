// ── Firebase Setup ───────────────────────────────────────────
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your Firebase config (Aman)
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDz6oxUYKWbeb9swFShbf-rsDfzPP6s2UU",
  authDomain: "aman-3ee64.firebaseapp.com",
  projectId: "aman-3ee64",
  storageBucket: "aman-3ee64.firebasestorage.app",
  messagingSenderId: "134662250108",
  appId: "1:134662250108:web:fca670ce3b982f2cb7b3f9",
  measurementId: "G-6N3R4JLCRL"
};

// Initialize Firebase
export const app = initializeApp(FIREBASE_CONFIG);
export const analytics = getAnalytics(app);

// ── OpenAI helper (UPDATED MODEL) ────────────────────────────
export const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY"; // ⚠️ move to backend later

export async function callOpenAI(messages, model = "gpt-4o-mini") {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: 2000,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    console.error("OpenAI Error:", err);
    throw new Error(err.error?.message || "AI request failed");
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// ── Toast helper ─────────────────────────────────────────────
export function showToast(message, type = "info") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// ── Copy helper (with fallback) ──────────────────────────────
export function copyToClipboard(text) {
  if (!navigator.clipboard) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast("Copied!", "success");
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => showToast("Copied to clipboard!", "success"))
    .catch(() => showToast("Copy failed", "error"));
}

// ── Format date ──────────────────────────────────────────────
export function formatDate(ts) {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}