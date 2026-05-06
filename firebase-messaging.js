import messaging from '@react-native-firebase/messaging';

export const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return authStatus;
};

export const getToken = async () => {
  return await messaging().getToken();
};

export const onMessageListener = () => {
  return messaging().onMessage(async remoteMessage => {
    console.log('Foreground message:', remoteMessage);
  });
};

export const onTokenRefreshListener = () => {
  return messaging().onTokenRefresh(token => {
    console.log('Token refreshed:', token);
  });
};