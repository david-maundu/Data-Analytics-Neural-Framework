
import React from 'react';

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: "24",
  height: "24",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export const Brain: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.97-3.44 2.5 2.5 0 0 1-1.6-4.28 2.5 2.5 0 0 1 1.6-4.28 2.5 2.5 0 0 1 2.97-3.44A2.5 2.5 0 0 1 9.5 2Z" />
    <path d="M14.5 2a2.5 2.5 0 0 0-2.5 2.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.97-3.44 2.5 2.5 0 0 0 1.6-4.28 2.5 2.5 0 0 0-1.6-4.28 2.5 2.5 0 0 0-2.97-3.44A2.5 2.5 0 0 0 14.5 2Z" />
  </svg>
);

export const TrendingUp: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
    <polyline points="16 7 22 7 22 13" />
  </svg>
);

export const AlertCircle: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="10" />
    <line x1="12" x2="12" y1="8" y2="12" />
    <line x1="12" x2="12.01" y1="16" y2="16" />
  </svg>
);

export const HelpCircle: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

export const CheckCircle: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <path d="m9 11 3 3L22 4" />
  </svg>
);

export const Plus: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

export const Minus: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M5 12h14" />
  </svg>
);

export const RotateCcw: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
);

export const X: React.FC<{className?: string}> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const Sun: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="m6.34 17.66-1.41 1.41" />
    <path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export const Moon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const Settings2: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M20 7h-9" />
    <path d="M14 17H5" />
    <circle cx="17" cy="17" r="3" />
    <circle cx="7" cy="7" r="3" />
  </svg>
);

export const SlidersHorizontal: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
    <svg {...iconProps} className={className}>
      {title && <title>{title}</title>}
      <line x1="21" x2="14" y1="4" y2="4" />
      <line x1="10" x2="3" y1="4" y2="4" />
      <line x1="21" x2="12" y1="12" y2="12" />
      <line x1="8" x2="3" y1="12" y2="12" />
      <line x1="21" x2="16" y1="20" y2="20" />
      <line x1="12" x2="3" y1="20" y2="20" />
      <line x1="14" x2="14" y1="2" y2="6" />
      <line x1="8" x2="8" y1="10" y2="14" />
      <line x1="16" x2="16" y1="18" y2="22" />
    </svg>
);


export const PlusCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8" />
    <path d="M12 8v8" />
  </svg>
);

export const BarChart3: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="M3 3v18h18" />
    <path d="M18 17V9" />
    <path d="M13 17V5" />
    <path d="M8 17v-3" />
  </svg>
);

export const ChevronDown: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const Zap: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg {...iconProps} className={className}>
    {title && <title>{title}</title>}
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

export const Sparkles: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="m12 8-2 4 2 4 2-4-2-4Z" />
    <path d="M8 12h8" />
  </svg>
);

export const Save: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
);

export const Trash2: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
);

export const Columns: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="12" x2="12" y1="3" y2="21" /></svg>
);

export const Share2: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" /></svg>
);

export const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);

export const ArrowUpRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><line x1="7" x2="17" y1="17" y2="7" /><polyline points="17 17 17 7 7 7" /></svg>
);

export const ArrowDownRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><line x1="7" x2="17" y1="7" y2="17" /><polyline points="17 7 17 17 7 17" /></svg>
);

export const Pin: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg {...iconProps} className={className}>
    {title && <title>{title}</title>}
    <path d="M12 17v5" />
    <path d="M9 10.76A5 5 0 0 1 15.24 7a5 5 0 0 1 1.76 4" />
    <path d="M15 14H9" />
    <path d="m16 9 5 5" />
    <path d="M2 12h7" />
  </svg>
);

export const Crosshair: React.FC<{ className?: string; title?: string }> = ({ className, title }) => (
  <svg {...iconProps} className={className}>
    {title && <title>{title}</title>}
    <circle cx="12" cy="12" r="10" />
    <line x1="22" x2="18" y1="12" y2="12" />
    <line x1="6" x2="2" y1="12" y2="12" />
    <line x1="12" x2="12" y1="6" y2="2" />
    <line x1="12" x2="12" y1="22" y2="18" />
  </svg>
);

export const EyeOff: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" /><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" /><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
);
