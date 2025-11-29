import { PerformanceInsights } from '@/components/dashboard/PerformanceInsights';
import { PromoBanner } from '@/components/dashboard/PromoBanner';
import { RecentOrders } from '@/components/dashboard/RecentOrders';
import { StatsCards } from '@/components/dashboard/StatsCards';

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Promo Banner */}
        <PromoBanner
          className="md:col-span-2 lg:col-span-1"
          subtitle="عملکرد خود را بهبود بخشید!"
          title="ویژگی جدید باز کردن شد!"
          actionText="هم‌اکنون ارتقا دهید"
        />

        {/* Stats Cards - استفاده از نام آیکون به جای کامپوننت */}
        <StatsCards
          subtitle="در ۲۱ فروشگاه"
          title="فروش محصولات"
          trend={{ value: 12.5, isPositive: true }}
          value="۴۱k"
          variant="gradient"
          gradientFrom="from-blue-500/10"
          gradientTo="to-blue-600/5"
          iconName="ShoppingCart"
        />

        <StatsCards
          subtitle="محصولات ارسال شده"
          title="تعداد سفارشات"
          trend={{ value: 8.2, isPositive: true }}
          value="۳۶۴k"
          variant="gradient"
          gradientFrom="from-green-500/10"
          gradientTo="to-green-600/5"
          iconName="Package"
        />

        <StatsCards
          subtitle="در ۵ منطقه"
          title="هزار سفارش پردازش شده"
          trend={{ value: 3.1, isPositive: false }}
          value="۲.۰۷"
          variant="gradient"
          gradientFrom="from-purple-500/10"
          gradientTo="to-purple-600/5"
          iconName="TrendingUp"
        />
      </div>

      {/* Performance Insights */}
      <PerformanceInsights />

      {/* Recent Orders Table */}
      <RecentOrders />
    </div>
  );
}
