from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow React to connect

# ========== IN-MEMORY DATABASE (No external DB needed) ==========
jobs_db = [
    {
        "id": 1,
        "title": "Software Developer",
        "company": "TCS",
        "type": "private",
        "location": "Jaipur",
        "salary": "6-8 LPA",
        "skills": ["Python", "React", "SQL"],
        "description": "Looking for skilled developers"
    },
    {
        "id": 2,
        "title": "Data Analyst",
        "company": "Infosys",
        "type": "private",
        "location": "Jaipur",
        "salary": "5-7 LPA",
        "skills": ["Python", "Excel", "Tableau"],
        "description": "Data analysis and visualization"
    },
    {
        "id": 3,
        "title": "Govt Technical Officer",
        "company": "Govt of Rajasthan",
        "type": "government",
        "location": "Jaipur",
        "salary": "Level 10",
        "skills": ["Technical Knowledge", "Interview"],
        "description": "Permanent government position"
    },
    {
        "id": 4,
        "title": "Frontend Developer",
        "company": "Google",
        "type": "overseas",
        "location": "USA",
        "salary": "$120k",
        "skills": ["React", "JavaScript", "CSS"],
        "description": "Work from USA office"
    }
]

internships_db = [
    {
        "id": 1,
        "title": "Web Development Intern",
        "company": "LocalStartup",
        "duration": "3 months",
        "stipend": "10,000/month",
        "location": "Jaipur",
        "skills": ["HTML", "CSS", "JS"]
    },
    {
        "id": 2,
        "title": "Data Science Intern",
        "company": "Analytics Corp",
        "duration": "6 months",
        "stipend": "15,000/month",
        "location": "Remote",
        "skills": ["Python", "ML", "Pandas"]
    }
]

counseling_db = []
mentorship_db = []
registered_students = []
posted_jobs = []
posted_internships = []

# ========== API ENDPOINTS ==========

@app.route('/')
def home():
    return jsonify({"message": "Rajasthan Career Connect API is running!"})

# Get all jobs
@app.route('/api/jobs', methods=['GET'])
def get_jobs():
    return jsonify(jobs_db)

# Get all internships
@app.route('/api/internships', methods=['GET'])
def get_internships():
    return jsonify(internships_db)

# AI Match - Calculate skill match percentage
@app.route('/api/match', methods=['POST'])
def match_skills():
    data = request.json
    user_skills = [s.lower().strip() for s in data.get('skills', [])]
    
    results = []
    for job in jobs_db:
        job_skills = [s.lower() for s in job.get('skills', [])]
        if job_skills:
            matches = sum(1 for s in user_skills if s in job_skills)
            percentage = (matches / len(job_skills)) * 100
        else:
            percentage = 0
        
        results.append({
            "job_id": job['id'],
            "title": job['title'],
            "company": job['company'],
            "match_percentage": round(percentage, 2)
        })
    
    results.sort(key=lambda x: x['match_percentage'], reverse=True)
    return jsonify(results[:5])

# Book counseling
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
    return jsonify({"success": True, "message": "Counseling booked!", "booking": booking})

# Request mentorship
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
    return jsonify({"success": True, "message": "Mentorship request sent!"})

# Register student
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
    return jsonify({"success": True, "message": "Registration successful!"})

# Post new job
@app.route('/api/post-job', methods=['POST'])
def post_job():
    data = request.json
    new_job = {
        "id": len(jobs_db) + len(posted_jobs) + 1,
        "title": data.get('title'),
        "company": data.get('company'),
        "type": data.get('type'),
        "location": data.get('location'),
        "salary": data.get('salary'),
        "skills": data.get('skills', []),
        "description": data.get('description'),
        "posted_at": datetime.now().isoformat()
    }
    posted_jobs.append(new_job)
    jobs_db.append(new_job)  # Add to main jobs list
    return jsonify({"success": True, "message": "Job posted!", "job": new_job})

# Post internship
@app.route('/api/post-internship', methods=['POST'])
def post_internship():
    data = request.json
    new_internship = {
        "id": len(internships_db) + len(posted_internships) + 1,
        "title": data.get('title'),
        "company": data.get('company'),
        "duration": data.get('duration'),
        "stipend": data.get('stipend'),
        "location": data.get('location'),
        "skills": data.get('skills', []),
        "posted_at": datetime.now().isoformat()
    }
    posted_internships.append(new_internship)
    internships_db.append(new_internship)
    return jsonify({"success": True, "message": "Internship posted!"})

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Server running at: http://localhost:5050")
    print("📋 Available endpoints:")
    print("   GET  /api/jobs")
    print("   GET  /api/internships")
    print("   POST /api/match")
    print("   POST /api/counseling")
    print("   POST /api/mentorship")
    print("   POST /api/register")
    print("   POST /api/post-job")
    print("   POST /api/post-internship")
    print("=" * 50)
    app.run(debug=True, port=5050, host='0.0.0.0')