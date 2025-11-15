import Ionicons from "react-native-vector-icons/Ionicons"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, View, Image, TouchableOpacity, SafeAreaView } from "react-native"
import { WebView } from "react-native-webview"

import { Text } from "../../app/components"
import { colors, spacing, globalStyle } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const check = require("../../assets/check.png")
const cross = require("../../assets/cross.png")

const PaymentLinking = ({ handler, paymentURL, handleBack }) => {
  const [newURL, setNewURL] = useState("")
  const [paymentstat, setPaymentStat] = useState(0)
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  useEffect(() => {
    if (newURL.includes(config.baseURL)) {
      setTimeout(() => {
        axios
          .post(
            config.baseURL + "/api/paymentStatus",
            {
              paymentId: newURL.split("paymentId=")[1].split("&")[0],
            },
            {
              headers: {
                Authorization: `bearer ${config.Token}`,
              },
            },
          )
          .then(response => {
            console.log(response.data.message)
            if (response.data.message === "success") {
              setPaymentStat(1)
            } else {
              setPaymentStat(2)
            }
          })
          .catch(() => {
            // do nothing
          })
      }, 3000)
    }
  }, [newURL])

  if (paymentstat === 1) {
    return (
      <View
        style={[
          styles.flex,
          {
            backgroundColor: colors.white,
          },
        ]}>
        <SafeAreaView style={styles.safeAreaViewStyle}>
          <Text preset="button01" color={colors.white} style={styles.headingText}>
            Payment Success
          </Text>
        </SafeAreaView>

        <Animated.View
          style={[
            styles.animatedViewStyle,
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
          <Image source={check} style={styles.checkmarkImageStyle} />
          <Text
            preset="button02"
            style={{
              marginVertical: spacing.medium,
            }}>
            {lang[lang.lang].payment_16}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              handler(1)
            }}>
            <Text preset="button02" color={colors.white}>
              {lang[lang.lang].payment_17}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )
  } else if (paymentstat === 0) {
    return (
      <View style={styles.flex}>
        <SafeAreaView style={styles.safeAreaViewStyle}>
          <TouchableOpacity
            style={styles.backIconStyle}
            onPress={() => {
              handleBack()
            }}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="button01" color={colors.white} style={styles.headingText}>
            Payment
          </Text>
        </SafeAreaView>

        <WebView
          onNavigationStateChange={link => {
            setNewURL(link.url)
          }}
          source={{
            uri: paymentURL,
          }}
        />
      </View>
    )
  } else {
    return (
      <View style={styles.body}>
        <SafeAreaView style={styles.safeAreaViewStyle}>
          <TouchableOpacity
            style={styles.backIconStyle}
            onPress={() => {
              handleBack()
            }}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="button01" color={colors.white} style={styles.headingText}>
            Payment
          </Text>
        </SafeAreaView>
        <Animated.View
          style={{
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -500],
                }),
              },
            ],
            ...globalStyle.columnCenter,
          }}>
          <Image source={cross} style={styles.crossImageStyle} />
          <Text preset="button02">{lang[lang.lang].payment_18}</Text>
        </Animated.View>

        <TouchableOpacity
          style={[styles.button, { marginTop: spacing.huge }]}
          onPress={() => {
            handler(2)
          }}>
          <Text preset="button02" color={colors.white}>
            {lang[lang.lang].payment_19}
          </Text>
        </TouchableOpacity>
      </View>
    )
  }
}

export default PaymentLinking

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },

  animatedViewStyle: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  button: {
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    width: "60%",
    alignSelf: "center",
  },
  crossImageStyle: { height: 50, width: 50, marginVertical: spacing.medium },
  safeAreaViewStyle: {
    backgroundColor: colors.yellow,
    width: "100%",
    alignItems: "center",
    paddingTop: spacing.extraSmall,
  },
  headingText: {
    marginBottom: spacing.medium,
  },
  backIconStyle: {
    position: "absolute",
    left: 10,
    bottom: 14,
  },
  flex: {
    flex: 1,
  },
  checkmarkImageStyle: { height: 100, width: 100 },
})
