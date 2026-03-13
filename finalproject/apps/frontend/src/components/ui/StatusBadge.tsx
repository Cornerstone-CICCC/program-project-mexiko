interface StatusBadgeProps {
    variant: 'success' | 'inactive' | 'pending' | 'reviewing' | 'resolved' | 'mbti';
    children: React.ReactNode;
  }
  
  const styles = {
    success: 'bg-green-100 text-green-700',
    inactive: 'bg-slate-100 text-slate-600',
    pending: 'bg-amber-100 text-amber-700',
    reviewing: 'bg-blue-100 text-blue-700',
    resolved: 'bg-green-100 text-green-700',
    mbti: 'bg-indigo-100 text-indigo-700',
  };
  
  export default function StatusBadge({ variant, children }: StatusBadgeProps) {
    return (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]}`}
      >
        {children}
      </span>
    );
  }