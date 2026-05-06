import Ionicons from "react-native-vector-icons/Ionicons"
import Feather from "react-native-vector-icons/Feather"
import axios from "axios"
import CheckBox from '@react-native-community/checkbox';
import React, { useRef, useState } from "react"
import {
  Alert,
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native"

import { Text, TextField } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const cardimg = require("../../assets/card.png")
const cashimg = require("../../assets/knet.png")

const CompletePayment = ({
  handler,
  subscribedays,
  totprice,
  editHandler,
  editshow,
  menuId,
  profilebackhandler,
  snacks,
  meals,
}) => {
  const [cashSelected, setCashSelection] = useState(false)
  const [cardSelected, setCardSelection] = useState(false)
  //PromoCode Variables
  const [promoCode, onChangepromoCode] = useState("")
  const [promoMessage, setPromoMessage] = useState("")
  const [finalPrice, setFinalPrice] = useState(totprice)
  const [discountValue, setDiscountValue] = useState(0)
  const [discountPercentage, setDiscountpercentage] = useState(0)
  const [marketingId, setMarketingId] = useState(0)
  const [applyPromoCode, setApplyPromoCode] = useState(0)
  const [PromoCodeFinal, setPromoCodeFinal] = useState("")

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const onApplyPromocode = () => {
    axios
      .post(
        config.baseURL + "/api/register/addPromoCode",
        {
          promoCode,
          menuId,
          price: totprice,
          days: subscribedays,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        if (response.data.applyPromoCode === 0) {
          setPromoMessage(lang[lang.lang].payment_9)
        } else {
          setApplyPromoCode(response.data.applyPromoCode)
          setDiscountValue(response.data.discountValue)
          setDiscountpercentage(response.data.discountPercentage)
          setMarketingId(response.data.marketingId)
          setFinalPrice(response.data.finalPrice)
          setPromoCodeFinal(response.data.promoCode)
          setPromoMessage(
            lang[lang.lang].payment_10 + String(response.data.discountPercentage) + " %",
          )
        }
      })
      .catch(e => {
        console.log(e)
        setPromoMessage(lang[lang.lang].payment_9)
      })
  }

  const onPayPress = () => {
    if (cardSelected && cashSelected) {
      Alert.alert("Please choose only one payment method")
    } else if (cardSelected) {
      handler(
        2,
        finalPrice,
        PromoCodeFinal,
        discountPercentage,
        discountValue,
        marketingId,
        applyPromoCode,
      )
    } else if (cashSelected) {
      handler(
        1,
        finalPrice,
        PromoCodeFinal,
        discountPercentage,
        discountValue,
        marketingId,
        applyPromoCode,
      )
    } else {
      Alert.alert("Please choose payment method")
    }
  }

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <TouchableOpacity
          style={styles.backIconStyle}
          onPress={() => {
            profilebackhandler()
          }}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          Review & Pay
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
          padding: spacing.medium,
        }}>
        <View style={styles.cardStyle}>
          <View>
            <Text
              preset="t2"
              text={`${meals} ${lang[lang.lang].available_package_2} & ${snacks} ${
                lang[lang.lang].available_package_3
              }`}
            />
            <Text preset="t2">
              {subscribedays}
              <Text preset="t3" text={lang[lang.lang].payment_2} />
            </Text>
            <Text preset="t2">
              {finalPrice}
              <Text preset="t3" text={lang[lang.lang].payment_5} />
            </Text>
          </View>
          {editshow && (
            <TouchableOpacity
              onPress={() => {
                editHandler()
              }}>
              <Feather name="edit" size={20} color={colors.yellow} />
            </TouchableOpacity>
          )}
        </View>

        {/* Promo Code Code here */}
        <View style={styles.promocodeContainer}>
          <Text preset="t2">{lang[lang.lang].payment_6}</Text>
          <View style={styles.textFieldWrapper}>
            <TextField
              value={promoCode}
              placeholder={lang[lang.lang].payment_7}
              onChangeText={onChangepromoCode}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={styles.inputContainerStyle}
              inputWrapperStyle={styles.inputWrapperStyle}
            />

            <TouchableOpacity style={styles.buttonPromo} onPress={onApplyPromocode}>
              <Text preset="button02" color={colors.white}>
                {lang[lang.lang].payment_8}
              </Text>
            </TouchableOpacity>
          </View>

          <Text preset="t3" color={colors.red}>
            {promoMessage}
          </Text>
        </View>

        {/* Payment methods */}
        <View>
          <Text preset="t2">{lang[lang.lang].payment_11}</Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            setCashSelection(!cashSelected)
            setCardSelection(false)
          }}
          style={styles.paymentMethodRow}>
          <CheckBox
            value={cashSelected}
            onValueChange={setCashSelection}
            color={colors.yellow}
            style={styles.checkbox}
          />
          <Image source={cashimg} style={styles.paymentMethodImage} />
          <Text preset="t2">{lang[lang.lang].payment_12}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCardSelection(!cardSelected)
            setCashSelection(false)
          }}
          style={styles.paymentMethodRow}>
          <CheckBox
            value={cardSelected}
            onValueChange={setCardSelection}
            color={colors.yellow}
            style={styles.checkbox}
          />
          <Image source={cardimg} style={styles.paymentMethodImage} />
          <Text preset="t2">{lang[lang.lang].payment_13}</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.button} onPress={onPayPress}>
        <Text preset="button01" color={colors.white}>
          {lang[lang.lang].payment_14}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default CompletePayment

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },

  button: {
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    alignSelf: "center",
    paddingHorizontal: spacing.massive,
  },
  buttonPromo: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginLeft: spacing.extraSmall,
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
  cardStyle: {
    borderWidth: 1,
    borderRadius: 14,
    padding: spacing.medium,
    borderColor: colors.grey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  inputWrapperStyle: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 6,
  },
  promocodeContainer: {
    marginVertical: spacing.large,
  },
  textFieldWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.extraSmall,
  },
  inputContainerStyle: {
    flex: 1,
    marginRight: spacing.extraSmall,
  },
  paymentMethodRow: {
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.grey,
    paddingVertical: spacing.small,
    paddingHorizontal: spacing.medium,
    marginVertical: spacing.extraSmall,
  },
  checkbox: {
    borderRadius: 4,
  },
  paymentMethodImage: {
    height: 20,
    width: 20,
    marginHorizontal: spacing.medium,
  },
})
