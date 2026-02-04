'use client';

import { Check, X, Trash2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import type { DiscussionGroup } from '@/types/forum';
import { validateGroup, rejectGroup, deleteGroup } from '@/actions/forum';

interface AdminViewProps {
  groups: DiscussionGroup[];
  onBack: () => void;
  onUpdate: () => void;
}

export default function AdminView({ groups, onBack, onUpdate }: AdminViewProps) {
  const handleValidate = async (groupId: string) => {
    try {
      await validateGroup(groupId);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la validation:', err);
    }
  };

  const handleReject = async (groupId: string) => {
    //if (!confirm('Êtes-vous sûr de vouloir rejeter ce forum ?')) return;

    try {
      await rejectGroup(groupId);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors du rejet:', err);
      alert('Erreur lors du rejet du forum. Vérifiez la console pour plus de détails.');
    }
  };

  const handleDelete = async (groupId: string) => {
    const message = 'Êtes-vous sûr de vouloir supprimer définitivement ce forum ? Cette action est irréversible.';
    if (!confirm(message)) return;

    try {
      await deleteGroup(groupId);
      onUpdate();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
    }
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="h2-bold text-black-500">Administration du Forum</h2>
          <p className="paragraph-medium-normal text-black-300">Gérez les demandes de forums et les discussions.</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-grey-100 text-black-500 rounded-lg hover:bg-grey-200 transition-colors font-medium border border-grey-200"
        >
          Retour aux forums
        </button>
      </div>

      <div className="grid gap-6">
        {groups.map((group) => (
          <div key={group.groupId} className="bg-white rounded-2xl border border-grey-200 p-8 shadow-sm hover:shadow-md transition-all">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h3 className="h5-bold text-black-500">{group.name}</h3>
                  <StatusBadge status={group.status} />
                </div>
                <p className="paragraph-medium-normal text-black-400 mb-4">{group.description}</p>
                <div className="flex items-center gap-2 text-sm text-black-200">
                  <span className="font-medium">Créé le</span>
                  <span>{group.createdAt || group.creationDate ? new Date(group.createdAt || group.creationDate!).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date inconnue'}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {group.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleValidate(group.groupId)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 font-medium transition-colors"
                      title="Valider le forum"
                    >
                      <Check className="w-4 h-4" />
                      Valider
                    </button>
                    <button
                      onClick={() => handleReject(group.groupId)}
                      className="px-4 py-2 bg-secondaryOrange-500 text-white rounded-lg hover:bg-secondaryOrange-600 flex items-center gap-2 font-medium transition-colors"
                      title="Rejeter le forum"
                    >
                      <X className="w-4 h-4" />
                      Rejeter
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDelete(group.groupId)}
                  className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 font-medium transition-colors"
                  title="Supprimer définitivement"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="text-center py-20 bg-grey-50 rounded-2xl border border-dashed border-grey-300">
            <p className="text-black-200 paragraph-medium-normal italic">Aucun forum à gérer pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}