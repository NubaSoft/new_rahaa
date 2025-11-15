import { StackActions } from "@react-navigation/native"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing, Image, StyleSheet, View } from "react-native"

import ActiveSubs from "./ActiveSubs"
import RenewalProcess from "./RenewalProcess"
import SubscriptionInfo from "./SubscriptionInfo"
import { config } from "../../config"
import Loading from "../loading/loading"

const bgImage = require("../../assets/images/login-background.png")

const Renew = ({ navigation }) => {
  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const [selectedPage, setSelectedPage] = useState(0)
  const [allowFast, setAllowFast] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState("")

  const ActiveSubscriptionDataHandler = allowfast => {
    setAllowFast(allowfast)
    setSelectedPage(0.5)
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }
  const selectPackageHandler = selectedPackage => {
    setSelectedPackage(selectedPackage)
    setSelectedPage(1)
    Animated.timing(pageAnim, {
      toValue: 1,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }
  const SubscriptionDataHandler = allowfast => {
    setAllowFast(true)
    setSelectedPage(0.5)
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }
  const RenewalProcessHandler = renewType => {
    if (renewType === 1) {
      setSelectedPage(0)
      let SubDays = 0
      let NumberMeals = 0
      let NumberSnacks = 0
      let offdays = 0
      let menuID = 0
      let price = 0
      axios
        .get(config.baseURL + "/api/package/subscriptionDetails", {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        })
        .then(response => {
          let subscriptionNumber = 0
          subscriptionNumber = response.data.subscriptions.length
          if (subscriptionNumber !== 0) {
            for (const i in response.data.subscriptions) {
              if (
                response.data.subscriptions[i].subscriptionEndDate ===
                response.data.subscriptionEndDate
              ) {
                SubDays = response.data.subscriptions[i].subscriptionDays
                NumberMeals = response.data.subscriptions[i].noOfMeals
                NumberSnacks = response.data.subscriptions[i].noOfSnacks
                offdays = response.data.subscriptions[i].offDays
                menuID = response.data.subscriptions[i].menueId
                price = response.data.subscriptions[i].packagePrice
                navigation.dispatch(
                  StackActions.replace("subscription", {
                    fromWhere: "Fastrenew",
                    offdays,
                    mealsnum: NumberMeals,
                    snacksnum: NumberSnacks,
                    periodnum: SubDays,
                    menuID,
                    price,
                  }),
                )
                navigation.navigate("subscription", {
                  fromWhere: "Fastrenew",
                  offdays,
                  mealsnum: NumberMeals,
                  snacksnum: NumberSnacks,
                  periodnum: SubDays,
                  menuID,
                  price,
                })
              }
              Animated.timing(pageAnim, {
                toValue: 0,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1000,
                useNativeDriver: true,
              }).start()
            }
          }
          setIsLoading(false)
        })
        .catch(() => {
          setIsLoading(false)
        })
    } else {
      setSelectedPage(0)
      navigation.dispatch(
        StackActions.replace("subscription", {
          fromWhere: "Newrenew",
        }),
      )
      navigation.navigate("subscription", {
        fromWhere: "Newrenew",
      })
      Animated.timing(pageAnim, {
        toValue: 0,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start()
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setIsLoading(false)
    setSelectedPage(0)
    navigation.navigate("personal")
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  const handleBackActive = () => {
    setIsLoading(true)
    setSelectedPage(0)
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
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

      <Animated.View
        style={[
          styles.leftCoverWrapper,
          {
            transform: [
              {
                translateX: pageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2000, -2000],
                }),
              },
            ],
          },
        ]}>
        {selectedPage === 0.5 ? (
          <RenewalProcess
            handler={RenewalProcessHandler}
            backHandler={handleBack}
            allowFast={allowFast}
            setIsLoading={setIsLoading}
          />
        ) : (
          <View></View>
        )}
      </Animated.View>

      <Animated.View
        style={[
          styles.leftCoverWrapper,
          {
            transform: [
              {
                translateX: pageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4000],
                }),
              },
            ],
          },
        ]}>
        {selectedPage === 0 ? (
          <ActiveSubs
            handler={ActiveSubscriptionDataHandler}
            backHandler={handleBack}
            setIsLoading={setIsLoading}
            selectPackageHandler={selectPackageHandler}
            RenewalProcessHandler={RenewalProcessHandler}
          />
        ) : (
          <View></View>
        )}
      </Animated.View>

      <Animated.View
        style={[
          styles.leftCoverWrapper,
          {
            transform: [
              {
                translateX: pageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4000, 0],
                }),
              },
            ],
          },
        ]}>
        {selectedPage === 1 ? (
          <SubscriptionInfo
            handler={SubscriptionDataHandler}
            backHandler={handleBackActive}
            setIsLoading={setIsLoading}
            packageData={selectedPackage}
          />
        ) : (
          <View></View>
        )}
      </Animated.View>
    </View>
  )
}

export default Renew

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
