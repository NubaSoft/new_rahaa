import Ionicons from "react-native-vector-icons/Ionicons"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Image, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native"

import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { lang } from "../../lang"

const pkgimg = require("../../assets/box-of-food-package.png")

const SubscriptionData = ({ handler, backHandler, setIsLoading, packageData }) => {
  const [remainDays, setRemainDays] = useState("20")
  const [totalPrice, setTotalPrice] = useState("500")
  const [subsPeriod, setSubsPeriod] = useState("20")
  const [pkgName, setPkgName] = useState("20")
  const [subsStartDate, setSubsStartDate] = useState("20")
  const [subsEndDate, setSubsEndDate] = useState("20")
  const [numbermeals, setNumberMeals] = useState("20")
  const [numberSnacks, setNumberSnacks] = useState("20")
  const [SubsDataExist, setSubsDataExist] = useState(false)
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  useEffect(() => {
    setRemainDays(packageData.remainingDays)
    setTotalPrice(packageData.subscriptionPrice)
    setPkgName(packageData.subscriptionName)
    setSubsStartDate(packageData.subscriptionStartDate)
    setSubsEndDate(packageData.subscriptionEndDate)
    setNumberMeals(packageData.noOfMeals)
    setNumberSnacks(packageData.noOfSnacks)
    setSubsPeriod(packageData.subscriptionDays)
    setSubsDataExist(true)
    setIsLoading(false)
  }, [])

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <TouchableOpacity
          style={styles.backIconStyle}
          onPress={() => {
            backHandler()
          }}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          Your Package
        </Text>
      </SafeAreaView>

      {SubsDataExist ? (
        <View style={[styles.inputBody]}>
          <Animated.View
            style={{
              padding: spacing.medium,
              transform: [
                {
                  translateX: transAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -500],
                  }),
                },
              ],
            }}>
            <View style={styles.topContainer}>
              <View style={styles.remainingDaysView}>
                <Text preset="t2">{lang[lang.lang].subscription_data_19}</Text>
                <View style={styles.remainingDaysCircle}>
                  <Text preset="t3">
                    {remainDays}
                    {lang[lang.lang].subscription_data_20}
                  </Text>
                </View>
              </View>

              <View style={styles.priceWrapperStyle}>
                <Text style={styles.alignSelf} preset="t2">
                  {lang[lang.lang].subscription_data_21}
                </Text>
                <View style={styles.priceContainer}>
                  <Text style={styles.priceUnitStyle} preset="t3">
                    {lang[lang.lang].subscription_data_22}
                  </Text>

                  <Text preset="t2">{totalPrice}</Text>
                </View>
              </View>
            </View>

            <View style={styles.rowItemStyle}>
              <Text preset="t3">
                {lang[lang.lang].subscription_data_23}
                {subsPeriod}
                {lang[lang.lang].subscription_data_20}
              </Text>
            </View>
            <View style={styles.rowItemStyle}>
              <Text preset="t3">
                {lang[lang.lang].subscription_data_24}
                {pkgName}
              </Text>
            </View>

            <View style={styles.rowItemStyle}>
              <Text preset="t3">
                {lang[lang.lang].subscription_data_25}
                {subsStartDate}
              </Text>
            </View>

            <View style={styles.rowItemStyle}>
              <Text preset="t3">
                {lang[lang.lang].subscription_data_26}
                {subsEndDate}
              </Text>
            </View>

            <View style={styles.rowItemStyle}>
              <Text preset="t3">
                {lang[lang.lang].subscription_data_27}
                {numbermeals}
                {lang[lang.lang].subscription_data_28}
                {numberSnacks} {lang[lang.lang].subscription_data_29}
              </Text>
            </View>
          </Animated.View>
        </View>
      ) : (
        <View style={[styles.inputBody]}>
          <Animated.View
            style={[
              styles.alignCenter,
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
            <Image source={pkgimg} style={styles.packageImageStyle} />

            <Text preset="t2">{lang[lang.lang].subscription_data_5}</Text>
          </Animated.View>
        </View>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handler(SubsDataExist)
        }}>
        <Text preset="button02" color={colors.white}>
          {SubsDataExist
            ? lang[lang.lang].subscription_data_30
            : lang[lang.lang].subscription_data_31}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default SubscriptionData

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },

  inputBody: {
    backgroundColor: colors.lightYellow,
    borderRadius: 15,
    width: "90%",
    height: "60%",
    alignItems: "center",
    marginTop: spacing.large,
  },

  button: {
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    width: "60%",
    alignSelf: "center",
    marginTop: spacing.large,
  },

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
  rowItemStyle: {
    borderWidth: 2,
    borderRadius: 10,
    borderColor: colors.green,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    padding: spacing.extraSmall,
    marginVertical: spacing.extraSmall,
  },
  topContainer: {
    flexDirection: "row",
    alignContent: "space-between",
    justifyContent: "space-evenly",
  },
  remainingDaysView: {
    flexDirection: "column",
    marginHorizontal: "5%",
    alignItems: "center",
  },
  remainingDaysCircle: {
    height: 100,
    width: 100,
    borderWidth: 7,
    borderRadius: 200,
    borderColor: colors.green,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: spacing.tiny,
  },
  priceContainer: {
    height: 70,
    width: 120,
    backgroundColor: colors.lightGreen,
    borderRadius: 20,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    marginTop: spacing.medium,
  },
  priceUnitStyle: {
    alignSelf: "flex-start",
    marginLeft: "9%",
  },
  priceWrapperStyle: {
    marginHorizontal: "5%",
  },
  alignSelf: {
    alignSelf: "center",
  },
  alignCenter: {
    alignItems: "center",
  },
  packageImageStyle: {
    height: 150,
    width: 150,
    marginTop: "50%",
    tintColor: colors.yellow,
    marginBottom: spacing.medium,
  },
})
