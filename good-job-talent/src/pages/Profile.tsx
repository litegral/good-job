import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../services/authService';
import type { User } from '../services/authService';
import { User as UserIcon, Mail, Calendar, Shield, Loader, AlertCircle, Edit2 } from 'lucide-react';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { token, user: authUser, logout } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError('Not authenticated. Please login.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const userProfile = await getUserProfile(token);
        setProfile(userProfile);
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          logout();
          setError('Session expired. Please login again.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch profile. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if(authUser){
        setProfile(authUser);
        setLoading(false);
    }
    fetchProfile();

  }, [token, authUser, logout]);

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
      </div>
    );
  }

  if (!profile) {
    return (
        <div className="max-w-2xl mx-auto my-8 px-4 text-center">
            <p className="text-gray-600">Could not load profile information.</p>
        </div>
    );
  }

  return (
    <div className="py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
        <div className="p-6 relative">
          <div className="absolute -top-16 left-1/2 -translate-x-1/2">
            <div className="w-32 h-32 bg-white rounded-full p-1 shadow-md flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                <UserIcon className="h-16 w-16 text-indigo-600" />
              </div>
            </div>
          </div>
          
          <div className="pt-16 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.name}</h1>
            <p className="text-gray-600 text-sm">{profile.type === 'talent' ? 'Talent Account' : 'Recruiter Account'}</p>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Details</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700">{profile.email}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                <span className="text-gray-700">
                  Joined: {new Date(profile.created_at).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </span>
              </div>
              <div className="flex items-center">
                <Shield className={`h-5 w-5 mr-3 ${profile.email_verified_at ? 'text-green-500' : 'text-yellow-500'}`} />
                <span className={`text-sm ${profile.email_verified_at ? 'text-green-700' : 'text-yellow-700'}`}>
                  {profile.email_verified_at ? `Email Verified: ${new Date(profile.email_verified_at).toLocaleDateString('en-US')}` : 'Email Not Verified'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-6 text-center">
            <button 
              onClick={() => navigate('/profile/edit')}
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center mx-auto"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile; 