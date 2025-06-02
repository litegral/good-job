import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
import { Briefcase, LogOut, UserPlus, LogIn, Plus, List } from 'lucide-react'
import AuthForm from './components/AuthForm'
import JobPostingForm from './components/JobPostingForm'
import JobList from './components/JobList'
import JobDetail from './components/JobDetail'
import { registerEmployer, loginEmployer } from './services/authService'
import { createJobPosting } from './services/jobService'
import './App.css'

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [authError, setAuthError] = useState<string | null>(null)
  const [jobError, setJobError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(JSON.parse(localStorage.getItem('user') || 'null'))
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogin = async (credentials: any) => {
    try {
      setIsLoading(true)
      setAuthError(null)
      const data = await loginEmployer(credentials)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
    } catch (error: any) {
      setAuthError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (credentials: any) => {
    try {
      setIsLoading(true)
      setAuthError(null)
      const data = await registerEmployer(credentials)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      setToken(data.token)
      setUser(data.user)
    } catch (error: any) {
      setAuthError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const handleCreateJob = async (jobData: any) => {
    if (!token) {
      setJobError('You must be logged in to post a job.')
      return false;
    }
    try {
      setIsLoading(true)
      setJobError(null)
      await createJobPosting(jobData, token)
      // Redirect to job listings
      return true;
    } catch (error: any) {
      setJobError(error.message)
      return false;
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="container nav-content">
            <Link to="/" className="logo">
              <Briefcase size={20} strokeWidth={2} className="icon" />
              GoodJob Employer
            </Link>
            <ul className="nav-links">
              {!token ? (
                <>
                  <li>
                    <Link to="/login">
                      <LogIn size={16} className="icon" />
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register">
                      <UserPlus size={16} className="icon" />
                      Register
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/">
                      <List size={16} className="icon" />
                      My Jobs
                    </Link>
                  </li>
                  <li>
                    <Link to="/post-job">
                      <Plus size={16} className="icon" />
                      Post Job
                    </Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="btn btn-outline">
                      <LogOut size={16} className="icon" />
                      Logout
                    </button>
                  </li>
                  {user && <li className="user-greeting">Welcome, {user.name}!</li>}
                </>
              )}
            </ul>
          </div>
        </nav>

        <div className="container">
          <Routes>
            <Route path="/login" element={
              !token ? (
                <div className="form-container">
                  <AuthForm onAuth={handleLogin} authError={authError} isRegister={false} isLoading={isLoading} />
                </div>
              ) : <Navigate to="/" />
            } />
            <Route path="/register" element={
              !token ? (
                <div className="form-container">
                  <AuthForm onAuth={handleRegister} authError={authError} isRegister={true} isLoading={isLoading} />
                </div>
              ) : <Navigate to="/" />
            } />
            <Route path="/post-job" element={
              token ? (
                <div className="form-container">
                  <JobPostingForm onSubmit={handleCreateJob} error={jobError} isLoading={isLoading} />
                </div>
              ) : <Navigate to="/login" />
            } />
            <Route path="/jobs/:id" element={
              token ? <JobDetail token={token} /> : <Navigate to="/login" />
            } />
            <Route path="/" element={
              token ? <JobList token={token} /> : (
                <div className="home-container">
                  <h1 className="home-title">Welcome to GoodJob Employer</h1>
                  <p className="home-subtitle">The easiest way to find your next great hire</p>
                  <div>
                    <Link to="/register" className="btn btn-primary">
                      <UserPlus size={18} className="icon" />
                      Get Started
                    </Link>
                    <Link to="/login" className="btn btn-outline" style={{ marginLeft: '1rem' }}>
                      <LogIn size={18} className="icon" />
                      Login
                    </Link>
                  </div>
                </div>
              )
            } />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
