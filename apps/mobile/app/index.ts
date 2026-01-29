/**
 * @format
 */
import "fast-text-encoding"; // For RxJS
import { AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { machineWard } from "./src";

AppRegistry.registerComponent(appName, () => machineWard.render);
