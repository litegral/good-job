import apiClient from './api';

// Interface for the response when a job application is created
export interface JobApplicationResponse {
  id: number;
  job_posting_id: number;
  user_id: number; // Changed from talent_user_id to match API response
  status: string; // e.g., pending, under review, etc.
  resume_path: string; // Added field
  resume_url: string;  // Changed from optional to required and updated name
  created_at: string;
  updated_at: string;
  job_posting_url?: string; // Added based on new response structure
  job_posting?: { // Updated to match the provided nested structure
    id: number;
    title: string;
    company_name: string;
    location: string; // Added location to nested job_posting
  };
  // Potentially include job posting title or company for display
  // job_posting?: { title: string; company_name: string; };
}

/**
 * Applies for a job.
 * @param jobPostingId The ID of the job posting to apply for.
 * @param resumeFile The resume file (File object).
 */
export const applyForJob = async (jobPostingId: string | number, resumeFile: File): Promise<JobApplicationResponse> => {
  const formData = new FormData();
  formData.append('resume', resumeFile);
  // The API docs specify /api/job-postings/{jobPostingId}/apply
  // And the body is form-data with a 'resume' key (file type)
  const response = await apiClient.post<JobApplicationResponse>(
    `/job-postings/${jobPostingId}/apply`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

/**
 * Fetches details of a specific job application.
 * This might be used by talent to view their own application or by employer.
 * For talent, we might need a dedicated endpoint or ensure proper authorization.
 */
export const getJobApplicationDetails = async (applicationId: string | number): Promise<JobApplicationResponse> => {
  // Assuming the API returns the application directly, not nested under 'data' for a single application fetch
  const response = await apiClient.get<JobApplicationResponse>(`/job-applications/${applicationId}`);
  return response.data;
};

/**
 * Lists all job applications for the currently authenticated talent.
 * Uses the /my-applications endpoint (prefixed by apiClient base URL, e.g. /api) with a Bearer token.
 * The API returns an array of JobApplicationResponse objects directly.
 */
export const listMyApplications = async (token: string): Promise<JobApplicationResponse[]> => {
  const response = await apiClient.get<JobApplicationResponse[]>(
    '/my-applications', 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data; // Corrected: API returns the array directly
}; 