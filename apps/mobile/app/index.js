/**
 * @format
 */
import "fast-text-encoding"; // For RxJS
import { Appearance, AppRegistry } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileMachineWard } from "./src/machine-ward";
import { name as appName } from './app.json';

const machineWard = new MobileMachineWard(
    { route: null },
    AsyncStorage,
    Appearance.getColorScheme() === 'light',
);

AppRegistry.registerComponent(appName, () => machineWard.render);
