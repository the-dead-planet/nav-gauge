import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { App } from '../src/ErrorFallback';

test('basic test', () => {
    // render(<App />);
    // expect(screen.queryByText('This is a test app')).toBeOnTheScreen();
    const { getByText } = render(<App />);
    expect(getByText('This is a test app')).toBeTruthy();
});