import {
  getFirestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  query,
  where,
  limit,
  getDocs,
  onSnapshot,
  orderBy,
  serverTimestamp,
  getCountFromServer,
  collectionGroup,
  type DocumentReference,
  type CollectionReference,
  type Query,
  type DocumentData,
  type DocumentSnapshot,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { getFirebaseApp } from "@/lib/firebase/client";
import { COLLECTIONS, SITE_ROOT } from "@/lib/firebase/database-structure";

function getDb() {
  return getFirestore(getFirebaseApp());
}

export type UserMeta = {
  uid?: string;
  displayName?: string;
  photoURL?: string;
};

export type SetDataOptions = {
  docRef: DocumentReference;
  data: DocumentData;
  merge?: boolean;
  userData?: UserMeta;
};

export type UpdateDataOptions = {
  docRef: DocumentReference;
  data: DocumentData;
  userData?: UserMeta;
};

/** FirestoreApi — جميع عمليات الكتابة عبر setData/updateData حصراً. */
class FirestoreApi {
  static get Api() {
    return new FirestoreApi();
  }

  getNewId(collectionName: string) {
    return doc(collection(getDb(), collectionName)).id;
  }

  getCollection(collectionName: string): CollectionReference {
    return collection(getDb(), collectionName);
  }

  getDocument(collectionName: string, documentId: string): DocumentReference {
    return doc(getDb(), collectionName, documentId);
  }

  getSubCollection(
    collectionName: string,
    documentId: string,
    subCollectionName: string
  ): CollectionReference {
    return collection(getDb(), collectionName, documentId, subCollectionName);
  }

  getSubDocument(
    collectionName: string,
    documentId: string,
    subCollectionName: string,
    subDocumentId: string
  ): DocumentReference {
    return doc(getDb(), collectionName, documentId, subCollectionName, subDocumentId);
  }

  getSiteConfigDoc() {
    return this.getSubDocument(COLLECTIONS.siteConfig, SITE_ROOT, COLLECTIONS.siteConfig, "global");
  }

  getTopbarDoc() {
    return this.getSubDocument(COLLECTIONS.topbar, SITE_ROOT, COLLECTIONS.topbar, "content");
  }

  getHeroDoc() {
    return this.getSubDocument(COLLECTIONS.hero, SITE_ROOT, COLLECTIONS.hero, "content");
  }

  getFooterDoc() {
    return this.getSubDocument(COLLECTIONS.footer, SITE_ROOT, COLLECTIONS.footer, "content");
  }

  getNewsletterDoc() {
    return this.getSubDocument(COLLECTIONS.newsletter, SITE_ROOT, COLLECTIONS.newsletter, "content");
  }

  getNavItemsCollection() {
    return this.getSubCollection(COLLECTIONS.navItems, SITE_ROOT, COLLECTIONS.navItems);
  }

  getNavItemDoc(itemId: string) {
    return this.getSubDocument(COLLECTIONS.navItems, SITE_ROOT, COLLECTIONS.navItems, itemId);
  }

  getStatsCollection() {
    return this.getSubCollection(COLLECTIONS.stats, SITE_ROOT, COLLECTIONS.stats);
  }

  getStatDoc(statId: string) {
    return this.getSubDocument(COLLECTIONS.stats, SITE_ROOT, COLLECTIONS.stats, statId);
  }

  getProgramsCollection() {
    return this.getSubCollection(COLLECTIONS.programs, SITE_ROOT, COLLECTIONS.programs);
  }

  getProgramDoc(programId: string) {
    return this.getSubDocument(COLLECTIONS.programs, SITE_ROOT, COLLECTIONS.programs, programId);
  }

  getProjectsCollection() {
    return this.getSubCollection(COLLECTIONS.projects, SITE_ROOT, COLLECTIONS.projects);
  }

  getProjectDoc(projectId: string) {
    return this.getSubDocument(COLLECTIONS.projects, SITE_ROOT, COLLECTIONS.projects, projectId);
  }

  getNewsCollection() {
    return this.getSubCollection(COLLECTIONS.news, SITE_ROOT, COLLECTIONS.news);
  }

  getNewsDoc(newsId: string) {
    return this.getSubDocument(COLLECTIONS.news, SITE_ROOT, COLLECTIONS.news, newsId);
  }

  getPartnersCollection() {
    return this.getSubCollection(COLLECTIONS.partners, SITE_ROOT, COLLECTIONS.partners);
  }

  getPartnerDoc(partnerId: string) {
    return this.getSubDocument(COLLECTIONS.partners, SITE_ROOT, COLLECTIONS.partners, partnerId);
  }

  getTestimonialsCollection() {
    return this.getSubCollection(COLLECTIONS.testimonials, SITE_ROOT, COLLECTIONS.testimonials);
  }

  getTestimonialDoc(id: string) {
    return this.getSubDocument(COLLECTIONS.testimonials, SITE_ROOT, COLLECTIONS.testimonials, id);
  }

  getMediaCollection() {
    return this.getSubCollection(COLLECTIONS.media, SITE_ROOT, COLLECTIONS.media);
  }

  getMediaDoc(id: string) {
    return this.getSubDocument(COLLECTIONS.media, SITE_ROOT, COLLECTIONS.media, id);
  }

  getLicensesCollection() {
    return this.getSubCollection(COLLECTIONS.licenses, SITE_ROOT, COLLECTIONS.licenses);
  }

  getLicenseDoc(id: string) {
    return this.getSubDocument(COLLECTIONS.licenses, SITE_ROOT, COLLECTIONS.licenses, id);
  }

  getMapPointsCollection() {
    return this.getSubCollection(COLLECTIONS.mapPoints, SITE_ROOT, COLLECTIONS.mapPoints);
  }

  getMapPointDoc(id: string) {
    return this.getSubDocument(COLLECTIONS.mapPoints, SITE_ROOT, COLLECTIONS.mapPoints, id);
  }

  getHowWeWorkCollection() {
    return this.getSubCollection(COLLECTIONS.howWeWork, SITE_ROOT, COLLECTIONS.howWeWork);
  }

  getHowWeWorkDoc(id: string) {
    return this.getSubDocument(COLLECTIONS.howWeWork, SITE_ROOT, COLLECTIONS.howWeWork, id);
  }

  getWhyUsCollection() {
    return this.getSubCollection(COLLECTIONS.whyUs, SITE_ROOT, COLLECTIONS.whyUs);
  }

  getWhyUsDoc(id: string) {
    return this.getSubDocument(COLLECTIONS.whyUs, SITE_ROOT, COLLECTIONS.whyUs, id);
  }

  getAdminsCollection() {
    return this.getSubCollection(COLLECTIONS.admins, SITE_ROOT, COLLECTIONS.admins);
  }

  getAdminDoc(uid: string) {
    return this.getSubDocument(COLLECTIONS.admins, SITE_ROOT, COLLECTIONS.admins, uid);
  }

  async setData({ docRef, data, merge = true, userData = {} }: SetDataOptions) {
    const payload = {
      ...data,
      createdByName: userData.displayName || "",
      createdByImageUrl: userData.photoURL || "",
      createdBy: userData.uid || "",
      createTimes: serverTimestamp(),
      updatedTimes: serverTimestamp(),
    };
    await setDoc(docRef, payload, { merge });
  }

  async updateData({ docRef, data, userData = {} }: UpdateDataOptions) {
    const payload: DocumentData = { ...data };
    if (!payload.updateByName) payload.updateByName = userData.displayName || "";
    if (!payload.updateByImageUrl) payload.updateByImageUrl = userData.photoURL || "";
    payload.updatedTimes = serverTimestamp();
    await updateDoc(docRef, payload);
  }

  async getData(docRef: DocumentReference) {
    const snap = await getDoc(docRef);
    return snap.exists() ? snap.data() : null;
  }

  async deleteData(docRef: DocumentReference) {
    await deleteDoc(docRef);
  }

  async getDocuments(
    colRef: CollectionReference,
    opts: { whereField?: string; isEqualTo?: unknown; limitCount?: number } = {}
  ) {
    let q: Query = colRef;
    if (opts.whereField) {
      q = query(q, where(opts.whereField, "==", opts.isEqualTo));
    }
    if (opts.limitCount) {
      q = query(q, limit(opts.limitCount));
    }
    const snapshot = await getDocs(q);
    return snapshot.docs;
  }

  async getOrderedDocuments(colRef: CollectionReference, orderField = "order") {
    const q = query(colRef, orderBy(orderField, "asc"));
    const snapshot = await getDocs(q);
    return snapshot.docs;
  }

  subscribeDocSnapshot(
    docRef: DocumentReference,
    onNext: (snap: DocumentSnapshot) => void,
    onError?: (error: Error) => void
  ) {
    return onSnapshot(docRef, onNext, onError);
  }

  subscribeQuerySnapshot(
    q: Query,
    onNext: (snap: import("firebase/firestore").QuerySnapshot) => void,
    onError?: (error: Error) => void
  ) {
    return onSnapshot(q, onNext, onError);
  }

  async getSubCollectionCount(parentCol: string, parentId: string, subCol: string) {
    const colRef = collection(getDb(), parentCol, parentId, subCol);
    const snapshot = await getCountFromServer(colRef);
    return snapshot.data().count;
  }

  docToData<T>(docSnap: QueryDocumentSnapshot): T {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
}

export default FirestoreApi;
