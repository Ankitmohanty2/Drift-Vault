import { SVGProps } from 'react';

interface FolderIconProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

export default function FolderIcon({ className = "w-6 h-6", ...props }: FolderIconProps) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );
} 