from fastapi import FastAPI, UploadFile, File, Form
import spacy
import spacy.cli
import re
from fastapi.middleware.cors import CORSMiddleware
from pdfminer.high_level import extract_text
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

spacy.cli.download("en_core_web_sm")
nlp = spacy.load("en_core_web_sm")


def extract_text_from_pdf(file_path):
    return extract_text(file_path)


# 👇 ADD THIS (Step 1 function)
def calculate_score(resume_text, job_description):
    resume_doc = nlp(resume_text)
    jd_doc = nlp(job_description)
    return resume_doc.similarity(jd_doc)


@app.get("/")
def home():
    return {"message": "AI Resume Parser Running 🚀"}


@app.post("/match/")
async def match_resume(file: UploadFile = File(...), job_description: str = Form(...)):

    file_location = f"temp_{file.filename}"

    with open(file_location, "wb") as f:
        f.write(await file.read())

    resume_text = extract_text_from_pdf(file_location)
    os.remove(file_location)

    score = calculate_score(resume_text, job_description)

    return {
        "match_score": round(score * 100, 2)
    }

@app.post("/rank/")
async def rank_resumes(files: list[UploadFile] = File(...), job_description: str = Form(...)):
    results = []

    for file in files:
        file_location = f"temp_{file.filename}"

        with open(file_location, "wb") as f:
            f.write(await file.read())

        resume_text = extract_text_from_pdf(file_location)
        os.remove(file_location)

        score = calculate_score(resume_text, job_description)

        results.append({
            "filename": file.filename,
            "score": round(score * 100, 2)
        })

    # 🔥 Sort by score (highest first)
    ranked = sorted(results, key=lambda x: x["score"], reverse=True)

    return {
        "ranking": ranked
    }