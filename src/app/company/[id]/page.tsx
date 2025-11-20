'use client';

import React, { useState, useEffect } from 'react';
import { getCompanyById, inviteUser, Company } from '@/services/companyService';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import InviteUserModal from '@/components/InviteUserModal';

const CompanyDetailsPage = ({ params }: { params: { id: string } }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyById(params.id);
        setCompany(data);
      } catch (err) {
        setError('Failed to fetch company details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, [params.id]);

  const handleInviteUser = async (email: string) => {
    try {
      await inviteUser(params.id, email);
    } catch (err) {
      throw new Error('Failed to invite user.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!company) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="py-10">
        <header>
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <img
                className="w-16 h-16 rounded-full"
                src={company.logo}
                alt=""
              />
              <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
                {company.name}
              </h1>
            </div>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Invite User
                </button>
              </div>
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Members
                </h2>
                <div className="mt-4">
                  <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg dark:border-gray-700">
                          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
                                >
                                  Name
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400"
                                >
                                  Email
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                              {company.members.map((member) => (
                                <tr key={member.id}>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                      {member.name}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                      {member.email}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <InviteUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInviteUser}
      />
    </div>
  );
};

export default CompanyDetailsPage;
