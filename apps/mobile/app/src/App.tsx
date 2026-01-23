import { FC, StrictMode, useEffect } from 'react';
import { Text, useColorScheme } from 'react-native';
import { StateWardenContext, theOneAndOnlyStateWarden } from '@apparatus';
import { ApplicationSettingsType, getDefaultApplicationSettings } from '@tinker-chest';
import { ErrorBoundary, Theme, ThemeContext, themes } from '@ui';
import { useStorageState } from './hooks/useStorageState';
import { Footer, Layout, TopBar } from './layout';
import { Machine } from './machine/Machine';
import { Notices } from './notices/Notices';

export const App: FC = () => {
  const colorScheme = useColorScheme();
  const [applicationSettings, setApplicationSettings] = useStorageState<ApplicationSettingsType>(
    'application-settings',
    getDefaultApplicationSettings(colorScheme === 'light' ? Theme.Light : Theme.Dark)
  );

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
