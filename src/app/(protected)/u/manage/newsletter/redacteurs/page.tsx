'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { MoreHorizontal, Power } from 'lucide-react';
import SidebarPageHeading from '@/components/ui/SidebarPageHeading';
import { Button } from '@/components/ui/button';
import EmptyState from '@/components/EmptyState/EmptyState';
import StatusTag from '@/components/ui/StatusTag';
import {
  approveRedacteurRequest,
  fetchRedacteurRequests,
  rejectRedacteurRequest,
} from '@/lib/FetchNewsletterData';
import type {
  RedacteurRequestResponse,
  RedacteurRequestStatus,
} from '@/types/newsletter';
import { formatDateOrRelative } from '@/helper/formatDateOrRelative';
import { GlobalNotifier } from '@/components/ui/GlobalNotifier';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TextArea from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const normalizeStatus = (
  status?: string | null
): RedacteurRequestStatus | null => {
  if (!status) return null;
  const normalized = status.toUpperCase();
  if (normalized === 'PENDING') return 'PENDING';
  if (normalized === 'APPROUVED') return 'APPROVED';
  if (normalized === 'APPROVED') return 'APPROVED';
  if (normalized === 'REJECTED') return 'REJECTED';
  return null;
};

const RedacteursAdminPage = () => {
  const [requests, setRequests] = useState<RedacteurRequestResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [activeRequest, setActiveRequest] =
    useState<RedacteurRequestResponse | null>(null);
  const [saving, setSaving] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    const data = await fetchRedacteurRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const rows = useMemo(
    () =>
      [...requests].sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      }),
    [requests]
  );

  const handleActivate = async (request: RedacteurRequestResponse) => {
    if (!request.id) {
      GlobalNotifier('Identifiant manquant.', 'error');
      return;
    }
    setSaving(true);
    const result = await approveRedacteurRequest(request.id);
    setSaving(false);

    if (!result) {
      GlobalNotifier("Activation impossible.", 'error');
      return;
    }

    GlobalNotifier('Redacteur active.', 'success');
    loadRequests();
  };

  const handleOpenReject = (request: RedacteurRequestResponse) => {
    setActiveRequest(request);
    setRejectReason('');
    setRejectOpen(true);
  };

  const handleReject = async () => {
    if (!activeRequest?.id) {
      setRejectOpen(false);
      return;
    }

    const reason = rejectReason.trim() || 'Desactive par admin';
    setSaving(true);
    const result = await rejectRedacteurRequest(activeRequest.id, reason);
    setSaving(false);

    if (!result) {
      GlobalNotifier('Desactivation impossible.', 'error');
      return;
    }

    GlobalNotifier('Redacteur desactive.', 'success');
    setRejectOpen(false);
    setActiveRequest(null);
    loadRequests();
  };

  const handleRejectOpenChange = (open: boolean) => {
    if (!open) {
      setActiveRequest(null);
      setRejectReason('');
    }
    setRejectOpen(open);
  };

  return (
    <div className="flex flex-col gap-8">
      <SidebarPageHeading
        title="Redacteurs"
        subtitle="Active ou desactive les redacteurs newsletters."
      />

      {loading ? (
        <p className="paragraph-medium-normal text-black-300">Chargement...</p>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-6">
          <EmptyState />
        </div>
      ) : (
        <div className="rounded-md border overflow-hidden bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-start w-[20%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Email
                </th>
                <th className="text-start w-[18%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Prenom
                </th>
                <th className="text-start w-[18%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Nom
                </th>
                <th className="text-start w-[14%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Statut
                </th>
                <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Cree le
                </th>
                <th className="text-start w-[15%] paragraph-xmedium-normal text-black-300 px-4 py-2 border-b">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => {
                const status = normalizeStatus(row.status);
                const isApproved = status === 'APPROVED';

                return (
                  <tr
                    key={row.id || index}
                    className={
                      index === rows.length - 1 ? 'rounded-b-[20px]' : ''
                    }
                  >
                    <td className="text-start w-[20%] paragraph-xmedium-normal px-4 py-3 border-b">
                      {row.email || '-'}
                    </td>
                    <td className="text-start w-[18%] paragraph-xmedium-normal px-4 py-3 border-b">
                      {row.prenom || '-'}
                    </td>
                    <td className="text-start w-[18%] paragraph-xmedium-normal px-4 py-3 border-b">
                      {row.nom || '-'}
                    </td>
                    <td className="text-start w-[14%] paragraph-xmedium-normal px-4 py-3 border-b">
                      <StatusTag status={status || 'UNKNOWN'} />
                    </td>
                    <td className="text-start w-[15%] paragraph-xmedium-normal px-4 py-3 border-b">
                      {row.createdAt ? formatDateOrRelative(row.createdAt) : '-'}
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
                          <DropdownMenuSeparator />
                          {isApproved ? (
                            <DropdownMenuItem
                              onClick={() => handleOpenReject(row)}
                              className="gap-2 text-red-600"
                            >
                              <Power className="h-4 w-4" />
                              Desactiver
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleActivate(row)}
                              className="gap-2"
                            >
                              <Power className="h-4 w-4" />
                              Activer
                            </DropdownMenuItem>
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
      )}

      <Dialog open={rejectOpen} onOpenChange={handleRejectOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Desactiver le redacteur</DialogTitle>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <p className="paragraph-small-normal text-black-300">
              Renseigne une raison si besoin.
            </p>
            <TextArea
              value={rejectReason}
              height="90px"
              maxWords={50}
              onChange={(value) => setRejectReason(value)}
            />
          </div>
          <DialogFooter className="mt-4 justify-end gap-2">
            <Button variant="outline" onClick={() => handleRejectOpenChange(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={saving}
            >
              {saving ? 'Desactivation...' : 'Desactiver'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RedacteursAdminPage;