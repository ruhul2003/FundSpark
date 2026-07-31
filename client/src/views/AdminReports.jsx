'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminReportsView() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/reports`);
      setReports(res.data);
    } catch (err) {
      console.error('Error fetching campaign reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleSuspendCampaign = async (reportId) => {
    try {
      await axios.patch(`${API_URL}/reports/${reportId}/suspend`);
      await fetchReports();
      alert('Campaign has been suspended and report marked resolved.');
    } catch (err) {
      alert(err.response?.data?.message || 'Suspend failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Fraudulent Campaign Reports</h1>
        <p className="text-xs text-slate-400">Review suspicious campaign flags submitted by supporters</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading campaign reports...</div>
        ) : reports.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No campaign flags or reports filed.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Reporter Name & Email</th>
                  <th className="p-3">Reported Campaign</th>
                  <th className="p-3">Reason / Details</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">
                      <div>{r.reporterName}</div>
                      <div className="text-[10px] text-slate-500">{r.reporterEmail}</div>
                    </td>
                    <td className="p-3 font-bold text-slate-200 max-w-xs">{r.campaignTitle}</td>
                    <td className="p-3 text-rose-300 bg-rose-950/20 rounded-lg p-2 max-w-xs leading-relaxed">{r.reason}</td>
                    <td className="p-3 text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</td>
                    <td className="p-3 text-right">
                      {r.status === 'resolved' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Resolved
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSuspendCampaign(r._id)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold inline-flex items-center space-x-1"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Suspend Campaign</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
