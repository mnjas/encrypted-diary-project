import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

interface JournalEntryProps {
    content: string; // message crypté
    password: string; // mdp pour décrypter le message
}

const JournalEntry: React.FC<JournalEntryProps> = ({ content, password }) => {
    const [decryptedContent, setDecryptedContent] = useState<string | null>(null); // stock le message décrypté

    const decryptContent = () => {
        try {
            const bytes = CryptoJS.AES.decrypt(content, password);
            // convertit les octets déchiffrés en txt UTF-8 et met à jour le state decryptedContent
            setDecryptedContent(bytes.toString(CryptoJS.enc.Utf8));
        } catch {
            setDecryptedContent('Mot de passe incorrect');
        }
    };

    return (
        <div>
            <button onClick={decryptContent}>Décrypter</button>
            {decryptedContent && <p>{decryptedContent}</p>}
        </div>
    );
};

export default JournalEntry;