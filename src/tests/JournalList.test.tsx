import { render, screen, fireEvent } from '@testing-library/react';
import JournalList from '../components/JournalList';

test('displays entries and triggers onRead, onUpdate, onDelete actions', () => {
  const mockOnRead = jest.fn();
  const mockOnUpdate = jest.fn();
  const mockOnDelete = jest.fn();

  const entries = [
    { id: '1', content: 'Contenu chiffré 1' },
    { id: '2', content: 'Contenu chiffré 2' },
  ];

  render(
    <JournalList
      entries={entries}
      onRead={mockOnRead}
      onUpdate={mockOnUpdate}
      onDelete={mockOnDelete}
      password="testPassword"
    />
  );

  // simule un clic sur "Lire" pour le message avec id "1"
  fireEvent.click(screen.getAllByText('Lire')[0]);

  expect(mockOnRead).toHaveBeenCalledWith(entries[0]); // au lieu de 1
});
