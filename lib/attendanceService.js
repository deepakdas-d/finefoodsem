import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    where,
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "attendance";

export async function addAttendance(data) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getAttendanceRecords(filters = {}) {
    let q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));

    if (filters.employeeId) {
        q = query(
            collection(db, COLLECTION_NAME),
            where("employeeId", "==", filters.employeeId),
            orderBy("date", "desc")
        );
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function getAttendanceById(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
}

export async function updateAttendance(id, data) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
}

export async function deleteAttendance(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
}
