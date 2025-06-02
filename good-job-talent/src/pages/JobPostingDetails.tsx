import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getJobPostingDetails, type JobPosting } from '../services/jobPostingService';
import { Briefcase, MapPin, Clock, DollarSign, Calendar, Building, ArrowLeft, Send, Loader, AlertCircle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Helper to format salary string
const formatSalary = (salaryString: string | undefined) => {
  if (!salaryString) return 'Not specified';
  const salaryNum = parseFloat(salaryString);
  if (isNaN(salaryNum)) return salaryString; // Return original if not a valid number
  return `$${salaryNum.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const JobPostingDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { isAuthenticated } = useAuth();
  const [jobPosting, setJobPosting] = useState<JobPosting | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) {
      setError('Job ID is missing.');
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getJobPostingDetails(jobId);
        setJobPosting(data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch job posting details.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [jobId]);

  if (loading) return (
    <div className="flex justify-center items-center py-16">
      <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      <span className="ml-3 text-lg text-gray-600">Loading job details...</span>
    </div>
  );
  
  if (error) return (
    <div className="max-w-3xl mx-auto my-8 px-4">
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
        <p className="text-sm text-red-700">{error}</p>
      </div>
      <div className="mt-6">
        <Link to="/jobs" className="flex items-center text-indigo-600 hover:text-indigo-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Job Listings
        </Link>
      </div>
    </div>
  );
  
  if (!jobPosting) return (
    <div className="max-w-3xl mx-auto my-8 px-4 text-center py-12">
      <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
        <Briefcase className="h-8 w-8 text-gray-500" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">Job posting not found</h3>
      <p className="text-gray-500 mb-6">The job you're looking for may have been removed or is no longer available.</p>
      <Link to="/jobs" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Job Listings
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto my-8 px-4">
      <Link to="/jobs" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Job Listings
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <div className="p-6 md:p-8">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{jobPosting.title}</h1>
            <div className="bg-indigo-100 p-3 rounded-lg">
              <Briefcase className="h-6 w-6 text-indigo-700" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Building className="h-5 w-5 mr-2 text-gray-500" />
              <span>{jobPosting.company_name}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <MapPin className="h-5 w-5 mr-2 text-gray-500" />
              <span>{jobPosting.location}</span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <span>{jobPosting.employment_type}</span>
            </div>
            
            {jobPosting.salary && (
              <div className="flex items-center text-gray-700">
                <DollarSign className="h-5 w-5 mr-2 text-gray-500" />
                <span>{formatSalary(jobPosting.salary)}</span>
              </div>
            )}
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-gray-900">Description</h2>
            <div className="prose prose-indigo max-w-none">
              <p className="text-gray-700 whitespace-pre-line">{jobPosting.description}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between bg-gray-50 -m-6 -mb-8 md:-m-8 md:-mb-8 p-6 md:p-8 mt-8 border-t border-gray-100">
            <div className="flex flex-col mb-4 md:mb-0">
              <div className="flex items-center mb-1 text-gray-700">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm">Posted on: {new Date(jobPosting.posted_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              
              {jobPosting.closes_at && (
                <div className="flex items-center text-gray-700">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="text-sm">Closes: {new Date(jobPosting.closes_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              )}
            </div>
            
            {isAuthenticated ? (
              <Link
                to={`/jobs/${jobId}/apply`}
                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Send className="h-4 w-4 mr-2" />
                Apply for this Job
              </Link>
            ) : (
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-700 mb-2">Want to apply for this job?</p>
                <Link
                  to={`/login?redirect=/jobs/${jobId}`}
                  className="inline-flex items-center justify-center px-4 py-2 mr-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-md hover:from-indigo-700 hover:to-purple-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login to Apply
                </Link>
                <Link
                  to={`/register-talent?redirect=/jobs/${jobId}`}
                  className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobPostingDetails; 