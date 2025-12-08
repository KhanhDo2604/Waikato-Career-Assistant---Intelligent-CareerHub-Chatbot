"""Train a question classifier on the provided CSV file."""

import pickle
from typing import Tuple

import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
from sklearn.model_selection import train_test_split

CSV_PATH = "questions(Sheet1) (1).csv"


def load_data(path: str) -> Tuple[pd.DataFrame, str]:
    """Load the CSV, create a clean final_category, and return df + label name."""
    df = pd.read_csv(path, encoding="latin1")

    if "question" not in df.columns:
        raise ValueError("The CSV must contain a 'question' column.")

    # Pick a source category column.
    candidate_source_cols = [
        "category",
        "catergory",
        "final category",
        "final_category",
        "final questions",
        "final_questions",
    ]
    source_col = next((c for c in candidate_source_cols if c in df.columns), None)
    if source_col is None:
        raise ValueError(
            "CSV must contain a category-like column such as "
            "'final category', 'final_category', 'final questions', 'category', or 'catergory'. "
            f"Columns found: {list(df.columns)}"
        )

    def make_final_category(row):
        cat = str(row.get(source_col, "")).lower()
        q = str(row.get("question", "")).lower()

        # CV / Resume
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
        if (
            "epa" in cat
            or "employability" in cat
            or "plus award" in cat
            or "volunteer" in cat
            or "community" in cat
        ):
            return "EPA / Workplace Skills"

        # Appointments / sessions
        if (
            "appoint" in cat
            or "drop-in" in cat
            or "drop in" in cat
            or "session" in cat
            or "online career chat" in cat
        ):
            return "Appointments"

        # Job search / applications / opportunities
        if (
            "job" in cat
            or "opportunit" in cat
            or "vacancy" in cat
            or "application" in cat
            or "job search" in cat
        ):
            return "Job Search & Applications"

        # Everything else
        return "Career Guidance / Other"

    df["final_category"] = df.apply(make_final_category, axis=1)
    df = df[["question", "final_category"]].dropna()
    df["final_category"] = df["final_category"].astype(str).str.strip()
    return df, "final_category"


def train_model(df: pd.DataFrame, label_col: str):
    """Train the TF-IDF + Logistic Regression pipeline."""
    test_size = 0.2 if len(df) > 1 else 0.0

    try:
        X_train, X_test, y_train, y_test = train_test_split(
            df["question"],
            df[label_col],
            test_size=test_size,
            random_state=42,
            stratify=df[label_col] if test_size > 0 else None,
        )
    except ValueError as exc:
        print("Stratified split failed, retrying without stratify:", exc)
        X_train, X_test, y_train, y_test = train_test_split(
            df["question"],
            df[label_col],
            test_size=test_size,
            random_state=42,
            stratify=None,
        )

    tfidf = TfidfVectorizer(stop_words="english", ngram_range=(1, 2), max_features=5000)
    X_train_vec = tfidf.fit_transform(X_train)
    X_test_vec = tfidf.transform(X_test)

    clf = LogisticRegression(max_iter=1000)
    clf.fit(X_train_vec, y_train)

    y_pred = clf.predict(X_test_vec)
    print("\nAccuracy:", accuracy_score(y_test, y_pred))
    print("\nDetailed report:\n", classification_report(y_test, y_pred))
    return tfidf, clf


def predict_category_from_models(model, vectorizer, question_text: str) -> str:
    vec = vectorizer.transform([question_text])
    return model.predict(vec)[0]


if __name__ == "__main__":
    df, label_col = load_data(CSV_PATH)
    print("Using label column:", label_col)
    print("Example rows:")
    print(df.head())
    print("\nUnique final categories:", df[label_col].unique())
    print("Counts per category:")
    print(df[label_col].value_counts())

    tfidf, clf = train_model(df, label_col)

    with open("question_vectorizer.pkl", "wb") as f:
        pickle.dump(tfidf, f)
    with open("question_classifier.pkl", "wb") as f:
        pickle.dump(clf, f)

    sample_q = "Can you please check my CV?"
    print("\nExample prediction for:", sample_q)
    print("Predicted category:", predict_category_from_models(clf, tfidf, sample_q))

    # Convenience wrapper using the trained global tfidf/clf.
    def predict_category(question_text: str) -> str:
        vec = tfidf.transform([question_text])
        return clf.predict(vec)[0]

    print("\nExample prediction for: Can you please check my CV?")
    print("Predicted category:", predict_category("Can you please check my CV?"))
from imblearn.over_sampling import RandomOverSampler

# Oversample minority classes
ros = RandomOverSampler(random_state=42)
X_resampled, y_resampled = ros.fit_resample(X_train_vec, y_train)

print("Before oversampling:", y_train.value_counts())
print("After oversampling:", y_resampled.value_counts())
import re

def clean_text(text):
    text = text.lower()
    text = re.sub(r"[^a-zA-Z0-9\s]", "", text)  # remove symbols
    text = re.sub(r"\s+", " ", text).strip()
    return text

df["question"] = df["question"].astype(str).apply(clean_text)

