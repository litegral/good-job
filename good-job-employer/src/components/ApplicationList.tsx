import { useState, useEffect } from 'react';
import { getJobApplications, updateApplicationStatus } from '../services/jobService';
import { FileText, Check, X, Clock, Users } from 'lucide-react';
import '../styles/ApplicationList.css';

interface ApplicationListProps {
  jobId: string;
  token: string;
}

interface Application {
  id: string;
  user: {
    name: string;
    email: string;
  };
  resume_url: string;
  status: string;
  created_at: string;
}

const statusIcons = {
  pending: <Clock size={16} className="status-icon pending" />,
  'under review': <FileText size={16} className="status-icon review" />,
  interviewing: <Users size={16} className="status-icon interviewing" />,
  accepted: <Check size={16} className="status-icon accepted" />,
  rejected: <X size={16} className="status-icon rejected" />
};

const ApplicationList = ({ jobId, token }: ApplicationListProps) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getJobApplications(jobId, token);
      setApplications(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [jobId, token]);

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    try {
      setUpdatingId(applicationId);
      await updateApplicationStatus(applicationId, newStatus, token);
      setApplications(applications.map(app => 
        app.id === applicationId ? { ...app, status: newStatus } : app
      ));
    } catch (error: any) {
      setError(error.message);
    } finally {
      setUpdatingId(null);
    }
  };

  // Helper to get the correct resume URL
  const getResumeUrl = (url: string) => {
    if (!url) return '';
    
    // Handle URLs with protocol already included
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Handle R2 storage URLs (good-job.litegral.com/resumes/...)
    if (url.includes('good-job.litegral.com/resumes/') || 
        url.startsWith('good-job.litegral.com/resumes/')) {
      return `https://${url}`;
    }
    
    // Handle relative URLs that might be from the API server
    const baseUrl = apiUrl.replace('/api', '');
    if (url.startsWith('/')) {
      return `${baseUrl}${url}`;
    }
    
    // Default case for other relative URLs
    return `${baseUrl}/${url}`;
  };

  if (loading) {
    return <div className="loading">Loading applications...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (applications.length === 0) {
    return <div className="no-applications">No applications yet for this job posting.</div>;
  }

  return (
    <div className="applications-container">
      <h2>Applications</h2>
      <div className="applications-list">
        {applications.map(application => (
          <div key={application.id} className="application-card">
            <div className="application-header">
              <h3>{application.user.name}</h3>
              <div className="status-badge">
                {statusIcons[application.status as keyof typeof statusIcons] || statusIcons.pending}
                <span>{application.status}</span>
              </div>
            </div>
            <div className="application-body">
              <p><strong>Email:</strong> {application.user.email}</p>
              <p><strong>Applied on:</strong> {new Date(application.created_at).toLocaleDateString()}</p>
              {application.resume_url && (
                <a 
                  href={getResumeUrl(application.resume_url)} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="resume-link"
                >
                  <FileText size={16} /> View Resume
                </a>
              )}
            </div>
            <div className="application-actions">
              <div className="status-selector">
                <label>Update Status:</label>
                <select 
                  value={application.status}
                  onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                  disabled={updatingId === application.id}
                >
                  <option value="pending">Pending</option>
                  <option value="under review">Under Review</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                </select>
                {updatingId === application.id && <span className="updating-spinner"></span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationList; 