"use client";

import { useCallback, useEffect, useState } from "react";
import type { DocumentReference } from "firebase/firestore";
import type { CollectionReference } from "firebase/firestore";
import FirestoreApi from "@/services/firestoreApi";

const api = FirestoreApi.Api;

type UserMeta = { uid?: string; displayName?: string };

type UseAdminCrudOptions<T extends { id: string }> = {
  getCollection: () => CollectionReference;
  getDocRef: (id: string) => DocumentReference;
  newIdPrefix: string;
  user: UserMeta | null;
};

export function useAdminCrud<T extends { id: string }>({
  getCollection,
  getDocRef,
  newIdPrefix,
  user,
}: UseAdminCrudOptions<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  const loadItems = useCallback(async () => {
    try {
      const docs = await api.getOrderedDocuments(getCollection());
      setItems(docs.map((d) => api.docToData<T>(d)));
    } catch (err) {
      console.error("[AdminCrud]", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [getCollection]);

  useEffect(() => {
    void loadItems();
  }, [loadItems]);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    try {
      const id = editing.id || api.getNewId(newIdPrefix);
      const payload = { ...editing, id };
      await api.setData({
        docRef: getDocRef(id),
        data: payload,
        userData: { uid: user?.uid, displayName: user?.displayName },
      });
      setEditing(null);
      await loadItems();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await api.deleteData(getDocRef(deleteTarget.id));
      setDeleteTarget(null);
      await loadItems();
    } finally {
      setDeletingId(null);
    }
  }

  return {
    items,
    loading,
    editing,
    setEditing,
    saving,
    deletingId,
    deleteTarget,
    setDeleteTarget,
    handleSave,
    handleDeleteConfirm,
    loadItems,
  };
}
