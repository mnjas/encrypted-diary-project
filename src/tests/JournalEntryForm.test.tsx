import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import JournalEntryForm from '../components/JournalEntryForm';
import CryptoJS from 'crypto-js';

test('encrypts and submits the entry content', () => {
    const mockOnAddEntry = jest.fn();
    render(<JournalEntryForm onAddEntry={mockOnAddEntry} password="testPassword" />);
  
    const textarea = screen.getByPlaceholderText('Écrire ...');
    const button = screen.getByText('Ajouter');
  
    fireEvent.change(textarea, { target: { value: 'Test entry content' } });
    fireEvent.click(button);
  
    expect(mockOnAddEntry).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        content: expect.any(String),
      })
    );
  });