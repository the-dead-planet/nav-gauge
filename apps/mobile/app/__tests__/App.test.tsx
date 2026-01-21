import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

test('basic test', () => {
  render(<App />);
  expect(screen.queryByText('This is a test app')).toBeOnTheScreen();
});