import { apiClient } from '@/src/lib/apiClient';

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
      <h1 className="mb-6 text-2xl font-bold">داشبورد مدیریت</h1>

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">تعداد محصولات</h3>
          <p className="text-2xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">تعداد سفارشات</h3>
          <p className="text-2xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">تعداد کاربران</h3>
          <p className="text-2xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">درآمد کل</h3>
          <p className="text-2xl font-bold">
            {stats.totalRevenue.toLocaleString()} تومان
          </p>
        </div>
      </div>
    </div>
  );
}
