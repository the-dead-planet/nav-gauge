import { render } from '@testing-library/react-native';
import { MobileMachineWard } from '../src/machine-ward';

const machineWard = new MobileMachineWard();

test('basic test', () => {
    // render(<App />);
    // expect(screen.queryByText('This is a test app')).toBeOnTheScreen();
    const { getByText } = render(machineWard.render());
    expect(getByText('Machine')).toBeTruthy();
});