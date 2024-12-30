//firestoreService.js
////////////////////////
import { doc, getDoc, collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase/firebase-config";

export const saveMessageToFirestore = async (conversationId, message) => {
  try {
    if (!conversationId || !message) {
      throw new Error("Invalid conversationId or message data");
    }

    console.log("Saving message to Firestore:", message);

    // Fetch the parent conversation document
    const conversationDocRef = doc(db, "conversations", conversationId);
    const conversationDoc = await getDoc(conversationDocRef);

    if (!conversationDoc.exists()) {
      throw new Error(`Conversation with ID ${conversationId} does not exist`);
    }

    // Check if the user owns the conversation or if the message is from Beta
    const userId = conversationDoc.data().userId;
    if (message.senderId !== "Beta" && userId !== message.senderId) {
      throw new Error("User does not own the conversation");
    }

    // Reference the messages sub-collection
    const messagesRef = collection(db, "conversations", conversationId, "messages");

    // Add the message
    const docRef = await addDoc(messagesRef, {
      ...message,
      timestamp: Timestamp.now(), // Add a Firestore timestamp
    });

    console.log(`Message saved to Firestore with ID: ${docRef.id}`);
    return docRef.id;
  } catch (error) {
    console.error("Error saving message to Firestore:", error);
    throw error;
  }
};

