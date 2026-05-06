import Ionicons from "react-native-vector-icons/Ionicons"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import {
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

const Freeze = ({ handler, setIsLoading, FreezeBackHandler }) => {
  const windowWidth = Dimensions.get("window").width

  const [subscriptionPeriod, setSubscriptionPeriod] = useState(null)
  const [subscriptionDays, setSubscriptionDays] = useState([])
  const [pausedDays, setPausedDays] = useState([])
  const [pausedDayslength, setPausedDayslength] = useState<number>()

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  useEffect(() => {
    setIsLoading(false)
  }, [])

  useEffect(() => {
    getCalendarDetails()
    getSubscriptionDetails()
  }, [])

  const unPause = pDates => {
    axios
      .post(
        config.baseURL + "/api/meal/unpauseMeal",
        {
          unPauseDates: [pDates],
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        console.log(response.data)
      })
      .catch(e => {
        console.log(e)
      })
  }
  const onChangeDate = date => {
    const indx = pausedDays.indexOf(moment(date).format("YYYY-MM-DD"))
    let pausedD = pausedDays
    if (indx === -1) {
      pausedD.push(moment(date).format("YYYY-MM-DD"))
    } else {
      unPause(moment(date).format("YYYY-MM-DD"))
      pausedD = pausedD.filter(function (value) {
        return value !== moment(date).format("YYYY-MM-DD")
      })
    }
    setPausedDays(pausedD)
    setPausedDayslength(pausedD.length)
  }
  const customDatesStylesCallback = date => {
    const indx = subscriptionDays.indexOf(moment(date).format("YYYY-MM-DD"))
    const pausindx = pausedDays.indexOf(moment(date).format("YYYY-MM-DD"))
    if (pausindx !== -1) {
      return {
        style: {
          backgroundColor: colors.red,
        },
      }
    } else if (indx !== -1) {
      return {
        style: {
          backgroundColor: colors.white,
        },
      }
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
        const sdStatus = []
        for (let i = 0; i < response.data.packageDates.length; i++) {
          sdStatus.push(response.data.packageDates[i].status)
        }
        setSubscriptionDays(sdates)
        const temppause = []
        for (let i = 0; i < sdates.length; i++) {
          if (sdStatus[i] === 2) {
            temppause.push(sdates[i])
          }
          setPausedDays(temppause)
          setPausedDayslength(temppause.length)
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <TouchableOpacity
          style={styles.backIconStyle}
          onPress={() => {
            FreezeBackHandler()
          }}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          {lang[lang.lang].freeze_1}
        </Text>
      </SafeAreaView>

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
        <View style={styles.calendarPickerWrapper}>
          <View style={styles.subscriptionDays}>
            <Text preset="t2" color={colors.white}>
              {subscriptionPeriod}
              {lang[lang.lang].freeze_2}
            </Text>
          </View>

          <CalendarPicker
            todayBackgroundColor={colors.yellow}
            selectedDayStyle={customDatesStylesCallback}
            customDatesStyles={customDatesStylesCallback}
            onDateChange={onChangeDate}
            minDate={moment().add(3, "days").toDate()}
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
              if (subscriptionDays.includes(moment(date).format("YYYY-MM-DD"))) {
                return false
              } else {
                return true
              }
            }}
          />
        </View>
        <View style={styles.freezedDaysStyle}>
          <Text preset="t2" color={colors.white}>
            {pausedDayslength}
            {lang[lang.lang].freeze_3}
          </Text>
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setIsLoading(true)
          handler(pausedDays)
        }}>
        <Text preset="button02" color={colors.white}>
          {lang[lang.lang].freeze_4}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Freeze

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    backgroundColor: colors.white,
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
  subscriptionDays: {
    borderRadius: 10,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.yellow,
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
  },
  calendarPickerWrapper: {
    height: "60%",
    marginTop: spacing.huge,
    backgroundColor: colors.lightYellow,
    borderRadius: 25,
    alignContent: "center",
    alignItems: "center",
    paddingVertical: spacing.medium,
  },
  freezedDaysStyle: {
    borderRadius: 10,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.yellow,
    justifyContent: "space-around",
    alignContent: "center",
    alignItems: "center",
    marginTop: spacing.medium,
  },
  alignCenter: {
    alignItems: "center",
  },
})
