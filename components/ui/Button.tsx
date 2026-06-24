'use client';

import Link from 'next/link';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline';

interface BaseProps {
  variant?: Variant;
  size?: 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

interface ButtonAsLink extends BaseProps {
  href: string;
  onClick?: () => void;
}

interface ButtonAsButton
  extends BaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children'> {
  href?: undefined;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-rust text-white hover:bg-rustDark border border-rust hover:border-rustDark',
  secondary:
    'bg-rust text-white hover:bg-rustDark border border-rust hover:border-rustDark',
  outline:
    'bg-transparent text-rust border border-rust hover:bg-ink hover:text-white hover:border-ink',
};

const sizeClasses = {
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

const baseClasses =
  'inline-flex items-center justify-center rounded-full font-sans font-medium tracking-wide transition-colors duration-300 ease-out';

export default function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = 'primary', size = 'md', children, className = '' } = props;
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if ('href' in props && props.href) {
    return (
      <Link href={props.href} onClick={props.onClick} className={classes}>
        {children}
      </Link>
    );
  }

  const { variant: _v, size: _s, children: _c, className: _cl, href, ...rest } =
    props as ButtonAsButton;

  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
