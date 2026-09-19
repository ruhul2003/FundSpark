'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit3, Trash2, Coins, Clock, X, Download } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function MyCampaignsView() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingCampaign, setEditingCampaign] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editStory, setEditStory] = useState('');
  const [editRewardInfo, setEditRewardInfo] = useState('');
  const [updating, setUpdating] = useState(false);
  const [exportingId, setExportingId] = useState(null);

  const fetchMyCampaigns = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/campaigns/creator`);
      setCampaigns(res.data);
    } catch (err) {
      console.error('Error fetching creator campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  const handleOpenEditModal = (campaign) => {
    setEditingCampaign(campaign);
    setEditTitle(campaign.title);
    setEditStory(campaign.story);
    setEditRewardInfo(campaign.rewardInfo || '');
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editingCampaign) return;

    try {
      setUpdating(true);
      await axios.put(`${API_URL}/campaigns/${editingCampaign._id}`, {
        title: editTitle,
        story: editStory,
        rewardInfo: editRewardInfo
      });
      setEditingCampaign(null);
      await fetchMyCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? All approved supporter credits will be automatically refunded!`)) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/campaigns/${id}`);
      await fetchMyCampaigns();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleExportCSV = async (campaign) => {
    try {
      setExportingId(campaign._id);
      const res = await axios.get(`${API_URL}/contributions/campaign/${campaign._id}/backers`);
      const { backers } = res.data;

      if (!backers || backers.length === 0) {
        alert('No approved backer contributions to export yet for this campaign.');
        return;
      }

      const headers = ['Supporter Name', 'Credits Pledged', 'Pledge Date', 'Message'];
      const rows = backers.map((b) => [
        `"${(b.supporterName || '').replace(/"/g, '""')}"`,
        b.amount,
        `"${new Date(b.createdAt).toLocaleDateString()}"`,
        `"${(b.message || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${campaign.title.replace(/[^a-zA-Z0-9]/g, '_')}_backers.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to export backers data');
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">My Campaigns</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Manage, update, or remove your launched campaigns</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
        {loading ? (
          <div className="text-slate-400 dark:text-slate-500 text-xs py-8 text-center">Loading campaigns...</div>
        ) : campaigns.length === 0 ? (
          <div className="text-slate-400 dark:text-slate-500 text-xs py-8 text-center">You have not launched any campaigns yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Title</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Goal vs Raised</th>
                  <th className="p-3">Deadline</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {campaigns.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-semibold text-slate-900 dark:text-white max-w-xs truncate">{item.title}</td>
                    <td className="p-3">{item.category}</td>
                    <td className="p-3 font-bold">
                      <span className="text-amber-600 dark:text-amber-400">{item.amountRaised || 0}</span> / <span className="text-slate-500 dark:text-slate-400">{item.fundingGoal}</span> Credits
                    </td>
                    <td className="p-3 text-slate-500 dark:text-slate-400">{new Date(item.deadline).toLocaleDateString()}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.status === 'approved' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' :
                        item.status === 'rejected' ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                        'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleExportCSV(item)}
                        disabled={exportingId === item._id}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
                        title="Export Backers CSV"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>{exportingId === item._id ? 'Exporting...' : 'Export CSV'}</span>
                      </button>
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="px-2.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Update</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item._id, item.title)}
                        className="px-2.5 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
          <div className="max-w-lg w-full p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl space-y-4 relative text-slate-900 dark:text-slate-100">
            <button
              onClick={() => setEditingCampaign(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Update Campaign</h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Story / Description</label>
                <textarea
                  rows={4}
                  required
                  value={editStory}
                  onChange={(e) => setEditStory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">Backer Reward Info</label>
                <input
                  type="text"
                  value={editRewardInfo}
                  onChange={(e) => setEditRewardInfo(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20"
                >
                  {updating ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
