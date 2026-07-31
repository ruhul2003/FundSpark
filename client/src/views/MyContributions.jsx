'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Coins } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MyContributionsView() {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 5;

  const fetchContributions = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/contributions/supporter?page=${page}&limit=${limit}`);
      setContributions(res.data.contributions);
      setTotalPages(res.data.pages || 1);
      setTotalCount(res.data.total || 0);
      setCurrentPage(res.data.page || 1);
    } catch (err) {
      console.error('Error fetching supporter contributions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContributions(currentPage);
  }, [currentPage]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">My Contributions</h1>
          <p className="text-xs text-slate-400">Detailed list of all your pledged credits and status history</p>
        </div>
        <div className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 self-start">
          Total Pledges: <span className="text-indigo-400 font-bold">{totalCount}</span>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-6">
        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading contributions...</div>
        ) : contributions.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">You have not made any contributions yet.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Campaign Title</th>
                    <th className="p-3">Creator Name</th>
                    <th className="p-3">Pledged Credits</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {contributions.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">{item.campaignTitle}</td>
                      <td className="p-3 text-slate-300">{item.creatorName}</td>
                      <td className="p-3 font-bold text-amber-400 flex items-center space-x-1">
                        <Coins className="w-3.5 h-3.5" />
                        <span>{item.amount} Credits</span>
                      </td>
                      <td className="p-3 text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'approved' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          item.status === 'rejected' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' :
                          'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages}</strong>
              </span>

              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-8 h-8 rounded-xl font-semibold text-xs transition-all ${
                        currentPage === pNum
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}

                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
