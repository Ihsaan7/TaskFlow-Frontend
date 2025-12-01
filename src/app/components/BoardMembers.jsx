"use client";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import apiConfig from "../../../api/axios.config";
import { X, UserPlus, Crown, Shield, Eye, Trash2, Loader2 } from "lucide-react";

export default function BoardMembers({ boardID, isOwner, onClose }) {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");

  const { data: members, isLoading } = useQuery({
    queryKey: ["boardMembers", boardID],
    queryFn: () =>
      apiConfig
        .get(`/api/v1/sharing/board/${boardID}/members`)
        .then((res) => res.data.data),
  });

  const inviteMember = useMutation({
    mutationFn: ({ email, role }) =>
      apiConfig.post(`/api/v1/sharing/board/${boardID}/invite`, { email, role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["boardMembers", boardID]);
      setEmail("");
    },
  });

  const removeMember = useMutation({
    mutationFn: (memberID) =>
      apiConfig.delete(`/api/v1/sharing/board/${boardID}/members/${memberID}`),
    onSuccess: () => queryClient.invalidateQueries(["boardMembers", boardID]),
  });

  const updateRole = useMutation({
    mutationFn: ({ memberID, role }) =>
      apiConfig.patch(`/api/v1/sharing/board/${boardID}/members/${memberID}`, {
        role,
      }),
    onSuccess: () => queryClient.invalidateQueries(["boardMembers", boardID]),
  });

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Shield size={14} className="text-blue-500" />;
      case "viewer":
        return <Eye size={14} className="text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 animate-fade-in">
      <div className="leather-panel theme-surface w-full max-w-md animate-scale-in">
        <div className="p-3 sm:p-4 border-b-2 border-dashed border-[#d48166]/30 flex justify-between items-center">
          <h2 className="text-lg sm:text-xl font-black theme-text heading-bold uppercase">
            Board Members
          </h2>
          <button onClick={onClose} className="theme-text hover:text-[#d48166] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-3 sm:p-4">
          {isOwner && (
            <div className="mb-6 animate-fade-in">
              <label className="label-text">Invite Member</label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address..."
                  className="input-field flex-1 text-sm"
                />
                <div className="flex gap-2">
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="input-field w-full sm:w-28 text-sm"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                  <button
                    onClick={() => inviteMember.mutate({ email, role })}
                    disabled={!email.trim() || inviteMember.isPending}
                    className="btn-primary disabled:opacity-50"
                  >
                    {inviteMember.isPending ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <UserPlus size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-[#d48166]" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="animate-slide-up">
                <label className="label-text mb-2">Owner</label>
                <div className="flex items-center gap-3 p-3 leather-card">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[#d48166] border-2 border-dashed border-[#b86b52] flex items-center justify-center text-white font-bold text-sm">
                    {members?.owner?.fullName?.[0] || "O"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold theme-text text-sm truncate">
                      {members?.owner?.fullName}
                    </p>
                    <p className="text-xs theme-text opacity-50 truncate">
                      {members?.owner?.email}
                    </p>
                  </div>
                  <Crown size={16} className="text-yellow-500 flex-shrink-0" />
                </div>
              </div>

              {members?.members?.length > 0 && (
                <div className="animate-slide-up stagger-2">
                  <label className="label-text mb-2">Members</label>
                  <div className="space-y-2">
                    {members.members.map((member, index) => (
                      <div
                        key={member.user._id}
                        className="flex items-center gap-2 sm:gap-3 p-3 leather-card animate-slide-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gray-500 border-2 border-dashed border-gray-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {member.user?.fullName?.[0] || "M"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold theme-text text-sm truncate">
                            {member.user?.fullName}
                          </p>
                          <p className="text-xs theme-text opacity-50 truncate">
                            {member.user?.email}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                          {getRoleIcon(member.role)}
                          {isOwner && (
                            <>
                              <select
                                value={member.role}
                                onChange={(e) =>
                                  updateRole.mutate({
                                    memberID: member.user._id,
                                    role: e.target.value,
                                  })
                                }
                                className="input-field text-xs py-1 px-1 sm:px-2 w-16 sm:w-20"
                              >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="viewer">Viewer</option>
                              </select>
                              <button
                                onClick={() =>
                                  removeMember.mutate(member.user._id)
                                }
                                className="text-red-500 hover:text-red-700 p-1 transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {members?.members?.length === 0 && (
                <p className="text-center theme-text py-4 text-sm opacity-60 animate-fade-in">
                  No members yet. Invite someone to collaborate!
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
