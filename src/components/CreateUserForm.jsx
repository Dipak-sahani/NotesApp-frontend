// src/components/CreateUserForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    role: 'member',
    sendEmail: true
  });
  const [generatedAccount, setGeneratedAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user, tenant } = useAuth();

  // Extract company name from admin's email (admin@acme.test -> acme)
  const companyName = tenant.name;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const generateUsername = (firstName, lastName) => {
    const cleanFirstName = firstName.toLowerCase().replace(/\s+/g, '');
    const cleanLastName = lastName.toLowerCase().replace(/\s+/g, '');
    
    // Different username formats
    const formats = [
      `${cleanFirstName}.${cleanLastName}`,
      `${cleanFirstName}${cleanLastName}`,
      `${cleanFirstName.charAt(0)}${cleanLastName}`,
      `${cleanFirstName}${cleanLastName.charAt(0)}`
    ];

    // Return the first format that seems reasonable
    return formats[0];
  };

  const generatePassword = (birthDate, username, company) => {
    if (!birthDate) return '';
    
    // Extract parts of birth date (YYYY-MM-DD)
    const [year, month, day] = birthDate.split('-');
    
    // Different password formats
    const password = `${day}${month}${year.substring(2)}${company}`;
    
    return password;
  };

  const generateEmail = (username, company) => {
    return `${username}@${company}.com`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const username = generateUsername(formData.firstName, formData.lastName);
      const password = generatePassword(formData.birthDate, username, companyName);
      const email = generateEmail(username, companyName);

      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email,
        password,
        role: formData.role,
        birthDate: formData.birthDate,
        sendEmail: formData.sendEmail
      };

      const response = await axios.post(`${import.meta.env.VITE_CREATE_USER_ACCOUNT}`, userData);

      setGeneratedAccount({
        email,
        password,
        loginLink: response.data.loginLink
      });

      setSuccess('User account created successfully!');
      setFormData({
        firstName: '',
        lastName: '',
        birthDate: '',
        role: 'member',
        sendEmail: true,
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create user account');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Show temporary success message
        const originalText = document.getElementById('copy-button').textContent;
        document.getElementById('copy-button').textContent = 'Copied!';
        setTimeout(() => {
          document.getElementById('copy-button').textContent = originalText;
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New User Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
              Birth Date *
            </label>
            <input
              type="date"
              id="birthDate"
              name="birthDate"
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={formData.birthDate}
              onChange={handleChange}
            />
            <p className="mt-1 text-sm text-gray-500">Used to generate a secure password</p>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role *
            </label>
            <select
              id="role"
              name="role"
              required
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              id="sendEmail"
              name="sendEmail"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              checked={formData.sendEmail}
              onChange={handleChange}
            />
            <label htmlFor="sendEmail" className="ml-2 block text-sm text-gray-900">
              Send welcome email with login instructions
            </label>
          </div>

          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Account will be created with:</h3>
            <div className="text-sm text-gray-600">
              <p>
                <span className="font-medium">Email:</span>{' '}
                {formData.firstName && formData.lastName 
                  ? generateEmail(
                      generateUsername(formData.firstName, formData.lastName), 
                      companyName
                    )
                  : 'username@' + companyName + '.com'
                }
              </p>
              <p>
                <span className="font-medium">Password:</span>{' '}
                {formData.birthDate 
                  ? generatePassword(
                      formData.birthDate, 
                      formData.firstName && formData.lastName 
                        ? generateUsername(formData.firstName, formData.lastName)
                        : 'username', 
                      companyName
                    )
                  : '••••••••'
                }
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create User Account'}
            </button>
          </div>
        </form>

        {generatedAccount && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <h2 className="text-lg font-medium text-green-800 mb-4">Account Created Successfully!</h2>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
              <div>
                <label className="block text-sm font-medium text-green-700">Email</label>
                <p className="mt-1 text-sm text-green-900 font-mono">{generatedAccount.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-green-700">Password</label>
                <p className="mt-1 text-sm text-green-900 font-mono">{generatedAccount.password}</p>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-green-700">Login Link</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  readOnly
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-green-300 focus:ring-green-500 focus:border-green-500 sm:text-sm font-mono"
                  value={generatedAccount.loginLink}
                />
                <button
                  id="copy-button"
                  type="button"
                  onClick={() => copyToClipboard(generatedAccount.loginLink)}
                  className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-green-300 bg-green-100 text-green-700 hover:bg-green-200 focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
                >
                  Copy
                </button>
              </div>
            </div>

            <div className="bg-green-100 border-l-4 border-green-500 p-4">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    <strong>Share this information securely with the user.</strong> The password should be changed on first login.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateUserForm;