/**
 * @format
 */
import { AppRegistry } from 'react-native';
import App from './App';
import './firebase-messaging'; // background handler
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
