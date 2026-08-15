/**
 * @format
 */
import "fast-text-encoding"; // For RxJS
import { AppRegistry, Platform, UIManager } from 'react-native';
import { name as appName } from './app.json';
import { machineWard } from "./src";

if (Platform.OS === 'android') {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

AppRegistry.registerComponent(appName, () => machineWard.render);
