import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  Shield, 
  Save, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle,
  Eye,
  Edit,
  Crown,
  Clock,
  Database,
  Bell,
  Globe,
  Lock,
  Key,
  Trash2
} from 'lucide-react';

// Role Management Sub-component
const RoleManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: API Integration
      // Call getUserProfiles() from supabase-module.js
      
      // Mock data for now
      const mockUsers = [
        {
          id: 'user-1',
          fullName: 'John Doe',
          email: 'john@example.com',
          role: 'admin',
          lastLogin: '2024-01-15T10:30:00Z',
          createdAt: '2023-06-01T09:00:00Z'
        },
        {
          id: 'user-2',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          role: 'editor',
          lastLogin: '2024-01-14T15:45:00Z',
          createdAt: '2023-08-15T14:20:00Z'
        },
        {
          id: 'user-3',
          fullName: 'Bob Johnson',
          email: 'bob@example.com',
          role: 'viewer',
          lastLogin: '2024-01-10T08:15:00Z',
          createdAt: '2023-12-01T11:30:00Z'
        }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setUpdating(userId);
    try {
      // TODO: API Integration
      // Call the '/iam-system' Edge Function
      // await supabase.functions.invoke('iam-system', {
      //   body: { targetUserId: userId, newRole },
      // });
      
      console.log(`Updating user ${userId} role to ${newRole}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update UI optimistically
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Error updating role:', error);
      setError('Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <Crown size={16} className="text-red-400" />;
      case 'editor':
        return <Edit size={16} className="text-blue-400" />;
      case 'viewer':
        return <Eye size={16} className="text-green-400" />;
      default:
        return <Shield size={16} className="text-gray-400" />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'editor':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'viewer':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-400">Loading users...</span>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Users size={24} />
          Identity & Access Management
        </h3>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-300 font-medium">User</th>
              <th className="pb-3 text-gray-300 font-medium">Role</th>
              <th className="pb-3 text-gray-300 font-medium">Last Login</th>
              <th className="pb-3 text-gray-300 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-700/50">
                <td className="py-4 pr-4">
                  <div>
                    <div className="font-medium text-white">{user.fullName}</div>
                    <div className="text-sm text-gray-400">{user.email}</div>
                  </div>
                </td>
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-2">
                    {getRoleIcon(user.role)}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="py-4 pr-4 text-sm text-gray-400">
                  {formatDate(user.lastLogin)}
                </td>
                <td className="py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={updating === user.id}
                    className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {updating === user.id && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-blue-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                      Updating...
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Application Settings Sub-component
const ApplicationSettings = () => {
  const [settings, setSettings] = useState({
    auto_publish: false,
    queue_processing: true,
    image_compression: true,
    max_image_size: 50,
    notification_emails: true,
    maintenance_mode: false,
    public_registration: false,
    project_approval_required: true
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // TODO: API Integration
      // Call getSettings() from supabase-module.js
      console.log('Fetching settings...');
    } catch (error) {
      console.error('Error fetching settings:', error);
      setError('Failed to load settings');
    }
  };

  const handleSettingChange = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    setSaving(true);
    try {
      // TODO: API Integration
      // Debounced call to '/settings-management' Edge Function
      console.log(`Saving setting: ${key} = ${value}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error saving setting:', error);
      setError('Failed to save setting');
    } finally {
      setSaving(false);
    }
  };

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      // TODO: API Integration
      // Call updateSetting for all settings
      console.log('Saving all settings:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const SettingToggle = ({ key, label, description, icon: Icon }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-700/50 last:border-b-0">
      <div className="flex items-start gap-3">
        <Icon size={20} className="text-gray-400 mt-1 flex-shrink-0" />
        <div>
          <label className="font-medium text-white">{label}</label>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={settings[key]}
          onChange={(e) => handleSettingChange(key, e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  const SettingInput = ({ key, label, description, type = 'text', icon: Icon, ...props }) => (
    <div className="py-4 border-b border-gray-700/50 last:border-b-0">
      <div className="flex items-start gap-3 mb-3">
        <Icon size={20} className="text-gray-400 mt-1 flex-shrink-0" />
        <div>
          <label className="font-medium text-white">{label}</label>
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        </div>
      </div>
      <input
        type={type}
        value={settings[key]}
        onChange={(e) => handleSettingChange(key, type === 'number' ? parseInt(e.target.value) : e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...props}
      />
    </div>
  );

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Settings size={24} />
          Application Settings
        </h3>
        <button
          onClick={saveAllSettings}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save All
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="flex items-center gap-2 text-red-400">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="space-y-1">
        <SettingToggle
          key="auto_publish"
          label="Auto-Publish New Projects"
          description="When enabled, projects set to 'published' will be added to the site immediately instead of going to the queue."
          icon={Globe}
        />

        <SettingToggle
          key="queue_processing"
          label="Background Queue Processing"
          description="Enable background processing for image optimization, notifications, and other tasks."
          icon={Clock}
        />

        <SettingToggle
          key="image_compression"
          label="Automatic Image Compression"
          description="Automatically compress large images to optimize performance and reduce storage costs."
          icon={Database}
        />

        <SettingInput
          key="max_image_size"
          label="Maximum Image Size (MB)"
          description="Maximum file size allowed for image uploads."
          type="number"
          min="1"
          max="100"
          icon={Database}
        />

        <SettingToggle
          key="notification_emails"
          label="Email Notifications"
          description="Send email notifications for project updates, queue completions, and system alerts."
          icon={Bell}
        />

        <SettingToggle
          key="maintenance_mode"
          label="Maintenance Mode"
          description="Enable maintenance mode to temporarily disable public access to the site."
          icon={Lock}
        />

        <SettingToggle
          key="public_registration"
          label="Public User Registration"
          description="Allow new users to register accounts without admin approval."
          icon={Users}
        />

        <SettingToggle
          key="project_approval_required"
          label="Project Approval Required"
          description="Require admin approval before projects are published to the public site."
          icon={Shield}
        />
      </div>
    </div>
  );
};

// Dashboard Authentication Sub-component
const DashboardAuth = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
    twoFactorEnabled: false
  });
  const [saving, setSaving] = useState(false);

  const handleSaveCredentials = async () => {
    setSaving(true);
    try {
      // TODO: API Integration
      // Update dashboard authentication credentials
      console.log('Saving dashboard credentials:', credentials);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error saving credentials:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Key size={24} />
        Dashboard Authentication
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Username
          </label>
          <input
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter dashboard username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter dashboard password"
          />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <label className="font-medium text-white">Two-Factor Authentication</label>
            <p className="text-sm text-gray-400">Add an extra layer of security to dashboard access</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={credentials.twoFactorEnabled}
              onChange={(e) => setCredentials({ ...credentials, twoFactorEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <button
          onClick={handleSaveCredentials}
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving...
            </>
          ) : (
            <>
              <Save size={16} />
              Save Credentials
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Main Settings View
const SettingsView = () => {
  const [activeTab, setActiveTab] = useState('iam');

  const tabs = [
    { id: 'iam', label: 'IAM', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'auth', label: 'Authentication', icon: Key }
  ];

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">System Settings</h1>
          <p className="text-gray-400">Manage users, application settings, and system configuration</p>
        </header>

        {/* Tab Navigation */}
        <div className="border-b border-gray-700 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'iam' && <RoleManager />}
          {activeTab === 'settings' && <ApplicationSettings />}
          {activeTab === 'auth' && <DashboardAuth />}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;

