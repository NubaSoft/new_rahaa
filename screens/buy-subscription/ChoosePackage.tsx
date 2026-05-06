import Ionicons from "react-native-vector-icons/Ionicons"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import CalendarPicker from "react-native-calendar-picker"
import DropDownPicker from "react-native-dropdown-picker"
import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"
import Loading from "../loading/loading"

DropDownPicker.setLanguage(lang.lang === "ar" ? "AR" : "EN")

const PackageSelection = ({ handler, offdays, fromwhere, onBackPress }) => {
  const [startD, onChangeStartD] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const windowWidth = Dimensions.get("window").width
  const [subscriptionStartDates, setSubscriptionStartDates] = useState([])

  const textAlign = lang.lang === "ar" ? "right" : "left"
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
    setIsLoading(true)
    let renew_send = 0
    axios
      .get(config.baseURL + "/api/package/subscriptionDetails?center_id=" + config.branch_code, {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then(response => {
        console.log(response.data)
        if (response.data.subscriptions) {
          const todayDate = moment()
          let subscriptionNumber = 0
          subscriptionNumber = response.data.subscriptions.length
          if (subscriptionNumber !== 0) {
            for (const i in response.data.subscriptions) {
              if (
                todayDate.diff(
                  moment(response.data.subscriptions[i].subscriptionEndDate, "YYYY/MM/DD").toDate(),
                )
              ) {
                renew_send = 1
              }
            }
          }
        }
        axios
          .post(
            config.baseURL + "/api/register/getSubscribtionStartDates",
            {
              offDays: offdays,
              renew: renew_send,
              centerId: config.branch_code,
            },
            {
              headers: {
                Authorization: `bearer ${config.Token}`,
              },
            },
          )
          .then(response => {
            setSubscriptionStartDates(response.data.subscriptionStartDates)
            setIsLoading(false)
          })
          .catch(e => {
            console.log(e)
            setIsLoading(false)
          })
      })
      .catch(e => {
        console.log("ACTIVESUBSERR_______________", e)
        setIsLoading(false)
      })
  }

  useEffect(() => {
    getPackageStartDates()
  }, [])

  const onChangeSEDate = date => {
    onChangeStartD(date)

    if (date != null) {
      // setDisableDaysPicker(false)
    }
  }

  return (
    <View style={styles.body}>
      <Loading isLoading={isLoading} />

      <SafeAreaView style={styles.safeAreaViewStyle}>
        <TouchableOpacity
          style={styles.backIconStyle}
          onPress={() => {
            onBackPress()
          }}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          {lang[lang.lang].package_selection_1}
        </Text>
      </SafeAreaView>
      <View style={[styles.inputBody]}>
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
          {/* Choosing start date */}
          <View
            style={{
              marginTop: spacing.extraLarge,
              marginBottom: spacing.medium,
              alignSelf: "center",
            }}>
            <Text preset="t2">{lang[lang.lang].package_selection_3}</Text>
          </View>
          <View style={styles.calendarPickerWrapper}>
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
                if (subscriptionStartDates.includes(moment(date).format("YYYY-MM-DD"))) {
                  return false
                } else {
                  return true
                }
              }}
            />
          </View>
          {/* End of choose start dates  */}

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              if (startD) {
                // TODO: remove zero constants
                handler(0, 0, 0, moment(startD).format("YYYY-MM-DD"))
              } else {
                Alert.alert(lang[lang.lang].package_selection_alert_10)
              }
            }}>
            <Text preset="button01" color={colors.white}>
              {lang[lang.lang].package_selection_6}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  )
}

export default PackageSelection

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: spacing.large,
  },

  inputBody: {
    borderRadius: 15,
    width: "100%",
    height: "75%",
    alignItems: "center",
  },

  button: {
    padding: spacing.small,
    paddingHorizontal: spacing.huge,
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: spacing.extraLarge,
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
  dropdownStyle: {
    alignSelf: "center",
    width: "100%",
    zIndex: 800000,
    borderColor: colors.grey,
    marginTop: spacing.extraSmall,
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
  calendarPickerWrapper: {
    height: "60%",
    borderWidth: 1,
    borderColor: colors.lightYellow,
    borderRadius: 20,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.extraLarge,
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
  filterDropdown: {
    borderColor: colors.grey,
    marginTop: spacing.extraSmall,
  },
  filterWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: spacing.medium,
  },
  mealsContainer: {
    width: "40%",
  },
  dietGoalWrapper: {
    borderWidth: 1,
    padding: spacing.small,
    borderRadius: 6,
    borderColor: colors.grey,
    marginTop: spacing.extraSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
})
