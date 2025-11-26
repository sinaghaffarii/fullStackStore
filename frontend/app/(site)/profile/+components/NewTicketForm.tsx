/* eslint-disable max-lines */
'use client';

import { Upload, X } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectItem } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface NewTicketFormProps {
  onSubmit: (data: {
    subject: string;
    department: string;
    message: string;
    files: File[];
  }) => Promise<void>;
  onCancel: () => void;
}

const departments = [
  { value: 'technical', label: 'پشتیبانی فنی' },
  { value: 'financial', label: 'امور مالی' },
  { value: 'product', label: 'محصولات' },
  { value: 'other', label: 'سایر موارد' },
];

export const NewTicketForm = ({ onSubmit, onCancel }: NewTicketFormProps) => {
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ subject, department, message, files });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <Label className="mb-2 block text-sm font-medium text-gray-700">
          موضوع تیکت <span className="text-red-600">*</span>
        </Label>
        <input
          required
          className="w-full rounded-lg border border-gray-200 px-4 py-2 focus:ring-2 focus:ring-rose-500 focus:outline-none"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="عنوان مشکل یا سوال خود را وارد کنید"
        />
      </div>

      <div className="space-y-2">
        <Label className="block text-sm font-medium text-gray-700">
          دپارتمان <span className="text-red-600">*</span>
        </Label>
        <Select
          className="w-full"
          value={department}
          // onChange={(e) => setDepartment(e.target.value)}
        >
          {departments.map((dept) => (
            <SelectItem key={dept.value} value={dept.value}>
              {dept.label}
            </SelectItem>
          ))}
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium text-gray-700">
          متن پیام <span className="text-red-600">*</span>
        </Label>
        <Textarea
          required
          className="w-full resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="توضیحات کامل خود را بنویسید..."
          rows={6}
        />
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium text-gray-700">
          پیوست فایل (اختیاری)
        </Label>
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center transition-colors hover:border-rose-300">
          <input
            multiple
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
            id="file-upload"
            type="file"
            onChange={handleFileChange}
          />
          <label
            className="flex cursor-pointer flex-col items-center gap-2"
            htmlFor="file-upload"
          >
            <Upload className="size-8 text-gray-400" />
            <span className="text-sm text-gray-600">
              فایل‌های خود را انتخاب کنید
            </span>
            <span className="text-xs text-gray-400">
              حداکثر 5 فایل، هر کدام تا 2MB
            </span>
          </label>
        </div>

        {files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((file, index) => (
              <div
                className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2 text-sm"
                key={index}
              >
                <span className="text-gray-700">{file.name}</span>
                <button
                  className="text-red-600 hover:text-red-700"
                  type="button"
                  onClick={() =>
                    setFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  <X className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          className="flex-1 bg-rose-600 hover:bg-rose-700"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? 'در حال ارسال...' : 'ارسال تیکت'}
        </Button>
        <Button
          className="flex-1"
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          انصراف
        </Button>
      </div>
    </form>
  );
};
