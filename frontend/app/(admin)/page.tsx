import { apiClient } from '@/lib/apiClient';

async function getDashboardStats() {
  try {
    const response = await apiClient.get('/admin/dashboard/stats');
    return response.data;
  } catch (error) {
    return {
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">داشبورد مدیریت</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">تعداد محصولات</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">تعداد سفارشات</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">تعداد کاربران</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">درآمد کل</h3>
          <p className="text-2xl font-bold">
            {stats.totalRevenue.toLocaleString()} تومان
          </p>
        </div>
      </div>
    </div>
  );
}
