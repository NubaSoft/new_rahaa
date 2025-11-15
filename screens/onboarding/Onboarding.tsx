import axios from "axios"
import React, { useEffect, useRef } from "react"
import { Alert, Animated, Dimensions, Easing, Image, StyleSheet, View } from "react-native"

import Address from "./Address"
import HowItWorks from "./HowItWorks"
import UserProfile from "./UserProfile"
import { config } from "../../config"

const windowWidth = Dimensions.get("window").width
const bgImage = require("../../assets/images/login-background.png")

const Profile = ({ route, navigation }) => {
  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const registerData = route.params.registerdata

  const completeprofileHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }
  const completeresidenceHandler = (gender, ht, wt) => {
    Animated.timing(pageAnim, {
      toValue: 1,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()

    registerData.gender = gender
    registerData.weight = wt
    registerData.height = ht
  }

  const senddatahandler = (areaValue, block, building, jadda, street, flat, floor, notes) => {
    registerData.addressDetails.area = areaValue
    registerData.addressDetails.block = block
    registerData.addressDetails.street = street
    registerData.addressDetails.jadda = jadda
    registerData.addressDetails.building = building
    registerData.addressDetails.floor = floor
    registerData.addressDetails.flat = flat
    registerData.addressDetails.notes = notes

    // Checking if the user already registered before
    axios
      .post(config.baseURL + "/api/register/signupAddPersonalData", registerData)
      .then(response => {
        if (response.data.message === "success") {
          Alert.alert("You registered successfully!")
          navigation.navigate("account")
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  useEffect(() => {
    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(0.5)),
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }, [transAnim])

  return (
    <View>
      {/* Animated background */}
      <Animated.View
        style={{
          width: "100%",
          height: "100%",
          transform: [
            {
              translateX: transAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-320, -200],
              }),
            },
          ],
        }}>
        <Image source={bgImage} style={styles.bgImageStyle} resizeMode="cover"></Image>
      </Animated.View>

      {/* Left Profile Icon */}
      <Animated.View
        style={[
          styles.leftCoverWrapper,
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
        <UserProfile profileHandler={completeresidenceHandler} />
      </Animated.View>

      <Animated.View
        style={[
          styles.leftCoverWrapper,
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
        <HowItWorks handler={completeprofileHandler} />
      </Animated.View>

      <Animated.View
        style={[
          styles.leftCoverWrapper,
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
        <Address handler={senddatahandler} />
      </Animated.View>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  bgImageStyle: {
    height: "100%",
    width: "250%",
  },

  leftCoverWrapper: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
})
