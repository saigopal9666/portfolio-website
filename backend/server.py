import os
import json
import PyPDF2
import google.generativeai as genai
from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
import urllib.request
import urllib.error
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure Google Gemini
API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("WARNING: GEMINI_API_KEY not found in environment variables.")

app = FastAPI(title="ATS Matcher API")

# Enable CORS for frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/analyze-resume")
async def analyze_resume(
    resumeText: str = Form(...),
    jobDesc: str = Form(...)
):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")
    
    if len(resumeText.strip()) < 50:
        raise HTTPException(status_code=400, detail="Resume text is too short. Please paste more content.")

    # Formulate prompt for Gemini
    prompt = f"""
    You are an expert ATS (Applicant Tracking System).
    I will provide you with a Job Description and a candidate's Resume Text.
    Analyze the resume against the job description and extract the matching and missing keywords, provide a score out of 100, a grade (A, B, C, D, or F), a short message, and 3 actionable improvement tips.
    
    Respond EXACTLY with a JSON object in this format (no markdown code blocks, just raw JSON):
    {{
        "score": 85,
        "grade": "B",
        "grade_msg": "Good match! You have most of the required skills but lack some cloud experience.",
        "matched_keywords": ["Python", "SQL", "Data Engineering"],
        "missing_keywords": ["AWS", "Spark Streaming"],
        "tips": [
            "Highlight your experience with AWS services.",
            "Add specific metrics to your achievements."
        ]
    }}

    --- Job Description ---
    {jobDesc}
    
    --- Resume Text ---
    {resumeText}
    """
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={API_KEY}"
        data = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}]
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req) as response:
            resp_body = response.read().decode('utf-8')
            resp_json = json.loads(resp_body)
            raw_text = resp_json['candidates'][0]['content']['parts'][0]['text']
            
        # Clean up response text in case it contains markdown formatting
        resp_text = raw_text.strip()
        if resp_text.startswith("```json"):
            resp_text = resp_text[7:]
        if resp_text.startswith("```"):
            resp_text = resp_text[3:]
        if resp_text.endswith("```"):
            resp_text = resp_text[:-3]
            
        result = json.loads(resp_text.strip())
        return result
        
    except json.JSONDecodeError as e:
        print("Failed to decode JSON from Gemini:", str(e))
        raise HTTPException(status_code=500, detail="Failed to parse AI response.")
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f"HTTP Error {e.code}: {error_body}")
        
        # Try to parse the Google API error message
        try:
            err_json = json.loads(error_body)
            msg = err_json.get("error", {}).get("message", error_body)
            raise HTTPException(status_code=400, detail=f"Gemini API Error: {msg}")
        except:
            raise HTTPException(status_code=400, detail=f"Gemini API Error: {error_body}")
    except Exception as e:
        print("Error calling Gemini API:", str(e))
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")

@app.post("/api/generate-resume")
async def generate_resume(promptText: str = Form(...)):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured on the server.")
    
    if len(promptText.strip()) < 3:
        raise HTTPException(status_code=400, detail="Prompt is too short.")

    # Formulate prompt for Gemini
    prompt = f"""
    You are an expert technical recruiter and resume writer.
    The user wants a highly detailed, professional, and realistic sample Resume and a matching Job Description for the following role and skills:
    '{promptText}'
    
    CRITICAL INSTRUCTION: The resume MUST be very detailed, long, and look like a real senior professional's resume (at least 300-400 words). 
    Include the following sections in the resume text:
    - Professional Summary
    - Work Experience (Include at least 2-3 companies, with 4-5 highly detailed bullet points each, including metrics and specific tools)
    - Projects
    - Education
    - Technical Skills
    
    The Job Description must also be detailed (at least 150 words) with Requirements and Responsibilities.
    
    Respond EXACTLY with a JSON object in this format (no markdown code blocks, just raw JSON):
    {{
        "jd": "Full detailed job description text here...",
        "resume": "Full detailed resume text here..."
    }}
    """
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={API_KEY}"
        data = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}]
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req) as response:
            resp_body = response.read().decode('utf-8')
            resp_json = json.loads(resp_body)
            raw_text = resp_json['candidates'][0]['content']['parts'][0]['text']
            
        # Clean up response text
        resp_text = raw_text.strip()
        if resp_text.startswith("```json"):
            resp_text = resp_text[7:]
        if resp_text.startswith("```"):
            resp_text = resp_text[3:]
        if resp_text.endswith("```"):
            resp_text = resp_text[:-3]
            
        result = json.loads(resp_text.strip())
        return result
        
    except Exception as e:
        print("Error generating resume:", str(e))
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@app.post("/api/mock-interview")
async def mock_interview(request: Request):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")
    
    data = await request.json()
    role = data.get("role", "Software Engineer")
    history = data.get("history", [])
    
    system_instruction = f"You are an expert technical interviewer for a {role} position. Conduct a professional, tough but fair mock interview. Ask one technical question at a time. When the user answers, briefly evaluate it (give constructive feedback) and then ask the next question. Do not ask more than one question at once. Limit your responses to 70 words. Keep it conversational."
    
    contents = []
    
    if not history:
        # First message
        contents.append({"role": "user", "parts": [{"text": system_instruction + "\n\nStart the interview by introducing yourself and asking the first question."}]})
    else:
        for i, msg in enumerate(history):
            msg_role = "user" if msg["role"] == "user" else "model"
            text = msg["text"]
            if msg_role == "user" and i == 0:
                text = system_instruction + "\n\n" + text
            contents.append({"role": msg_role, "parts": [{"text": text}]})
            
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={API_KEY}"
        payload = json.dumps({"contents": contents}).encode('utf-8')
        
        req = urllib.request.Request(url, data=payload, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            resp_body = response.read().decode('utf-8')
            resp_json = json.loads(resp_body)
            ai_text = resp_json['candidates'][0]['content']['parts'][0]['text']
            
        return {"response": ai_text}
    except Exception as e:
        print("Error in mock interview:", str(e))
        raise HTTPException(status_code=500, detail=f"Interview Error: {str(e)}")

import urllib.parse

import random
import datetime

# Premium Mock Database (Massive JDs and 1 week time range)

import os
import json
jobs_db_path = os.path.join(os.path.dirname(__file__), 'jobs_db.json')
with open(jobs_db_path, 'r', encoding='utf-8') as f:
    MOCK_JOBS_DB = json.load(f)
import re

def clean_html(raw_html):
    cleanr = re.compile('<.*?>')
    return re.sub(cleanr, '', str(raw_html))[:300] + '...'

@app.get("/api/jobs")
async def get_jobs(q: str = "", country: str = "Global"):
    query = q.strip().lower()
    real_jobs = []
    
    # 1. Fetch real jobs from RemoteOK API
    try:
        req = urllib.request.Request('https://remoteok.com/api', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            for j in data[1:]:
                title = j.get('position', '')
                comp = j.get('company', '')
                # Filter by keyword if provided
                if not query or query in title.lower() or query in comp.lower():
                    loc = j.get('location', 'Remote')
                    # Filter by country if provided and not global
                    if country != 'Global' and country.lower() not in loc.lower():
                        continue
                    
                    real_jobs.append({
                        "id": f"ro-{j.get('id', random.randint(1000,9999))}",
                        "title": title,
                        "company": comp,
                        "location": loc,
                        "type": "Full Time",
                        "source": "RemoteOK",
                        "salary": "Competitive",
                        "posted": "Recently",
                        "url": j.get('url', ''),
                        "description": clean_html(j.get('description', '')),
                        "requirements": j.get('tags', [])[:3] if j.get('tags') else ["Remote Work", "Communication"]
                    })
    except Exception as e:
        print("RemoteOK error:", e)

    # 2. Fetch real jobs from Arbeitnow API
    try:
        req = urllib.request.Request('https://www.arbeitnow.com/api/job-board-api', headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            for j in data.get('data', []):
                title = j.get('title', '')
                comp = j.get('company_name', '')
                if not query or query in title.lower() or query in comp.lower():
                    loc = j.get('location', 'Remote')
                    if country != 'Global' and country.lower() not in loc.lower():
                        continue
                    
                    real_jobs.append({
                        "id": f"an-{random.randint(1000,9999)}",
                        "title": title,
                        "company": comp,
                        "location": loc,
                        "type": "Full Time",
                        "source": "Arbeitnow",
                        "salary": "Competitive",
                        "posted": "Recently",
                        "url": j.get('url', ''),
                        "description": clean_html(j.get('description', '')),
                        "requirements": j.get('tags', [])[:3] if j.get('tags') else ["Communication", "Self-motivated"]
                    })
    except Exception as e:
        print("Arbeitnow error:", e)
        
    # If we found matching real jobs, return them!
    if len(real_jobs) > 0:
        return {"jobs": real_jobs[:30]}
        
    # 3. Ultimate Fallback to Gemini AI if the real APIs yield 0 matches
    if not API_KEY:
        filtered = [j for j in MOCK_JOBS_DB if query in j["title"].lower() or query in j["company"].lower()]
        if not filtered: filtered = MOCK_JOBS_DB[:5]
        return {"jobs": filtered}
        
    prompt = f"""
    A user is searching for: "{query}" in "{country}".
    Generate a list of 10 highly realistic job postings for this search.
    Format as JSON array with: id, title, company, location, type, source, salary, posted (string), url, description, requirements (array).
    Important: Do NOT use example.com for URLs. Provide realistic looking URLs or real company career page URLs.
    """
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={API_KEY}"
        data = json.dumps({"contents": [{"parts": [{"text": prompt}]}]}).encode('utf-8')
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as response:
            resp_json = json.loads(response.read().decode())
            raw_text = resp_json['candidates'][0]['content']['parts'][0]['text'].strip()
            if raw_text.startswith("```json"): raw_text = raw_text[7:]
            if raw_text.startswith("```"): raw_text = raw_text[3:]
            if raw_text.endswith("```"): raw_text = raw_text[:-3]
            
            gemini_jobs = json.loads(raw_text.strip())
            
            # Rewrite fake URLs like example.com to a Google search for realism
            for j in gemini_jobs:
                job_url = j.get('url', '').lower()
                if not job_url or 'example.com' in job_url or 'example.org' in job_url:
                    company_encoded = urllib.parse.quote(j.get('company', 'Company') + ' careers')
                    j['url'] = f"https://www.google.com/search?q={company_encoded}"
            
            return {"jobs": gemini_jobs}
            
    except Exception as e:
        print("Gemini fallback error:", e)
        filtered = [j for j in MOCK_JOBS_DB if query in j["title"].lower()]
        return {"jobs": filtered if filtered else MOCK_JOBS_DB[:5]}

import xml.etree.ElementTree as ET

@app.get("/api/tech-news")
async def get_tech_news():
    """
    Fetches real tech news from official RSS feeds (AI & Microsoft).
    Falls back to high-quality curated data if RSS feeds fail.
    """
    news = []
    
    # Try fetching NYT Technology News
    try:
        req = urllib.request.Request("https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            xml_data = response.read()
        root = ET.fromstring(xml_data)
        namespaces = {'media': 'http://search.yahoo.com/mrss/'}
        for item in root.findall('.//item')[:3]:
            title = item.find('title').text
            link = item.find('link').text
            pubDate = item.find('pubDate').text if item.find('pubDate') is not None else "Recent"
            clean_date = pubDate.split('00:')[0].replace('00:','').strip() if ':' in pubDate else pubDate
            
            # Extract Original Image
            img_url = ""
            media = item.find('.//media:content', namespaces)
            if media is not None:
                img_url = media.attrib.get('url', '')
                
            news.append({"tag": "Tech News", "title": title, "link": link, "date": clean_date, "img_url": img_url})
    except Exception as e:
        print("Error fetching NYT news:", e)

    # Try fetching BBC Technology News
    try:
        req = urllib.request.Request("http://feeds.bbci.co.uk/news/technology/rss.xml", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            xml_data = response.read()
        root = ET.fromstring(xml_data)
        namespaces = {'media': 'http://search.yahoo.com/mrss/'}
        for item in root.findall('.//item')[:2]:
            title = item.find('title').text
            link = item.find('link').text
            pubDate = item.find('pubDate').text if item.find('pubDate') is not None else "Recent"
            clean_date = pubDate.split('00:')[0].replace('00:','').strip() if ':' in pubDate else pubDate
            
            # Extract Original Image
            img_url = ""
            media = item.find('.//media:thumbnail', namespaces)
            if media is not None:
                img_url = media.attrib.get('url', '')
                
            news.append({"tag": "BBC Tech", "title": title, "link": link, "date": clean_date, "img_url": img_url})
    except Exception as e:
        print("Error fetching BBC news:", e)
        
    # Fallback to realistic mock with REAL URLs if live feeds fail
    if not news:
        news = [
            {"tag": "Fabric", "title": "Microsoft Fabric merges OneLake and Synapse for unified Data Engineering", "link": "https://azure.microsoft.com/en-us/blog/introducing-microsoft-fabric-data-analytics-for-the-era-of-ai/", "date": "Today", "img_url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
            {"tag": "Databricks", "title": "How Unity Catalog is revolutionizing data governance across clouds", "link": "https://www.databricks.com/product/unity-catalog", "date": "Yesterday", "img_url": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
            {"tag": "Azure", "title": "Best practices for ADF CI/CD using Azure DevOps Pipelines", "link": "https://learn.microsoft.com/en-us/azure/data-factory/continuous-integration-delivery", "date": "2 days ago", "img_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
            {"tag": "AI", "title": "Gemini Pro integration with Azure OpenAI: A Data Engineer's Guide", "link": "https://cloud.google.com/gemini", "date": "1 week ago", "img_url": "https://images.unsplash.com/photo-1618401471353-b98a5233c591?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"},
            {"tag": "IT News", "title": "The biggest tech trends and AI breakthroughs of 2024", "link": "https://techcrunch.com/category/artificial-intelligence/", "date": "1 week ago", "img_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"}
        ]
        
    return {"news": news}

@app.post("/api/run-code")
async def run_code(language: str = Form(...), code: str = Form(...)):
    if not API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API Key is not configured.")
    
    if len(code.strip()) < 5:
        raise HTTPException(status_code=400, detail="Code is too short.")

    # Formulate prompt for Gemini to act as a compiler
    prompt = f"""
    You are a realistic {language.upper()} code execution engine (like Databricks or PostgreSQL terminal).
    The user has submitted the following code:
    
    ```{language}
    {code}
    ```
    
    Your task:
    1. Analyze the code.
    2. If there are syntax errors, return a realistic terminal error message.
    3. If the code is valid, simulate its execution. Assume there is a mock database available (e.g., tables like Employees, Sales, Customers).
    4. Generate a highly realistic console/terminal text output of what the result would look like (e.g., ASCII table format for SQL, DataFrame show() format for PySpark).
    5. Return ONLY the raw plain text output (no markdown blocks, no conversational text, no explanations). The output should look EXACTLY like a real console output.
    """
    
    try:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={API_KEY}"
        data = json.dumps({
            "contents": [{"parts": [{"text": prompt}]}]
        }).encode('utf-8')
        
        req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        
        with urllib.request.urlopen(req) as response:
            resp_body = response.read().decode('utf-8')
            resp_json = json.loads(resp_body)
            raw_text = resp_json['candidates'][0]['content']['parts'][0]['text']
            
        # Clean up if Gemini accidentally includes markdown code blocks
        resp_text = raw_text.strip()
        if resp_text.startswith("```"):
            lines = resp_text.split('\n')
            if len(lines) > 1:
                resp_text = '\n'.join(lines[1:-1]) if lines[-1].startswith("```") else '\n'.join(lines[1:])
                
        return {"output": resp_text.strip()}
        
    except Exception as e:
        print("Error executing code:", str(e))
        raise HTTPException(status_code=500, detail=f"Execution Error: {str(e)}")

# Mount the entire frontend directory as static files
from fastapi.staticfiles import StaticFiles
app.mount("/", StaticFiles(directory="..", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)
