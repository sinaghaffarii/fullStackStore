'use client';

import { Download, FileText, Loader2, Table } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { Button } from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

export function ExportButton() {
  const [loading, setLoading] = useState(false);

  const handleExportPDF = async () => {
    try {
      setLoading(true);

      const element = document.getElementById('analytics-report');
      if (!element) {
        toast.error('خطا: محتوای گزارش پیدا نشد');
        return;
      }

      const rect = element.getBoundingClientRect();

      if (rect.width === 0 || rect.height === 0) {
        toast.error('خطا: المنت گزارش خالی است');
        return;
      }

      const { toPng } = await import('html-to-image');
      const { default: jsPDF } = await import('jspdf');

      const imgData = await toPng(element, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        cacheBust: true,
        skipFonts: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
      });

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const img = new Image();
      img.src = imgData;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('خطا در بارگذاری تصویر'));
      });

      const margin = 10;
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (img.height * imgWidth) / img.width;

      if (imgHeight > pageHeight - 2 * margin) {
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      } else {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      }

      const fileName = `گزارش-فروش-${new Date().toLocaleDateString('fa-IR')}.pdf`;
      pdf.save(fileName);

      toast.success('PDF با موفقیت ایجاد شد');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('PDF Export Error:', error);
      toast.error(
        `خطا در ایجاد PDF: ${error instanceof Error ? error.message : 'خطای نامشخص'}`,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const data = [
        ['ماه', 'درآمد', 'سفارشات'],
        ['فروردین', '4200000', '120'],
        ['اردیبهشت', '3800000', '98'],
        ['خرداد', '5100000', '145'],
      ];

      const csv = data.map((row) => row.join(',')).join('\n');
      const blob = new Blob([`\uFEFF${csv}`], {
        type: 'text/csv;charset=utf-8',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `گزارش-فروش-${new Date().toLocaleDateString('fa-IR')}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.success('CSV با موفقیت ایجاد شد');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('CSV Export Error:', error);
      toast.error('خطا در ایجاد CSV');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={loading} variant="outline">
          {loading ? (
            <Loader2 className="ml-2 size-4 animate-spin" />
          ) : (
            <Download className="ml-2 size-4" />
          )}
          خروجی
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="bottom">
        <DropdownMenuItem disabled={loading} onClick={handleExportPDF}>
          <FileText className="ml-2 size-4" />
          دانلود PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>
          <Table className="ml-2 size-4" />
          دانلود CSV
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
