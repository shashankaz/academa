import { LoaderCircle } from "lucide-react";

const Loading = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col items-center space-y-4">
          <LoaderCircle className="animate-spin rounded-full h-10 w-10" />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    </div>
  );
};

export default Loading;
