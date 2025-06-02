import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';
import type { User } from '../services/authService';
import { Loader, AlertCircle, ArrowLeft } from 'lucide-react';
import EditProfileForm from '../components/EditProfileForm';

const UpdateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { token, user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userProfile = await getUserProfile(token);
        setProfile(userProfile);
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to fetch profile';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (authUser) {
      setProfile(authUser);
      setLoading(false);
    }
    fetchProfile();
  }, [token, authUser, navigate]);

  const handleProfileUpdate = () => {
    navigate('/profile', { replace: true });
  };

  if (loading && !profile) {
    return (
      <div className="flex justify-center items-center py-16">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        <span className="ml-3 text-lg text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto my-8 px-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-2xl mx-auto my-8 px-4 text-center">
        <p className="text-gray-600">Could not load profile information.</p>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center mx-auto text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6 flex">
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Profile
          </button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Update Your Profile</h1>
        
        <EditProfileForm 
          currentUser={profile}
          onSuccess={handleProfileUpdate}
          onCancel={() => navigate('/profile')}
        />
      </div>
    </div>
  );
};

export default UpdateProfile; 