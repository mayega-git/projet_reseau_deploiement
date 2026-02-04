/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useMemo, useState } from 'react';
import { MoreHorizontal, Eye, Send, CheckCircle, XCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { truncateText } from '@/helper/TruncateText';
import StatusTag from '@/components/ui/StatusTag';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import {
  publishNewsletter,
  rejectNewsletter,
  submitNewsletter,
  validateNewsletter,
} from '@/actions/newsletter';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import { NewsletterResponse, NewsletterStatus } from '@/types/newsletter';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import ConvertDraftToHTML from '@/components/Editor/ConvertDtaftoHtml';

interface NewsletterDataTableProps {
  data: NewsletterResponse[];
  variant: 'redacteur' | 'admin';
  redacteurId?: string;
  onRefresh?: () => void;
  onEdit?: (newsletterId: string) => void;
}

const formatStatusLabel = (status?: NewsletterStatus | null) =>
  status || 'UNKNOWN';

const isDraftRaw = (content?: string | null) => {
  if (!content) return false;
  try {
    const parsed = JSON.parse(content);
    return Boolean(parsed?.blocks && parsed?.entityMap);
  } catch (error) {
    return false;
  }
};

const NewsletterDataTable: React.FC<NewsletterDataTableProps> = ({
  data,
  variant,
  redacteurId,
  onRefresh,
  onEdit,
}) => {
  const [previewNewsletter, setPreviewNewsletter] =
    useState<NewsletterResponse | null>(null);

  const refresh = () => {
    if (onRefresh) {
      onRefresh();
      return;
    }
    window.location.reload();
  };

  const handleSubmit = async (newsletterId: string) => {
    if (!redacteurId) {
      GlobalNotifier('Identifiant redacteur manquant.', 'error');
      return;
    }
    const result = await submitNewsletter(newsletterId, redacteurId);
    if (!result) {
      GlobalNotifier('Echec de la soumission.', 'error');
      return;
    }
    GlobalNotifier('Newsletter soumise.', 'success');
    refresh();
  };

  const handleValidate = async (newsletterId: string) => {
    const result = await validateNewsletter(newsletterId);
    if (!result) {
      GlobalNotifier('Validation impossible.', 'error');
      return;
    }
    GlobalNotifier('Newsletter validee.', 'success');
    refresh();
  };

  const handleReject = async (newsletterId: string) => {
    const result = await rejectNewsletter(newsletterId);
    if (!result) {
      GlobalNotifier('Rejet impossible.', 'error');
      return;
    }
    GlobalNotifier('Newsletter rejetee.', 'success');
    refresh();
  };

  const handlePublish = async (newsletterId: string) => {
    const result = await publishNewsletter(newsletterId);
    if (!result) {
      GlobalNotifier('Publication impossible.', 'error');
      return;
    }
    GlobalNotifier('Newsletter publiee.', 'success');
    refresh();
  };

  const rows = useMemo(() => [...(data || [])], [data]);

  return (
    <>
      <div className="rounded-md border overflow-hidden bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="text-start w-[25%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Title
              </th>
              <th className="text-start w-[20%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Categories
              </th>
              {variant === 'admin' && (
                <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Redacteur
                </th>
              )}
              <th className="text-start w-[10%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Status
              </th>
              <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Created At
              </th>
              <th className="text-start w-[10%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const categoriesLabel = row.categories
                ?.map((category) => category?.nom)
                .filter(Boolean)
                .join(', ');
              return (
                <tr
                  key={row.id ?? index}
                  className={
                    index === rows.length - 1 ? 'rounded-b-[20px]' : ''
                  }
                >
                  <td className="text-start w-[25%] paragraph-xmedium-normal px-4 py-3 border-b">
                    {truncateText(row.titre || '')}
                  </td>
                  <td className="text-start w-[20%] paragraph-xmedium-normal px-4 py-3 border-b">
                    {truncateText(categoriesLabel || '-')}
                  </td>
                  {variant === 'admin' && (
                    <td className="text-start w-[15%] paragraph-xmedium-normal px-4 py-3 border-b">
                      {row.redacteurNom || '-'}
                    </td>
                  )}
                  <td className="text-start w-[10%] paragraph-xmedium-normal px-4 py-3 border-b">
                    <StatusTag status={formatStatusLabel(row.statut)} />
                  </td>
                  <td className="text-start w-[15%] paragraph-xmedium-normal px-4 py-3 border-b">
                    {row.createdAt
                      ? formatDateOrRelative(row.createdAt)
                      : '-'}
                  </td>
                  <td className="text-start w-[10%] paragraph-xmedium-normal px-4 py-3 border-b">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setPreviewNewsletter(row)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        {variant === 'redacteur' && row.id && (
                          <>
                            <DropdownMenuItem
                              onClick={() => onEdit?.(row.id as string)}
                              className="gap-2"
                            >
                              Edit
                            </DropdownMenuItem>
                            {(row.statut === 'BROUILLON' ||
                              row.statut === 'REJETEE') && (
                              <DropdownMenuItem
                                onClick={() => handleSubmit(row.id as string)}
                                className="gap-2"
                              >
                                <Send className="h-4 w-4" />
                                Submit
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                        {variant === 'admin' && row.id && (
                          <>
                            {row.statut === 'SOUMISE' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleValidate(row.id as string)
                                  }
                                  className="gap-2"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                  Validate
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleReject(row.id as string)
                                  }
                                  className="gap-2"
                                >
                                  <XCircle className="h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </>
                            )}
                            {row.statut === 'VALIDEE' && (
                              <DropdownMenuItem
                                onClick={() => handlePublish(row.id as string)}
                                className="gap-2"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Publish
                              </DropdownMenuItem>
                            )}
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Dialog
        open={Boolean(previewNewsletter)}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewNewsletter(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {previewNewsletter?.titre || 'Newsletter'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {previewNewsletter?.categories && (
              <div className="flex flex-wrap gap-2">
                {previewNewsletter.categories.map((category) => (
                  <span
                    key={category?.id}
                    className="px-3 py-1 rounded-full text-xs bg-primaryPurple-50 text-primaryPurple-600"
                  >
                    {category?.nom}
                  </span>
                ))}
              </div>
            )}
            <div className="rounded-lg border border-grey-100 p-4 bg-gray-50">
              {isDraftRaw(previewNewsletter?.contenu) ? (
                <ConvertDraftToHTML content={previewNewsletter?.contenu || ''} />
              ) : previewNewsletter?.contenu ? (
                <div
                  className="prose max-w-none text-sm"
                  dangerouslySetInnerHTML={{
                    __html: previewNewsletter.contenu,
                  }}
                />
              ) : (
                <p className="paragraph-small-normal text-black-300">
                  Aucun contenu disponible.
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewsletterDataTable;
