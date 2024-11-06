import React, { useState } from 'react';
import CryptoJS from 'crypto-js';

interface JournalEntryProps {
    content: string;
    password: string;
}

const JournalEntry: React.FC<JournalEntryProps> = ({ content, password }) => {
    const [decryptedContent, setDecryptedContent] = useState<string | null>(null);

    const decryptContent = () => {
        try {
            const bytes = CryptoJS.AES.decrypt(content, password);
            setDecryptedContent(bytes.toString(CryptoJS.enc.Utf8));
        } catch {
            setDecryptedContent('Mot de passe incorrecte');
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