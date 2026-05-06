import Ionicons from "react-native-vector-icons/Ionicons"
import { useFocusEffect } from "@react-navigation/native"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import {
  Animated,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native"
import CalendarPicker from "react-native-calendar-picker"

import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const CalendarView = ({
  handler,
  FreezeDaysHandler,
  profileHandler,
  settingsHandler,
  setIsLoading,
}) => {
  const windowWidth = Dimensions.get("window").width
  const windowHeight = Dimensions.get("window").height
  const [subscriptionStartDate, setSubscriptionStartDate] = useState(null)
  const [subscriptionEndDate, setSubscriptionEndDate] = useState(null)
  const [subscriptionPeriod, setSubscriptionPeriod] = useState(null)
  const [subscriptionDays, setSubscriptionDays] = useState([])
  const [subscriptionDaysStatus, setSubscriptionDaysStatus] = useState([])
  const [subscriptionWeekIds, setSubscriptionWeekIds] = useState([])
  const [subscriptionDayIds, setSubscriptionDayIds] = useState([])
  const [subscriptionCenterIds, setSubscriptionCenterIds] = useState([])
  const [subscriptionOIds, setSubscriptionOIds] = useState([])
  const [subscriptionDaycan_be_modifieds, setSubscriptionDaycan_be_modifieds] = useState([])

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  useEffect(() => {
    getCalendarDetails()
    getSubscriptionDetails()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      getCalendarDetails()
      getSubscriptionDetails()
    }, []),
  )
  const customDatesStylesCallback = date => {
    const indx = subscriptionDays.indexOf(moment(date).format("YYYY-MM-DD"))
    const statusCode = subscriptionDaysStatus[indx]
    console.log("statusCode----------", subscriptionDaysStatus[indx])
    switch (statusCode) {
      case 0:
        return {
          style: {
            backgroundColor: "orange",
          },
        }

      case 1:
        return {
          style: {
            backgroundColor: colors.green,
          },
        }

      case 2:
        return {
          style: {
            backgroundColor: colors.red,
          },
        }

      case 3:
        return {
          style: {
            backgroundColor: colors.red,
          },
        }
      case 4:
        return {
          style: {
            backgroundColor: colors.yellow,
          },
        }
      case 8:
        return {
          style: {
            backgroundColor: colors.grey,
          },
        }
      // case 9:
      //   return {
      //     style: {
      //       backgroundColor: colors.grey,
      //     },
      //   }
    }
  }

  const getSubscriptionDetails = () => {
    axios
      .get(config.baseURL + "/api/package/subscriptionDetails", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then(response => {
        setSubscriptionStartDate(response.data.subscriptionStartDate)
        setSubscriptionEndDate(response.data.subscriptionEndDate)
        setSubscriptionPeriod(response.data.subscriptionDays)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getCalendarDetails = () => {
    axios
      .get(config.baseURL + "/api/package/calenderDetails", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then(response => {
        const sdates = []
        for (let i = 0; i < response.data.packageDates.length; i++) {
          sdates.push(response.data.packageDates[i].vdate)
        }
        console.log("response.data.packageDates--------", response.data.packageDates)
        const sdStatus = []
        for (let i = 0; i < response.data.packageDates.length; i++) {
          sdStatus.push(response.data.packageDates[i].status)
        }
        const weekIds = []
        for (let i = 0; i < response.data.packageDates.length; i++) {
          weekIds.push(response.data.packageDates[i].weekId)
        }
        const dayIds = []
        for (let i = 0; i < response.data.packageDates.length; i++) {
          dayIds.push(response.data.packageDates[i].dayId)
        }
        const centerIds = []
        for (let i = 0; i < response.data.packageDates.length; i++) {
          centerIds.push(response.data.packageDates[i].centerId)
        }
        const oIds = []
        for (let i = 0; i < response.data.packageDates.length; i++) {
          oIds.push(response.data.packageDates[i].oId)
        }
        const can_be_modifieds = []
        for (let i = 0; i < response.data.packageDates.length; i++) {
          can_be_modifieds.push(response.data.packageDates[i].can_be_modified)
        }
        setSubscriptionDaysStatus(sdStatus)
        setSubscriptionDays(sdates)
        setSubscriptionWeekIds(weekIds)
        setSubscriptionDayIds(dayIds)
        setSubscriptionCenterIds(centerIds)
        setSubscriptionOIds(oIds)
        setSubscriptionDaycan_be_modifieds(can_be_modifieds)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const selectedDateChanged = (selDate: any) => {
    console.log("subscriptionDaycan_be_modifieds-------", subscriptionDaycan_be_modifieds)
    const indx = subscriptionDays.indexOf(moment(selDate).format("YYYY-MM-DD"))
    const statusCode = subscriptionDaysStatus[indx]
    const weekId = subscriptionWeekIds[indx]
    const dayId = subscriptionDayIds[indx]
    const centerId = subscriptionCenterIds[indx]
    const oId = subscriptionOIds[indx]
    const can_be_modified = subscriptionDaycan_be_modifieds[indx]
    console.log("can_be_modified------->>>>>>>>>", can_be_modified)
    if (statusCode === 8) {
      // Alert.alert(lang[lang.lang].calendar_alert_8)
      // setIsLoading(false)
    } else {
      setIsLoading(true)
      if (statusCode === 2) {
        Alert.alert(lang[lang.lang].calendar_alert_8)
        setIsLoading(false)
      } else if (statusCode === 3) {
        Alert.alert(lang[lang.lang].calendar_alert_9)
        handler(
          moment(selDate).format("dddd, DD/MM"),
          moment(selDate).format("YYYY-MM-DD"),
          weekId,
          dayId,
          centerId,
          oId,
          statusCode,
          can_be_modified,
        )
      } else {
        handler(
          moment(selDate).format("dddd, DD/MM"),
          moment(selDate).format("YYYY-MM-DD"),
          weekId,
          dayId,
          centerId,
          oId,
          statusCode,
          can_be_modified,
        )
      }
    }
  }

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.headingInnerStyle}>
          <StatusBar />
          <TouchableOpacity
            onPress={() => {
              profileHandler()
            }}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="button01" color={colors.white}>
            Calendar
          </Text>
          <TouchableOpacity
            onPress={() => {
              settingsHandler(true)
            }}>
            <Ionicons name="settings-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <ScrollView>
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
          <View style={styles.daysRemainingCircle}>
            <Text preset="t2">
              {subscriptionPeriod}
              {lang[lang.lang].calendar_1}
            </Text>
          </View>

          <View style={styles.startEndDateStyle}>
            <Text preset="t2">{subscriptionStartDate}</Text>
            <Text preset="t2">{subscriptionEndDate}</Text>
          </View>

          <TouchableOpacity
            style={styles.freezeButtonStyle}
            onPress={() => {
              setIsLoading(true)
              FreezeDaysHandler()
            }}>
            <Ionicons name="pause-circle" size={22} color={colors.white} />
            <Text preset="button01" color={colors.white}>
              {lang[lang.lang].calendar_2}
            </Text>
          </TouchableOpacity>

          <View style={styles.calendarPickerWrapper}>
            <Text preset="t3">{lang[lang.lang].calendar_3}</Text>

            <CalendarPicker
              todayBackgroundColor="white"
              selectedDayStyle={
                {
                  // backgroundColor: colors.grey,
                }
              }
              customDatesStyles={customDatesStylesCallback}
              onDateChange={selectedDateChanged}
              minDate={subscriptionDaysStatus[0]?.vdate}
              width={0.85 * windowWidth}
              height={0.45 * windowHeight}
              disabledDatesTextStyle={{ color: colors.black }}
              monthTitleStyle={styles.monthTitleStyle}
              yearTitleStyle={styles.yearTitleStyle}
              nextTitle=">"
              previousTitle="<"
              nextTitleStyle={styles.nextTitleStyle}
              previousTitleStyle={styles.previousTitleStyle}
              textStyle={styles.textStyle}
              disabledDates={date => {
                if (subscriptionDays.includes(moment(date).format("YYYY-MM-DD"))) {
                  return false
                } else {
                  return true
                }
              }}
            />
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.activeWithoutMeals}>
              <Text preset="footnote" color={colors.white} size="xxs">
                {lang[lang.lang].calendar_4}
              </Text>
            </View>
            <View style={styles.activeWithMeals}>
              <Text preset="footnote" color={colors.white} size="xxs">
                {lang[lang.lang].calendar_7}
              </Text>
            </View>
          </View>
          <View style={styles.rowContainer}>
            <View style={styles.pausedStyle}>
              <Text preset="footnote" color={colors.white} size="xxs">
                {lang[lang.lang].calendar_6}
              </Text>
            </View>
            <View style={styles.postedStyle}>
              <Text preset="footnote" color={colors.white} size="xxs">
                {lang[lang.lang].calendar_5}
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  )
}

export default CalendarView

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },

  freezeButtonStyle: {
    borderRadius: 10,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.yellow,
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "50%",
    marginTop: spacing.small,
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

  daysRemainingCircle: {
    height: 120,
    width: 120,
    borderWidth: 10,
    borderRadius: 120 / 2,
    borderColor: colors.green,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  startEndDateStyle: {
    justifyContent: "space-between",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: colors.lightGreen,
    borderRadius: 10,
    paddingVertical: spacing.tiny,
    paddingHorizontal: spacing.medium,
    marginTop: spacing.small,
    width: "80%",
  },
  monthTitleStyle: {
    fontFamily: "inter400Regular",
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderEndWidth: 10,
    borderStartWidth: 10,
  },
  yearTitleStyle: {
    fontFamily: "inter400Regular",
    fontSize: 24,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderEndWidth: 10,
    borderStartWidth: 10,
  },
  nextTitleStyle: {
    fontFamily: "inter400Regular",
    fontSize: 24,
    fontWeight: "bold",
    borderEndWidth: 10,
    borderStartWidth: 10,
  },
  previousTitleStyle: {
    fontFamily: "inter400Regular",
    fontSize: 24,
    fontWeight: "bold",
    borderEndWidth: 10,
    borderStartWidth: 10,
  },
  textStyle: {
    fontFamily: "inter400Regular",
    color: colors.black,
    fontSize: 14,
  },
  calendarPickerWrapper: {
    height: "50%",
    borderWidth: 2,
    borderColor: colors.lightYellow,
    borderRadius: 20,
    alignContent: "center",
    alignItems: "center",
    paddingVertical: spacing.medium,
    marginVertical: spacing.extraSmall,
  },
  animatedView: {
    alignItems: "center",
    padding: spacing.medium,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: spacing.tiny,
  },
  activeWithoutMeals: {
    flex: 1,
    backgroundColor: "orange",
    borderWidth: 1,
    borderColor: colors.grey,
    padding: spacing.small,
    marginHorizontal: spacing.tiny,
    alignItems: "center",
    borderRadius: 10,
  },
  activeWithMeals: {
    flex: 1,
    backgroundColor: colors.green,
    borderWidth: 1,
    borderColor: colors.green,
    padding: spacing.small,
    marginHorizontal: spacing.tiny,
    alignItems: "center",
    borderRadius: 10,
  },
  pausedStyle: {
    flex: 1,
    backgroundColor: colors.red,
    borderWidth: 1,
    borderColor: colors.red,
    padding: spacing.small,
    marginHorizontal: spacing.tiny,
    alignItems: "center",
    borderRadius: 10,
  },
  postedStyle: {
    flex: 1,
    backgroundColor: colors.yellow,
    borderWidth: 1,
    borderColor: colors.lightGreen,
    padding: spacing.small,
    marginHorizontal: spacing.tiny,
    alignItems: "center",
    borderRadius: 10,
  },
})
