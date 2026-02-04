'use client';

import React, { useEffect, useState } from 'react';
import HeaderWrapper from '@/components/Header/HeaderWrapper';
import Footer from '@/components/Footer';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  fetchLecteurPreferences,
  fetchNewsletterCategories,
  updateLecteurCategories,
} from '@/actions/newsletter';
import type { NewsletterCategory } from '@/types/newsletter';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';

const NewsletterCategoriesPage = () => {
  const [lecteurId, setLecteurId] = useState<string>('');
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const storedId = localStorage.getItem('newsletterLecteurId') || '';
    setLecteurId(storedId);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!lecteurId) {
        setLoading(false);
        return;
      }

      const [allCategories, preferences] = await Promise.all([
        fetchNewsletterCategories(),
        fetchLecteurPreferences(lecteurId),
      ]);
      setCategories(allCategories);
      const initialIds =
        preferences?.categories
          ?.map((category) => category?.id)
          .filter(Boolean) || [];
      setSelectedIds(initialIds as string[]);
      setLoading(false);
    };

    loadData();
  }, [lecteurId]);

  const toggleCategory = (categoryId: string) => {
    if (selectedIds.includes(categoryId)) {
      if (selectedIds.length === 1) {
        GlobalNotifier(
          'Au moins une categorie doit rester selectionnee.',
          'warning'
        );
        return;
      }
      setSelectedIds(selectedIds.filter((id) => id !== categoryId));
    } else {
      setSelectedIds([...selectedIds, categoryId]);
    }
  };

  const handleSave = async () => {
    if (!lecteurId) {
      GlobalNotifier('Compte lecteur introuvable.', 'error');
      return;
    }

    if (selectedIds.length === 0) {
      GlobalNotifier('Selectionne au moins une categorie.', 'warning');
      return;
    }

    setSaving(true);
    const result = await updateLecteurCategories(lecteurId, selectedIds);
    setSaving(false);

    if (!result) {
      GlobalNotifier('Mise a jour impossible.', 'error');
      return;
    }

    GlobalNotifier('Categories mises a jour.', 'success');
  };

  return (
    <div className="w-full flex flex-col justify-between min-h-screen">
      <HeaderWrapper />
      <div className="container py-8 flex-1">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <SidebarPageHeading
            title="Modifier mes categories"
            subtitle="Gere les categories auxquelles tu es abonne."
          />
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Enregistrer'}
          </Button>
        </div>

        {loading ? (
          <p className="paragraph-medium-normal text-black-300 mt-6">
            Chargement...
          </p>
        ) : !lecteurId ? (
          <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-4">
            <p className="paragraph-small-normal text-black-300">
              Aucun compte lecteur detecte. Abonne-toi a une newsletter pour
              activer les preferences.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <div className="flex items-center justify-between text-sm text-black-300 mb-4">
              <p>Selectionne tes categories</p>
              <p>{selectedIds.length} / {categories.length} categories</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
                const isSelected = category.id
                  ? selectedIds.includes(category.id)
                  : false;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => category.id && toggleCategory(category.id)}
                    className={cn(
                      'border rounded-xl p-4 text-left transition',
                      isSelected
                        ? 'border-primaryPurple-500 bg-primaryPurple-50'
                        : 'border-grey-200 hover:border-primaryPurple-300'
                    )}
                  >
                    <p className="paragraph-medium-medium">
                      {category.nom || 'Sans nom'}
                    </p>
                    {category.description && (
                      <p className="paragraph-small-normal text-black-300 mt-1">
                        {category.description}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewsletterCategoriesPage;
