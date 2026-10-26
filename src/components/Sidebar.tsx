import { Search, Grid, Shield, Activity } from 'lucide-react';

interface SidebarProps {
  activeNav: string;
  setActiveNav: (nav: string) => void;
}

export default function Sidebar({ activeNav, setActiveNav }: SidebarProps) {
  const navItems = [
    { id: 'scan', icon: Search, label: 'Scan & Analyze', badge: true },
    { id: 'batch', icon: Grid, label: 'Batch Processing' },
    { id: 'manifest', icon: Shield, label: 'C2PA Manifest Viewer' },
    { id: 'logs', icon: Activity, label: 'AI Observability Logs' },
  ];

  return (
    <div className="w-64 bg-midnight-light border-r border-slate-dark-light h-full flex flex-col">
      {/* Logo & Header */}
      <div className="p-6 border-b border-slate-dark-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-bright to-emerald-bright rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-midnight" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">VerifyAI</h1>
            <p className="text-xs text-gray-400 font-mono">C2PA & TRUST ENGINE</p>
          </div>
        </div>
        <div className="mt-3 px-2 py-1 bg-slate-dark rounded text-xs font-mono text-emerald-bright border border-emerald-bright/30">
          v2.4
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                ${isActive 
                  ? 'bg-cyan-bright/10 border border-cyan-bright text-cyan-bright shadow-glow-cyan' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-slate-dark'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
              {item.badge && isActive && (
                <span className="px-2 py-0.5 bg-emerald-bright text-midnight text-xs font-bold rounded">
                  ACTIVE
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-dark-light">
        <div className="space-y-2 text-xs text-gray-500 font-mono">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="text-emerald-bright">● Online</span>
          </div>
          <div className="flex justify-between">
            <span>API:</span>
            <span className="text-cyan-bright">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
