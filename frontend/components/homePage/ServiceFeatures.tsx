'use client';
import { CheckCircle, Headphones, RefreshCcw, Truck } from 'lucide-react'; // یا استفاده از عکس

const features = [
  { title: 'ارسال به کل ایران', icon: Truck },
  { title: 'ضمانت اصالت کالا', icon: CheckCircle },
  { title: 'مشاوره رایگان و تخصصی', icon: Headphones },
  { title: 'ضمانت بازگشت کالا', icon: RefreshCcw },
];

const ServiceFeatures = () => {
  return (
    <section className="mx-auto mt-10 w-11/12 max-w-7xl rounded-lg bg-white px-4 py-8 shadow-sm">
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        {features.map((item, idx) => (
          <div
            className="flex flex-col items-center justify-center gap-3 text-center"
            key={idx}
          >
            <div className="flex size-16 items-center justify-center rounded-full bg-gray-100 text-gray-500">
              <item.icon size={32} />
            </div>
            <span className="text-sm font-bold text-gray-700">
              {item.title}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceFeatures;
