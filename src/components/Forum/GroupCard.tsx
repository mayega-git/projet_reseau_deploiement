import { ChevronRight } from 'lucide-react';
import type { DiscussionGroup } from '@/types/forum';

interface GroupCardProps {
  group: DiscussionGroup;
  onClick: () => void;
}

export default function GroupCard({ group, onClick }: GroupCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-grey-200 p-6 hover:border-secondaryOrange-200 hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="h6-bold text-black-500 group-hover:text-secondaryOrange-600 transition-colors">{group.name}</h3>
        <div className="w-8 h-8 rounded-full bg-grey-50 flex items-center justify-center group-hover:bg-secondaryOrange-50 transition-colors">
          <ChevronRight className="w-5 h-5 text-black-200 group-hover:text-secondaryOrange-500 transition-all" />
        </div>
      </div>
      <p className="paragraph-small-normal text-black-300 line-clamp-2">{group.description}</p>
      <div className="mt-4 flex items-center gap-2 text-[12px] font-inter text-black-200">
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>Créé le {group.createdAt || group.creationDate ? new Date(group.createdAt || group.creationDate!).toLocaleDateString('fr-FR') : 'Date inconnue'}</span>
      </div>
    </div>
  );
}