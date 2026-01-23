import { FC, StrictMode, useEffect } from 'react';
import { Text } from 'react-native';
import { StateWardenContext, theOneAndOnlyStateWarden } from '@apparatus';
import { ApplicationSettingsType, defaultApplicationSettings } from '@tinker-chest';
import { ErrorBoundary, ThemeContext, themes } from '@ui';
import { useStorageState } from './hooks/useStorageState';
import { Footer, Layout, TopBar } from './layout';
import { Machine } from './machine/Machine';
import { Notices } from './notices/Notices';

export const App: FC = () => {
  // const isSystemDarkMode = useColorScheme() === 'dark'; // TODO: Find func to getDefaultApplicationSettings
  const [applicationSettings, setApplicationSettings] = useStorageState<ApplicationSettingsType>('application-settings', defaultApplicationSettings);

  useEffect(() => {
    // theOneAndOnlyStateWarden.engine.addGear(routeGear);

    // return () => {
    //     theOneAndOnlyStateWarden.engine.removeGear(routeGear.id);
    // };
  }, []);

  return (
    <StrictMode>
      <ErrorBoundary fallback={<Text>Fallback</Text>}>
        <ThemeContext.Provider value={themes[applicationSettings.theme]}>
          <StateWardenContext.Provider value={theOneAndOnlyStateWarden}>
            <Layout>
              <TopBar />
              <Machine applicationSettings={applicationSettings} onApplicationSettingsChange={setApplicationSettings} />
              <Footer />
              <Notices />
            </Layout>
          </StateWardenContext.Provider>
        </ThemeContext.Provider>
      </ErrorBoundary>
    </StrictMode>
  );
};
