interface PlaceholderProps {
  label?: string;
  className?: string;
  ratio?: 'video' | 'square' | 'portrait' | 'editorial';
}

const ratioClass: Record<NonNullable<PlaceholderProps['ratio']>, string> = {
  video: 'aspect-video',
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
  editorial: 'aspect-[3/2]',
};

// Placeholder neutro para imagens que serão substituídas em produção.
export default function Placeholder({
  label = 'imagem do produto',
  className = '',
  ratio = 'square',
}: PlaceholderProps) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-cream to-[#ece4d8] ${ratioClass[ratio]} ${className}`}
    >
      <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle_at_1px_1px,#1A1A1A_1px,transparent_0)] [background-size:22px_22px]" />
      <span className="relative z-10 text-xs uppercase tracking-[0.25em] text-ink/40">
        {label}
      </span>
    </div>
  );
}
