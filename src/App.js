import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5050/api';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [jobs, setJobs] = useState([]);
  const [internships, setInternships] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', date: '', time: '',
    field: '', message: '', course: '', year: '', skills: ''
  });
  const [jobPost, setJobPost] = useState({
    title: '', company: '', type: 'private', location: '', salary: '', skills: '', description: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchInternships();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(`${API_URL}/jobs`);
      const data = await response.json();
      setJobs(data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchInternships = async () => {
    try {
      const response = await fetch(`${API_URL}/internships`);
      const data = await response.json();
      setInternships(data);
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const handleAIMatch = async () => {
    if (!formData.skills) {
      alert('Please enter your skills in the registration form first!');
      return;
    }
    
    setLoading(true);
    const skillsArray = formData.skills.split(',').map(s => s.trim());
    
    try {
      const response = await fetch(`${API_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skills: skillsArray })
      });
      const data = await response.json();
      setMatchResults(data);
      setActiveTab('match');
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleCounseling = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/counseling`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Counseling booked successfully!');
        setFormData({ ...formData, name: '', email: '', phone: '', date: '', time: '' });
      }
    } catch (error) {
      alert('Error booking counseling');
    }
  };

  const handleMentorship = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/mentorship`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Mentorship request sent!');
        setFormData({ ...formData, field: '', message: '' });
      }
    } catch (error) {
      alert('Error sending request');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Registration successful! Try AI Match now.');
      }
    } catch (error) {
      alert('Error registering');
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    const skillsArray = jobPost.skills.split(',').map(s => s.trim());
    try {
      const response = await fetch(`${API_URL}/post-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...jobPost, skills: skillsArray })
      });
      const data = await response.json();
      if (data.success) {
        alert('✅ Job posted successfully!');
        fetchJobs();
        setJobPost({ title: '', company: '', type: 'private', location: '', salary: '', skills: '', description: '' });
      }
    } catch (error) {
      alert('Error posting job');
    }
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1 className="logo">🎯 Rajasthan Career Connect</h1>
        <div className="nav-links">
          <button onClick={() => setActiveTab('home')}>Home</button>
          <button onClick={() => { fetchJobs(); setActiveTab('jobs'); }}>Jobs</button>
          <button onClick={() => { fetchInternships(); setActiveTab('internships'); }}>Internships</button>
          <button onClick={handleAIMatch}>🤖 AI Match</button>
          <button onClick={() => setActiveTab('counseling')}>Counseling</button>
          <button onClick={() => setActiveTab('mentorship')}>Mentorship</button>
          <button onClick={() => setActiveTab('register')}>Register</button>
          <button onClick={() => setActiveTab('post-job')}>Post Job</button>
        </div>
      </nav>

      <div className="container">
        {activeTab === 'home' && (
          <div className="hero">
            <h1>Welcome to Career Connect</h1>
            <p>An Interactive Job and Internship Platform for Technical Education Department, Govt. of Rajasthan</p>
            <div className="stats">
              <div className="stat-card">
                <h3>{jobs.length}</h3>
                <p>Active Jobs</p>
              </div>
              <div className="stat-card">
                <h3>{internships.length}</h3>
                <p>Internships</p>
              </div>
              <div className="stat-card">
                <h3>24/7</h3>
                <p>Support Available</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <h2>Available Jobs</h2>
            <div className="filters">
              <button onClick={() => setJobs([...jobs])}>All</button>
              <button onClick={() => setJobs(jobs.filter(j => j.type === 'private'))}>Private</button>
              <button onClick={() => setJobs(jobs.filter(j => j.type === 'government'))}>Government</button>
              <button onClick={() => setJobs(jobs.filter(j => j.type === 'overseas'))}>Overseas</button>
            </div>
            <div className="job-grid">
              {jobs.map(job => (
                <div key={job.id} className="job-card">
                  <h3>{job.title}</h3>
                  <p className="company">{job.company}</p>
                  <p>📍 {job.location}</p>
                  <p>💰 {job.salary}</p>
                  <p>🎯 Skills: {job.skills?.join(', ')}</p>
                  <span className={`job-type ${job.type}`}>{job.type}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'internships' && (
          <div className="internships-section">
            <h2>Internship Opportunities</h2>
            <div className="internship-grid">
              {internships.map(intern => (
                <div key={intern.id} className="internship-card">
                  <h3>{intern.title}</h3>
                  <p className="company">{intern.company}</p>
                  <p>⏱️ {intern.duration}</p>
                  <p>💰 Stipend: ₹{intern.stipend}</p>
                  <p>📍 {intern.location}</p>
                  <p>🎯 Skills: {intern.skills?.join(', ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'match' && (
          <div className="match-section">
            <h2>🤖 AI Job Match Results</h2>
            {loading ? <p>Analyzing your skills...</p> : (
              matchResults.length > 0 ? (
                matchResults.map(result => (
                  <div key={result.job_id} className="match-card">
                    <div className="match-info">
                      <h3>{result.title}</h3>
                      <p>{result.company}</p>
                    </div>
                    <div className="match-percentage">
                      <div className="percentage-bar" style={{ width: `${result.match_percentage}%` }}>
                        {result.match_percentage}%
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>Go to Register tab first and add your skills, then click AI Match!</p>
              )
            )}
          </div>
        )}

        {activeTab === 'counseling' && (
          <form onSubmit={handleCounseling} className="form">
            <h2>Book Career Counseling</h2>
            <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input type="tel" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
            <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
            <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} required />
            <button type="submit">Book Session</button>
          </form>
        )}

        {activeTab === 'mentorship' && (
          <form onSubmit={handleMentorship} className="form">
            <h2>Request Mentorship</h2>
            <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <select value={formData.field} onChange={e => setFormData({...formData, field: e.target.value})} required>
              <option value="">Select Field</option>
              <option>Web Development</option>
              <option>Data Science</option>
              <option>Cloud Computing</option>
              <option>Cybersecurity</option>
            </select>
            <textarea placeholder="Your message..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} rows="4"></textarea>
            <button type="submit">Request Mentor</button>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="form">
            <h2>Student Registration</h2>
            <input type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            <input type="text" placeholder="Course" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} required />
            <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} required>
              <option value="">Select Year</option>
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
              <option>4th Year</option>
            </select>
            <textarea placeholder="Skills (comma separated, e.g., Python, React, SQL)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} rows="3" required></textarea>
            <button type="submit">Register</button>
          </form>
        )}

        {activeTab === 'post-job' && (
          <form onSubmit={handlePostJob} className="form">
            <h2>Post a New Job</h2>
            <input type="text" placeholder="Job Title" value={jobPost.title} onChange={e => setJobPost({...jobPost, title: e.target.value})} required />
            <input type="text" placeholder="Company Name" value={jobPost.company} onChange={e => setJobPost({...jobPost, company: e.target.value})} required />
            <select value={jobPost.type} onChange={e => setJobPost({...jobPost, type: e.target.value})}>
              <option value="private">Private</option>
              <option value="government">Government</option>
              <option value="overseas">Overseas</option>
            </select>
            <input type="text" placeholder="Location" value={jobPost.location} onChange={e => setJobPost({...jobPost, location: e.target.value})} required />
            <input type="text" placeholder="Salary" value={jobPost.salary} onChange={e => setJobPost({...jobPost, salary: e.target.value})} required />
            <textarea placeholder="Required Skills (comma separated)" value={jobPost.skills} onChange={e => setJobPost({...jobPost, skills: e.target.value})} rows="2" required></textarea>
            <textarea placeholder="Job Description" value={jobPost.description} onChange={e => setJobPost({...jobPost, description: e.target.value})} rows="3" required></textarea>
            <button type="submit">Post Job</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default App;