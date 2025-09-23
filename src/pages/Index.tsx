import { ASRApp } from "@/components/ASRApp";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <ASRApp />
      <Toaster />
    </div>
  );
};

export default Index;
