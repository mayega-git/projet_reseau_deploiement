import { Check, Clock } from 'lucide-react';

export default function StatusBadge({ status }: { status: 'PENDING' | 'VALIDATED' }) {
  const styles = status === 'VALIDATED' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-yellow-100 text-yellow-800';
  
  const Icon = status === 'VALIDATED' ? Check : Clock;
  
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${styles}`}>
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}