import { FC, StrictMode, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StateWardenContext, theOneAndOnlyStateWarden, useSubjectState } from '@apparatus';
import { ApplicationSettingsType, defaultApplicationSettings } from '@tinker-chest';
import { ErrorBoundary } from '@ui';
import { useStorageState } from './hooks/useStorageState';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#d3c5aa"
  },
});

export const App: FC = () => {
  // const isSystemDarkMode = useColorScheme() === 'dark';
  const [applicationSettings, setApplicationSettings] = useStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);

  useEffect(() => {
    // document.body.setAttribute("data-theme", applicationSettings.theme);
  }, [applicationSettings.theme]);

  useEffect(() => {
    // theOneAndOnlyStateWarden.engine.addGear(routeGear);

    // return () => {
    //     theOneAndOnlyStateWarden.engine.removeGear(routeGear.id);
    // };
  }, []);

  useEffect(() => {
    console.log("START");
    console.log(theOneAndOnlyStateWarden)
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
                This is a test app
              </Text>
            </View>
          </View>
        </StateWardenContext.Provider>
      </ErrorBoundary>
    </StrictMode>
  );
};
