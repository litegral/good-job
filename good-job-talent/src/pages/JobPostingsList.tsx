import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listJobPostings, type JobPosting } from '../services/jobPostingService';
import { Briefcase, MapPin, Clock, DollarSign, Building, Search, AlertCircle, Loader } from 'lucide-react';

const JobPostingsList: React.FC = () => {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchJobPostings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await listJobPostings();
        setJobPostings(response.data || response);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch job postings.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobPostings();
  }, []);

  // Filter job postings based on search term
  const filteredJobs = jobPostings.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    job.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Available Job Opportunities</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover and apply to exciting job opportunities that match your skills and career goals.</p>
        </div>

        {/* Search bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search jobs by title, company or location..."
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
            <span className="ml-3 text-lg text-gray-600">Loading job postings...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start max-w-lg mx-auto">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-3 w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="h-8 w-8 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No job postings found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search terms.' : 'No job postings available at the moment.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <Link 
                to={`/jobs/${job.id}`} 
                key={job.id}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{job.title}</h2>
                    <div className="bg-indigo-100 p-2 rounded-md">
                      <Briefcase className="h-5 w-5 text-indigo-700" />
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-2 text-gray-600">
                    <Building className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">{job.company_name}</span>
                  </div>
                  
                  <div className="flex items-center mb-2 text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm truncate">{job.location}</span>
                  </div>
                  
                  <div className="flex items-center mb-2 text-gray-600">
                    <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm">{job.employment_type}</span>
                  </div>
                  
                  {job.salary && (
                    <div className="flex items-center mb-4 text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm">${job.salary.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <span className="inline-block w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-center text-white text-sm font-medium rounded-md hover:from-indigo-700 hover:to-purple-700">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostingsList; 