import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Dimensions, Easing, Image, Keyboard, StyleSheet, View } from "react-native"

import LandingScreen from "./LandingScreen"
import RegisterScreen from "./RegisterScreen"
import SigninScreen from "./SigninScreen"
import { config } from "../../config"
import Loading from "../loading/loading"

const windowWidth = Dimensions.get("window").width

const bgImage = require("../../assets/images/login-background.png")
Keyboard.dismiss()

const Account = ({ navigation }) => {
  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const [isLoading, setIsLoading] = useState(false)

  const registerHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 1,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()

    setIsLoading(false)
  }

  const loginHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()

    setIsLoading(false)
  }

  const backHandlerWelcome = () => {
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()

    setIsLoading(false)
  }

  const profileHandler = registerdata => {
    navigation.navigate("profile", {
      registerdata,
    })
    // Make the login is the current default value to return to it after registeration process

    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()

    setIsLoading(false)
  }
  const checkUserExistance = mobilephone => {
    axios
      .post(config.baseURL + "/api/register/signupGetUserPersonlInfo", {
        mobileNumber: mobilephone,
      })
      .then(response => {
        setIsLoading(false)
        Animated.timing(pageAnim, {
          toValue: 0.5,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start()

        if (response.data.registerUser === 2) {
          // user tried before to do registration but he didn’t complete
          navigation.navigate("subscription", {
            fromWhere: "Account",
          })
        } else if (response.data.registerUser === 1) {
          navigation.navigate("meals")
          // navigation.navigate("personal");
        }
        // Make the login is the current default value to return to it in logout process
      })
      .catch(e => {
        setIsLoading(false)
        console.log(e)
      })
  }

  const AfterLoginHandler = mobilephone => {
    // Check user information to navigate
    checkUserExistance(mobilephone)
  }

  useEffect(() => {
    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(0.5)),
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }, [transAnim])

  const _retrieveData = async () => {
    try {
      const data = JSON.parse(await AsyncStorage.getItem("data"))

      config.Token = data.accessToken
      config.profile = data

      if (data !== "") {
        setIsLoading(true)
        checkUserExistance(+data.mobileNumber)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    _retrieveData()
  }, [])

  return (
    <View style={styles.flex}>
      <Animated.View
        style={{
          transform: [
            {
              translateX: transAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0],
              }),
            },
          ],
        }}>
        <Image source={bgImage} style={styles.bgImageStyle} resizeMode="cover"></Image>
      </Animated.View>

      <Loading isLoading={isLoading} />
      <Animated.View
        style={[
          styles.body,
          {
            transform: [
              {
                translateX: pageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -2 * windowWidth],
                }),
              },
            ],
          },
        ]}>
        <LandingScreen handler={loginHandler} setIsLoading={setIsLoading} />
      </Animated.View>

      <Animated.View
        style={[
          styles.body,
          {
            transform: [
              {
                translateX: pageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [windowWidth, -windowWidth],
                }),
              },
            ],
          },
        ]}>
        <SigninScreen
          handler={registerHandler}
          AfterLoginHandler={AfterLoginHandler}
          setIsLoading={setIsLoading}
          backHandlerWelcome={backHandlerWelcome}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.body,
          {
            transform: [
              {
                translateX: pageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2 * windowWidth, 0],
                }),
              },
            ],
          },
        ]}>
        <RegisterScreen
          handler={loginHandler}
          profileHandler={profileHandler}
          setIsLoading={setIsLoading}
          backHandlerWelcome={backHandlerWelcome}
        />
      </Animated.View>
    </View>
  )
}

export default Account

const styles = StyleSheet.create({
  bgImageStyle: {
    height: "100%",
    width: "100%",
    alignSelf: "center",
  },

  body: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    alignItems: "center",
    zIndex: 988,
  },

  flex: { flex: 1 },
})
