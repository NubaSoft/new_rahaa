import Ionicons from "react-native-vector-icons/Ionicons"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Image, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native"
import { ScrollView } from "react-native-gesture-handler"

import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const pkgimg = require("../../assets/box-of-food-package.png")

const ActiveSubscriptions = ({
  handler,
  backHandler,
  setIsLoading,
  selectPackageHandler,
  RenewalProcessHandler,
}) => {
  const [activeSubs, setActiveSubs] = useState([])
  const [SubsDataExist, setSubsDataExist] = useState(false)
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0


  useEffect(() => {
    axios
      .get(config.baseURL + "/api/package/subscriptionDetails", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then(response => {
        const todayDate = moment()
        let subscriptionNumber = 0
        const activeS = []
        subscriptionNumber = response.data.subscriptions.length
        if (subscriptionNumber !== 0) {
          for (const i in response.data.subscriptions) {            
            // if (todayDate.diff(moment(response.data.subscriptions[i].subscriptionEndDate)) < 0) {
              activeS.push(response.data.subscriptions[i])
              setSubsDataExist(true)
            // }
          }
          setActiveSubs(activeS)
        } else {
          setSubsDataExist(false)
        }
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }, [])

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.headingInnerStyle}>
          <TouchableOpacity
            onPress={() => {
              backHandler()
            }}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="button01" color={colors.white}>
            {lang[lang.lang].subscription_data_2}
          </Text>
          <View />
        </View>
      </SafeAreaView>

      <Animated.View
        style={[
          styles.animatedContainer,
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
        {SubsDataExist ? (
          <ScrollView>
            {activeSubs.map(activeSub => (
              <TouchableOpacity
                style={styles.activesubCard}
                onPress={() => {
                  selectPackageHandler(activeSub)
                }}>
                <Text preset="t2" color={colors.green}>
                  {activeSub.subscriptionName}
                </Text>
                <Text preset="button02">
                  {lang[lang.lang].subscription_data_3}
                  <Text
                    preset="button02"
                    color={colors.yellow}
                    text={activeSub.subscriptionStartDate}
                  />
                </Text>
                <Text preset="button02">
                  {lang[lang.lang].subscription_data_4}
                  <Text
                    preset="button02"
                    color={colors.yellow}
                    text={activeSub.subscriptionEndDate}
                  />
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noPackageContainer}>
            <Image source={pkgimg} style={styles.packageImage} />
            <Text preset="t2">{lang[lang.lang].subscription_data_5}</Text>
          </View>
        )}
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!SubsDataExist) {
            RenewalProcessHandler(2)
          } else {
            handler(SubsDataExist)
          }
        }}>
        <Text preset="button02" color={colors.white}>
          {SubsDataExist
            ? lang[lang.lang].subscription_data_6
            : lang[lang.lang].subscription_data_7}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default ActiveSubscriptions

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },

  activesubCard: {
    backgroundColor: colors.lightGreen,
    borderRadius: 10,
    flex: 1,
    padding: spacing.medium,
    marginBottom: spacing.medium,
  },

  button: {
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    bottom: 30,
    width: "60%",
    alignSelf: "center",
  },
  safeAreaViewStyle: {
    backgroundColor: colors.yellow,
  },

  headingInnerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.extraSmall,
    width: "100%",
  },
  packageImage: {
    height: 150,
    width: 150,
    marginTop: "50%",
    marginBottom: spacing.medium,
    tintColor: colors.yellow,
  },
  noPackageContainer: { alignContent: "center", alignItems: "center" },
  animatedContainer: {
    flex: 1,
    padding: spacing.medium,
  },
})
