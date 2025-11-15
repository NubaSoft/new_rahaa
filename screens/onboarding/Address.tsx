import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { Alert, Animated, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import { Text, TextField } from "../../app/components"
import { colors, globalStyle, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const CompleteResidence = (params: any) => {
  console.log("CompleteResidence----", params.route.params?.registerData)

  const [block, onChangeBlock] = useState("")
  const [building, onChangebuilding] = useState("")
  const [jadda, onChangejadda] = useState("")
  const [street, onChangeStreet] = useState("")
  const [flat, onChangeflat] = useState("")
  const [floor, onChangeFloor] = useState("")
  const [areaOpen, setareaOpen] = useState(false)
  const [areaValue, setareaValue] = useState(0)
  const [areaItems, setareaItems] = useState<{ label: string; value: string }[]>([
    { label: lang[lang.lang].complete_residence_14, value: "0" },
  ])
  const [governOpen, setgovernOpen] = useState(false)
  const [governValue, setgovernValue] = useState(0)
  const [governItems, setgovernItems] = useState([])
  const [governAreasResponse, setGovernAreasResponse] = useState([])
  const [notes, onChangenotes] = useState("")

  const textAlign = lang.lang === "ar" ? "right" : "left"
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const getAreas = () => {
    // Get Areas
    axios
      .get(config.baseURL + "/api/address/getAreas")
      .then(response => {
        const Governs = []

        setGovernAreasResponse(response.data)
        for (let i = 0; i < response.data.length; i++) {
          Governs.push({
            label:
              lang.lang === "ar"
                ? response.data[i].governmentNameAr
                : response.data[i].governmentNameEn,
            value: response.data[i].governmentId,
          })
        }
        setgovernItems(Governs)
      })
      .catch(e => {
        console.log(e)
      })
  }

  useEffect(() => {
    getAreas()
  }, [])

  useEffect(() => {
    if (governValue !== 0) {
      let areasf = []
      for (let i = 0; i < governAreasResponse.length; i++) {
        if (governAreasResponse[i].governmentId === governValue) {
          areasf = governAreasResponse[i].data
        }
      }
      const areasItemsformat = []
      for (let i = 0; i < areasf.length; i++) {
        areasItemsformat.push({
          label: lang.lang === "ar" ? areasf[i].name : areasf[i].nameEn,
          value: areasf[i].id,
        })
      }
      setareaItems(areasItemsformat)
    } else {
      setareaItems([{ label: "Choose government first", value: "0" }])
    }
  }, [governValue])

  const onRegister = () => {
    if (areaValue !== 0 && block !== "" && building !== "" && street !== "") {
      const registerData = params.route.params?.registerData
      registerData.addressDetails.area = areaValue
      registerData.addressDetails.block = block
      registerData.addressDetails.street = street
      registerData.addressDetails.jadda = jadda
      registerData.addressDetails.building = building
      registerData.addressDetails.floor = floor
      registerData.addressDetails.flat = flat
      registerData.addressDetails.notes = notes
      console.log("registerData--------", registerData)

      // Checking if the user already registered before
      axios
        .post(config.baseURL + "/api/register/signupAddPersonalData", registerData)
        .then(response => {
          console.log("response----------", response)

          if (response.data.message === "success") {
            Alert.alert("You registered successfully!")
            params.navigation.navigate("account")
          }
        })
        .catch(e => {
          console.log(e)
        })
    } else {
      Alert.alert(lang[lang.lang].complete_residence_alert_15)
    }
  }
  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          {lang[lang.lang].complete_residence_1}
        </Text>
      </SafeAreaView>

      <Animated.View
        style={[
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
          styles.animatedView,
        ]}>
        <View style={styles.dropdownWrapperStyle}>
          <View style={styles.dropdownWrapper}>
            <Text preset="footnote">{lang[lang.lang].complete_residence_2}</Text>
            <DropDownPicker
              style={styles.dropdownStyle}
              textStyle={{
                textAlign,
              }}
              multiple={false}
              searchable={true}
              open={governOpen}
              value={governValue}
              items={governItems}
              setOpen={setgovernOpen}
              setValue={setgovernValue}
              setItems={setgovernItems}
              placeholder={lang[lang.lang].complete_residence_3}
            />
          </View>

          <View style={styles.dropdownAreaWrapper}>
            <Text preset="footnote">{lang[lang.lang].complete_residence_4}</Text>
            <DropDownPicker
              style={styles.dropdownStyle}
              textStyle={{
                textAlign,
              }}
              multiple={false}
              searchable={true}
              open={areaOpen}
              value={areaValue}
              items={areaItems}
              setOpen={setareaOpen}
              setValue={setareaValue}
              setItems={setareaItems}
              placeholder={lang[lang.lang].complete_residence_5}
            />
          </View>
        </View>
        <KeyboardAwareScrollView
          style={{
            padding: spacing.medium,
          }}
          enableAutomaticScroll={false}
          showsVerticalScrollIndicator={false}>
          <View style={globalStyle.rowBetween}>
            <TextField
              value={block}
              label={lang[lang.lang].complete_residence_7}
              placeholder={lang[lang.lang].complete_residence_7}
              onChangeText={onChangeBlock}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={styles.leftInputContainerStyle}
              inputWrapperStyle={styles.inputWrapperStyle}
            />
            <TextField
              value={street}
              label={lang[lang.lang].complete_residence_10}
              placeholder={lang[lang.lang].complete_residence_10}
              onChangeText={onChangeStreet}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={styles.rightInputContainerStyle}
              inputWrapperStyle={styles.inputWrapperStyle}
            />
          </View>
          <View style={globalStyle.rowBetween}>
            <TextField
              value={building}
              label={lang[lang.lang].complete_residence_8}
              placeholder={lang[lang.lang].complete_residence_8}
              onChangeText={onChangebuilding}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={styles.leftInputContainerStyle}
              inputWrapperStyle={styles.inputWrapperStyle}
            />
            <TextField
              value={flat}
              label={lang[lang.lang].complete_residence_11}
              placeholder={lang[lang.lang].complete_residence_11}
              onChangeText={onChangeflat}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={styles.rightInputContainerStyle}
              inputWrapperStyle={styles.inputWrapperStyle}
            />
          </View>
          <View style={globalStyle.rowBetween}>
            <TextField
              value={jadda}
              label={lang[lang.lang].complete_residence_9}
              placeholder={lang[lang.lang].complete_residence_9}
              onChangeText={onChangejadda}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={styles.leftInputContainerStyle}
              inputWrapperStyle={styles.inputWrapperStyle}
            />

            <TextField
              value={floor}
              label={lang[lang.lang].complete_residence_12}
              placeholder={lang[lang.lang].complete_residence_12}
              onChangeText={onChangeFloor}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={styles.rightInputContainerStyle}
              inputWrapperStyle={styles.inputWrapperStyle}
            />
          </View>
          <TextField
            autoCorrect={false}
            placeholder={lang[lang.lang].complete_residence_6}
            value={notes}
            onChangeText={onChangenotes}
            label={lang[lang.lang].complete_residence_6}
            inputWrapperStyle={styles.inputWrapperStyle}
          />

          <TouchableOpacity style={styles.button} onPress={() => onRegister()}>
            <Text preset="button01" color={colors.white}>
              {lang[lang.lang].complete_residence_13}
            </Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      </Animated.View>
    </View>
  )
}

export default CompleteResidence

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
    marginTop: spacing.large,
  },

  safeAreaViewStyle: {
    backgroundColor: colors.yellow,
    width: "100%",
    alignItems: "center",
  },
  headingText: {
    marginBottom: spacing.medium,
  },
  dropdownWrapper: {
    justifyContent: "center",
    zIndex: 999,
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.medium,
  },
  dropdownAreaWrapper: {
    justifyContent: "center",
    zIndex: 0,
    paddingHorizontal: spacing.medium,
    paddingTop: spacing.medium,
  },
  dropdownStyle: {
    backgroundColor: colors.white,
    width: "100%",
    borderColor: colors.grey,
    marginTop: spacing.extraSmall,
  },
  inputWrapperStyle: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 6,
  },
  leftInputContainerStyle: {
    marginBottom: spacing.medium,
    flex: 1,
    marginRight: spacing.tiny,
  },
  rightInputContainerStyle: {
    marginBottom: spacing.medium,
    flex: 1,
    marginLeft: spacing.tiny,
  },
  animatedView: {
    flex: 1,
  },
  dropdownWrapperStyle: {
    flex: 1,
    backgroundColor: colors.white,
    zIndex: 999,
    marginBottom: spacing.huge,
  },
})
