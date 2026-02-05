'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { EditorState, convertFromRaw, convertToRaw, ContentState } from 'draft-js';
import DraftEditor from '@/components/Editor/DraftEditor';
import TextArea from '@/components/ui/textarea';
import FileUpload from '@/components/ui/FileUpload';
import MultiSelectDropdown from '@/components/ui/MultiSelectDropdown';
import { Button } from '@/components/ui/button';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import { useAuth } from '@/context/AuthContext';
import {
  createNewsletter,
  fetchNewsletterCategories,
  submitNewsletter,
  updateNewsletter,
} from '@/lib/FetchNewsletterData';
import type {
  NewsletterCategory,
  NewsletterCreateRequest,
  NewsletterResponse,
} from '@/types/newsletter';
import { TagInterface } from '@/types/tag';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ConvertDraftToHTML from '@/components/Editor/ConvertDtaftoHtml';
import { cn } from '@/lib/utils';

interface CreateNewsLetterComponentsProps {
  mode?: 'create' | 'update';
  initialNewsletter?: NewsletterResponse | null;
  onUpdated?: () => void;
}

const emptyEditorState = () =>
  EditorState.createWithContent(
    ContentState.createFromText('Ecris ta newsletter ici...')
  );

const buildEditorStateFromContent = (content?: string | null) => {
  if (!content) {
    return emptyEditorState();
  }
  try {
    const raw = JSON.parse(content);
    return EditorState.createWithContent(convertFromRaw(raw));
  } catch (error) {
    return EditorState.createWithContent(ContentState.createFromText(content));
  }
};

const CreateNewsLetterComponents = ({
  mode = 'create',
  initialNewsletter,
  onUpdated,
}: CreateNewsLetterComponentsProps) => {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState<{
    name: string;
    size: number;
    data: string;
  } | null>(null);
  const [categories, setCategories] = useState<NewsletterCategory[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [editorState, setEditorState] = useState(() => emptyEditorState());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [redacteurId, setRedacteurId] = useState('');

  const categoryChoices: TagInterface[] = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id || '',
        name: category.nom || '',
        description: category.description || '',
        domain: 'NEWSLETTER',
        createdAt: '',
        updatedAt: '',
      })),
    [categories]
  );

  const selectedCategoryNames = useMemo(
    () =>
      selectedCategoryIds
        .map((id) => categories.find((category) => category.id === id)?.nom)
        .filter(Boolean) as string[],
    [selectedCategoryIds, categories]
  );

  useEffect(() => {
    const loadCategories = async () => {
      const data = await fetchNewsletterCategories();
      setCategories(data);
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const storedId = localStorage.getItem('newsletterRedacteurId') || '';
    if (storedId) {
      setRedacteurId(storedId);
    }
  }, []);

  useEffect(() => {
    if (mode === 'update' && initialNewsletter) {
      setTitle(initialNewsletter.titre || '');
      setSelectedCategoryIds(
        initialNewsletter.categories
          ?.map((category) => category?.id)
          .filter(Boolean) as string[]
      );
      setEditorState(buildEditorStateFromContent(initialNewsletter.contenu));
    }
  }, [initialNewsletter, mode]);

  const serializeContent = (state: EditorState) => {
    const contentState = state.getCurrentContent();
    const rawContent = convertToRaw(contentState);
    return JSON.stringify(rawContent);
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Le titre est requis';
    if (!editorState.getCurrentContent().getPlainText().trim()) {
      newErrors.content = 'Contenu requis';
    }
    if (selectedCategoryIds.length === 0)
      newErrors.categories = 'Selectionne au moins une categorie';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    // Use redacteurId from localStorage (newsletter module ID), NOT user?.id
    const activeRedacteurId = redacteurId;
    if (!activeRedacteurId) {
      GlobalNotifier('Redacteur ID non trouve. Veuillez rafraichir la page.', 'error');
      return;
    }

    if (!validate()) return;

    const payload: NewsletterCreateRequest = {
      titre: title,
      contenu: serializeContent(editorState),
      categorieIds: selectedCategoryIds,
    };

    setIsLoading(true);
    const result = await createNewsletter(activeRedacteurId, payload);
    setIsLoading(false);

    if (!result) {
      GlobalNotifier('Creation impossible.', 'error');
      return;
    }

    GlobalNotifier('Newsletter creee avec succes.', 'success');
    router.push('/u/newsletter');
  };

  const handleUpdate = async () => {
    if (!initialNewsletter?.id) {
      GlobalNotifier('Newsletter introuvable.', 'error');
      return;
    }

    if (!validate()) return;

    const payload: NewsletterCreateRequest = {
      titre: title,
      contenu: serializeContent(editorState),
      categorieIds: selectedCategoryIds,
    };

    setIsLoading(true);
    const result = await updateNewsletter(initialNewsletter.id, payload);
    setIsLoading(false);

    if (!result) {
      GlobalNotifier('Mise a jour impossible.', 'error');
      return;
    }

    GlobalNotifier('Newsletter mise a jour.', 'success');
    onUpdated?.();
  };

  const handleSubmitNewsletter = async () => {
    // Use redacteurId from localStorage (newsletter module ID), NOT user?.id
    const activeRedacteurId = redacteurId;
    if (!activeRedacteurId || !initialNewsletter?.id) {
      GlobalNotifier('Newsletter ou Redacteur ID invalide.', 'error');
      return;
    }

    const result = await submitNewsletter(
      initialNewsletter.id,
      activeRedacteurId
    );
    if (!result) {
      GlobalNotifier('Soumission impossible.', 'error');
      return;
    }
    GlobalNotifier('Newsletter soumise.', 'success');
    onUpdated?.();
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="h4-medium">
            {mode === 'create' ? 'Creation de newsletter' : 'Modifier la newsletter'}
          </p>
          <p className="paragraph-medium-normal text-black-300">
            {mode === 'create'
              ? 'Redige et prepare ta newsletter.'
              : 'Ajuste et soumets ta newsletter.'}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" type="button" onClick={() => setPreviewOpen(true)}>
            View
          </Button>
          {mode === 'update' ? (
            <>
              <Button type="button" onClick={handleUpdate} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Update'}
              </Button>
              <Button type="button" onClick={handleSubmitNewsletter}>
                Submit
              </Button>
            </>
          ) : (
            <Button type="button" onClick={handleCreate} disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6">
        <div>
          <label htmlFor="newsletter-title" className="form-label">
            Newsletter Title
          </label>
          <input
            id="newsletter-title"
            type="text"
            className={cn(
              'custom-input',
              errors.title ? 'border-red-500' : 'border-gray-300'
            )}
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div>
          <label htmlFor="newsletter-description" className="form-label">
            Description
          </label>
          <TextArea
            id="newsletter-description"
            value={description}
            onChange={(value) => setDescription(value)}
            placeholder="Courte description de la newsletter"
          />
        </div>

        <div>
          <label className="form-label">Cover Image</label>
          <FileUpload
            id="newsletter-cover"
            type="Image"
            acceptedFormats={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
            onFileSelect={(fileData) => setCoverImage(fileData)}
          />
        </div>

        <div>
          <label className="form-label">Categories</label>
          <MultiSelectDropdown
            choices={categoryChoices}
            selectedChoices={selectedCategoryNames}
            setSelectedChoices={(selectedNames) => {
              const ids = categories
                .filter((category) => selectedNames.includes(category.nom || ''))
                .map((category) => category.id)
                .filter(Boolean) as string[];
              setSelectedCategoryIds(ids);
            }}
          />
          {errors.categories && (
            <p className="text-red-500 text-sm mt-1">{errors.categories}</p>
          )}
        </div>

        <div>
          <label className="form-label">Content</label>
          <DraftEditor
            editorState={editorState}
            setEditorState={setEditorState}
            placeholder="Ecris ta newsletter ici..."
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{title || 'Preview Newsletter'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {description && (
              <p className="paragraph-medium-normal text-black-300">
                {description}
              </p>
            )}
            {coverImage?.data && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage.data}
                alt={coverImage.name}
                className="w-full h-48 object-cover rounded-lg border border-grey-100"
              />
            )}
            <div className="rounded-lg border border-grey-100 p-4 bg-gray-50">
              <ConvertDraftToHTML content={serializeContent(editorState)} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateNewsLetterComponents;