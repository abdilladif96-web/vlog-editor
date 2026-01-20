import { Sidebar } from "@/components/Sidebar";
import { VideoPreview } from "@/components/VideoPreview";
import { ChatInterface } from "@/components/ChatInterface";

export default function Home() {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex">
        <VideoPreview />
        <ChatInterface />
      </div>
    </div>
  );
}
