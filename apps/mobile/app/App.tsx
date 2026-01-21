import { FC, PureComponent, useEffect } from 'react';
import { StyleSheet, useColorScheme, View, Text } from 'react-native';
import { ErrorBoundary } from '@ui';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ErrorBoundary fallback={<Text>Fallback</Text>}>
      <View style={styles.container}>
        <View>
          <Text>
            This is a test app
          </Text>
        </View>
      </View>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#d3c5aa"
  },
});

export default App;
