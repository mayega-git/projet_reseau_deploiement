'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import { useAuth } from '@/context/AuthContext';
import {
  fetchNewsletterCategories,
  registerLecteur,
  subscribeLecteurToCategories,
} from '@/lib/FetchNewsletterData';
import type { NewsletterCategory } from '@/types/newsletter';
import { cn } from '@/lib/utils';

const schema = yup.object().shape({
  email: yup.string().email('Email invalide').required('Email requis'),
  firstName: yup.string().required('First Name requis'),
  lastName: yup.string().required('Last Name requis'),
});

type FormData = yup.InferType<typeof schema>;

interface NewsletterSubscribeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefillEmail?: string;
}

const NewsletterSubscribeDialog = ({
  open,
  onOpenChange,
  prefillEmail = '',
}: NewsletterSubscribeDialogProps) => {
  const { user } = useAuth();

  const derivedEmail = useMemo(() => {
    if (user?.sub && user.sub.includes('@')) {
      return user.sub;
    }
    return prefillEmail;
  }, [prefillEmail, user?.sub]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
    },
  });

  const [step, setStep] = useState<'form' | 'categories'>('form');
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [categorySelectionError, setCategorySelectionError] = useState<
    string | null
  >(null);
  const [createdLecteurId, setCreatedLecteurId] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    setStep('form');
    setCreatedLecteurId(null);
    setSelectedCategoryIds([]);
    setCategorySelectionError(null);
    reset({
      email: derivedEmail,
      firstName: user?.firstName ?? '',
      lastName: user?.lastName ?? '',
    });
  }, [open, derivedEmail, reset, user?.firstName, user?.lastName]);

  useEffect(() => {
    setValue('email', derivedEmail);
  }, [derivedEmail, setValue]);

  useEffect(() => {
    if (!open || categories.length > 0 || categoriesLoading) {
      return;
    }

    const loadCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      const data = await fetchNewsletterCategories();
      if (!data || data.length === 0) {
        setCategoriesError('Aucune categorie disponible.');
      }
      setCategories(data);
      setCategoriesLoading(false);
    };

    loadCategories();
  }, [open, categories.length, categoriesLoading]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const lecteur = await registerLecteur({
      email: data.email,
      nom: data.lastName,
      prenom: data.firstName,
    });

    if (!lecteur?.id) {
      GlobalNotifier('Impossible de creer le compte lecteur.', 'error');
      return;
    }

    setCreatedLecteurId(lecteur.id);
    setStep('categories');
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const confirmCategories = async () => {
    setCategorySelectionError(null);

    if (!createdLecteurId) {
      GlobalNotifier('Compte lecteur non initialise.', 'error');
      return;
    }

    if (selectedCategoryIds.length === 0) {
      setCategorySelectionError('Selectionne au moins une categorie.');
      return;
    }

    const result = await subscribeLecteurToCategories(
      createdLecteurId,
      selectedCategoryIds
    );

    if (!result) {
      GlobalNotifier('Impossible d\'enregistrer les categories.', 'error');
      return;
    }

    if (createdLecteurId) {
      localStorage.setItem('newsletterLecteurId', createdLecteurId);
    }
    GlobalNotifier('Compte lecteur cree avec succes.', 'success');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 sm:max-w-3xl overflow-hidden">
        <div className="grid sm:grid-cols-[0.9fr_1.1fr]">
          <div className="hidden sm:flex flex-col justify-between bg-gradient-to-br from-primaryPurple-50 via-white to-secondaryOrange-200 p-8">
            <div>
              <p className="paragraph-small-medium text-primaryPurple-500 uppercase tracking-wide">
                Newsletters
              </p>
              <p className="text-2xl font-semibold mt-3">
                Cree ton compte lecteur
              </p>
              <p className="paragraph-small-normal text-black-300 mt-3">
                Recois les newsletters selon tes preferences et garde le
                controle sur tes categories.
              </p>
            </div>
            <div className="mt-8 space-y-3 text-sm text-black-300">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primaryPurple-500" />
                Compte lecteur en 2 etapes
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondaryOrange-500" />
                Categories personnalisables
              </div>
            </div>
          </div>

          <div className="p-8">
            <DialogHeader>
              <DialogTitle>
                {step === 'form'
                  ? 'Creation de compte lecteur'
                  : 'Selection des categories'}
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4 flex items-center gap-2 text-xs uppercase text-black-300">
              <span
                className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center border',
                  step === 'form'
                    ? 'border-primaryPurple-500 text-primaryPurple-500'
                    : 'border-grey-200 text-black-300'
                )}
              >
                1
              </span>
              Compte
              <span className="h-px w-6 bg-grey-200" />
              <span
                className={cn(
                  'h-6 w-6 rounded-full flex items-center justify-center border',
                  step === 'categories'
                    ? 'border-primaryPurple-500 text-primaryPurple-500'
                    : 'border-grey-200 text-black-300'
                )}
              >
                2
              </span>
              Categories
            </div>

            {step === 'form' ? (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 space-y-4"
              >
                <div>
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={cn(
                      'custom-input',
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    )}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      className={cn(
                        'custom-input',
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      )}
                      {...register('firstName')}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      className={cn(
                        'custom-input',
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      )}
                      {...register('lastName')}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <DialogFooter className="pt-2">
                  <Button type="submit" disabled={isSubmitting}>
                    Continuer
                  </Button>
                </DialogFooter>
              </form>
            ) : (
              <div className="mt-6 space-y-4">
                <p className="paragraph-small-normal text-black-300">
                  Selectionne au moins une categorie pour recevoir les
                  newsletters correspondantes.
                </p>

                {categoriesLoading ? (
                  <p className="paragraph-medium-normal">Chargement...</p>
                ) : categoriesError ? (
                  <p className="text-red-500 text-sm">{categoriesError}</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {categories.map((category) => {
                      if (!category?.id) {
                        return null;
                      }
                      const isSelected = selectedCategoryIds.includes(
                        category.id
                      );
                      return (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => toggleCategory(category.id)}
                          className={cn(
                            'border rounded-xl p-4 text-left transition',
                            isSelected
                              ? 'border-primaryPurple-500 bg-primaryPurple-50'
                              : 'border-grey-200 hover:border-primaryPurple-300'
                          )}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="paragraph-medium-medium">
                                {category.nom ?? 'Sans nom'}
                              </p>
                              {category.description && (
                                <p className="paragraph-small-normal text-black-300 mt-1">
                                  {category.description}
                                </p>
                              )}
                            </div>
                            {isSelected && (
                              <span className="h-6 w-6 rounded-full bg-primaryPurple-500 text-white flex items-center justify-center">
                                <Check size={14} />
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {categorySelectionError && (
                  <p className="text-red-500 text-sm">
                    {categorySelectionError}
                  </p>
                )}

                <DialogFooter className="pt-2 sm:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('form')}
                  >
                    Retour
                  </Button>
                  <Button type="button" onClick={confirmCategories}>
                    Valider
                  </Button>
                </DialogFooter>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterSubscribeDialog;