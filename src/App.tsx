import React, { useState } from 'react';
import PasswordInput from './components/PasswordInput';
import JournalEntryForm from './components/JournalEntryForm';
import JournalList from './components/JournalList';
import CryptoJS from 'crypto-js';
import './App.css'

interface Entry {
    id: string;
    content: string;
}

const App: React.FC = () => {
    const [password, setPassword] = useState('');
    const [entries, setEntries] = useState<Entry[]>([]);
    const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
    const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
    const [readPassword, setReadPassword] = useState<string>(''); // État pour le mot de passe de lecture
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // État pour le message d'erreur

    const handleAddEntry = (entry: Entry) => {
        setEntries([...entries, entry]);
    };

    const handleDeleteEntry = (id: string) => {
        setEntries(entries.filter(entry => entry.id !== id));
        if (currentEntry?.id === id) {
            setCurrentEntry(null);
            setDecryptedContent(null);
        }
    };

    const handleUpdateEntry = (id: string, updatedContent: string) => {
        setEntries(
            entries.map(entry =>
                entry.id === id ? { ...entry, content: updatedContent } : entry
            )
        );

        // Si l'entrée actuelle est mise à jour, on essaie de déchiffrer
        if (currentEntry?.id === id) {
            try {
                const bytes = CryptoJS.AES.decrypt(updatedContent, password);
                const newDecryptedContent = bytes.toString(CryptoJS.enc.Utf8);
                setDecryptedContent(newDecryptedContent);
            } catch {
                setErrorMessage('Mot de passe incorrect'); // Mettre à jour l'état d'erreur
            }
        }
    };

    const handleReadEntry = (entry: Entry) => {
        setCurrentEntry(entry);
        setDecryptedContent(null); // Réinitialise le contenu déchiffré avant la lecture
        setErrorMessage(null); // Réinitialiser le message d'erreur
    };

    const handleReadConfirm = () => {
        if (currentEntry) {
            try {
                const bytes = CryptoJS.AES.decrypt(currentEntry.content, readPassword);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                if (decrypted) {
                    setDecryptedContent(decrypted);
                    setErrorMessage(null); // Réinitialiser le message d'erreur
                } else {
                    setErrorMessage('Mot de passe incorrect'); // Mettre à jour l'état d'erreur
                    setDecryptedContent(null); // Réinitialiser le contenu déchiffré
                }
            } catch {
                setErrorMessage('Mot de passe incorrect'); // Mettre à jour l'état d'erreur
                setDecryptedContent(null); // Réinitialiser le contenu déchiffré
            }
        }
    };

    return (
        <div className='container'>
            <h1>Journal encrypté</h1>
            <PasswordInput onSubmit={setPassword} />
            <JournalEntryForm onAddEntry={handleAddEntry} password={password} />
            <JournalList
                entries={entries}
                onDelete={handleDeleteEntry}
                onUpdate={handleUpdateEntry}
                onRead={handleReadEntry}
                password={password} // Passer le mot de passe pour les actions
            />
            {/* Section pour confirmer le mot de passe avant de lire le contenu */}
            {currentEntry && (
                <div>
                    <input
                        type="password"
                        placeholder="Entrez votre mot de passe pour lire"
                        value={readPassword}
                        onChange={(e) => setReadPassword(e.target.value)}
                    />
                    <button onClick={handleReadConfirm}>Confirmer le mot de passe</button>
                </div>
            )}
            {decryptedContent && (
                <div>
                    <h2>Entrée décryptée :</h2>
                    <p>{decryptedContent}</p>
                </div>
            )}
            {/* Afficher le message d'erreur si présent */}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
};

export default App;
