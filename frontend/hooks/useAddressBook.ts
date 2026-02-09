import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useCurrentAccount } from '@mysten/dapp-kit';

interface Contact {
    address: string;
    name: string;
}

export function useAddressBook() {
    const account = useCurrentAccount();
    const [contacts, setContacts] = useState<Record<string, string>>({});
    const [pinnedContacts, setPinnedContacts] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!account?.address) {
            setContacts({});
            setPinnedContacts([]);
            setIsLoading(false);
            return;
        }

        const userDocRef = doc(db, 'users', account.address);

        // Subscribe to real-time updates
        const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                setContacts(data.contacts || {});
                setPinnedContacts(data.pinnedContacts || []);
            } else {
                setContacts({});
                setPinnedContacts([]);
            }
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [account?.address]);

    const updateContactName = useCallback(async (address: string, name: string) => {
        if (!account?.address) return;

        const userDocRef = doc(db, 'users', account.address);

        try {
            await setDoc(userDocRef, {
                contacts: {
                    [address]: name
                }
            }, { merge: true });

        } catch (error) {
            console.error("Failed to update contact name:", error);
            throw error;
        }
    }, [account?.address]);

    const pinContact = useCallback(async (address: string) => {
        if (!account?.address) return;
        const userDocRef = doc(db, 'users', account.address);
        try {
            // Use arrayUnion to add to the array if not already present
            await setDoc(userDocRef, {
                pinnedContacts: arrayUnion(address)
            }, { merge: true });
        } catch (error) {
            console.error("Failed to pin contact:", error);
            throw error;
        }
    }, [account?.address]);

    const unpinContact = useCallback(async (address: string) => {
        if (!account?.address) return;
        const userDocRef = doc(db, 'users', account.address);
        try {
            // Use arrayRemove to remove from the array
            await updateDoc(userDocRef, {
                pinnedContacts: arrayRemove(address)
            });
        } catch (error) {
            console.error("Failed to unpin contact:", error);
            throw error;
        }
    }, [account?.address]);


    const getContactName = useCallback((address: string) => {
        return contacts[address] || null;
    }, [contacts]);

    return {
        contacts,
        pinnedContacts,
        isLoading,
        updateContactName,
        pinContact,
        unpinContact,
        getContactName
    };
}
