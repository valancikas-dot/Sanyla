'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, UserPlus, Crown, Trash2 } from 'lucide-react';

interface TeamMember {
  id: string;
  user: {
    name: string | null;
    email: string;
  };
  role: string;
  createdAt: string;
}

interface TeamInvitation {
  id: string;
  email: string;
  role: string;
  expiresAt: string;
  status: string;
}

export default function TeamSettingsPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<TeamInvitation[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [loading, setLoading] = useState(false);
  const [organizationId, setOrganizationId] = useState<string>('');

  useEffect(() => {
    // TODO: Get current organization ID from context/session
    // For now, hardcoded - needs to be replaced with actual org selection
    loadTeamData();
  }, [organizationId]);

  const loadTeamData = async () => {
    if (!organizationId) return;

    try {
      // Load members
      const membersRes = await fetch(`/api/team/members?organizationId=${organizationId}`);
      if (membersRes.ok) {
        const data = await membersRes.json();
        setMembers(data.members || []);
      }

      // Load invitations
      const invitesRes = await fetch(`/api/team/invite?organizationId=${organizationId}`);
      if (invitesRes.ok) {
        const data = await invitesRes.json();
        setInvitations(data.invitations || []);
      }
    } catch (error) {
      console.error('Failed to load team data:', error);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          organizationId,
          role,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Invitation sent to ${email}!`);
        setEmail('');
        loadTeamData();
      } else {
        alert(data.error || 'Failed to send invitation');
      }
    } catch (error) {
      console.error('Invite error:', error);
      alert('Failed to send invitation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Users className="w-8 h-8" />
            Team Settings
          </h1>
          <p className="text-gray-300">Manage your team members and invitations</p>
        </div>

        {/* Invite Form */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Invite Team Member
          </h2>

          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@example.com"
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="member" className="bg-slate-800">Member</option>
                <option value="owner" className="bg-slate-800">Owner</option>
              </select>
              <p className="text-sm text-gray-400 mt-1">
                Members can view and edit projects. Owners can manage team and billing.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Mail className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send Invitation'}
            </button>
          </form>
        </div>

        {/* Team Members */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Team Members ({members.length})
          </h2>

          <div className="space-y-3">
            {members.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No team members yet</p>
            ) : (
              members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold">
                      {member.user.name?.[0] || member.user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="text-white font-medium">{member.user.name || member.user.email}</div>
                      <div className="text-sm text-gray-400">{member.user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {member.role === 'owner' && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium">
                        <Crown className="w-4 h-4" />
                        Owner
                      </span>
                    )}
                    {member.role === 'member' && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium">
                        Member
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Invitations */}
        {invitations.length > 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Pending Invitations ({invitations.length})
            </h2>

            <div className="space-y-3">
              {invitations.map((invite) => (
                <div
                  key={invite.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div>
                    <div className="text-white font-medium">{invite.email}</div>
                    <div className="text-sm text-gray-400">
                      Invited as {invite.role} • Expires {new Date(invite.expiresAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-lg text-red-400 hover:text-red-300 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
