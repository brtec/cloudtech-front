'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCompanies, createCompany, Company } from '@/services/companyService';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import Header from '@/components/Header';
import CreateCompanyModal from '@/components/CreateCompanyModal';

const DashboardPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 6;
  const router = useRouter();
  const { userId: authUserId } = useAuth();
  const [userId, setUserId] = useState<string | undefined>();

  // Atualizar userId quando authUserId mudar
  useEffect(() => {
    console.log('Dashboard - authUserId changed:', authUserId);
    setUserId(authUserId);
  }, [authUserId]);

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await getCompanies(currentPage, companiesPerPage);
        setCompanies(data);
        console.log('Companies loaded:', data, 'userId:', userId);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Failed to fetch companies. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage]);

  const handleCreateCompany = async (name: string, logoUrl?: string) => {
    try {
      const newCompany = await createCompany(name, logoUrl);
      setCompanies([newCompany, ...companies]);
      setIsModalOpen(false);
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create company');
    }
  };

  const handleCompanyClick = (id: string) => {
    router.push(`/company/${id}`);
  };

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center h-96">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Companies
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                All companies
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Company
            </button>
          </div>

          <ErrorMessage message={error} />

          {companies.length === 0 ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.5m0 0H9m11 0v-5.5"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No companies yet
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Create your first company to get started
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Company
              </button>
            </div>
          ) : (
            <>
              {/* Companies Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => {
                  // Check if user is a member (including admin/owner roles)
                  const userMembership = userId && company.members?.find(m => m.userId === userId);
                  const isMember = !!userMembership;
                  const isAdmin = isMember && (userMembership?.role === 'ADMIN' || userMembership?.role === 'OWNER');
                  const memberCount = company.members?.length || 0;
                  
                  return (
                    <div
                      key={company.id}
                      className={`group relative bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all overflow-hidden border border-gray-200 dark:border-gray-700 ${
                        isMember ? 'cursor-pointer' : 'cursor-default'
                      }`}
                      onClick={() => isMember && handleCompanyClick(company.id)}
                    >
                      {/* Card Background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                      {/* Card Content */}
                      <div className="relative p-6">
                        {/* Logo */}
                        <div className="flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4">
                          {company.logoUrl ? (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="w-full h-full object-contain p-2 rounded-lg"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                              <span className="text-lg font-bold text-white">
                                {company.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Company Name */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {company.name}
                        </h3>

                        {/* Admin Badge */}
                        {isAdmin && (
                          <div className="inline-block mb-3 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 text-xs font-semibold rounded-md border border-yellow-200 dark:border-yellow-800">
                            👤 Admin
                          </div>
                        )}

                        {/* Members Count */}
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4.354a4 4 0 110 5.292M15 12H9m4 8H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2z"
                            />
                          </svg>
                          {memberCount} member(s)
                        </div>

                        {/* View Details Button - Only for members */}
                        {isMember && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button className="w-full text-center text-blue-600 dark:text-blue-400 text-sm font-semibold hover:underline transition-colors">
                              View Details →
                            </button>
                          </div>
                        )}

                        {/* Non-member notice */}
                        {!isMember && (
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-center text-gray-500 dark:text-gray-400 text-xs">
                              You are not a member of this company
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Page {currentPage}
                </span>
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={companies.length < companiesPerPage}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <CreateCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateCompany}
      />
    </div>
  );
};

export default DashboardPage;
