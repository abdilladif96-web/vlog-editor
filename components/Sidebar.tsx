import { Home, Settings, Video, FolderOpen } from 'lucide-react';
import Link from 'next/link';

export function Sidebar() {
  return (
    <div className="w-16 md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full text-zinc-400">
      <div className="p-4 flex items-center gap-2 border-b border-zinc-800 h-16">
        <Video className="w-6 h-6 text-blue-500" />
        <span className="font-bold text-white hidden md:block">VlogAI</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
              <Home className="w-5 h-5" />
              <span className="hidden md:block">Home</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md bg-zinc-800 text-white transition-colors">
              <FolderOpen className="w-5 h-5" />
              <span className="hidden md:block">Projects</span>
            </Link>
          </li>
          <li>
            <Link href="#" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-zinc-800 hover:text-white transition-colors">
              <Settings className="w-5 h-5" />
              <span className="hidden md:block">Settings</span>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-zinc-800">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                U
            </div>
            <div className="hidden md:block">
                <p className="text-sm font-medium text-white">User</p>
                <p className="text-xs">Pro Plan</p>
            </div>
        </div>
      </div>
    </div>
  );
}
