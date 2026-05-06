import Ionicons from "react-native-vector-icons/Ionicons"
import axios from "axios"
import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';
import React, { useEffect, useRef, useState } from "react"
import { Alert, Animated, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"

import { Text, Icon, ItemPickerModal } from "../../app/components"
import { colors, globalStyle, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

DropDownPicker.setLanguage(lang.lang === "ar" ? "AR" : "EN")

const AddDietDetails = ({ handler, handleBack }) => {
  const [dietTypeOpen, setdietTypeOpen] = useState(false)
  const [dietTypeValue, setdietTypeValue] = useState()
  const [dietTypeItems, setdietTypeItems] = useState([{ label: "diet type", value: "dt" }])

  // const [itemsDislike, setItemsDislike] = useState([])
  // const [itemsAllergies, setItemsAllergies] = useState([])

  const [is0Selected, set0Selection] = useState(false)
  const [is1Selected, set1Selection] = useState(false)
  const [is2Selected, set2Selection] = useState(false)
  const [is3Selected, set3Selection] = useState(false)
  const [is4Selected, set4Selection] = useState(false)
  const [is5Selected, set5Selection] = useState(false)
  const [is6Selected, set6Selection] = useState(true)

  const [weekDays, setWeekDays] = useState([])

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const SendDetails = () => {
    const offdaysarr = []
    if (is0Selected) {
      offdaysarr.push(weekDays[0])
    }
    if (is1Selected) {
      offdaysarr.push(weekDays[1])
    }
    if (is2Selected) {
      offdaysarr.push(weekDays[2])
    }
    if (is3Selected) {
      offdaysarr.push(weekDays[3])
    }
    if (is4Selected) {
      offdaysarr.push(weekDays[4])
    }
    if (is5Selected) {
      offdaysarr.push(weekDays[5])
    }
    if (is6Selected) {
      offdaysarr.push(weekDays[6])
    }
    axios
      .post(
        config.baseURL + "/api/register/addDietDetails",
        {
          renew: 0,
          dietGoal: dietTypeValue,
          allergieItems: [],
          dislikeItems: [],
          offDays: offdaysarr,

          platform: DeviceInfo.getSystemName(),
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        handler(offdaysarr)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getDislikeAlerg = () => {
    // Get Dislikes
    axios
      .get(config.baseURL + "/api/items/dislikeItems")
      .then(response => {
        const dislikeArr = []
        for (let i = 0; i < response.data.dislikesItems.length; i++) {
          dislikeArr.push({
            label: response.data.dislikesItems[i].name,
            value: response.data.dislikesItems[i].id,
          })
        }
        // setItemsDislike(dislikeArr)
      })
      .catch(e => {
        console.log(e)
      })

    // Get Allergies

    axios
      .get(config.baseURL + "/api/items/allergiesItems")
      .then(response => {
        const allergiesArr = []
        for (let i = 0; i < response.data.allergiesItems.length; i++) {
          allergiesArr.push({
            label: response.data.allergiesItems[i].name,
            value: response.data.allergiesItems[i].id,
          })
        }

        // setItemsAllergies(allergiesArr)
      })
      .catch(e => {
        console.log(e)
      })
  }

  const getDietTypes = () => {
    axios
      .put(
        config.baseURL + "/api/register/getDietDetails",
        {
          renew: 0,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        const dietTypes = []

        for (let i = 0; i < response.data.dietGoals.length; i++) {
          dietTypes.push({
            label: response.data.dietGoals[i].nameEn,
            name: response.data.dietGoals[i].nameEn,
            value: response.data.dietGoals[i].id,
          })
        }

        setdietTypeItems(dietTypes)
        setWeekDays(response.data.weekDays)
      })
      .catch(e => {
        console.log(e)
      })
  }

  useEffect(() => {
    getDietTypes()
    getDislikeAlerg()
  }, [])

  const getDietTypeLabel = () => {
    let label = ""
    console.log("id-----------", dietTypeValue)

    for (let i = 0; i < dietTypeItems?.length; i++) {
      if (dietTypeItems[i]?.value == dietTypeValue) {
        label = dietTypeItems[i]?.label
      }
    }
    return label || lang[lang.lang].add_diet_details_4
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
          {lang[lang.lang].add_diet_details_2}
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
        <View>
          <Text preset="t2">{lang[lang.lang].add_diet_details_3}</Text>
          <TouchableOpacity
            style={styles.dietGoalWrapper}
            onPress={() => {
              setdietTypeOpen(true)
            }}>
            <Text preset="t3" text={getDietTypeLabel() || lang[lang.lang].add_diet_details_4} />
            <Icon icon="doubleArrow" />
          </TouchableOpacity>
        </View>
        <ItemPickerModal
          isModalVisible={dietTypeOpen}
          heading={lang[lang.lang].add_diet_details_4}
          selectedValue={dietTypeValue}
          onValueChange={value => {
            setdietTypeValue(value)
          }}
          onDonePress={() => {
            setdietTypeOpen(false)
          }}
          onClosePress={() => {
            setdietTypeOpen(false)
          }}
          data={dietTypeItems}
        />

        <View>
          <Text preset="t2" style={styles.weekDayTextStyle}>
            {lang[lang.lang].add_diet_details_9}
          </Text>

          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={is0Selected}
              onValueChange={set0Selection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />

            <Text preset="t3">{lang[lang.lang][weekDays[0]]}</Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={is1Selected}
              onValueChange={set1Selection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />

            <Text preset="t3">{lang[lang.lang][weekDays[1]]}</Text>
          </View>

          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={is2Selected}
              onValueChange={set2Selection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />

            <Text preset="t3">{lang[lang.lang][weekDays[2]]}</Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={is3Selected}
              onValueChange={set3Selection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />

            <Text preset="t3">{lang[lang.lang][weekDays[3]]}</Text>
          </View>

          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={is4Selected}
              onValueChange={set4Selection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />

            <Text preset="t3">{lang[lang.lang][weekDays[4]]}</Text>
          </View>
          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={is5Selected}
              onValueChange={set5Selection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />

            <Text preset="t3">{lang[lang.lang][weekDays[5]]}</Text>
          </View>

          <View style={styles.checkboxWrapper}>
            <CheckBox
              value={is6Selected}
              onValueChange={set6Selection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />

            <Text preset="t3">{lang[lang.lang][weekDays[6]]}</Text>
          </View>
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (dietTypeValue) {
            SendDetails()
          } else {
            Alert.alert(lang[lang.lang].add_diet_details_alert_11)
          }
        }}>
        <Text preset="button02" color={colors.white} text={lang[lang.lang].add_diet_details_10} />
      </TouchableOpacity>
    </View>
  )
}

export default AddDietDetails

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
    marginHorizontal: spacing.medium,
    position: "absolute",
    bottom: spacing.huge,
    right: 0,
    left: 0,
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
  weekDayTextStyle: {
    marginTop: spacing.large,
    marginBottom: spacing.medium,
  },
  checkboxStyle: {
    borderRadius: 6,
    marginRight: spacing.extraSmall,
  },
  checkboxWrapper: {
    ...globalStyle.rowStart,
    marginBottom: spacing.extraSmall,
  },
})
