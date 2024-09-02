/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import PushNotification from 'react-native-push-notification';
import { name as appName } from './app.json';

// Configure PushNotification for local notifications
PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)

  // Called when a local notification is received or opened
  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);

    // Process the notification

    // Call finish to let the system know you are done processing the notification
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },

  // (optional) Called when Registered Action is pressed and invokeApp is false
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },

  // (optional) Called when the user fails to register for remote notifications
  onRegistrationError: function(err) {
    console.error(err.message, err);
  },

  // (optional) Android only: Create a notification channel
  createChannel: true,

  // Should the initial notification be popped automatically
  popInitialNotification: true,

  // Request permissions (default: true)
  requestPermissions: false, // Not needed for local notifications
});

// Register the main component
AppRegistry.registerComponent(appName, () => App);
