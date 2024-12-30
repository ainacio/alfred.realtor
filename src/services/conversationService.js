// File: conversationService.js
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const ensureConversationExists = async (conversationId, userId, firstName) => {
  try {
    const conversationDocRef = doc(db, "conversations", conversationId);
    const conversationDoc = await getDoc(conversationDocRef);

    if (!conversationDoc.exists()) {
      console.log(`Creating conversation document for ID: ${conversationId}`);
      await setDoc(conversationDocRef, {
        userId,
        assistantId: "asst_0Y0kj2YOn7RC55H9tDquo340", // Example static data
        threadId: "thread_placeholder", // Replace with dynamic data
        firstName,
        createdAt: new Date().toISOString(),
      });
    } else {
      console.log(`Conversation with ID ${conversationId} already exists`);
    }
  } catch (error) {
    console.error("Error ensuring conversation exists:", error);
    throw error;
  }
};
