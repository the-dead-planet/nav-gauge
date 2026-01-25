import { View } from 'react-native';
import { ErrorBoundaryProps } from '@ui';

export const ErrorFallback: ErrorBoundaryProps['fallbackComponent'] = () => {
    return (
        <View>
            Error fallback
        </View>
    );
};
