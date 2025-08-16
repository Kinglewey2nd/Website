import React, { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection as fsCollection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  writeBatch,
  limit as fsLimit,
  getDoc
} from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { db } from '@/firebase';
import useAuth from '@/useAuth';
import { ref as sRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '@/firebase';
import toast, { Toaster } from 'react-hot-toast';

type FormValues = {
  collectionName: string;
  FlavorText: string;
  NormalFrame: FileList;
  FoilVersionFrame: FileList;
};

type LiteCollection = {
  id: string;
  collectionName: string;
  flavorText?: string;
  normalFrame?: string;
  foilVersionFrame?: string;
  createdAtMillis?: number;
  ownerId: string;
};

const BATCH_LIMIT = 300; // safe chunk size without ordering

const CreateCollection = () => {
  const { user } = useAuth();
  const [preview, setPreview] = useState('');
  const [gemPreview, setGemPreview] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  // Collections UI state
  const [myCollections, setMyCollections] = useState<LiteCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<FormValues>();

  // Watch file inputs to update previews
  const normalFrameFile = watch('NormalFrame');
  const foilFrameFile = watch('FoilVersionFrame');

  useEffect(() => {
    if (normalFrameFile && normalFrameFile.length > 0) {
      setPreview(URL.createObjectURL(normalFrameFile[0]));
    }
  }, [normalFrameFile]);

  useEffect(() => {
    if (foilFrameFile && foilFrameFile.length > 0) {
      setGemPreview(URL.createObjectURL(foilFrameFile[0]));
    }
  }, [foilFrameFile]);

  // -------- Load user's collections (no orderBy => no index required) --------
  const loadCollections = async () => {
    if (!user) return;
    try {
      const qColl = query(fsCollection(db, 'collections'), where('ownerId', '==', user.uid));
      const snap = await getDocs(qColl);
      const rows: LiteCollection[] = snap.docs.map(d => {
        const data = d.data() as any;
        const createdAt = data?.createdAt;
        const createdAtMillis =
          (typeof createdAt?.toMillis === 'function' && createdAt.toMillis()) ||
          (createdAt instanceof Date && createdAt.getTime()) ||
          undefined;
        return {
          id: d.id,
          collectionName: data?.collectionName ?? '(untitled)',
          flavorText: data?.flavorText ?? '',
          normalFrame: data?.normalFrame,
          foilVersionFrame: data?.foilVersionFrame,
          createdAtMillis,
          ownerId: data?.ownerId ?? '',
        };
      });

      // client-side sort by createdAt desc (fallback: name)
      rows.sort((a, b) => {
        if (a.createdAtMillis && b.createdAtMillis) return b.createdAtMillis - a.createdAtMillis;
        return a.collectionName.localeCompare(b.collectionName);
      });

      setMyCollections(rows);
      if (!rows.find(r => r.id === selectedCollectionId)) setSelectedCollectionId('');
    } catch (e) {
      console.error(e);
      toast.error('Failed to load your collections.');
    }
  };

  useEffect(() => {
    loadCollections();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const selectedCollection = useMemo(
    () => myCollections.find(c => c.id === selectedCollectionId),
    [myCollections, selectedCollectionId]
  );
  const selectedCollectionName = selectedCollection?.collectionName ?? '';

  // -------- Create Collection --------
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      setStatus('⚠️ You must be signed in to create a collection.');
      return;
    }

    try {
      setLoading(true);
      const normalFrameFile = data.NormalFrame[0];
      const normalRef = sRef(storage, `collections/${Date.now()}-${normalFrameFile.name}`);
      await uploadBytes(normalRef, normalFrameFile);
      const normalFrameURL = await getDownloadURL(normalRef);

      const foilFrameFile = data.FoilVersionFrame[0];
      const foilRef = sRef(storage, `collections/${Date.now()}-${foilFrameFile.name}`);
      await uploadBytes(foilRef, foilFrameFile);
      const foilFrameURL = await getDownloadURL(foilRef);

      await addDoc(fsCollection(db, 'collections'), {
        collectionName: data.collectionName,
        flavorText: data.FlavorText,
        normalFrame: normalFrameURL,
        foilVersionFrame: foilFrameURL,
        ownerId: user.uid,
        createdAt: new Date(),
      });

      toast.success('Collection created successfully!');
      reset();
      setPreview('');
      setGemPreview('');
      await loadCollections();
    } catch (err) {
      console.error('Firestore save error:', err);
      setStatus('Failed to save collection. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // -------- Helpers for Storage deletion from URL or path --------
  const tryDeleteStorageRef = async (maybeUrlOrPath?: string) => {
    if (!maybeUrlOrPath) return;
    try {
      // Works with gs://, https download URLs, or a full path like "cards/..."
      const r = sRef(storage, maybeUrlOrPath);
      await deleteObject(r);
    } catch {
      // ignore missing/cannot parse
    }
  };

  // -------- Delete Collection + all its Cards (+ Storage images) --------
  const deleteCollectionAndCards = async (collectionId: string) => {
    if (!user || !collectionId) return;

    setDeleting(true);
    try {
      // Verify collection belongs to user and fetch its data (for image cleanup)
      const collRef = doc(db, 'collections', collectionId);
      const collDocSnap = await getDoc(collRef);
      const collData = collDocSnap.exists() ? (collDocSnap.data() as any) : null;
      if (!collData || collData.ownerId !== user.uid) {
        toast.error('Collection not found or not owned by you.');
        setDeleting(false);
        setConfirmOpen(false);
        return;
      }

      // 1) Delete all cards in chunks
      let totalDeleted = 0;
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const cardsSnap = await getDocs(
          query(
            fsCollection(db, 'cards'),
            where('ownerId', '==', user.uid),
            where('collectionId', '==', collectionId),
            fsLimit(BATCH_LIMIT)
          )
        );
        if (cardsSnap.empty) break;

        // Try to delete card storage (common field names supported)
        for (const d of cardsSnap.docs) {
          const data = d.data() as any;
          await Promise.all([
            tryDeleteStorageRef(data?.imagePath),
            tryDeleteStorageRef(data?.imageUrl),
            tryDeleteStorageRef(data?.cardImageUrl),
            tryDeleteStorageRef(data?.foilImageUrl),
          ]);
        }

        const batch = writeBatch(db);
        cardsSnap.docs.forEach(d => batch.delete(d.ref));
        await batch.commit();

        totalDeleted += cardsSnap.docs.length;
        if (cardsSnap.size < BATCH_LIMIT) break;
      }

      // 2) Delete collection's Storage frames (URLs)
      await Promise.all([
        tryDeleteStorageRef(collData?.normalFrame),
        tryDeleteStorageRef(collData?.foilVersionFrame),
      ]);

      // 3) Delete the collection document
      await deleteDoc(collRef);

      await loadCollections();
      toast.success(
        `Deleted collection${selectedCollectionName ? ` “${selectedCollectionName}”` : ''} and ${totalDeleted} card(s).`
      );
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete collection.');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
      setSelectedCollectionId('');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen backdrop-blur-md ">
        <div className="text-center p-8 bg-black/40 backdrop-blur-xl border border-purple-500/30 rounded-xl">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  const hasCollections = myCollections.length > 0;

  return (
    <div className="p-10 min-h-screen">
      <Toaster />
      <div className="flex items-center justify-center mt-40">
        <div className="md:w-[800px] bg-gray-800/60 backdrop-blur-md border border-gray-700 rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-100">Create Collection</h2>

          {/* CREATE FORM */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Collection Name */}
            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Collection Name <sup className="text-pink-700 text-base">*</sup>
              </label>
              <input
                {...register('collectionName', { required: 'Collection name is required' })}
                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.collectionName && (
                <p className="text-red-400 text-sm">{errors.collectionName.message}</p>
              )}
            </div>

            {/* Flavor Text */}
            <div>
              <label className="block font-semibold text-gray-100 mb-1">Flavor Text</label>
              <input
                {...register('FlavorText', {})}
                className="w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-3 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.FlavorText && (
                <p className="text-red-400 text-sm">{errors.FlavorText.message}</p>
              )}
            </div>

            {/* Normal Frame */}
            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Normal Frame <sup className="text-pink-700 text-base">*</sup>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('NormalFrame', { required: 'Normal frame is required' })}
                className="block w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200
                  file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.NormalFrame && (
                <p className="text-red-400 text-sm">{errors.NormalFrame.message}</p>
              )}
              {preview && <img src={preview} alt="NormalFrame" style={{ width: 150 }} />}
            </div>

            {/* Foil Version Frame */}
            <div>
              <label className="block font-semibold text-gray-100 mb-1">
                Foil Version Frame <sup className="text-pink-700 text-base">*</sup>
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('FoilVersionFrame', { required: 'Foil version frame is required' })}
                className="block w-full bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200
                file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-600 file:text-white hover:file:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              {errors.FoilVersionFrame && (
                <p className="text-red-400 text-sm">{errors.FoilVersionFrame.message}</p>
              )}
              {gemPreview && <img src={gemPreview} alt="FoilVersionFrame" style={{ width: 150 }} />}
            </div>

            <button
              type="submit"
              className="bg-green-600 cursor-pointer text-white px-4 py-2 rounded-xl hover:bg-green-500"
            >
              {loading ? 'Creating...' : 'Create Collection'}
            </button>
          </form>

          {/* Status */}
          <p className="mt-4 text-green-500 font-medium text-center">{status}</p>

          {/* ====== Your Collections (viewer) ====== */}
          <div className="my-10">
            <h3 className="text-xl font-bold text-gray-100 mb-3">Your Collections</h3>

            {!hasCollections ? (
              <p className="text-sm text-gray-300">You don’t have any collections yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {myCollections.map((c) => (
                  <div
                    key={c.id}
                    className={`rounded-xl border p-3 bg-gray-900/60 border-gray-700 hover:border-purple-500/50 transition cursor-pointer ${
                      selectedCollectionId === c.id ? 'ring-2 ring-purple-400' : ''
                    }`}
                    onClick={() => setSelectedCollectionId(c.id)}
                  >
                    <div className="flex gap-3">
                      <img
                        src={c.normalFrame || '/placeholder.png'}
                        alt={c.collectionName}
                        className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-100">{c.collectionName}</h4>
                          {selectedCollectionId === c.id && (
                            <span className="text-xs px-2 py-0.5 rounded bg-purple-600/30 text-purple-200 border border-purple-500/40">
                              Selected
                            </span>
                          )}
                        </div>
                        {c.flavorText && (
                          <p className="text-xs text-gray-300 mt-1 line-clamp-2">{c.flavorText}</p>
                        )}
                        <p className="text-[11px] text-gray-400 mt-2">
                          {c.createdAtMillis
                            ? new Date(c.createdAtMillis).toLocaleString()
                            : 'No date'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-gray-700/80" />

          {/* ====== Danger Zone: Delete Collection ====== */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-red-400">Danger Zone</h3>
            <p className="text-sm text-red-200/80">
              <span className="font-semibold">Warning:</span> all cards in the collection will be deleted. This action
              cannot be undone.
            </p>

            <div className="flex gap-3 items-center">
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                className="flex-1 bg-gray-700/70 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                <option value="">Select a collection…</option>
                {myCollections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.collectionName}
                  </option>
                ))}
              </select>

              <button
                disabled={!selectedCollectionId || deleting}
                onClick={() => setConfirmOpen(true)}
                className={`px-4 py-2 rounded-xl text-white ${
                  !selectedCollectionId || deleting
                    ? 'bg-red-900/60 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {deleting ? 'Deleting…' : 'Delete Collection'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {confirmOpen && selectedCollectionId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-white">Confirm Delete</h4>
            <p className="mt-2 text-sm text-gray-300">
              <span className="font-semibold text-red-400">Warning:</span> all cards in the collection will be deleted.
              This action cannot be undone.
            </p>
            {selectedCollectionName && (
              <p className="mt-1 text-sm text-gray-400">
                Collection: <span className="text-gray-200">“{selectedCollectionName}”</span>
              </p>
            )}

            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-gray-700 hover:bg-gray-600 text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteCollectionAndCards(selectedCollectionId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white"
              >
                {deleting ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateCollection;
