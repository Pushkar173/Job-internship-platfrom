import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:5050/api';

function App() {

  // =========================================================
  // LOGIN STATE
  // =========================================================

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  // =========================================================
  // APP STATES
  // =========================================================

  const [activeTab, setActiveTab] = useState('home');

  const [jobs, setJobs] = useState([]);
  const [allJobs, setAllJobs] = useState([]);

  const [internships, setInternships] = useState([]);

  const [matchResults, setMatchResults] = useState([]);

  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({

    name: 'Pushkar',
    email: 'pushkar@gmail.com',
    phone: '9876543210',
    date: '',
    time: '',
    field: 'Web Development',
    message: '',
    course: 'B.Tech',
    year: '3rd Year',
    skills: 'Python, React, SQL'

  });

  const [jobPost, setJobPost] = useState({

    title: '',
    company: '',
    type: 'private',
    location: '',
    salary: '',
    skills: '',
    description: ''

  });

  // =========================================================
  // FETCH DATA
  // =========================================================

  useEffect(() => {

    if (isLoggedIn) {

      fetchJobs();
      fetchInternships();

    }

  }, [isLoggedIn]);

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = (e) => {

    e.preventDefault();

    if (
      loginData.email === 'admin@gmail.com' &&
      loginData.password === '1234'
    ) {

      setIsLoggedIn(true);

    } else {

      alert('❌ Invalid Email or Password');

    }
  };

  // =========================================================
  // FETCH JOBS
  // =========================================================

  const fetchJobs = async () => {

    try {

      const response = await fetch(`${API_URL}/jobs`);
      const data = await response.json();

      setJobs(data);
      setAllJobs(data);

    } catch (error) {

      console.error(error);

    }
  };

  // =========================================================
  // FETCH INTERNSHIPS
  // =========================================================

  const fetchInternships = async () => {

    try {

      const response = await fetch(`${API_URL}/internships`);
      const data = await response.json();

      setInternships(data);

    } catch (error) {

      console.error(error);

    }
  };

  // =========================================================
  // SEARCH JOBS
  // =========================================================

  const handleSearch = (value) => {

    setSearchTerm(value);

    if (value.trim() === '') {

      setJobs(allJobs);

    } else {

      const filtered = allJobs.filter((job) =>

        job.title.toLowerCase().includes(value.toLowerCase()) ||
        job.company.toLowerCase().includes(value.toLowerCase()) ||
        job.location.toLowerCase().includes(value.toLowerCase())

      );

      setJobs(filtered);
    }
  };

  // =========================================================
  // AI MATCH
  // =========================================================

  const handleAIMatch = async () => {

    setLoading(true);

    const skillsArray = formData.skills
      .split(',')
      .map(s => s.trim());

    try {

      const response = await fetch(`${API_URL}/match`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          skills: skillsArray
        })

      });

      const data = await response.json();

      setMatchResults(data);

      setActiveTab('match');

    } catch (error) {

      console.error(error);

    }

    setLoading(false);
  };

  // =========================================================
  // APPLY JOB
  // =========================================================

  const applyJob = (jobTitle) => {

    alert(`✅ Successfully Applied for ${jobTitle}`);
  };

  // =========================================================
  // COUNSELING
  // =========================================================

  const handleCounseling = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(`${API_URL}/counseling`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)

      });

      const data = await response.json();

      if (data.success) {

        alert('✅ Counseling booked successfully!');

      }

    } catch (error) {

      alert('Error booking counseling');

    }
  };

  // =========================================================
  // MENTORSHIP
  // =========================================================

  const handleMentorship = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(`${API_URL}/mentorship`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)

      });

      const data = await response.json();

      if (data.success) {

        alert('✅ Mentorship request sent!');

      }

    } catch (error) {

      alert('Error sending mentorship request');

    }
  };

  // =========================================================
  // REGISTER
  // =========================================================

  const handleRegister = async (e) => {

    e.preventDefault();

    try {

      const response = await fetch(`${API_URL}/register`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(formData)

      });

      const data = await response.json();

      if (data.success) {

        alert('✅ Registration Successful!');

      }

    } catch (error) {

      alert('Registration Error');

    }
  };

  // =========================================================
  // POST JOB
  // =========================================================

  const handlePostJob = async (e) => {

    e.preventDefault();

    const skillsArray = jobPost.skills
      .split(',')
      .map(s => s.trim());

    try {

      const response = await fetch(`${API_URL}/post-job`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({

          ...jobPost,
          skills: skillsArray

        })

      });

      const data = await response.json();

      if (data.success) {

        alert('✅ Job Posted Successfully!');

        fetchJobs();

        setJobPost({

          title: '',
          company: '',
          type: 'private',
          location: '',
          salary: '',
          skills: '',
          description: ''

        });

        setActiveTab('jobs');
      }

    } catch (error) {

      alert('Error posting job');

    }
  };

  // =========================================================
  // FILTER JOBS
  // =========================================================

  const filterJobs = (type) => {

    if (type === 'all') {

      setJobs(allJobs);

    } else {

      const filtered = allJobs.filter(
        j => j.type === type
      );

      setJobs(filtered);
    }
  };

  // =========================================================
  // LOGIN PAGE
  // =========================================================

  if (!isLoggedIn) {

    return (

      <div className="App">

        <div className="container">

          <form onSubmit={handleLogin} className="form">

            <h2>🔐 Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value
                })
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value
                })
              }
            />

            <button type="submit">
              Login
            </button>

            <br /><br />

            <p style={{ textAlign: 'center' }}>
              Demo Login:
              <br />
              admin@gmail.com
              <br />
              Password: 1234
            </p>

          </form>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN APP
  // =========================================================

  return (

    <div className="App">

      <nav className="navbar">

        <h1 className="logo">
          🎯 Rajasthan Career Connect
        </h1>

        <div className="nav-links">

          <button onClick={() => setActiveTab('home')}>
            Home
          </button>

          <button onClick={() => {
            fetchJobs();
            setActiveTab('jobs');
          }}>
            Jobs
          </button>

          <button onClick={() => {
            fetchInternships();
            setActiveTab('internships');
          }}>
            Internships
          </button>

          <button onClick={handleAIMatch}>
            🤖 AI Match
          </button>

          <button onClick={() => setActiveTab('counseling')}>
            Counseling
          </button>

          <button onClick={() => setActiveTab('mentorship')}>
            Mentorship
          </button>

          <button onClick={() => setActiveTab('register')}>
            Register
          </button>

          <button onClick={() => setActiveTab('post-job')}>
            Post Job
          </button>

          <button onClick={() => setIsLoggedIn(false)}>
            Logout
          </button>

        </div>

      </nav>

      <div className="container">

        {/* HOME */}

        {activeTab === 'home' && (

          <div className="hero">

            <h1>Welcome to Career Connect</h1>

            <p>
              AI Powered Job & Internship Portal
            </p>

            <div className="stats">

              <div className="stat-card">
                <h3>{jobs.length}</h3>
                <p>Jobs</p>
              </div>

              <div className="stat-card">
                <h3>{internships.length}</h3>
                <p>Internships</p>
              </div>

              <div className="stat-card">
                <h3>24/7</h3>
                <p>Support</p>
              </div>

            </div>

          </div>
        )}

        {/* JOBS */}

        {activeTab === 'jobs' && (

          <div>

            <h2 style={{ color: 'white' }}>
              Available Jobs
            </h2>

            <br />

            <input
              type="text"
              placeholder="🔍 Search jobs..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="form"
            />

            <br /><br />

            <div className="filters">

              <button onClick={() => filterJobs('all')}>
                All
              </button>

              <button onClick={() => filterJobs('private')}>
                Private
              </button>

              <button onClick={() => filterJobs('government')}>
                Government
              </button>

              <button onClick={() => filterJobs('overseas')}>
                Overseas
              </button>

            </div>

            <div className="job-grid">

              {jobs.map(job => (

                <div key={job.id} className="job-card">

                  <h3>{job.title}</h3>

                  <p className="company">{job.company}</p>

                  <p>📍 {job.location}</p>

                  <p>💰 {job.salary}</p>

                  <p>
                    🎯 {job.skills?.join(', ')}
                  </p>

                  <br />

                  <button
                    onClick={() => applyJob(job.title)}
                  >
                    Apply Now
                  </button>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* INTERNSHIPS */}

        {activeTab === 'internships' && (

          <div>

            <h2 style={{ color: 'white' }}>
              Internship Opportunities
            </h2>

            <div className="internship-grid">

              {internships.map(intern => (

                <div key={intern.id} className="internship-card">

                  <h3>{intern.title}</h3>

                  <p className="company">
                    {intern.company}
                  </p>

                  <p>⏱️ {intern.duration}</p>

                  <p>💰 {intern.stipend}</p>

                  <p>📍 {intern.location}</p>

                  <p>
                    🎯 {intern.skills?.join(', ')}
                  </p>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* AI MATCH */}

        {activeTab === 'match' && (

          <div className="match-section">

            <h2>🤖 AI Match Results</h2>

            {loading ? (

              <p>Analyzing...</p>

            ) : (

              matchResults.map(result => (

                <div
                  key={result.job_id}
                  className="match-card"
                >

                  <div>

                    <h3>{result.title}</h3>

                    <p>{result.company}</p>

                  </div>

                  <h2>
                    {result.match_percentage}%
                  </h2>

                </div>
              ))
            )}
          </div>
        )}

        {/* COUNSELING */}

        {activeTab === 'counseling' && (

          <form onSubmit={handleCounseling} className="form">

            <h2>Career Counseling</h2>

            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />

            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  date: e.target.value
                })
              }
            />

            <input
              type="time"
              value={formData.time}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  time: e.target.value
                })
              }
            />

            <button type="submit">
              Book Session
            </button>

          </form>
        )}

        {/* MENTORSHIP */}

        {activeTab === 'mentorship' && (

          <form onSubmit={handleMentorship} className="form">

            <h2>AI Mentorship</h2>

            <textarea
              placeholder="Enter your message"
              value={formData.message}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  message: e.target.value
                })
              }
            />

            <button type="submit">
              Request Mentor
            </button>

          </form>
        )}

        {/* REGISTER */}

        {activeTab === 'register' && (

          <form onSubmit={handleRegister} className="form">

            <h2>Student Registration</h2>

            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value
                })
              }
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value
                })
              }
            />

            <textarea
              placeholder="Skills"
              value={formData.skills}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills: e.target.value
                })
              }
            />

            <button type="submit">
              Register
            </button>

          </form>
        )}

        {/* POST JOB */}

        {activeTab === 'post-job' && (

          <form onSubmit={handlePostJob} className="form">

            <h2>Post New Job</h2>

            <input
              type="text"
              placeholder="Job Title"
              value={jobPost.title}
              onChange={(e) =>
                setJobPost({
                  ...jobPost,
                  title: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Company"
              value={jobPost.company}
              onChange={(e) =>
                setJobPost({
                  ...jobPost,
                  company: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={jobPost.location}
              onChange={(e) =>
                setJobPost({
                  ...jobPost,
                  location: e.target.value
                })
              }
            />

            <input
              type="text"
              placeholder="Salary"
              value={jobPost.salary}
              onChange={(e) =>
                setJobPost({
                  ...jobPost,
                  salary: e.target.value
                })
              }
            />

            <textarea
              placeholder="Skills"
              value={jobPost.skills}
              onChange={(e) =>
                setJobPost({
                  ...jobPost,
                  skills: e.target.value
                })
              }
            />

            <textarea
              placeholder="Description"
              value={jobPost.description}
              onChange={(e) =>
                setJobPost({
                  ...jobPost,
                  description: e.target.value
                })
              }
            />

            <button type="submit">
              Post Job
            </button>

          </form>
        )}

      </div>
    </div>
  );
}

export default App;