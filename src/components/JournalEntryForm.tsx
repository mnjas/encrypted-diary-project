import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

interface JournalEntryFormProps {
    onAddEntry: (entry: { id: string; content: string }) => void;
    password: string;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({ onAddEntry, password }) => {
    const [content, setContent] = useState(''); // stock le contenu de l'entrée

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const encryptedContent = CryptoJS.AES.encrypt(content, password).toString(); // chiffrement du contenu de l'entrée avec le mdp
        onAddEntry({ id: Date.now().toString(), content: encryptedContent }); // call la fonction pour ajouter la nouvelle entrée
        setContent('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Écrire ..."
            ></textarea>
            <button type="submit" disabled={!password}>Ajouter</button>
        </form>
    );
};

export default JournalEntryForm;