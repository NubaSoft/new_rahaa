import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import { Animated, Easing, Image, StyleSheet, TouchableOpacity, View } from "react-native"

import CalendarScreen from "./CalendarScreen"
import FreezeScreen from "./FreezeScreen"
import ManageMealsScreen from "./ManageMealsScreen"
import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"
import Loading from "../loading/loading"

const bgImage = require("../../assets/images/login-background.png")

const Meals = ({ navigation }) => {
  //Animations
  //Background animations
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const pageAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const [selectedPage, setSelectedPage] = useState(0)

  const [mealsDate, setMealsDate] = useState(null)
  const [mealsUsedDate, setUsedMealsDate] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [centerId, setCenterId] = useState(-1)
  const [oId, setOId] = useState(-1)
  const [Can_be_modified, setCan_be_modified] = useState(false)
  const [meals, setMeals] = useState([])
  const [settingsMenu, setSettingsMenu] = useState(false)
  const [status, setStatus] = useState(-1)

  const CalendarBackHandler = () => {
    setSelectedPage(0)
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
  }

  const FreezeBackHandler = () => {
    setSelectedPage(0)
    Animated.timing(pageAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
    setIsLoading(false)
  }
  const profileHandler = () => {
    navigation.navigate("personal")
  }
  const FreezeDaysHandler = () => {
    setSelectedPage(0.5)
    Animated.timing(pageAnim, {
      toValue: 0.5,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1000,
      useNativeDriver: true,
    }).start()
    setIsLoading(false)
  }

  const CalendarViewHandler = (
    mdate,
    vdatei,
    weekIdi,
    dayIdi,
    centerId,
    oId,
    dayStatus,
    can_be_modified,
  ) => {
    setMealsDate(mdate)
    setCenterId(centerId)
    setOId(oId)
    setCan_be_modified(can_be_modified)
    setUsedMealsDate(vdatei)
    setStatus(dayStatus)
    axios
      .post(
        config.baseURL + "/api/meal/getMealsListByDate",
        {
          vdate: vdatei,
          weekId: parseInt(weekIdi),
          dayId: parseInt(dayIdi),
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        console.log(response.data)
        setMeals(response.data)

        setSelectedPage(1)
        Animated.timing(pageAnim, {
          toValue: 1,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start()
        setIsLoading(false)
      })
      .catch(e => {
        console.log(e)
        setIsLoading(false)
      })
  }

  const FreezeViewHandler = pDates => {
    const filteredDates = []
    for (let i = 0; i < pDates.length; i++) {
      const day = moment(pDates[i]).format("YYYY-MM-DD")
      if (moment(day).isSameOrAfter(moment().add(2, "days"))) {
        filteredDates.push(pDates[i])
      }
    }
    axios
      .post(
        config.baseURL + "/api/meal/pauseMeal",
        {
          pauseDates: filteredDates,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        console.log(response.data)
        setSelectedPage(0)
        Animated.timing(pageAnim, {
          toValue: 0,
          easing: Easing.in(Easing.elastic(1)),
          duration: 1000,
          useNativeDriver: true,
        }).start()
        setIsLoading(false)
      })
      .catch(e => {
        console.log(e)
        setIsLoading(false)
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
      {settingsMenu && (
        <TouchableOpacity
          style={styles.settingsMenu}
          onPress={() => {
            setSettingsMenu(false)
          }}>
          <View style={styles.settingsWrapper}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                config.Token = ""
                AsyncStorage.setItem("keepLoggedIn", "")
                AsyncStorage.setItem("data", "")
                navigation.navigate("account")
              }}>
              <Text preset="t2" color={colors.white}>
                {lang[lang.lang].logout}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
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
          <FreezeScreen
            handler={FreezeViewHandler}
            setIsLoading={setIsLoading}
            FreezeBackHandler={FreezeBackHandler}
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
          <CalendarScreen
            handler={CalendarViewHandler}
            FreezeDaysHandler={FreezeDaysHandler}
            setIsLoading={setIsLoading}
            profileHandler={profileHandler}
            settingsHandler={setSettingsMenu}
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
                  outputRange: [1000, 0],
                }),
              },
            ],
          },
        ]}>
        {selectedPage === 1 && (
          <ManageMealsScreen
            date={mealsDate}
            usedDate={mealsUsedDate}
            meals={meals}
            CalendarBackHandler={CalendarBackHandler}
            setIsLoading={setIsLoading}
            centerId={centerId}
            oId={oId}
            status={status}
            can_be_modified={Can_be_modified}
          />
        )}
      </Animated.View>
    </View>
  )
}

export default Meals

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
  logoutButton: {
    padding: spacing.extraSmall,
    backgroundColor: colors.green,
    borderRadius: 10,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch",
    marginHorizontal: spacing.extraSmall,
  },
  settingsWrapper: {
    height: 80,
    width: 200,
    backgroundColor: colors.lightYellow,
    position: "absolute",
    right: 40,
    top: 110,
    borderRadius: 10,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsMenu: {
    height: "100%",
    width: "100%",
    position: "absolute",
    zIndex: 1000,
  },
})
