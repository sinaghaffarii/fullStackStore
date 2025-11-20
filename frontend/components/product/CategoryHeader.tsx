'use client';

interface CategoryHeaderProps {
  title: string;
  description: string;
}

export function CategoryHeader({ title, description }: CategoryHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
