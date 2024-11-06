import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';

describe('App', () => {
    it('adds, reads, and shows error for incorrect password', () => {
        render(<App />);

        // ajout d'une entrée
        const passwordInput = screen.getByPlaceholderText('Écrivez votre MDP');
        fireEvent.change(passwordInput, { target: { value: 'test-password' } });
        fireEvent.click(screen.getByText('Envoyer'));

        const contentTextarea = screen.getByPlaceholderText('Écrire ...');
        fireEvent.change(contentTextarea, { target: { value: 'Mon texte secret' } });
        fireEvent.click(screen.getByText('Ajouter'));

        // lire l'entrée avec un mot de passe incorrect
        fireEvent.click(screen.getAllByText('Lire')[0]);

        const readPasswordInput = screen.getByPlaceholderText('Entrez votre mot de passe pour lire');
        fireEvent.change(readPasswordInput, { target: { value: 'wrong-password' } });
        fireEvent.click(screen.getByText('Confirmer le mot de passe'));

        expect(screen.getByText('Mot de passe incorrect')).toBeInTheDocument();

        //lire l'entrée avec le mot de passe correct
        fireEvent.change(readPasswordInput, { target: { value: 'test-password' } });
        fireEvent.click(screen.getByText('Confirmer le mot de passe'));

        expect(screen.queryByText('Mot de passe incorrect')).not.toBeInTheDocument();
        expect(screen.getByText('Mon texte secret')).toBeInTheDocument();
    });
});
