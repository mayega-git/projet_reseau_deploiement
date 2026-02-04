'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import GroupCard from './GroupCard';
import type { DiscussionGroup } from '@/types/forum';
import { createGroup } from '@/actions/forum';
import { api } from '@/lib/FetchFromForum';

interface GroupsListProps {
  initialGroups: DiscussionGroup[];
  onGroupClick: (group: DiscussionGroup) => void;
  onGroupsUpdate: () => void;
}

export default function GroupsList({ initialGroups, onGroupClick, onGroupsUpdate }: GroupsListProps) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user?.id) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      setError(null);
      await createGroup(
        formData.get('name') as string,
        formData.get('description') as string,
        user.id
      );
      setShowForm(false);
      form.reset();
      onGroupsUpdate();
    } catch (err) {
      setError('Erreur lors de la création du forum');
    }
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="h2-bold text-black-500">Forums de discussion</h2>
          <p className="paragraph-medium-normal text-black-300">Rejoignez une communauté et partagez vos connaissances.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-6 py-3 bg-primary-purple-600 text-black-500 rounded-lg hover:bg-primary-purple-700 transition-all font-semibold shadow-sm hover:shadow-md"
        >
          <Plus className="w-5 h-5" />
          Creer un forum
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-grey-50 rounded-2xl border border-grey-200 p-8 mb-10 shadow-inner animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="h4-bold text-black-800 mb-6">Nouveau Forum</h3>
          {error && <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">{error}</div>}

          <div className="mb-4">
            <label className="form-label mb-2 block text-black-500">Nom du forum</label>
            <input
              type="text"
              name="name"
              placeholder="Ex: Passion Jardinage"
              required
              className="custom-input"
            />
          </div>

          <div className="mb-8">
            <label className="form-label mb-2 block text-black-500">Description</label>
            <textarea
              name="description"
              placeholder="Décrivez brièvement le but de ce forum..."
              required
              rows={4}
              className="custom-input h-auto py-3 min-h-[100px]"
            />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="px-8 py-2.5 bg-primary-purple-600 text-black-300 rounded-lg hover:bg-primary-purple-700 font-semibold shadow-sm transition-all">
              Soumettre
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-8 py-2.5 bg-white border border-grey-300 text-black-500 rounded-lg hover:bg-grey-50 font-medium transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-6">
        {initialGroups.map((group) => (
          <GroupCard key={group.groupId} group={group} onClick={() => onGroupClick(group)} />
        ))}
        {initialGroups.length === 0 && (
          <div className="text-center py-20 bg-grey-50 rounded-2xl border border-dashed border-grey-300">
            <p className="text-black-200 paragraph-medium-normal italic">Aucun forum n'est disponible pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}