import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building, FileText, MapPin, DollarSign, Layers, Loader2 } from 'lucide-react';

interface JobPostingFormProps {
  onSubmit: (jobData: any) => Promise<boolean>;
  error: string | null;
  isLoading: boolean;
}

const JobPostingForm: React.FC<JobPostingFormProps> = ({ onSubmit, error, isLoading }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [employmentType, setEmploymentType] = useState('Full-time');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit({
      title,
      description,
      location,
      salary: parseFloat(salary),
      company_name: companyName,
      employment_type: employmentType,
      closes_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
    });
    
    if (success) {
      navigate('/');
    }
  };

  return (
    <div className="card">
      <h2 className="page-title">Post a New Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Job Title</label>
          <div className="input-icon-wrapper">
            <Briefcase size={18} className="input-icon" />
            <input
              type="text"
              id="title"
              className="form-input with-icon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Marketing Manager"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="companyName" className="form-label">Company Name</label>
          <div className="input-icon-wrapper">
            <Building size={18} className="input-icon" />
            <input
              type="text"
              id="companyName"
              className="form-input with-icon"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Your company name"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="description" className="form-label">Job Description</label>
          <div className="input-icon-wrapper">
            <FileText size={18} className="input-icon textarea-icon" />
            <textarea
              id="description"
              className="form-input with-icon"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide a detailed description of the job responsibilities and requirements"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="location" className="form-label">Location</label>
          <div className="input-icon-wrapper">
            <MapPin size={18} className="input-icon" />
            <input
              type="text"
              id="location"
              className="form-input with-icon"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Remote, New York, NY"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="salary" className="form-label">Annual Salary ($)</label>
          <div className="input-icon-wrapper">
            <DollarSign size={18} className="input-icon" />
            <input
              type="number"
              id="salary"
              className="form-input with-icon"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. 75000"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="employmentType" className="form-label">Employment Type</label>
          <div className="input-icon-wrapper">
            <Layers size={18} className="input-icon" />
            <select
              id="employmentType"
              className="form-input with-icon"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              required
              disabled={isLoading}
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Temporary">Temporary</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
        </div>
        
        {error && <p className="error-message">{error}</p>}
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%' }}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="icon loading-spinner" />
              Posting Job...
            </>
          ) : (
            'Post Job'
          )}
        </button>
      </form>
    </div>
  );
};

export default JobPostingForm; 