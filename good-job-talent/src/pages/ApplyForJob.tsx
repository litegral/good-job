import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { applyForJob, type JobApplicationResponse } from '../services/jobApplicationService';
import { getJobPostingDetails, type JobPosting } from '../services/jobPostingService';
import { UploadCloud, FileText, Send, Loader, AlertCircle, CheckCircle, Briefcase, Building, ArrowLeft, ExternalLink } from 'lucide-react';

const ApplyForJob: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDetails, setJobDetails] = useState<JobPosting | null>(null);
  const [loadingJobDetails, setLoadingJobDetails] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [uploadedResumeUrl, setUploadedResumeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      setLoadingJobDetails(true);
      getJobPostingDetails(jobId)
        .then(setJobDetails)
        .catch(() => setError('Could not load job details.'))
        .finally(() => setLoadingJobDetails(false));
    } else {
      setError('Job ID is missing.');
      setLoadingJobDetails(false);
    }
  }, [jobId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setError(null);
      setSuccessMessage(null);
      setUploadedResumeUrl(null);
    } else {
      setResumeFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!jobId) {
      setError('Job ID is missing. Cannot submit application.');
      return;
    }
    if (!resumeFile) {
      setError('Please select a resume file to upload.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setUploadedResumeUrl(null);

    try {
      const applicationResponse: JobApplicationResponse = await applyForJob(jobId, resumeFile);
      setSuccessMessage('Application submitted successfully!');
      if (applicationResponse.resume_url) {
        setUploadedResumeUrl(applicationResponse.resume_url);
      }
      setTimeout(() => {
        navigate('/my-applications');
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Application submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingJobDetails) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Loading job information...</span>
      </div>
    );
  }

  if (!jobId || !jobDetails && !error) {
    return (
      <div className="max-w-2xl mx-auto my-8 px-4 text-center">
          <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
          <p className="text-xl text-gray-700">Job information could not be loaded or Job ID is missing.</p>
          <Link to="/jobs" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Job Listings
          </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto my-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
        <div className="text-center mb-6">
            <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 mb-4">
                <Briefcase className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Apply for {jobDetails?.title || 'Job'}</h1>
            {jobDetails && (
                <div className="flex items-center justify-center text-gray-600 mt-2">
                    <Building className="h-5 w-5 mr-2 text-gray-500" /> 
                    <span>{jobDetails.company_name}</span>
                </div>
            )}
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start mb-6">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex flex-col items-center mb-6">
            <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-green-700">{successMessage}</p>
            </div>
            {uploadedResumeUrl && (
              <a 
                href={uploadedResumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 font-medium"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                View Uploaded Resume
              </a>
            )}
            <p className="text-xs text-gray-500 mt-2">You will be redirected shortly...</p>
          </div>
        )}

        {!successMessage && (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Resume
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="resume"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input id="resume" name="resume" type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={handleFileChange} required />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                </div>
              </div>
              {resumeFile && (
                <div className="mt-3 flex items-center text-sm text-gray-700">
                    <FileText className="h-5 w-5 text-gray-500 mr-2" />
                    <span>{resumeFile.name} ({(resumeFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !resumeFile || !!successMessage}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="-ml-1 mr-2 h-5 w-5" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link 
            to={`/jobs/${jobId}`}
            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
            aria-disabled={loading || !!successMessage}
            onClick={(e) => (loading || !!successMessage) && e.preventDefault()}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Job Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ApplyForJob; 