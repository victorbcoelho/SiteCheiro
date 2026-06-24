interface ImagePlaceholderProps {
  className?: string;
  label?: string;
}

export default function ImagePlaceholder({ className = '', label }: ImagePlaceholderProps) {
  return (
    <div className={`bg-sand/40 flex flex-col items-center justify-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 40 40"
        className="h-10 w-10 text-ink/20"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="2" width="36" height="36" rx="4" />
        <path d="M8 8l24 24M32 8L8 32" />
      </svg>
      {label && <p className="text-xs text-ink/30">{label}</p>}
    </div>
  );
}
