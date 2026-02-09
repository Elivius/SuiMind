import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface Contact {
    address: string;
    name: string;
}

export function useAddressBook() {
    const account = useCurrentAccount();
    const [contacts, setContacts] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!account?.address) {
            setContacts({});
            setIsLoading(false);
            return;
        }

        const userDocRef = doc(db, 'users', account.address);

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setContacts(data.contacts || {});
            } else {
                setContacts({});
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [account?.address]);

    const updateContactName = useCallback(async (address: string, name: string) => {
        if (!account?.address) return;

        const userDocRef = doc(db, 'users', account.address);

        try {
            // We use setDoc with merge: true to ensure the document exists and update the specific field
            // Note: We are storing contacts as a map in the 'contacts' field of the user document
            // structure: users/{userAddress} -> { contacts: { "0x123...": "Bob", "0xabc...": "Alice" } }
            await setDoc(userDocRef, {
                contacts: {
                    [address]: name
                }
            }, { merge: true });

            // Optimistic update is handled by the snapshot listener
        } catch (error) {
            console.error("Failed to update contact name:", error);
            throw error;
        }
    }, [account?.address]);

    const getContactName = useCallback((address: string) => {
        return contacts[address] || null;
    }, [contacts]);

    return {
        contacts,
        isLoading,
        updateContactName,
        getContactName
    };
}
