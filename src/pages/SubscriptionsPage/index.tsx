import MySubscriptions from '../../entities/subscriptions/ui/MySubscriptions';

export default function SubscriptionsPage() {
  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            My Subscriptions
          </h1>
          <p className="text-lg text-gray-600">
            Manage your active subscriptions
          </p>
        </div>

        <MySubscriptions />
      </div>
    </div>
  );
}
