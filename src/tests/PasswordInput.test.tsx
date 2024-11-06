import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PasswordInput from '../components/PasswordInput';

describe('PasswordInput', () => {
    it('submits the entered password', () => {
        const mockSubmit = jest.fn();
        render(<PasswordInput onSubmit={mockSubmit} />);

        const input = screen.getByPlaceholderText('Écrivez votre MDP');
        const submitButton = screen.getByText('Envoyer');

        fireEvent.change(input, { target: { value: 'test-password' } });
        fireEvent.click(submitButton);

        expect(mockSubmit).toHaveBeenCalledWith('test-password');
        expect(input).toHaveValue('');
    });
});