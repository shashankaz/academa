import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-7xl font-bold text-foreground">404</h1>
            <p className="text-muted-foreground text-sm">Page not found</p>
            <p className="text-muted-foreground text-xs">
              The page you're looking for doesn't exist.
            </p>
          </div>
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
