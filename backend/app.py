from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
import sqlite3

app = Flask(__name__)
CORS(app)

# =========================================================
# SQLITE DATABASE
# =========================================================

def connect_db():
    return sqlite3.connect("jobs.db")

def create_tables():

    conn = connect_db()
    cur = conn.cursor()

    # JOBS TABLE
    cur.execute("""
    CREATE TABLE IF NOT EXISTS jobs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        company TEXT,
        type TEXT,
        location TEXT,
        salary TEXT,
        skills TEXT,
        description TEXT
    )
    """)

    # INTERNSHIPS TABLE
    cur.execute("""
    CREATE TABLE IF NOT EXISTS internships(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        company TEXT,
        duration TEXT,
        stipend TEXT,
        location TEXT,
        skills TEXT
    )
    """)

    conn.commit()

    # =========================================================
    # INSERT SAMPLE JOBS IF EMPTY
    # =========================================================

    cur.execute("SELECT COUNT(*) FROM jobs")
    count = cur.fetchone()[0]

    if count == 0:

        sample_jobs = [

            (
                "Software Developer",
                "TCS",
                "private",
                "Jaipur",
                "6-8 LPA",
                "Python,React,SQL",
                "Looking for skilled developers"
            ),

            (
                "Data Analyst",
                "Infosys",
                "private",
                "Jaipur",
                "5-7 LPA",
                "Python,Excel,Tableau",
                "Data analysis and visualization"
            ),

            (
                "Govt Technical Officer",
                "Govt of Rajasthan",
                "government",
                "Jaipur",
                "Level 10",
                "Technical Knowledge,Interview",
                "Permanent government position"
            ),

            (
                "Frontend Developer",
                "Google",
                "overseas",
                "USA",
                "$120k",
                "React,JavaScript,CSS",
                "Work from USA office"
            )
        ]

        cur.executemany("""
        INSERT INTO jobs(title, company, type, location, salary, skills, description)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """, sample_jobs)

        conn.commit()

    # =========================================================
    # INSERT SAMPLE INTERNSHIPS IF EMPTY
    # =========================================================

    cur.execute("SELECT COUNT(*) FROM internships")
    internship_count = cur.fetchone()[0]

    if internship_count == 0:

        sample_internships = [

            (
                "Web Development Intern",
                "LocalStartup",
                "3 months",
                "10,000/month",
                "Jaipur",
                "HTML,CSS,JS"
            ),

            (
                "Data Science Intern",
                "Analytics Corp",
                "6 months",
                "15,000/month",
                "Remote",
                "Python,ML,Pandas"
            )
        ]

        cur.executemany("""
        INSERT INTO internships(title, company, duration, stipend, location, skills)
        VALUES (?, ?, ?, ?, ?, ?)
        """, sample_internships)

        conn.commit()

    conn.close()

create_tables()

# =========================================================
# TEMP STORAGE
# =========================================================

counseling_db = []
mentorship_db = []
registered_students = []

# =========================================================
# HOME
# =========================================================

@app.route('/')

def home():
    return jsonify({
        "message": "Rajasthan Career Connect API is running!"
    })

# =========================================================
# GET ALL JOBS
# =========================================================

@app.route('/api/jobs', methods=['GET'])

def get_jobs():

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM jobs")

    rows = cur.fetchall()

    jobs = []

    for row in rows:

        jobs.append({
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "type": row[3],
            "location": row[4],
            "salary": row[5],
            "skills": row[6].split(","),
            "description": row[7]
        })

    conn.close()

    return jsonify(jobs)

# =========================================================
# GET ALL INTERNSHIPS
# =========================================================

@app.route('/api/internships', methods=['GET'])

def get_internships():

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM internships")

    rows = cur.fetchall()

    internships = []

    for row in rows:

        internships.append({
            "id": row[0],
            "title": row[1],
            "company": row[2],
            "duration": row[3],
            "stipend": row[4],
            "location": row[5],
            "skills": row[6].split(",")
        })

    conn.close()

    return jsonify(internships)

# =========================================================
# AI MATCH
# =========================================================

@app.route('/api/match', methods=['POST'])

def match_skills():

    data = request.json

    user_skills = [
        s.lower().strip()
        for s in data.get('skills', [])
    ]

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("SELECT * FROM jobs")

    rows = cur.fetchall()

    conn.close()

    results = []

    for row in rows:

        job_skills = row[6].lower().split(",")

        matches = sum(
            1 for s in user_skills
            if s in job_skills
        )

        percentage = (
            matches / len(job_skills)
        ) * 100 if job_skills else 0

        results.append({

            "job_id": row[0],
            "title": row[1],
            "company": row[2],
            "match_percentage": round(percentage, 2)

        })

    results.sort(
        key=lambda x: x['match_percentage'],
        reverse=True
    )

    return jsonify(results[:5])

# =========================================================
# BOOK COUNSELING
# =========================================================

@app.route('/api/counseling', methods=['POST'])

def book_counseling():

    data = request.json

    booking = {

        "id": len(counseling_db) + 1,
        "name": data.get('name'),
        "email": data.get('email'),
        "phone": data.get('phone'),
        "date": data.get('date'),
        "time": data.get('time'),
        "created_at": datetime.now().isoformat()

    }

    counseling_db.append(booking)

    return jsonify({
        "success": True,
        "message": "Counseling booked!",
        "booking": booking
    })

# =========================================================
# MENTORSHIP
# =========================================================

@app.route('/api/mentorship', methods=['POST'])

def request_mentorship():

    data = request.json

    request_data = {

        "id": len(mentorship_db) + 1,
        "name": data.get('name'),
        "email": data.get('email'),
        "field": data.get('field'),
        "message": data.get('message'),
        "created_at": datetime.now().isoformat()

    }

    mentorship_db.append(request_data)

    return jsonify({
        "success": True,
        "message": "Mentorship request sent!"
    })

# =========================================================
# REGISTER STUDENT
# =========================================================

@app.route('/api/register', methods=['POST'])

def register_student():

    data = request.json

    student = {

        "id": len(registered_students) + 1,
        "name": data.get('name'),
        "email": data.get('email'),
        "course": data.get('course'),
        "year": data.get('year'),
        "skills": data.get('skills'),
        "registered_at": datetime.now().isoformat()

    }

    registered_students.append(student)

    return jsonify({
        "success": True,
        "message": "Registration successful!"
    })

# =========================================================
# POST NEW JOB
# =========================================================

@app.route('/api/post-job', methods=['POST'])

def post_job():

    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO jobs(title, company, type, location, salary, skills, description)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (

        data.get('title'),
        data.get('company'),
        data.get('type'),
        data.get('location'),
        data.get('salary'),
        ",".join(data.get('skills', [])),
        data.get('description')

    ))

    conn.commit()

    job_id = cur.lastrowid

    conn.close()

    return jsonify({

        "success": True,
        "message": "Job posted successfully!",
        "job_id": job_id

    })

# =========================================================
# POST INTERNSHIP
# =========================================================

@app.route('/api/post-internship', methods=['POST'])

def post_internship():

    data = request.json

    conn = connect_db()
    cur = conn.cursor()

    cur.execute("""
    INSERT INTO internships(title, company, duration, stipend, location, skills)
    VALUES (?, ?, ?, ?, ?, ?)
    """, (

        data.get('title'),
        data.get('company'),
        data.get('duration'),
        data.get('stipend'),
        data.get('location'),
        ",".join(data.get('skills', []))

    ))

    conn.commit()

    internship_id = cur.lastrowid

    conn.close()

    return jsonify({

        "success": True,
        "message": "Internship posted successfully!",
        "internship_id": internship_id

    })

# =========================================================
# RUN SERVER
# =========================================================

if __name__ == '__main__':

    print("=" * 60)
    print("🚀 Rajasthan Career Connect Server Running")
    print("🌐 URL: http://localhost:5050")
    print("=" * 60)

    app.run(
        debug=True,
        port=5050,
        host='0.0.0.0'
    )