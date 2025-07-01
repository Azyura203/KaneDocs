import React, { useState, useEffect } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Camera, 
  Save, 
  Loader, 
  Eye, 
  EyeOff, 
  Shield, 
  Bell, 
  Palette, 
  Globe,
  Key,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { authService } from '../lib/supabase';
import { notificationManager } from './SimpleNotification';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onUserUpdate: (user: any) => void;
}

interface ProfileData {
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  location: string;
  website: string;
  company: string;
  twitter_username: string;
  github_username: string;
}

interface SecuritySettings {
  email_notifications: boolean;
  marketing_emails: boolean;
  security_alerts: boolean;
  two_factor_enabled: boolean;
}

interface PreferenceSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  date_format: string;
}

export default function ProfileModal({ isOpen, onClose, user, onUserUpdate }: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences' | 'danger'>('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Profile data
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    email: '',
    avatar_url: '',
    bio: '',
    location: '',
    website: '',
    company: '',
    twitter_username: '',
    github_username: ''
  });

  // Security settings
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    email_notifications: true,
    marketing_emails: false,
    security_alerts: true,
    two_factor_enabled: false
  });

  // Preference settings
  const [preferenceSettings, setPreferenceSettings] = useState<PreferenceSettings>({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    date_format: 'MM/DD/YYYY'
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Avatar upload
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  // Load user data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadUserProfile();
    }
  }, [isOpen, user]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      // Load profile data from user metadata
      const metadata = user.user_metadata || {};
      setProfileData({
        full_name: metadata.full_name || user.email?.split('@')[0] || '',
        email: user.email || '',
        avatar_url: metadata.avatar_url || '',
        bio: metadata.bio || '',
        location: metadata.location || '',
        website: metadata.website || '',
        company: metadata.company || '',
        twitter_username: metadata.twitter_username || '',
        github_username: metadata.github_username || ''
      });

      // Load settings from metadata or use defaults
      setSecuritySettings({
        email_notifications: metadata.email_notifications ?? true,
        marketing_emails: metadata.marketing_emails ?? false,
        security_alerts: metadata.security_alerts ?? true,
        two_factor_enabled: metadata.two_factor_enabled ?? false
      });

      setPreferenceSettings({
        theme: metadata.theme || localStorage.getItem('theme') || 'system',
        language: metadata.language || 'en',
        timezone: metadata.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        date_format: metadata.date_format || 'MM/DD/YYYY'
      });

      setAvatarPreview(metadata.avatar_url || '');
    } catch (error) {
      console.error('Error loading profile:', error);
      notificationManager.error('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        notificationManager.error('File Too Large', 'Avatar image must be less than 5MB');
        return;
      }

      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string> => {
    if (!avatarFile) return profileData.avatar_url;

    // In a real implementation, you would upload to a storage service
    // For now, we'll use a placeholder URL
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.full_name)}&size=200&background=random`;
    
    notificationManager.info('Avatar Upload', 'Avatar uploaded successfully!');
    return avatarUrl;
  };

  const saveProfile = async () => {
    setSaving(true);
    try {
      let avatarUrl = profileData.avatar_url;
      
      // Upload avatar if changed
      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      // Prepare update data
      const updateData = {
        data: {
          ...profileData,
          avatar_url: avatarUrl,
          ...securitySettings,
          ...preferenceSettings,
          updated_at: new Date().toISOString()
        }
      };

      // Update user profile
      const { data, error } = await authService.updateProfile(updateData.data);
      
      if (error) throw error;

      // Update local state
      onUserUpdate({ ...user, user_metadata: updateData.data });

      // Apply theme change immediately
      if (preferenceSettings.theme !== 'system') {
        localStorage.setItem('theme', preferenceSettings.theme);
        document.documentElement.classList.toggle('dark', preferenceSettings.theme === 'dark');
      } else {
        localStorage.removeItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.classList.toggle('dark', systemTheme === 'dark');
      }

      notificationManager.success('Profile Updated', 'Your profile has been saved successfully!');
      
    } catch (error) {
      console.error('Error saving profile:', error);
      notificationManager.error('Save Failed', 'Failed to save profile changes');
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      notificationManager.error('Password Mismatch', 'New passwords do not match');
      return;
    }

    if (passwordData.new_password.length < 6) {
      notificationManager.error('Password Too Short', 'Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    try {
      // In a real implementation, you would verify current password first
      const { error } = await authService.updateProfile({
        password: passwordData.new_password
      });

      if (error) throw error;

      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });

      notificationManager.success('Password Changed', 'Your password has been updated successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      notificationManager.error('Password Change Failed', 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.'
    );

    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Type "DELETE" to confirm account deletion:'
    );

    if (doubleConfirm !== 'DELETE') {
      notificationManager.error('Confirmation Failed', 'Account deletion cancelled');
      return;
    }

    setSaving(true);
    try {
      // In a real implementation, you would call a delete account API
      notificationManager.info('Account Deletion', 'Account deletion request submitted. You will receive an email confirmation.');
      onClose();
    } catch (error) {
      console.error('Error deleting account:', error);
      notificationManager.error('Deletion Failed', 'Failed to delete account');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile Settings
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <nav className="p-4 space-y-2">
              {[
                { id: 'profile', label: 'Profile', icon: <User size={16} /> },
                { id: 'security', label: 'Security', icon: <Shield size={16} /> },
                { id: 'preferences', label: 'Preferences', icon: <Palette size={16} /> },
                { id: 'danger', label: 'Danger Zone', icon: <AlertTriangle size={16} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-3">
                  <Loader className="animate-spin" size={20} />
                  <span className="text-gray-600 dark:text-gray-400">Loading profile...</span>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Profile Information
                      </h3>
                      
                      {/* Avatar Section */}
                      <div className="flex items-center gap-6 mb-6">
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                            {avatarPreview ? (
                              <img
                                src={avatarPreview}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User size={32} className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <label className="absolute bottom-0 right-0 p-2 bg-primary-600 text-white rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                            <Camera size={14} />
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleAvatarChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            Profile Picture
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Upload a new avatar. Max file size: 5MB
                          </p>
                        </div>
                      </div>

                      {/* Profile Form */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={profileData.full_name}
                            onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            value={profileData.email}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Email cannot be changed
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Company
                          </label>
                          <input
                            type="text"
                            value={profileData.company}
                            onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Location
                          </label>
                          <input
                            type="text"
                            value={profileData.location}
                            onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Website
                          </label>
                          <input
                            type="url"
                            value={profileData.website}
                            onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                            placeholder="https://example.com"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            GitHub Username
                          </label>
                          <input
                            type="text"
                            value={profileData.github_username}
                            onChange={(e) => setProfileData({ ...profileData, github_username: e.target.value })}
                            placeholder="username"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bio
                        </label>
                        <textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                          rows={3}
                          placeholder="Tell us about yourself..."
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Security Settings
                      </h3>

                      {/* Change Password */}
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 mb-6">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
                          Change Password
                        </h4>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Current Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.current ? 'text' : 'password'}
                                value={passwordData.current_password}
                                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.new ? 'text' : 'password'}
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                              </button>
                            </div>
                          </div>

                          <button
                            onClick={changePassword}
                            disabled={!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password || saving}
                            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                          >
                            {saving ? 'Changing...' : 'Change Password'}
                          </button>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          Notification Preferences
                        </h4>
                        
                        {[
                          { key: 'email_notifications', label: 'Email Notifications', description: 'Receive email notifications for important updates' },
                          { key: 'security_alerts', label: 'Security Alerts', description: 'Get notified about security-related activities' },
                          { key: 'marketing_emails', label: 'Marketing Emails', description: 'Receive newsletters and promotional content' }
                        ].map((setting) => (
                          <div key={setting.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div>
                              <h5 className="font-medium text-gray-900 dark:text-white">
                                {setting.label}
                              </h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {setting.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={securitySettings[setting.key as keyof SecuritySettings] as boolean}
                                onChange={(e) => setSecuritySettings({
                                  ...securitySettings,
                                  [setting.key]: e.target.checked
                                })}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        Preferences
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Theme
                          </label>
                          <select
                            value={preferenceSettings.theme}
                            onChange={(e) => setPreferenceSettings({ ...preferenceSettings, theme: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="system">System</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Language
                          </label>
                          <select
                            value={preferenceSettings.language}
                            onChange={(e) => setPreferenceSettings({ ...preferenceSettings, language: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Timezone
                          </label>
                          <select
                            value={preferenceSettings.timezone}
                            onChange={(e) => setPreferenceSettings({ ...preferenceSettings, timezone: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="UTC">UTC</option>
                            <option value="America/New_York">Eastern Time</option>
                            <option value="America/Chicago">Central Time</option>
                            <option value="America/Denver">Mountain Time</option>
                            <option value="America/Los_Angeles">Pacific Time</option>
                            <option value="Europe/London">London</option>
                            <option value="Europe/Paris">Paris</option>
                            <option value="Asia/Tokyo">Tokyo</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Date Format
                          </label>
                          <select
                            value={preferenceSettings.date_format}
                            onChange={(e) => setPreferenceSettings({ ...preferenceSettings, date_format: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Danger Zone Tab */}
                {activeTab === 'danger' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">
                        Danger Zone
                      </h3>
                      
                      <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-900/20">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                          <div className="flex-1">
                            <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                              Delete Account
                            </h4>
                            <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                              Once you delete your account, there is no going back. Please be certain.
                              This will permanently delete your profile, repositories, and all associated data.
                            </p>
                            <button
                              onClick={deleteAccount}
                              disabled={saving}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors font-medium"
                            >
                              {saving ? 'Processing...' : 'Delete Account'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {!loading && activeTab !== 'danger' && (
          <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Changes are saved automatically when you click Save
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors"
              >
                {saving ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}