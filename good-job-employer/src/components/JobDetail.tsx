import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Briefcase, MapPin, Calendar, DollarSign, Users } from 'lucide-react';
import ApplicationList from './ApplicationList';
import '../styles/JobDetail.css';

interface JobDetailProps {
  token: string | null;
}

interface Job {
  id: string;
  title: string;
  description: string;
  company_name: string;
  location: string;
  salary: number;
  employment_type: string;
  closes_at: string;
  created_at: string;
}

const JobDetail = ({ token }: JobDetailProps) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/job-postings/${id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch job details');
        }
        
        const data = await response.json();
        setJob(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id, token, navigate]);

  if (loading) {
    return <div className="loading-container">Loading job details...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!job) {
    return <div className="not-found-container">Job not found</div>;
  }

  return (
    <div className="job-detail-container">
      <div className="job-detail-header">
        <h1>{job.title}</h1>
        <Link to="/" className="back-link">← Back to jobs</Link>
      </div>
      
      <div className="job-detail-card">
        <div className="job-detail-info">
          <div className="job-detail-meta">
            <div className="meta-item">
              <Briefcase size={18} />
              <span>{job.company_name}</span>
            </div>
            <div className="meta-item">
              <MapPin size={18} />
              <span>{job.location}</span>
            </div>
            <div className="meta-item">
              <DollarSign size={18} />
              <span>${job.salary.toLocaleString()}</span>
            </div>
            <div className="meta-item">
              <Users size={18} />
              <span>{job.employment_type}</span>
            </div>
            <div className="meta-item">
              <Calendar size={18} />
              <span>Closes: {new Date(job.closes_at).toLocaleDateString()}</span>
            </div>
          </div>
          
          <div className="job-detail-dates">
            <p>Posted on: {new Date(job.created_at).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="job-detail-description">
          <h2>Description</h2>
          <div className="description-content">
            {job.description.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
      
      {token && id && <ApplicationList jobId={id} token={token} />}
    </div>
  );
};

export default JobDetail; 