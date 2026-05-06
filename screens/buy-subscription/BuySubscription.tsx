import { StackActions, useFocusEffect } from "@react-navigation/native"
import axios from "axios"
import DeviceInfo from 'react-native-device-info';
import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing, Image, StyleSheet, View } from "react-native"

import ChoosePackage from "./ChoosePackage"
import DietInfo from "./DietInfo"
import ExpressRenewPackageSelection from "./ExpressRenewPackageSelection"
import ListPackages from "./ListPackages"
import { config } from "../../config"

const bgImage = require("../../assets/images/login-background.png")

const Subscription = ({ route, navigation }) => {
  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const pageAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const [offdaysPackage, setOffDaysPackage] = useState([])

  const [fastRenew, setFastRenew] = useState(false)
  const [selectedPage, setSelectedPage] = useState(0)
  const [subscriptionData, setSubscriptionData] = useState({
    meals: null,
    snacks: null,
    days: null,
    startDate: null,
  })
  const [availablePackages, setAvailablePackages] = useState([])

  const adddeitHandler = offDays => {
    setOffDaysPackage(offDays)
    setSelectedPage(0.5)

    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  const personalHandleBack = () => {
    navigation.navigate("personal")
  }

  const handleBack = () => {
    if (selectedPage === 0.5) {
      if (fastRenew) {
        return
      } else {
        Animated.timing(pageAnim, {
          toValue: 0,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start()

        setSelectedPage(0)
      }
    }
    if (selectedPage === 1) {
      Animated.timing(pageAnim, {
        toValue: 0.5,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start()

      setSelectedPage(0.5)
    }
  }

  const availablepackageshandler = paymentdata => {
    if (fastRenew) {
      navigation.dispatch(
        StackActions.replace("payment", {
          paymentdata,
          editshow: false,
          renewtype: 1,
        }),
      )
      navigation.navigate("payment", {
        paymentdata,
        editshow: false,
        renewtype: 1,
      })
    } else {
      navigation.dispatch(
        StackActions.replace("payment", {
          paymentdata,
          editshow: true,
          renewtype: 0,
        }),
      )
      navigation.navigate("payment", {
        paymentdata,
        editshow: true,
        renewtype: 0,
      })
    }

    setSelectedPage(0)
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  const SelectPackageHandler = (meals, snacks, days, startDate) => {
    axios
      .post(
        config.baseURL + "/api/register/getAvailablePackages",
        {
          days: parseInt(days),
          meals: parseInt(meals),
          snacks: parseInt(snacks),
          noBreakfast: 0,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        setAvailablePackages(response.data.packages)
        setSubscriptionData({
          meals,
          snacks,
          days,
          startDate,
        })
        setSelectedPage(1)

        Animated.timing(pageAnim, {
          toValue: 1,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start()

        //TODO set available packages data like , days meals snacks startdates
      })
      .catch(e => {
        console.log(e)
      })
  }

  const SelectPackageHandlerFast = (meals, snacks, days, startDate, menueid, price) => {
    const paymentdata = {
      days,
      meals,
      snacks,
      menuId: menueid, // selected package menu id
      price, // selected package price
      applyPromoCode: 0,
      noBreakfast: 0,
      finalPrice: price,
      promoCode: "",
      discountPercentage: 0,
      discountValue: 0,
      marketingId: 1,
      paymentMethod: 1,
      language: "en",
      renew: 0,
      platform: "postman",
      startSubscription: startDate,
    }

    axios
      .post(
        config.baseURL + "/api/register/addDietDetails",
        {
          dietGoal: 1,
          allergieItems: [],
          dislikeItems: [],
          offDays: [],
          renew: 1,
          platform: DeviceInfo.getSystemName(),
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        availablepackageshandler(paymentdata)
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

  useEffect(() => {
    const fromWhere = route.params.fromWhere

    if (fromWhere === "Fastrenew") {
      setFastRenew(true)
      setSelectedPage(0.5)

      Animated.timing(pageAnim, {
        toValue: 0.5,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start()
    }
    if (fromWhere === "Newrenew") {
      setFastRenew(false)
    }
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      const fromWhere = route.params.fromWhere

      if (fromWhere === "Fastrenew") {
        setFastRenew(true)
        setSelectedPage(0.5)

        Animated.timing(pageAnim, {
          toValue: 0.5,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start()
      }
      if (fromWhere === "Newrenew") {
        setFastRenew(false)
      }
    }, []),
  )

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

      <Animated.View
        style={[
          styles.leftCoverWrapper,
          {
            transform: [
              {
                translateX: pageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [500, -500],
                }),
              },
            ],
          },
        ]}>
        {selectedPage === 0.5 && fastRenew ? (
          <ExpressRenewPackageSelection
            handler={SelectPackageHandlerFast}
            offdays={route.params.offdays}
            mealsnum={route.params.mealsnum}
            snacksnum={route.params.snacksnum}
            periodnum={route.params.periodnum}
            menuID={route.params.menuID}
            price={route.params.price}
            handleBack={personalHandleBack}
          />
        ) : (
          <View></View>
        )}
        {selectedPage === 0.5 && !fastRenew ? (
          <ChoosePackage
            handler={SelectPackageHandler}
            offdays={offdaysPackage}
            fromwhere={route.params.fromWhere}
            onBackPress={handleBack}
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
                  outputRange: [0, -1000],
                }),
              },
            ],
          },
        ]}>
        {selectedPage === 0 ? (
          <DietInfo handler={adddeitHandler} handleBack={personalHandleBack} />
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
                  outputRange: [1500, 0],
                }),
              },
            ],
          },
        ]}>
        {selectedPage === 1 ? (
          <ListPackages
            availablePackages={availablePackages}
            handler={availablepackageshandler}
            subscriptionData={subscriptionData}
            onBackPress={handleBack}
          />
        ) : (
          <View></View>
        )}
      </Animated.View>
    </View>
  )
}

export default Subscription

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
