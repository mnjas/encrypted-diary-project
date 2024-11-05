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
    onRead: (entry: Entry) => void; // Modification pour passer l'entrée entière
    password: string;
}

const JournalList: React.FC<JournalListProps> = ({ entries, onDelete, onUpdate, onRead, password }) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState<string>('');

    const handleEditClick = (id: string, encryptedContent: string) => {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
            const decryptedContent = bytes.toString(CryptoJS.enc.Utf8);
            if (decryptedContent) {
                setEditingId(id);
                setEditingContent(decryptedContent); // Place le contenu déchiffré dans l'input
            }
        } catch {
            alert('Mot de passe incorrect');
        }
    };

    const handleSaveClick = (id: string) => {
        onUpdate(id, CryptoJS.AES.encrypt(editingContent, password).toString());
        setEditingId(null);
        setEditingContent('');
    };

    return (
        <ul>
            {entries.map((entry) => (
                <li key={entry.id}>
                    {editingId === entry.id ? (
                        <input
                            type="text"
                            value={editingContent}
                            onChange={(e) => setEditingContent(e.target.value)}
                        />
                    ) : (
                        <button onClick={() => onRead(entry)}>Lire</button> // Passer l'entrée complète ici
                    )}
                    {editingId === entry.id ? (
                        <button onClick={() => handleSaveClick(entry.id)}>Sauvegarder</button>
                    ) : (
                        <button onClick={() => handleEditClick(entry.id, entry.content)}>Update</button>
                    )}
                    <button onClick={() => onDelete(entry.id)}>Supprimer</button>
                </li>
            ))}
        </ul>
    );
};

export default JournalList;
