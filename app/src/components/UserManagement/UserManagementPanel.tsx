import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Trash2, Plus, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  lastLogin: string | null;
}

interface PasswordStrength {
  score: number; // 0-4
  message: string;
  color: string;
}

export function UserManagementPanel() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  // Create User Form
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  
  // Password Change Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState(false);
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simulate loading users
  useEffect(() => {
    // In production, fetch from API
    setUsers([
      {
        id: '1',
        username: 'Admin',
        email: 'admin@voicebox.ai',
        isAdmin: true,
        createdAt: '2024-06-20T10:00:00Z',
        lastLogin: '2024-06-23T08:30:00Z'
      },
      {
        id: '2',
        username: 'John Doe',
        email: 'john@example.com',
        isAdmin: false,
        createdAt: '2024-06-21T14:20:00Z',
        lastLogin: '2024-06-23T09:15:00Z'
      }
    ]);
  }, []);

  // Password strength checker
  const checkPasswordStrength = (password: string): PasswordStrength => {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&]/.test(password)) score++;

    const levels: PasswordStrength[] = [
      { score: 0, message: 'Very Weak', color: 'text-red-500' },
      { score: 1, message: 'Weak', color: 'text-orange-500' },
      { score: 2, message: 'Fair', color: 'text-yellow-500' },
      { score: 3, message: 'Good', color: 'text-blue-500' },
      { score: 4, message: 'Strong', color: 'text-green-500' }
    ];

    return levels[Math.min(score, 4)];
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError('');

    if (!newUsername.trim()) {
      setCreateError('Username is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setCreateError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setCreateError('Password must be at least 8 characters');
      return;
    }

    setCreateLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: UserData = {
        id: Date.now().toString(),
        username: newUsername,
        email: newEmail,
        isAdmin,
        createdAt: new Date().toISOString(),
        lastLogin: null
      };

      setUsers(prev => [...prev, newUser]);
      setNewUsername('');
      setNewEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setIsAdmin(false);
      setShowCreateUser(false);
    } catch (error) {
      setCreateError('Failed to create user');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess(false);

    if (newPass !== confirmNewPass) {
      setChangeError('New passwords do not match');
      return;
    }

    if (newPass.length < 8) {
      setChangeError('Password must be at least 8 characters');
      return;
    }

    setChangeLoading(true);
    try {
      // Simulate API call - verify current password
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In production, verify currentPassword matches user's actual password
      setChangeSuccess(true);
      setCurrentPassword('');
      setNewPass('');
      setConfirmNewPass('');
      
      setTimeout(() => {
        setShowPasswordChange(false);
        setChangeSuccess(false);
      }, 2000);
    } catch (error) {
      setChangeError('Failed to change password');
    } finally {
      setChangeLoading(false);
    }
  };

  const deleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(prev => prev.filter(u => u.id !== userId));
    }
  };

  const formatDate = (dateStr: string | null): string => {
    if (!dateStr) return 'Never';
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const passwordStrength = checkPasswordStrength(newPass);

  return (
    <div className={`flex flex-col gap-6 p-4 md:p-6 max-w-6xl mx-auto ${isMobile ? 'w-full' : ''}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-2">
            <User className="w-8 h-8 text-accent" />
            User Management
          </h2>
          <p className="text-muted-foreground mt-1">Manage users, roles, and passwords</p>
        </div>
        <button
          onClick={() => setShowCreateUser(!showCreateUser)}
          className="w-full md:w-auto px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg flex items-center gap-2 justify-center font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create User
        </button>
      </div>

      {/* Create User Form */}
      {showCreateUser && (
        <div className="bg-muted border border-border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Create New User</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email (optional)"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm font-medium">Admin User</span>
            </label>

            {createError && (
              <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{createError}</span>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowCreateUser(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createLoading}
                className="px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50 text-accent-foreground rounded-lg font-medium transition-colors"
              >
                {createLoading ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-muted border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Username</th>
                <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Role</th>
                <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Created</th>
                <th className="px-4 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="border-b border-border hover:bg-background/50 transition-colors">
                  <td className="px-4 py-3 font-medium">{user.username}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-muted-foreground text-xs md:text-sm">{user.email || '-'}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.isAdmin ? 'bg-accent/20 text-accent' : 'bg-muted text-foreground'
                    }`}>
                      {user.isAdmin ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground text-xs md:text-sm">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowPasswordChange(true);
                        }}
                        className="px-3 py-1.5 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-500 rounded transition-colors flex items-center gap-1"
                        title="Change password"
                      >
                        <Lock className="w-4 h-4" />
                        <span className="hidden md:inline">Password</span>
                      </button>
                      <button
                        onClick={() => deleteUser(user.id)}
                        className="px-3 py-1.5 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded transition-colors flex items-center gap-1"
                        title="Delete user"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden md:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordChange && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-xl font-semibold mb-1">Change Password</h3>
            <p className="text-muted-foreground text-sm mb-4">User: {selectedUser.username}</p>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength */}
                {newPass && (
                  <div className="mt-2 p-2 bg-muted rounded">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Strength:</span>
                      <span className={`text-xs font-medium ${passwordStrength.color}`}>{passwordStrength.message}</span>
                    </div>
                    <div className="w-full bg-background rounded-full h-2 mt-1 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          passwordStrength.score === 0 ? 'w-1/5 bg-red-500' :
                          passwordStrength.score === 1 ? 'w-2/5 bg-orange-500' :
                          passwordStrength.score === 2 ? 'w-3/5 bg-yellow-500' :
                          passwordStrength.score === 3 ? 'w-4/5 bg-blue-500' :
                          'w-full bg-green-500'
                        }`}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={confirmNewPass}
                    onChange={(e) => setConfirmNewPass(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Messages */}
              {changeError && (
                <div className="flex gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{changeError}</span>
                </div>
              )}

              {changeSuccess && (
                <div className="flex gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-500 text-sm">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>Password changed successfully!</span>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordChange(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={changeLoading || !currentPassword || !newPass || !confirmNewPass}
                  className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 disabled:opacity-50 text-accent-foreground rounded-lg font-medium transition-colors"
                >
                  {changeLoading ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
