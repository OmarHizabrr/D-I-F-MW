import FirestoreApi from "@/services/firestoreApi";
import type { DonorRating } from "@/types/project-management";

const api = FirestoreApi.Api;

export async function getDonorRating(
  projectId: string,
  donorId: string
): Promise<DonorRating | null> {
  const data = await api.getData(api.getDonorRatingDoc(projectId, donorId));
  return data ? ({ donorId, projectId, ...data } as DonorRating) : null;
}

export async function saveDonorRating(
  rating: Omit<DonorRating, "id" | "createdAt">
): Promise<void> {
  await api.setData({
    docRef: api.getDonorRatingDoc(rating.projectId, rating.donorId),
    data: {
      ...rating,
      id: rating.donorId,
      createdAt: new Date().toISOString(),
    },
    merge: false,
    userData: {},
  });
}
