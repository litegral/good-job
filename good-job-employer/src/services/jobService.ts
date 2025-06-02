const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const createJobPosting = async (jobData: any, token: string) => {
  const response = await fetch(`${API_URL}/job-postings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(jobData),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create job posting');
  }
  return response.json();
};

export const getJobApplications = async (jobPostingId: string, token: string) => {
  const response = await fetch(`${API_URL}/job-postings/${jobPostingId}/applications`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch job applications');
  }
  return response.json();
};

export const updateApplicationStatus = async (applicationId: string, status: string, token: string) => {
  const response = await fetch(`${API_URL}/job-applications/${applicationId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update application status');
  }
  return response.json();
}; 