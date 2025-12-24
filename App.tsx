import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import React, { useEffect } from "react"

import "react-native-gesture-handler"

import { customFontsToLoad } from "./app/theme"
import Authentication from "./screens/auth/Authentication"
import LandingScreen from "./screens/auth/LandingScreen"
import SigninScreen from "./screens/auth/SigninScreen"
import RegisterScreen from "./screens/auth/RegisterScreen"
import { BrowseMenu } from "./screens/browse/BrowseMenu"
import { BrowsePackages } from "./screens/browse/BrowsePackages"
import BuySubscription from "./screens/buy-subscription/BuySubscription"
import Food from "./screens/food/Food"
import Loading from "./screens/loading/loading"
import Onboarding from "./screens/onboarding/Onboarding"
import Pay from "./screens/pay/Pay"
import Renewal from "./screens/renewal/Renewal"
import UserInfo from "./screens/userInfo/UserInfo"
import DislikeAllergies from "./screens/userInfo/DislikeAllergies"
import Update_DislikeIngredient from "./screens/userInfo/Update_DislikeIngredient"
import Update_DislikeMeals from "./screens/userInfo/Update_DislikeMeals"
import Update_Allergy from "./screens/userInfo/Update_Allergy"
import CompleteProfile from "./screens/onboarding/UserProfile"
import DislikeIngredient from "./screens/onboarding/DislikeIngredient"
import DislikeMeals from "./screens/onboarding/DislikeMeals"
import Allergy from "./screens/onboarding/Allergy"
import HowItWorks from "./screens/onboarding/HowItWorks"
import Address from "./screens/onboarding/Address"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import messaging from '@react-native-firebase/messaging';

// import { firebase } from '@react-native-firebase/app';

const Stack = createStackNavigator()

export default function App() {


// useEffect(() => {
//   console.log('Firebase apps:', firebase.apps);
// }, []);

  useEffect(() => {
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled = 
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const token = await messaging().getToken();
      if (token) {
        await AsyncStorage.setItem('fcmtoken', token);
      }
      console.log('FCM Token:', token);
    } else {
      Alert.alert('Notification Permission', 'Please enable notifications.');
    }
  };

  requestUserPermission();

  // Foreground listener
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    Alert.alert(
      remoteMessage.notification?.title || 'Notification',
      remoteMessage.notification?.body || ''
    );
  });

  return unsubscribe;
}, []);


  if (false/* !areFontsLoaded */) {
    return <Loading isLoading={true} />
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            gestureEnabled: false,
          }}
          initialRouteName={"LandingScreen"}>
          <Stack.Screen name="LandingScreen" component={LandingScreen} />
          <Stack.Screen name="SigninScreen" component={SigninScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="account" component={Authentication} />

          <Stack.Screen name="profile" component={Onboarding} />
          <Stack.Screen name="HowItWorks" component={HowItWorks} />
          <Stack.Screen name="CompleteProfile" component={CompleteProfile} />
          <Stack.Screen name="DislikeIngredient" component={DislikeIngredient} />
          <Stack.Screen name="DislikeMeals" component={DislikeMeals} />
          <Stack.Screen name="Allergy" component={Allergy} />
          <Stack.Screen name="Address" component={Address} />

          <Stack.Screen name="subscription" component={BuySubscription} />
          <Stack.Screen name="payment" component={Pay} />
          <Stack.Screen name="meals" component={Food} />
          <Stack.Screen name="personal" component={UserInfo} />
          <Stack.Screen name="DislikeAllergies" component={DislikeAllergies} />
          <Stack.Screen name="Update_DislikeIngredient" component={Update_DislikeIngredient} />
          <Stack.Screen name="Update_DislikeMeals" component={Update_DislikeMeals} />
          <Stack.Screen name="Update_Allergy" component={Update_Allergy} />

          <Stack.Screen name="renew" component={Renewal} />
          <Stack.Group
            screenOptions={{
              presentation: "modal",
            }}>
            <Stack.Screen name="BrowseMenu" component={BrowseMenu} />
            <Stack.Screen name="BrowsePackages" component={BrowsePackages} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}
