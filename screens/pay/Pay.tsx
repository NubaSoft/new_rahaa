import { StackActions } from "@react-navigation/native"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { Animated, StyleSheet, View, Image, Easing, Alert } from "react-native"

import PayLinking from "./PayLinking"
import ReviewAndPay from "./ReviewAndPay"
import { config } from "../../config"

const bgImage = require("../../assets/images/login-background.png")

const Payment = ({ route, navigation }) => {
  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const pageAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const [selectedPage, setSelectedPage] = useState(0)
  const [paymentURL, setPaymentURL] = useState("")

  const linkPaymentHandler = type => {
    if (type === 1) {
      navigation.navigate("meals")
      setSelectedPage(0)
      Animated.timing(pageAnim, {
        toValue: 0,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start()
    } else if (type === 2) {
      setSelectedPage(0)

      Animated.timing(pageAnim, {
        toValue: 0,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1000,
        useNativeDriver: true,
      }).start()
    }
  }
  const paymentData = route.params.paymentdata
  const editshow = route.params.editshow
  const EditPaymentHandler = () => {
    navigation.dispatch(
      StackActions.replace("subscription", {
        fromWhere: "payment",
      }),
    )
    navigation.navigate("subscription", { fromWhere: "payment" })
    setSelectedPage(0)
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  const profileback = () => {
    navigation.navigate("personal")
    setSelectedPage(0)
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }
  const CompletePaymentHandler = (
    paymentMethod,
    finalPrice,
    promoCode,
    discountPercentage,
    discountValue,
    marketingId,
    applyPromoCode,
  ) => {
    // paymentMethod = 1 (Credit Card) , paymentMethod = 2 (Cash on first delivery)
    axios
      .post(
        config.baseURL + "/api/register/addCustomerPackage",
        {
          days: paymentData.days,
          meals: paymentData.meals,
          snacks: paymentData.snacks,
          menuId: paymentData.menuId,
          price: paymentData.price,
          applyPromoCode: paymentData.applyPromoCode,
          noBreakfast: paymentData.noBreakfast,
          finalPrice,
          promoCode,
          discountPercentage,
          discountValue,
          marketingId,
          paymentMethod,
          language: paymentData.language,
          renew: route.params.renewtype,
          platform: paymentData.platform,
          startSubscription: paymentData.startSubscription,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        console.log({ response })
        setPaymentURL(response.data.PaymentURL)
        setSelectedPage(0.5)
        Animated.timing(pageAnim, {
          toValue: 0.5,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start()
      })
      .catch(e => {
        Alert.alert("Something went wrong")
        console.log(e)
      })
  }

  const handleBack = () => {
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
        {selectedPage === 0.5 && (
          <PayLinking
            handler={linkPaymentHandler}
            paymentURL={paymentURL}
            handleBack={handleBack}
          />
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
        {selectedPage === 0 && (
          <ReviewAndPay
            handler={CompletePaymentHandler}
            subscribedays={paymentData.days}
            totprice={paymentData.price}
            editHandler={EditPaymentHandler}
            editshow={editshow}
            menuId={paymentData.menuId}
            profilebackhandler={profileback}
            snacks={paymentData.snacks}
            meals={paymentData.meals}
          />
        )}
      </Animated.View>
    </View>
  )
}

export default Payment

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
