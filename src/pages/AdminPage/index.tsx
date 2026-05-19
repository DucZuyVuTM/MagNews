import { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import AdminPublications from '../../widgets/Admin/AdminPublications';
import AdminSubscriptionBlock from '../../widgets/Admin/AdminSubscriptionBlock';
import AdminComplaints from '../../widgets/Admin/AdminComplaints';
import AdminModeration from '../../widgets/Admin/AdminModeration';

export default function AdminPage() {
  const [tab, setTab] = useState(0);

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Manage publications, complaints, and subscriptions
          </p>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow-sm">
          <Tabs
            value={tab}
            onChange={(_, value) => setTab(value)}
            centered
            data-testid="admin-tabs"
          >
            <Tab label="Moderation" data-testid="admin-tab-moderation" />
            <Tab label="Publications" data-testid="admin-tab-pubs" />
            <Tab label="Complaints" data-testid="admin-tab-complaints" />
            <Tab label="Block subscription" data-testid="admin-tab-block" />
          </Tabs>
        </div>

        {tab === 0 && <AdminModeration />}
        {tab === 1 && <AdminPublications />}
        {tab === 2 && <AdminComplaints />}
        {tab === 3 && <AdminSubscriptionBlock />}
      </div>
    </div>
  );
}
