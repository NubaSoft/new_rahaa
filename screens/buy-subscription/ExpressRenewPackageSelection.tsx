import Ionicons from "react-native-vector-icons/Ionicons"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native"
import CalendarPicker from "react-native-calendar-picker"

import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const FastRenewPackageSelection = ({
  handler,
  offdays,
  mealsnum,
  snacksnum,
  periodnum,
  menuID,
  price,
  handleBack,
}) => {
  const [ValueMeal, setValueMeal] = useState("1")

  const [value, setValue] = useState("1")
  const [valueDays, setValueDays] = useState("0")

  const [startD, onChangeStartD] = useState(null)
  const [endD, onChangeEndD] = useState(null)
  const windowWidth = Dimensions.get("window").width

  const [subscriptionStartDates, setSubscriptionStartDates] = useState([])

  const [subdays, setSubDays] = useState("")
  const [disableDaysPicker, setDisableDaysPicker] = useState(true)
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const customDatesStylesCallback = () => {
    return {
      style: {
        backgroundColor: colors.lightYellow,
      },
    }
  }

  const getPackageStartDates = () => {
    axios
      .post(
        config.baseURL + "/api/register/getSubscribtionStartDates",
        {
          offDays: offdays,
          renew: 1,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        setSubscriptionStartDates(response.data.subscriptionStartDates)
      })
      .catch(() => {
        // Do nothing
      })
  }

  useEffect(() => {
    getPackageStartDates()
    setValue(snacksnum)
    setValueMeal(mealsnum)
    setValueDays(periodnum)
  }, [])

  useEffect(() => {
    setSubDays(valueDays)
  }, [valueDays, subdays])

  const onChangeSEDate = (date, type) => {
    onChangeStartD(date)
    onChangeEndD(moment(date.format("DD-MM-YYYY"), "DD-MM-YYYY").add(valueDays, "days"))
    if (date != null) {
      setDisableDaysPicker(false)
    }
  }

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
          {lang[lang.lang].subscription_data_17}
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
        <View style={styles.calendarPickerWrapperStyle}>
          <CalendarPicker
            todayBackgroundColor={colors.green}
            selectedRangeStyle={{
              backgroundColor: colors.lightYellow,
            }}
            customDatesStyles={customDatesStylesCallback}
            allowRangeSelection={false}
            selectedDayColor={colors.yellow}
            onDateChange={onChangeSEDate}
            width={0.85 * windowWidth}
            disabledDatesTextStyle={{ color: colors.black }}
            monthTitleStyle={styles.monthTitleStyle}
            yearTitleStyle={styles.yearTitleStyle}
            nextTitle=">"
            previousTitle="<"
            nextTitleStyle={styles.nextTitleStyle}
            previousTitleStyle={styles.previousTitleStyle}
            textStyle={styles.textStyle}
            disabledDates={date => {
              if (subscriptionStartDates.includes(date.format("YYYY-MM-DD"))) {
                return false
              } else {
                return true
              }
            }}
          />
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (startD) {
            handler(ValueMeal, value, subdays, startD.format("YYYY-MM-DD"), menuID, price)
          } else {
            Alert.alert("Please select your subscription start date")
          }
        }}>
        <Text preset="button02" color={colors.white}>
          {lang[lang.lang].subscription_data_18}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default FastRenewPackageSelection

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
    width: "60%",
    alignSelf: "center",
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
  monthTitleStyle: {
    fontSize: 24,
    borderEndWidth: 10,
    borderStartWidth: 10,
  },
  yearTitleStyle: {
    fontSize: 24,
    borderEndWidth: 10,
    borderStartWidth: 10,
  },
  nextTitleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    borderEndWidth: 10,
    borderStartWidth: 10,
  },
  previousTitleStyle: {
    fontSize: 20,
    fontWeight: "bold",
    borderEndWidth: 10,
    borderStartWidth: 10,
  },
  textStyle: {
    color: colors.black,
    fontSize: 14,
  },
  calendarPickerWrapperStyle: {
    height: "60%",
    borderWidth: 1,
    borderColor: colors.yellow,
    borderRadius: 20,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.huge,
  },
})
