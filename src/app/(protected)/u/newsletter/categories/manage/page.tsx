'use client';

import React, { useEffect, useState } from 'react';
import { MoreHorizontal, Plus, Trash2, PencilLine } from 'lucide-react';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState/EmptyState';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TextArea from '@/components/ui/textarea';
import {
  createNewsletterCategory,
  deleteNewsletterCategory,
  fetchNewsletterCategories,
  updateNewsletterCategory,
} from '@/lib/FetchNewsletterData';
import type { NewsletterCategory } from '@/types/newsletter';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const emptyForm = {
  nom: '',
  description: '',
};

type FormMode = 'create' | 'edit';

const ManageNewsletterCategories = () => {
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('create');
  const [formData, setFormData] = useState(emptyForm);
  const [activeCategory, setActiveCategory] = useState<NewsletterCategory | null>(
    null
  );
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    const data = await fetchNewsletterCategories();
    setCategories(data);
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateDialog = () => {
    setFormMode('create');
    setFormData(emptyForm);
    setActiveCategory(null);
    setFormOpen(true);
  };

  const openEditDialog = (category: NewsletterCategory) => {
    setFormMode('edit');
    setActiveCategory(category);
    setFormData({
      nom: category.nom || '',
      description: category.description || '',
    });
    setFormOpen(true);
  };

  const openDeleteDialog = (category: NewsletterCategory) => {
    setActiveCategory(category);
    setDeleteOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    if (!open) {
      setFormData(emptyForm);
      setActiveCategory(null);
    }
    setFormOpen(open);
  };

  const handleDeleteOpenChange = (open: boolean) => {
    if (!open) {
      setActiveCategory(null);
    }
    setDeleteOpen(open);
  };

  const handleFormChange = (
    key: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.nom.trim()) {
      GlobalNotifier('Le nom est requis.', 'warning');
      return;
    }
    if (!formData.description.trim()) {
      GlobalNotifier('La description est requise.', 'warning');
      return;
    }

    setSaving(true);
    let result: NewsletterCategory | null = null;

    try {
      if (formMode === 'create') {
        result = await createNewsletterCategory({
          nom: formData.nom,
          description: formData.description,
        });
      } else if (activeCategory?.id) {
        result = await updateNewsletterCategory(activeCategory.id, {
          nom: formData.nom,
          description: formData.description,
        });
      }

      if (!result) {
        throw new Error('Operation returned null');
      }

      GlobalNotifier('Categorie enregistree.', 'success');
      setFormOpen(false);
      setFormData(emptyForm);
      setActiveCategory(null);
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      GlobalNotifier('Operation impossible.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!activeCategory?.id) {
      setDeleteOpen(false);
      return;
    }

    const categoryId = activeCategory.id;
    setDeleting(true);
    const success = await deleteNewsletterCategory(categoryId);
    setDeleting(false);

    if (!success) {
      GlobalNotifier('Suppression impossible.', 'error');
      return;
    }

    GlobalNotifier('Categorie supprimee.', 'success');
    setDeleteOpen(false);
    setActiveCategory(null);
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <SidebarPageHeading
          title="Newsletter Categories"
          subtitle="Create, update and delete newsletter categories"
        />
        <Button onClick={openCreateDialog} className="w-fit">
          <Plus className="h-4 w-4" />
          Create new Category
        </Button>
      </div>

      {loading ? (
        <p className="paragraph-medium-normal text-black-300">Chargement...</p>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center gap-6">
          <EmptyState />
          <Button onClick={openCreateDialog} className="w-fit">
            <Plus className="h-4 w-4" />
            Create new Category
          </Button>
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-start w-[30%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Name
                </th>
                <th className="text-start w-[55%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Description
                </th>
                <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr
                  key={category.id || index}
                  className={
                    index === categories.length - 1
                      ? 'rounded-b-[20px]'
                      : ''
                  }
                >
                  <td className="text-start w-[30%] paragraph-xmedium-normal px-4 py-3 border-b">
                    {category.nom || '-'}
                  </td>
                  <td className="text-start w-[55%] paragraph-xmedium-normal px-4 py-3 border-b">
                    {category.description || '-'}
                  </td>
                  <td className="text-start w-[15%] paragraph-xmedium-normal px-4 py-3 border-b">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel className="paragraph-medium-medium">
                          Actions
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(category)}
                          className="gap-2"
                        >
                          <PencilLine className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openDeleteDialog(category)}
                          className="gap-2 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={formOpen} onOpenChange={handleFormOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {formMode === 'create'
                ? 'Create Newsletter Category'
                : 'Edit Newsletter Category'}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="newsletter-category-name" className="form-label">
                Name
              </label>
              <input
                id="newsletter-category-name"
                type="text"
                value={formData.nom}
                onChange={(event) => handleFormChange('nom', event.target.value)}
                className="custom-input"
              />
            </div>
            <div>
              <label
                htmlFor="newsletter-category-description"
                className="form-label"
              >
                Description
              </label>
              <TextArea
                id="newsletter-category-description"
                value={formData.description}
                height="80px"
                maxWords={50}
                onChange={(value) => handleFormChange('description', value)}
              />
            </div>
          </div>
          <DialogFooter className="mt-4 justify-end gap-2">
            <Button variant="outline" onClick={() => handleFormOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteOpen} onOpenChange={handleDeleteOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
          </DialogHeader>
          <p className="paragraph-small-normal text-black-300">
            Are you sure you want to delete this category?
          </p>
          <DialogFooter className="mt-4 justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => handleDeleteOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageNewsletterCategories;