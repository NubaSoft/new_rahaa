import Ionicons from "react-native-vector-icons/Ionicons"
import { useNavigation } from "@react-navigation/native"
import React, { useEffect, useState } from "react"
import {
  Keyboard,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native"

import { Text } from "../../app/components"
import { colors, globalStyle, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

Keyboard.dismiss()

// const handleOpenWithLinking = () => {
//   Linking.openURL(config.instagramLink)
// }

const crossFatLogo = require("../../assets/images/cross-fat.png")

const Welcome = ({ handler, setIsLoading }) => {
  const navigation = useNavigation<any>()
  const statusBarHeight = StatusBar.currentHeight
  const topHeight = Platform.OS === "ios" ? 70 : statusBarHeight
  const [_, setLanguage] = useState(lang.lang)

  useEffect(() => {
    // setIsLoading(false)
    Keyboard.dismiss()
  }, [])

  const onChangeLanguage = () => {
    if (lang.lang === "ar") {
      lang.lang = "en"
      setLanguage(lang.lang)
    } else {
      lang.lang = "ar"
      setLanguage(lang.lang)
    }
  }
  const bgImage = require("../../assets/images/login-background.png")

  return (
    <ImageBackground
      style={[{ height: "100%", width: "100%", alignSelf: "center", alignItems: "center" }]}
      imageStyle={[{ resizeMode: "cover", height: "100%", width: "100%", alignSelf: "center" }]}
      source={bgImage}>
      {/* <Image
        source={crossFatLogo}
        resizeMode={"contain"}
        style={[
          styles.logoStyle,
          {
            marginTop: topHeight,
          },
        ]}
      /> */}
      <Image
        source={require("../../assets/icon.png")}
        resizeMode="contain"
        style={styles.logoIconStyle}
      />
      <View
        style={[
          styles.headerView,
          {
            top: topHeight,
          },
        ]}>
        <TouchableOpacity style={globalStyle.rowCenter} onPress={onChangeLanguage}>
          <Text
            preset="t3"
            color={colors.yellow}
            text={lang.lang === "ar" ? "English" : "العربية"}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={() => Linking.openURL(`tel:+96565779943`)}
        style={{ marginTop: 16 }}>
        <Text color={colors.yellow} preset="t2">
          +96565779943
        </Text>
      </TouchableOpacity>
      <View style={styles.innerContainer}>
        {/* <View style={styles.infoContainer}>
          <View style={styles.whatsappContainer}>
            <Ionicons name="logo-whatsapp" size={25} color={colors.yellow} />
            <Text
              preset="t2"
              color={colors.black}
              text={config.contactNumber2}
              style={styles.textStyle}
            />
          </View>

          <View style={styles.whatsappContainer}>
            <Ionicons name="logo-instagram" size={25} color={colors.yellow} />
            <TouchableOpacity onPress={() => handleOpenWithLinking()}>
              <Text
                preset="t2"
                color={colors.black}
                text={config.instagramName}
                style={styles.textStyle}
              />
            </TouchableOpacity>
          </View>
        </View> */}
        {/* <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            navigation.navigate("BrowseMenu")
          }}>
          <Text preset="button02" color={colors.white} text={lang[lang.lang].welcome_browse_menu} />
        </TouchableOpacity> */}
        {/* <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => {
            navigation.navigate("BrowsePackages")
          }}>
          <Text
            preset="button02"
            color={colors.white}
            text={lang[lang.lang].welcome_browse_packages}
          />
        </TouchableOpacity> */}
        <TouchableOpacity
          style={styles.buttonStyle}
          onPress={() => navigation.navigate("SigninScreen")}>
          <Text preset="button02" color={colors.white} text={lang[lang.lang].welcome_button} />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

export default Welcome

const styles = StyleSheet.create({
  body: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignSelf: "center",
    // position: "absolute",
    alignItems: "center",
  },

  buttonStyle: {
    width: "80%",
    paddingVertical: spacing.small,
    borderRadius: 14,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.extraSmall,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: colors.lightGreen,
    padding: spacing.extraSmall,
    borderRadius: 10,
    marginVertical: spacing.medium,
  },
  logoStyle: {
    width: 140,
    height: 32,
  },
  whatsappContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginHorizontal: spacing.extraSmall,
  },
  textStyle: {
    marginHorizontal: spacing.tiny,
  },
  logoIconStyle: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: spacing.extraLarge * 2.7,
  },
  innerContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    paddingBottom: spacing.large,
  },

  headerView: {
    position: "absolute",
    zIndex: 999,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.medium,
  },
})
