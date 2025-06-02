import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, DollarSign, Users, FileText } from 'lucide-react';
import '../styles/JobList.css';

interface JobListProps {
  token: string | null;
}

interface Job {
  id: string;
  title: string;
  company_name: string;
  location: string;
  salary: number;
  employment_type: string;
  closes_at: string;
  created_at: string;
  applications_count?: number;
}

interface PaginatedResponse {
  current_page: number;
  data: Job[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: {url: string | null, label: string, active: boolean}[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

const JobList = ({ token }: JobListProps) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/my-job-postings`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch job postings');
        }
        
        const responseData: PaginatedResponse = await response.json();
        setJobs(responseData.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [token, navigate]);

  if (loading) {
    return <div className="jobs-loading">Loading your job postings...</div>;
  }

  if (error) {
    return <div className="jobs-error">{error}</div>;
  }

  if (jobs.length === 0) {
    return (
      <div className="jobs-empty">
        <p>You haven't posted any jobs yet.</p>
        <Link to="/post-job" className="btn btn-primary">Post Your First Job</Link>
      </div>
    );
  }

  return (
    <div className="jobs-container">
      <div className="jobs-header">
        <h1>Your Job Postings</h1>
        <Link to="/post-job" className="btn btn-primary">Post New Job</Link>
      </div>
      
      <div className="jobs-list">
        {jobs.map(job => (
          <div key={job.id} className="job-card">
            <div className="job-card-header">
              <h2>{job.title}</h2>
              {job.applications_count !== undefined && (
                <div className="applications-badge">
                  <FileText size={16} />
                  <span>{job.applications_count} {job.applications_count === 1 ? 'Application' : 'Applications'}</span>
                </div>
              )}
            </div>
            
            <div className="job-card-meta">
              <div className="meta-item">
                <Briefcase size={16} />
                <span>{job.company_name}</span>
              </div>
              <div className="meta-item">
                <MapPin size={16} />
                <span>{job.location}</span>
              </div>
              <div className="meta-item">
                <DollarSign size={16} />
                <span>${typeof job.salary === 'number' ? job.salary.toLocaleString() : job.salary}</span>
              </div>
              <div className="meta-item">
                <Users size={16} />
                <span>{job.employment_type}</span>
              </div>
              {job.closes_at && (
                <div className="meta-item">
                  <Calendar size={16} />
                  <span>Closes: {new Date(job.closes_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            
            <div className="job-card-footer">
              <p className="job-posted-date">Posted on: {new Date(job.created_at).toLocaleDateString()}</p>
              <Link to={`/jobs/${job.id}`} className="view-applications-btn">
                View Details & Applications
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList; 