import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import UserProfile from '../../entities/user/ui/UserProfile';
import ComplaintForm from '../../features/complaints/ComplaintForm';
import MyComplaints from '../../widgets/MyComplaints';

export default function ProfilePage() {
  const [tab, setTab] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Profile
          </h1>
          <p className="text-lg text-gray-600">
            View and manage your account information
          </p>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow-sm">
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            centered
            data-testid="profile-tabs"
          >
            <Tab label="Account" data-testid="tab-account" />
            <Tab label="File a complaint" data-testid="tab-complaint-new" />
            <Tab label="My complaints" data-testid="tab-complaint-list" />
          </Tabs>
        </div>

        {tab === 0 && <UserProfile />}
        {tab === 1 && (
          <ComplaintForm onSuccess={() => setRefreshKey((k) => k + 1)} />
        )}
        {tab === 2 && <MyComplaints key={refreshKey} />}
      </div>
    </div>
  );
}
