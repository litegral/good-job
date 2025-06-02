import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { listMyApplications, type JobApplicationResponse } from '../services/jobApplicationService';
import { ClipboardList, Calendar, Clock, AlertCircle, Loader, Eye, CheckCircle, XCircle, AlertTriangle, Briefcase, Building, ExternalLink, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PDFModal from '../components/PDFModal';

const MyApplications: React.FC = () => {
  const { token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<JobApplicationResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setError('You must be logged in to view your applications.');
      setLoading(false);
      return;
    }

    if (!token) {
        setError('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
    }

    const fetchApplications = async () => {
      try {
        setLoading(true);
        setError(null);
        const appsData = await listMyApplications(token);
        console.log('Applications data:', appsData);
        setApplications(appsData);
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
            logout();
            setError('Session expired. Please log in again to view your applications.');
        } else {
            setError(err.response?.data?.message || 'Failed to fetch your applications.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token, isAuthenticated, logout, navigate]);

  const handleViewResume = (pdfUrl: string) => {
    console.log('Opening PDF modal with URL:', pdfUrl);
    
    let formattedUrl = pdfUrl;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = `https://${formattedUrl}`;
      console.log('Formatted URL:', formattedUrl);
    }
    
    setSelectedPdfUrl(formattedUrl);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPdfUrl(null);
  };

  const getStatusDetails = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return { 
          icon: <Clock className="h-5 w-5" />, 
          color: 'text-yellow-600 bg-yellow-100',
          label: 'Pending'
        };
      case 'approved':
      case 'accepted':
        return { 
          icon: <CheckCircle className="h-5 w-5" />, 
          color: 'text-green-600 bg-green-100',
          label: 'Accepted'
        };
      case 'rejected':
        return { 
          icon: <XCircle className="h-5 w-5" />, 
          color: 'text-red-600 bg-red-100',
          label: 'Rejected'
        };
      case 'interviewing':
        return { 
          icon: <AlertTriangle className="h-5 w-5" />, 
          color: 'text-blue-600 bg-blue-100',
          label: 'Interviewing'
        };
      default:
        return { 
          icon: <Clock className="h-5 w-5" />, 
          color: 'text-gray-600 bg-gray-100',
          label: status
        };
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      <span className="ml-3 text-lg text-gray-600">Loading your applications...</span>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
      {!isAuthenticated && (
          <div className="mt-4 text-center">
              <Link to="/login" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                  Go to Login
              </Link>
          </div>
      )}
    </div>
  );

  return (
    <div className="py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">My Job Applications</h1>
          <p className="text-gray-600">Track the status of your job applications</p>
        </div>
        
        {applications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
              <ClipboardList className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No applications yet</h3>
            <p className="text-gray-500 mb-6">You haven't submitted any job applications yet.</p>
            <Link 
              to="/jobs" 
              className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => {
                    const statusDetails = getStatusDetails(app.status);
                    return (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Briefcase className="h-5 w-5 text-indigo-600 mr-3 flex-shrink-0" />
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {app.job_posting?.title || `Job ID: ${app.job_posting_id}`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Building className="h-5 w-5 text-gray-500 mr-2 flex-shrink-0"/>
                            <span className="text-sm text-gray-600 truncate">
                                {app.job_posting?.company_name || 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusDetails.color}`}>
                            <span className="mr-1">{statusDetails.icon}</span>
                            {statusDetails.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                            {new Date(app.created_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {app.resume_url ? (
                            <div className="flex flex-col">
                              <button 
                                onClick={() => handleViewResume(app.resume_url!)}
                                className="text-indigo-600 hover:text-indigo-900 inline-flex items-center font-medium"
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                View Resume
                              </button>
                              <a 
                                href={`https://${app.resume_url}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-xs text-gray-500 mt-1 hover:text-gray-700"
                              >
                                <ExternalLink className="h-3 w-3 mr-1 inline" />
                                Open in New Tab
                              </a>
                            </div>
                          ) : (
                            <span className="text-gray-400">N/A</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link 
                            to={`/jobs/${app.job_posting_id}`}
                            className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Job
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      {selectedPdfUrl && (
        <PDFModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          pdfUrl={selectedPdfUrl} 
        />
      )}
    </div>
  );
};

export default MyApplications; 