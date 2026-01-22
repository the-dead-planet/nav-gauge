import { FC, StrictMode, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSubjectState } from '@apparatus';
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

// const theOneAndOnlyStateWarden = getTheOneAndOnlyStateWarden(new maplibregl.Map({
//     container: document.createElement('div'),
//     style: Cartomancer.styles.get('osm')!.style,
//     attributionControl: false,
//     maxPitch: 80,
// }));

// export const StateWardenContext = createContext<StateWarden>(theOneAndOnlyStateWarden);

const value$ = new BehaviorSubject(4);

export const App: FC = () => {
  // const isSystemDarkMode = useColorScheme() === 'dark';
  const [applicationSettings, setApplicationSettings] = useStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);
  // const [value, setValue] = useSubjectState(value$);

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
    const abortController= new AbortController().signal
    console.log("START");
    // console.log(theOneAndOnlyStateWarden)
  }, []);

  return (
    <StrictMode>
      <ErrorBoundary fallback={<Text>Fallback</Text>}>
        {/* <StateWardenContext.Provider value={theOneAndOnlyStateWarden}> */}
          {/* <TopBar />
              <Machine applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
              <Footer />
              <Notices /> */}
          <View style={styles.container}>
            <View>
              <Text>
                This is a test app
              </Text>
              {/* <Text>{value}</Text> */}
            </View>
          </View>
        {/* </StateWardenContext.Provider> */}
      </ErrorBoundary>
    </StrictMode>
  );
};
