'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCompanies, Company } from '@/services/companyService';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import ThemeSwitcher from '@/components/ThemeSwitcher';

const DashboardPage = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const companiesPerPage = 4;
  const router = useRouter();

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        // Use server-side pagination
        const data = await getCompanies(currentPage, companiesPerPage);
        setCompanies(data);
      } catch (err) {
        setError('Failed to fetch companies.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleCompanyClick = (id: number) => {
    router.push(`/company/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="py-10">
        <header>
          <div className="flex items-center justify-between px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <ThemeSwitcher />
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <ErrorMessage message={error} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => handleCompanyClick(company.id)}
                    className="relative flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm cursor-pointer hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={company.logoUrl}
                        alt=""
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {company.name}
                      </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Switch
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-6">
                <div className="flex justify-between flex-1 sm:hidden">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    // We don't know the total count from the API yet, so we'll just assume there might be a next page if we got a full page
                    disabled={companies.length < companiesPerPage}
                    className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    {/* Pagination info omitted as we don't have total count */}
                  </div>
                  <div>
                     <nav
                      className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                         onClick={() => paginate(currentPage + 1)}
                         disabled={companies.length < companiesPerPage}
                         className="relative inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
