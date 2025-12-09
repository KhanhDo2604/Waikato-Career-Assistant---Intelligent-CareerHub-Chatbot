# ============================================
# CareerHub question classifier with BERT
# Uses sentence-transformers (MiniLM) + Logistic Regression
# ============================================

import pandas as pd
import re
import pickle
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

from sentence_transformers import SentenceTransformer

# ---------- 1. Load data ----------

df = pd.read_csv("questions(Sheet1) (1).csv", encoding="latin1")

# ---------- 2. Build final_category (same logic as before) ----------

def make_final_category(row):
    cat = str(row.get("category", "")).lower()
    q = str(row.get("question", "")).lower()

    # CV / Resume things
    if "cv" in cat or "cv" in q:
        if "cover letter" in cat or "cover letter" in q:
            return "Cover Letter Help"
        return "CV / Resume Help"

    # Cover letter
    if "cover letter" in cat or "cover letter" in q:
        return "Cover Letter Help"

    # Internships
    if "intern" in cat or "intern" in q:
        return "Internships / Placements"

    # EPA / Employability / Volunteering / Community
    if ("epa" in cat or
        "employability" in cat or
        "plus award" in cat or
        "volunteer" in cat or
        "community" in cat):
        return "EPA / Workplace Skills"

    # Appointments / sessions
    if ("appoint" in cat or
        "drop-in" in cat or
        "drop in" in cat or
        "session" in cat or
        "online career chat" in cat):
        return "Appointments"

    # Job search / applications / opportunities
    if ("job" in cat or
        "opportunit" in cat or
        "vacancy" in cat or
        "application" in cat or
        "job search" in cat):
        return "Job Search & Applications"

    # Everything else
    return "Career Guidance / Other"

df["final_category"] = df.apply(make_final_category, axis=1)

# ---------- 3. Clean question text ----------

def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r"[^a-z0-9\s]", " ", text)  # remove symbols
    text = re.sub(r"\s+", " ", text).strip()  # collapse spaces
    return text

df["question"] = df["question"].astype(str).apply(clean_text)

# Keep only what we need
df = df[["question", "final_category"]].dropna()
df["final_category"] = df["final_category"].astype(str).str.strip()

print("Example rows:")
print(df.head())
print("\nCounts per category:")
print(df["final_category"].value_counts())

# ---------- 4. Train / test split ----------

X = df["question"].tolist()
y = df["final_category"].tolist()

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ---------- 5. Load BERT model & encode sentences ----------

print("\nLoading BERT model (all-MiniLM-L6-v2)...")
bert_model = SentenceTransformer("all-MiniLM-L6-v2")  # small, fast, good

print("Encoding training sentences...")
X_train_emb = bert_model.encode(X_train, convert_to_numpy=True, show_progress_bar=True)

print("Encoding test sentences...")
X_test_emb = bert_model.encode(X_test, convert_to_numpy=True, show_progress_bar=True)

# ---------- 6. Train classifier on BERT embeddings ----------

clf = LogisticRegression(
    max_iter=3000,
    n_jobs=-1,
    multi_class="auto"
)
clf.fit(X_train_emb, y_train)

# ---------- 7. Evaluate ----------

y_pred = clf.predict(X_test_emb)

print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nDetailed report:")
print(classification_report(y_test, y_pred))

# ---------- 8. Save classifier (BERT model is loaded by name) ----------

with open("bert_question_classifier.pkl", "wb") as f:
    pickle.dump(clf, f)

print("\nSaved classifier as 'bert_question_classifier.pkl'.")

# ---------- 9. Helper function for single prediction ----------

def predict_category(question_text: str) -> str:
    cleaned = clean_text(question_text)
    emb = bert_model.encode([cleaned], convert_to_numpy=True)
    pred = clf.predict(emb)[0]
    return pred

test_q = "Can you please check my CV?"
print("\nExample prediction for:", test_q)
print("Predicted category:", predict_category(test_q))
