import Ionicons from "react-native-vector-icons/Ionicons"
import React, { useRef, useState } from "react"
import {
  Alert,
  Animated,
  Easing,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"

import { Icon, Text, ItemPickerModal } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { lang } from "../../lang"
import { Image } from "react-native"

const CompleteProfile = (params: any) => {
  console.log("CompleteProfile-----------", params.route.params.registerdata)
  const [isMale, setIsMale] = useState(true)
  const [isFemale, setIsFemale] = useState(false)
  const [height, setHeight] = useState<number | string>(50)
  const [weight, setWeight] = useState<number | string>(30)

  const [openHeightPicker, setOpenHeightPicker] = useState(false)
  const [openWeightPicker, setOpenWeightPicker] = useState(false)

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const onNextButtonPress = () => {
    let gender = 1
    let sendHandler = true
    if (isMale) {
      gender = 1
    } else if (isFemale) {
      gender = 2
    } else {
      sendHandler = false
      Alert.alert("Please choose a gender!")
    }
    if (sendHandler) {
      const registerData = params.route.params.registerdata
      registerData.gender = gender
      registerData.weight = weight
      registerData.height = height

      console.log("registerData------------", registerData)
      params.navigation.navigate("DislikeIngredient", { registerData: registerData })
      // profileHandler(gender, height, weight)
    }
  }
  // generate an array of objects with name and value from 50 to 250
  const generateHeightData = () => {
    const data = []
    for (let i = 50; i <= 250; i++) {
      data.push({ name: `${i.toString()} CM`, value: i })
    }
    return data
  }

  // generate an array of objects with name and value from 30 to 250
  const generateWeightData = () => {
    const data = []
    for (let i = 30; i <= 250; i++) {
      data.push({ name: `${i.toString()} KG`, value: i })
    }
    return data
  }

  return (
    <View style={styles.body}>
      <View>
        <SafeAreaView style={styles.safeAreaViewStyle}>
          <Text preset="button01" color={colors.white} style={styles.headingText}>
            {lang[lang.lang].complete_profile_1}
          </Text>
        </SafeAreaView>
        <View style={{ padding: spacing.medium }}>
          <View>
            <Text text="Select Gender" preset="t2" />
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderBox,
                  {
                    backgroundColor: isMale ? colors.yellow : colors.white,
                    borderColor: isMale ? colors.yellow : colors.grey,
                  },
                ]}
                onPress={() => {
                  setIsMale(true)
                  setIsFemale(false)
                }}>
                <Image
                  source={
                    isMale
                      ? require("../../assets/icons/maleWhite.png")
                      : require("../../assets/icons/male.png")
                  }
                  style={{ width: 32, height: 32 }}
                />
                {/* <Ionicons name="male" size={32} color={isMale ? colors.white : colors.green} /> */}
                <Text text="Male" preset="t2" color={isMale ? colors.white : colors.yellow} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderBox,
                  {
                    backgroundColor: isFemale ? colors.yellow : colors.white,
                    borderColor: isFemale ? colors.yellow : colors.grey,
                  },
                ]}
                onPress={() => {
                  setIsMale(false)
                  setIsFemale(true)
                }}>
                <Image
                  source={
                    isFemale
                      ? require("../../assets/icons/femaleWhite.png")
                      : require("../../assets/icons/female.png")
                  }
                  style={{ width: 32, height: 32 }}
                />
                {/* <Ionicons name="female" size={32} color={isFemale ? colors.white : colors.green} /> */}
                <Text text="Female" preset="t2" color={isFemale ? colors.white : colors.yellow} />
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View style={styles.selectionHeading}>
              <Text text="Select Height" preset="t2" />
              <View style={styles.unitContainer}>
                <Text text="CM" preset="button02" />
              </View>
            </View>
            <TouchableOpacity
              style={styles.horizontalRow}
              onPress={() => {
                setOpenHeightPicker(true)
              }}>
              <Text text={`${height} ${lang[lang.lang].complete_profile_2}`} preset="t3" />
              <Icon icon="doubleArrow" />
            </TouchableOpacity>
          </View>
          <View>
            <View style={styles.selectionHeading}>
              <Text text="Select Weight" preset="t2" />
              <View style={styles.unitContainer}>
                <Text text="KG" preset="button02" />
              </View>
            </View>
            <TouchableOpacity
              style={styles.horizontalRow}
              onPress={() => {
                setOpenWeightPicker(true)
              }}>
              <Text text={`${weight} ${lang[lang.lang].complete_profile_4}`} preset="t3" />
              <Icon icon="doubleArrow" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={onNextButtonPress}>
        <Text preset="button01" color={colors.white}>
          {lang[lang.lang].complete_profile_6}
        </Text>
      </TouchableOpacity>
      <ItemPickerModal
        isModalVisible={openHeightPicker}
        heading="Select Height"
        selectedValue={height}
        onValueChange={value => {
          setHeight(value)
        }}
        onDonePress={() => {
          setOpenHeightPicker(false)
        }}
        onClosePress={() => {
          setOpenHeightPicker(false)
        }}
        data={generateHeightData()}
      />
      <ItemPickerModal
        isModalVisible={openWeightPicker}
        heading="Select Weight"
        selectedValue={weight}
        onValueChange={value => {
          setWeight(value)
        }}
        onDonePress={() => {
          setOpenWeightPicker(false)
        }}
        onClosePress={() => {
          setOpenWeightPicker(false)
        }}
        data={generateWeightData()}
      />
    </View>
  )
}

export default CompleteProfile

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: "column",
    justifyContent: "space-between",
    paddingBottom: 40,
  },

  button: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.extraSmall,
    marginTop: spacing.huge,
  },
  safeAreaViewStyle: {
    height: 44,
    backgroundColor: colors.yellow,
    width: "100%",
    alignItems: "center",
  },
  genderBox: {
    paddingVertical: spacing.medium,
    paddingHorizontal: spacing.medium,
    backgroundColor: colors.yellow,
    width: 150,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.yellow,
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: spacing.medium,
  },
  headingText: {
    marginBottom: spacing.medium,
  },
  horizontalRow: {
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    borderColor: colors.grey,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.medium,
  },
  unitContainer: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: spacing.tiny,
    paddingHorizontal: spacing.medium,
    borderColor: colors.grey,
  },
  selectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: spacing.medium,
  },
})
