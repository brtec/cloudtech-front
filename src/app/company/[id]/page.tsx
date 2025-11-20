'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getCompanyById,
  createInvite,
  removeMember,
  updateMember,
  Company,
  InviteResponse,
} from '@/services/companyService';
import { useAuth } from '@/context/AuthContext';
import Spinner from '@/components/Spinner';
import ErrorMessage from '@/components/ErrorMessage';
import Header from '@/components/Header';
import InviteUserModal from '@/components/InviteUserModal';

const CompanyDetailsPage = ({ params }: { params: { id: string } }) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedMembers, setExpandedMembers] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { userId } = useAuth();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const data = await getCompanyById(params.id);
        
        // Verificar se o usuário é member ou admin da company
        const userMembership = data.members?.find(m => m.userId === userId);
        
        if (!userMembership) {
          // Usuário não é member, redirecionar
          setError('You do not have access to this company.');
          setTimeout(() => router.push('/dashboard'), 2000);
          return;
        }
        
        // Verificar se é admin
        setIsAdmin(userMembership.role === 'ADMIN' || userMembership.role === 'OWNER');
        setCompany(data);
      } catch (err) {
        setError('Failed to fetch company details.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchCompany();
    }
  }, [params.id, userId]);

  const handleInviteUser = async (email: string): Promise<any> => {
    try {
      // Sempre enviar ROLE como MEMBER
      const response = await createInvite(params.id, email, 'MEMBER');
      
      // Reload company data to show new member if they already accepted
      setTimeout(async () => {
        try {
          const updatedCompany = await getCompanyById(params.id);
          setCompany(updatedCompany);
        } catch (err) {
          console.error('Failed to reload company:', err);
        }
      }, 1000);
      
      return response;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to create invite');
    }
  };

  const handleRemoveMember = async (memberId: string, memberUserId: string) => {
    // Não permitir remover o admin (usuário atual)
    if (memberUserId === userId) {
      setError('You cannot remove yourself from the company.');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      await removeMember(params.id, memberId);
      if (company) {
        setCompany({
          ...company,
          members: company.members?.filter((m) => m.id !== memberId),
        });
      }
    } catch (err) {
      setError('Failed to remove member');
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      await updateMember(params.id, memberId, newRole);
      if (company) {
        setCompany({
          ...company,
          members: company.members?.map((m) =>
            m.id === memberId ? { ...m, role: newRole as 'OWNER' | 'ADMIN' | 'MEMBER' } : m
          ),
        });
      }
    } catch (err) {
      setError('Failed to update member role');
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

  if (error || !company) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="mx-auto max-w-7xl px-4 py-12">
          <ErrorMessage message={error || 'Company not found'} />
          <Link href="/dashboard">
            <button className="mt-6 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <main className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <Link href="/dashboard">
            <button className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Companies
            </button>
          </Link>

          {/* Company Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-6">
                {/* Logo */}
                <div className="flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-lg">
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
                      <span className="text-2xl font-bold text-white">
                        {company.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Company Info */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {company.name}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    {company.members?.length || 0} member(s)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {isAdmin && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-blue-800 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Invite Member
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          <ErrorMessage message={error} />

          {/* Members Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Members</h2>
            </div>

            {company.members && company.members.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Added
                      </th>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {company.members.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <td className="px-8 py-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {member.user?.name || 'N/A'}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {member.user?.email}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          {member.userId === userId ? (
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`}>
                              {member.role}
                            </span>
                          ) : (
                            <select
                              value={member.role}
                              onChange={(e) => handleUpdateMemberRole(member.id, e.target.value)}
                              className={`px-3 py-1.5 rounded-md text-xs font-semibold border text-white transition-colors ${
                                member.role === 'OWNER' ? 'bg-purple-600 border-purple-700 hover:bg-purple-700' :
                                member.role === 'ADMIN' ? 'bg-yellow-600 border-yellow-700 hover:bg-yellow-700' :
                                'bg-blue-600 border-blue-700 hover:bg-blue-700'
                              }`}
                            >
                              <option value="MEMBER">Member</option>
                              <option value="ADMIN">Admin</option>
                              <option value="OWNER">Owner</option>
                            </select>
                          )}
                        </td>
                        <td className="px-8 py-4">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(member.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          {member.userId === userId ? (
                            <span className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-md cursor-not-allowed">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                              Admin
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRemoveMember(member.id, member.userId)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="px-8 py-12 text-center">
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
                    d="M12 4.354a4 4 0 110 5.292M15 12H9m4 8H7a2 2 0 01-2-2V9a2 2 0 012-2h10a2 2 0 012 2v9a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                  No members yet
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Invite team members to collaborate
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <InviteUserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          // Reload company data when modal closes
          const reloadCompany = async () => {
            try {
              const updatedCompany = await getCompanyById(params.id);
              setCompany(updatedCompany);
            } catch (err) {
              console.error('Failed to reload company:', err);
            }
          };
          reloadCompany();
        }}
        onInvite={handleInviteUser}
      />
    </div>
  );
};

export default CompanyDetailsPage;
