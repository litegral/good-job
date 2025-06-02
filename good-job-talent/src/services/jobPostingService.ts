import apiClient from './api';

// Interface based on api_docs.json for a single Job Posting
export interface JobPosting {
  id: number;
  user_id: number; // Added based on Postman response
  title: string;
  description: string;
  company_name: string;
  location: string;
  salary?: string; // Changed to string based on Postman response (e.g., "75000.00")
  employment_type: string; // e.g., Full-time, Part-time, Contract
  posted_at: string; // Added based on Postman response
  closes_at?: string; // ISO date string, optional
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  // employer_id: number; // If you need to show employer info, expand this
}

// Response type for listing job postings (usually an array)
// The API might return paginated data, but for now, we assume a simple array
export interface JobPostingsListResponse {
  data: JobPosting[]; // Assuming the API nests the array under a 'data' key
  // Potentially add pagination info here: total, per_page, current_page, etc.
}

/**
 * Fetches a list of all job postings.
 */
export const listJobPostings = async (): Promise<JobPostingsListResponse> => {
  const response = await apiClient.get<JobPostingsListResponse>('/job-postings');
  return response.data;
};

/**
 * Fetches the details of a specific job posting by its ID.
 */
export const getJobPostingDetails = async (jobId: string | number): Promise<JobPosting> => {
  // Corrected to expect the JobPosting object directly, not nested under response.data.data
  const response = await apiClient.get<JobPosting>(`/job-postings/${jobId}`);
  return response.data;
}; 