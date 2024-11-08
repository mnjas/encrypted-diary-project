import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JournalEntry from '../components/JournalEntry';
import CryptoJS from 'crypto-js';

describe('JournalEntry', () => {
  const content = 'ceci est une entrée de test';
  const password = 'testPassword';
  const encryptedContent = CryptoJS.AES.encrypt(content, password).toString();

  test('affiche le bouton de décryptage', () => {
    render(<JournalEntry content={encryptedContent} password={password} />);
    expect(screen.getByText('Décrypter')).toBeInTheDocument();
  });

  test('décrypte puis affiche le contenu avec le bon mot de passe', () => {
    render(<JournalEntry content={encryptedContent} password={password} />);
    
    fireEvent.click(screen.getByText('Décrypter'));
    
    expect(screen.getByText(content)).toBeInTheDocument();
  });
});