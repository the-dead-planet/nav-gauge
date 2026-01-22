import { FC, StrictMode, useEffect } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useSubjectState, StateWardenContext, theOneAndOnlyStateWarden } from '@apparatus';
import { ApplicationSettingsType, defaultApplicationSettings } from '@tinker-chest';
import { ErrorBoundary } from '@ui';
import { useStorageState } from './hooks/useStorageState';
import { BehaviorSubject } from 'rxjs';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#d3c5aa"
  },
});

const value$ = new BehaviorSubject(4);

export const App: FC = () => {
  // const isSystemDarkMode = useColorScheme() === 'dark';
  const [applicationSettings, setApplicationSettings] = useStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);
  const [value, setValue] = useSubjectState(value$);

  useEffect(() => {
    // document.body.setAttribute("data-theme", applicationSettings.theme);
  }, [applicationSettings.theme]);

  useEffect(() => {
    // theOneAndOnlyStateWarden.engine.addGear(routeGear);

    // return () => {
    //     theOneAndOnlyStateWarden.engine.removeGear(routeGear.id);
    // };
  }, []);

  return (
    <StrictMode>
      <ErrorBoundary fallback={<Text>Fallback</Text>}>
        <StateWardenContext.Provider value={theOneAndOnlyStateWarden}>
          {/* <TopBar />
              <Machine applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
              <Footer />
              <Notices /> */}
          <View style={styles.container}>
            <View>
              <Text>
                This is a test app {value}
              </Text>
              <Button onPress={() => setValue(prev => prev + 1)} title='+' />
              {/* <Text>{value}</Text> */}
            </View>
          </View>
        </StateWardenContext.Provider>
      </ErrorBoundary>
    </StrictMode>
  );
};
