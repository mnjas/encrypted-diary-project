import React, { useState } from 'react';
import PasswordInput from './components/PasswordInput';
import JournalEntryForm from './components/JournalEntryForm';
import JournalList from './components/JournalList';
import CryptoJS from 'crypto-js';
import './App.css';
import logo from './logo-ecv.png';

interface Entry {
    id: string;
    content: string;
}

const App: React.FC = () => {
    const [password, setPassword] = useState('');
    // stocker la liste des entrées du journal
    const [entries, setEntries] = useState<Entry[]>([]);
    // stocker l'entrée actuellement sélectionnée pour la lecture
    const [currentEntry, setCurrentEntry] = useState<Entry | null>(null);
    // stocker le message déchiffré de l'entrée sélectionnée
    const [decryptedContent, setDecryptedContent] = useState<string | null>(null);
    // stocker le mot de passe saisi pour lire une entrée spécifique
    const [readPassword, setReadPassword] = useState<string>('');
    // stocker les messages d'erreur
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    //désactive le bouton 'confirmer le mot de passe' une fois entré
    const [isPasswordConfirmed, setIsPasswordConfirmed] = useState<boolean>(false);

    // add une nouvelle entrée dans le journal
    const handleAddEntry = (entry: Entry) => {
        setEntries([...entries, entry]);
    };

    // supprimer une entrée du journal via son id
    const handleDeleteEntry = (id: string) => {
        setEntries(entries.filter(entry => entry.id !== id));
        // réinitialise l'entrée et le message décrypté si l'entrée supprimée est celle en cours de lecture
        if(currentEntry?.id === id){
            setCurrentEntry(null);
            setDecryptedContent(null);
        }
    };

    // update une entrée du journal
    const handleUpdateEntry = (id: string, updatedContent: string) => {
        setEntries(
            entries.map(entry =>
                entry.id === id ? { ...entry, content: updatedContent } : entry
            )
        );

        // si l'entrée actuellement sélectionnée est mise à jour essaie de décrypter le message mis à jour
        if(currentEntry?.id === id){
            try{
                const bytes = CryptoJS.AES.decrypt(updatedContent, password);
                const newDecryptedContent = bytes.toString(CryptoJS.enc.Utf8);
                setDecryptedContent(newDecryptedContent);
            } catch {
                setErrorMessage('Mot de passe incorrect');
            }
        }
    };

    // sélectionner une entrée pour la lire
    const handleReadEntry = (entry: Entry) => {
        setCurrentEntry(entry);
        setDecryptedContent(null); // réinitialise le message décrypté avant la lecture
        setErrorMessage(null);
        setIsPasswordConfirmed(false)
    };

    // confirmer le mot de passe avant de lire une entrée cryptée
    const handleReadConfirm = () => {
        if (currentEntry) {
            try {
                const bytes = CryptoJS.AES.decrypt(currentEntry.content, readPassword);
                const decrypted = bytes.toString(CryptoJS.enc.Utf8);
                if(decrypted){
                    // mot de passe est correct, affiche le message décrypté
                    setDecryptedContent(decrypted);
                    setErrorMessage(null);
                    setIsPasswordConfirmed(true);
                } else {
                    setErrorMessage('Mot de passe incorrect');
                    setDecryptedContent(null);
                }
            } catch {
                setErrorMessage('Mot de passe incorrect');
                setDecryptedContent(null);
            }
        }
    };

    return (
        <div className='container'>
            <div className="container_name">
                <p className='name'>Jason MENNECHET<br />M2 DEV</p>
                <img src={logo} alt="Logo" className='logo'/>
            </div>

            <h1>Journal encrypté</h1>
            {/* entrer le mot de passe global pour le chiffrement */}
            <PasswordInput onSubmit={setPassword} />
            {/* formulaire pour ajouter une nouvelle entrée */}
            <JournalEntryForm onAddEntry={handleAddEntry} password={password} />
            {/* liste des entrées du journal avec options de lecture, de mise à jour, et suppression */}
            <JournalList
                entries={entries}
                onDelete={handleDeleteEntry}
                onUpdate={handleUpdateEntry}
                onRead={handleReadEntry}
                password={password}
            />
            {/* confirmer le mot de passe avant de lire le message crypté */}
            {currentEntry && (
                <div>
                    <input
                        type="password"
                        placeholder="Entrez votre mot de passe pour lire"
                        value={readPassword}
                        onChange={(e) => setReadPassword(e.target.value)}
                    />
                    <button onClick={handleReadConfirm} disabled={isPasswordConfirmed}>Confirmer le mot de passe</button>
                </div>
            )}
            {decryptedContent && (
                <div>
                    <h2>Entrée décryptée :</h2>
                    <p>{decryptedContent}</p>
                </div>
            )}
            {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
        </div>
    );
};

export default App;
