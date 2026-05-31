import { Loader2 } from 'lucide-react';

const FetchLoading = () => {
  return (
    <div className="m-auto flex h-full flex-col items-center justify-center">
      در حال دریافت اطلاعات، لطفا منتظر بمانید...
      <Loader2 className="animate-spin" />
    </div>
  );
};

export default FetchLoading;
