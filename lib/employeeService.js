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
    serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_NAME = "employees";

export async function addEmployee(data) {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        createdAt: serverTimestamp(),
    });
    return docRef.id;
}

export async function getEmployees() {
    const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}

export async function getEmployeeById(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDoc(docRef);
    if (!snapshot.exists()) return null;
    return { id: snapshot.id, ...snapshot.data() };
}

export async function updateEmployee(id, data) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
}

export async function deleteEmployee(id) {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
}
