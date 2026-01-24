import { FC, StrictMode, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Text } from '@mobile-ui';
import { StateWarden, StateWardenContext, useStorageState } from '@apparatus';
import { ApplicationSettingsType, getDefaultApplicationSettings } from '@tinker-chest';
import { ErrorBoundary, Theme, ThemeContext, themes } from '@ui';
import { Footer, Layout, TopBar } from './layout';
import { Machine } from './machine/Machine';
import { Notices } from './notices/Notices';

const stateWarden = new StateWarden(AsyncStorage);

export const App: FC = () => {
    const colorScheme = useColorScheme();
    const [applicationSettings, setApplicationSettings] = useStorageState<ApplicationSettingsType>(
        AsyncStorage,
        'application-settings',
        getDefaultApplicationSettings(colorScheme === 'light' ? Theme.Light : Theme.Dark)
    );

    useEffect(() => {
        // TODO: 
        // theOneAndOnlyStateWarden.engine.addGear(routeGear);

        // return () => {
        //     theOneAndOnlyStateWarden.engine.removeGear(routeGear.id);
        // };
    }, []);

    return (
        <StrictMode>
            <ErrorBoundary fallback={<Text>Fallback</Text>}>
                <ThemeContext.Provider value={themes[applicationSettings.theme]}>
                    <StateWardenContext.Provider value={stateWarden}>
                        <Layout applicationSettings={applicationSettings}>
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
