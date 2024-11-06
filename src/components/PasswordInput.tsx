import React, { useState } from 'react';

interface PasswordInputProps {
    onSubmit: (password: string) => void; // envoi le mdp au composant parent
}

const PasswordInput: React.FC<PasswordInputProps> = ({ onSubmit }) => {
    const [password, setPassword] = useState(''); // stock le mdp

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(password);
        setPassword('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Écrivez votre mot de passe"
            />
            <button type="submit">Envoyer</button>
        </form>
    );
};

export default PasswordInput;