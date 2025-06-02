import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import RegisterTalent from './pages/RegisterTalent'
import Login from './pages/Login'
import JobPostingsList from './pages/JobPostingsList'
import JobPostingDetails from './pages/JobPostingDetails'
import ApplyForJob from './pages/ApplyForJob'
import MyApplications from './pages/MyApplications'
import Profile from './pages/Profile'
import UpdateProfile from './pages/UpdateProfile'
import { Home as HomeIcon, Briefcase, Search } from 'lucide-react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

// A simple placeholder for the home page
const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-full">
            <Briefcase className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 inline-block text-transparent bg-clip-text">Welcome to GoodJob Talent</h1>
        <p className="text-xl text-gray-600 mb-8">Find your next opportunity with top companies</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="/jobs" className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all">
            <Search className="h-5 w-5" />
            Browse Jobs
          </a>
          {!isAuthenticated && (
            <a href="/register-talent" className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all">
              <HomeIcon className="h-5 w-5" />
              Register as Talent
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register-talent" element={<RegisterTalent />} />
                <Route path="/login" element={<Login />} />
                <Route path="/jobs" element={<JobPostingsList />} />
                <Route path="/jobs/:jobId" element={<JobPostingDetails />} />
                <Route path="/jobs/:jobId/apply" element={<ApplyForJob />} />
                <Route path="/my-applications" element={<MyApplications />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<UpdateProfile />} />
              </Routes>
            </div>
          </div>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
