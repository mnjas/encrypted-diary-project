import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

interface Entry {
    id: string;
    content: string;
}

interface JournalListProps {
    entries: Entry[];
    onDelete: (id: string) => void;
    onUpdate: (id: string, updatedContent: string) => void;
    onRead: (entry: Entry) => void;
    password: string;
}

const JournalList: React.FC<JournalListProps> = ({ entries, onDelete, onUpdate, onRead, password }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState<string>('');
    const [editPassword, setEditPassword] = useState<string>('');
    const [isEditingUnlocked, setIsEditingUnlocked] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleEditClick = (id: string) => {
        setEditingId(id);
        setEditingContent('');
        setEditPassword('');
        setIsEditingUnlocked(false);
        setErrorMessage(null);
    };

    const handleUnlockEdit = () => {
        if (editingId) {
            try {
                const entry = entries.find(entry => entry.id === editingId);
                if (!entry) return;

                const bytes = CryptoJS.AES.decrypt(entry.content, editPassword);
                const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);

                if (decryptedContent) {
                    setEditingContent(decryptedContent);
                    setIsEditingUnlocked(true);
                    setErrorMessage(null);
                } else {
                    setErrorMessage('Mot de passe incorrect');
                }
            } catch {
                setErrorMessage('Mot de passe incorrect');
            }
        }
    };

    const handleSaveClick = (id: string) => {
        onUpdate(id, CryptoJS.AES.encrypt(editingContent, password).toString());
        setEditingId(null);
        setEditingContent('');
        setEditPassword('');
        setIsEditingUnlocked(false);
    };

    const handleDeleteClick = (id: string) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer ce message ?")) {
            onDelete(id);
        }
    };

    return (
        <ul>
            {entries.map((entry) => (
                <li key={entry.id}>
                    <button onClick={() => onRead(entry)}>Lire</button>

                    {editingId === entry.id ? (
                        <>
                            {!isEditingUnlocked ? (
                                <>
                                    <input
                                        type="password"
                                        placeholder="Entrez le mot de passe"
                                        value={editPassword}
                                        onChange={(e) => setEditPassword(e.target.value)}
                                    />
                                    <button onClick={handleUnlockEdit}>Confirmer</button>
                                </>
                            ) : (
                                <input
                                    type="text"
                                    value={editingContent}
                                    onChange={(e) => setEditingContent(e.target.value)}
                                />
                            )}
                        </>
                    ) : (
                        <button onClick={() => handleEditClick(entry.id)}>Update</button>
                    )}

                    {editingId === entry.id && isEditingUnlocked && (
                        <button onClick={() => handleSaveClick(entry.id)}>Sauvegarder</button>
                    )}
                    <button onClick={() => handleDeleteClick(entry.id)}>Supprimer</button>
                </li>
            ))}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </ul>
    );
};

export default JournalList;