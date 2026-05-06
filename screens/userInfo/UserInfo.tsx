import AsyncStorage from "@react-native-async-storage/async-storage"
import React, { useEffect, useRef, useState } from "react"
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"

import EditAddress from "./EditAddress"
import Settings from "./Settings"
import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"
import Loading from "../loading/loading"

const windowWidth = Dimensions.get("window").width

const bgImage = require("../../assets/profile_bg_croped.jpg")

const Personal = ({ navigation }) => {
  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const pageAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const [isLoading, setIsLoading] = useState(false)
  const [settingsMenu, setSettingsMenu] = useState(false)

  const editProfileHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  const logoutHandler = () => {
    config.Token = ""
    AsyncStorage.setItem("keepLoggedIn", "")
    AsyncStorage.setItem("data", "")
    setIsLoading(false)
    navigation.navigate("account")
  }

  const backHandler = () => {
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }
  const setDislikeHandler = () => {
    setIsLoading(false)
    navigation.navigate("DislikeAllergies")
  }
  const personalHandler = () => {
    setIsLoading(false)
    navigation.navigate("renew")
  }
  const backMealsHandler = () => {
    navigation.navigate("meals")
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

      <Loading isLoading={isLoading} />
      {settingsMenu && (
        <TouchableOpacity
          style={styles.settingsMenu}
          onPress={() => {
            setSettingsMenu(false)
          }}>
          <View style={styles.settingsWrapper}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                config.Token = ""
                AsyncStorage.setItem("keepLoggedIn", "")
                AsyncStorage.setItem("data", "")
                navigation.navigate("account")
              }}>
              <Text preset="t2" color={colors.white}>
                {lang[lang.lang].logout}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
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
        <Settings
          editProfileHandler={editProfileHandler}
          personalHandler={personalHandler}
          settingsHandler={setSettingsMenu}
          dislikeHandler={setDislikeHandler}
          setIsLoading={setIsLoading}
          handleBack={backMealsHandler}
          logoutHandler={logoutHandler}
        />
      </Animated.View>

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
        <EditAddress backHandler={backHandler} setIsLoading={setIsLoading} />
      </Animated.View>
    </View>
  )
}

export default Personal

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
  logoutButton: {
    padding: spacing.extraSmall,
    backgroundColor: colors.green,
    borderRadius: 10,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginHorizontal: spacing.extraSmall,
  },
  settingsWrapper: {
    height: 80,
    width: 200,
    backgroundColor: colors.lightYellow,
    position: "absolute",
    right: 40,
    top: 110,
    borderRadius: 10,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsMenu: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 1000,
  },
})
