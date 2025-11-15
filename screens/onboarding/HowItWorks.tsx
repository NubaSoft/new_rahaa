import React, { useRef } from "react"
import {
  Animated,
  StyleSheet,
  View,
  Easing,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from "react-native"

import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { lang } from "../../lang"

const crossfatLogo = require("../../assets/images/cross-fat.png")
const howItWorksImage = require("../../assets/images/how-it-works.png")

const HowItWorks = (params: any) => {
  console.log("route.params.registerdata-----", params.route.params.registerdata)

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  return (
    <View style={styles.body}>
      <Animated.View
        style={[
          styles.animatedView,
          {
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -500],
                }),
              },
            ],
          },
        ]}>
        <SafeAreaView>
          {/* <Image source={crossfatLogo} resizeMode={"cover"} /> */}
          <Text preset="t1" style={styles.howItWorksTextStyle}>
            {lang[lang.lang].how_it_works_1}
          </Text>
        </SafeAreaView>

        <View>
          <Image source={howItWorksImage} style={styles.howItWorksImageStyle} />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            params.navigation.navigate("CompleteProfile", {
              registerdata: params.route.params.registerdata,
            })
          }>
          <Text preset="button02" color={colors.white}>
            {lang[lang.lang].how_it_works_5}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

export default HowItWorks

const styles = StyleSheet.create({
  body: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
  },

  button: {
    borderRadius: 14,
    backgroundColor: colors.yellow,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    marginTop: spacing.medium,
    alignSelf: "stretch",
  },
  howItWorksTextStyle: {
    marginTop: spacing.medium,
    alignSelf: "center",
  },
  howItWorksImageStyle: { marginTop: spacing.extraSmall },
  animatedView: {
    alignItems: "center",
  },
})
