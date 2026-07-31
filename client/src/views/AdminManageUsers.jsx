'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function AdminManageUsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/users`);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRemoveUser = async (id, email) => {
    if (!window.confirm(`Are you sure you want to permanently remove user ${email}?`)) return;

    try {
      await axios.delete(`${API_URL}/users/${id}`);
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await axios.patch(`${API_URL}/users/${id}/role`, { role });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Role update failed');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Users</h1>
        <p className="text-xs text-slate-400">View user directory, modify system roles, or remove accounts</p>
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 p-6">
        {loading ? (
          <div className="text-slate-500 text-xs py-8 text-center">Loading user directory...</div>
        ) : users.length === 0 ? (
          <div className="text-slate-500 text-xs py-8 text-center">No registered users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Available Credits</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Update Role</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-900/40">
                    <td className="p-3 flex items-center space-x-3">
                      <img
                        src={u.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
                      />
                      <span className="font-semibold text-white">{u.name}</span>
                    </td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3 font-bold text-amber-400">{u.credits ?? 0} Credits</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        u.role === 'Admin' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30' :
                        u.role === 'Creator' ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' :
                        'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Supporter">Supporter</option>
                        <option value="Creator">Creator</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleRemoveUser(u._id, u.email)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-semibold inline-flex items-center space-x-1 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
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
