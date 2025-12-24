import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import axios from "axios"
import CheckBox from '@react-native-community/checkbox';
import DeviceInfo from 'react-native-device-info';
import React, { useMemo, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Dimensions,
  Easing,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native"
import CalendarPicker from "react-native-calendar-picker"
import OTPTextView from "react-native-otp-textinput"

import { Text, Icon, TextField } from "../../app/components"
import { colors, globalStyle, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"
import { useNavigation } from "@react-navigation/native"
import Loading from "../loading/loading"

Keyboard.dismiss()
const windowWidth = Dimensions.get("window").width
const crossFatLogo = require("../../assets/images/cross-fat.png")

function formatDate(date) {
  let d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear()

  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day

  return [year, month, day].join("-")
}

const Register = ({}) => {
  const navigation = useNavigation<any>()
  const [name, onChangeName] = useState("")
  const [email, onChangeEmail] = useState("")
  const [mobilephone, onChangeMobilePhone] = useState("")
  const [dob, onChangeDob] = useState(new Date())
  const [password, onChangePassword] = useState("")
  const [confirmPassword, onChangeConfirmPassword] = useState("")
  const [otpNumber, setOtpNumber] = useState("")
  const [trueOtp, setTrueOtp] = useState("")
  const [isSelected, setSelection] = useState(false)
  const [selectedDob, setSelectedDob] = useState(false)
  const [isOtp, setIsOtp] = useState(false)
  const [_, setLanguage] = useState(lang.lang)
  const [isLoading, setIsLoading] = useState(false)

  const statusBarHeight = StatusBar.currentHeight
  const topHeight = Platform.OS === "ios" ? 70 : statusBarHeight

  const checkRegInfo = () => {
    if (name === "" || mobilephone === "") {
      return 0
    } else if (mobilephone.length !== 8) {
      return 3
    } else {
      return 2
    }
  }

  const checkUserExistance = () => {
    axios
      .post(config.baseURL + "/api/register/signupGetUserPersonlInfo", {
        mobileNumber: mobilephone,
      })
      .then(response => {
        if (response.data.registerUser === 0) {
          //send registeration data
          axios
            .post(config.baseURL + "/api/sendSmsOtp", {
              mobileNumber: mobilephone,
              language: "en",
            })
            .then(function (response) {
              console.log("response===---===>>>", response)
              if (response.data.message === "success") {
                setTrueOtp(response.data.otpCode)
                Animated.timing(transAnim, {
                  toValue: 0.5,
                  easing: Easing.in(Easing.elastic(1)),
                  duration: 1600,
                  useNativeDriver: true,
                }).start()
                Keyboard.dismiss()
                setIsLoading(false)
                setIsOtp(true)
              } else {
                Alert.alert("Can't Send OTP to this mobile number, Please try again!")
                setIsLoading(false)
              }
            })
            .catch(function (error) {
              console.log(error)
              setIsLoading(false)
            })
        } else {
          Alert.alert("Registeration Failed", "This Mobile number already in use", [{ text: "OK" }])
          setIsLoading(false)
        }
      })
      .catch(e => {
        console.log(e)
        setIsLoading(false)
        Alert.alert("Something went wrong ", "Please try again later", [{ text: "OK" }])
      })
  }

  const register = () => {
    //register in backend
    if (password !== confirmPassword) {
      Alert.alert("Password didn't match, Please try again!")
      setIsLoading(false)
    } else if (password == null || password.length < 4) {
      Alert.alert("Password must be greater than 4 characters!")
      setIsLoading(false)
    } else if (!isSelected) {
      Alert.alert("Please agree on the terms and conditions!")
      setIsLoading(false)
    } else {
      const registerInfo = {
        otpVerified: 1,
        mobileNumber: mobilephone,
        password,
        email,
        gender: null,
        weight: null,
        height: null,
        disliked_item_ids: [],
        disliked_meal_ids: [],
        allergy_item_ids: [],
        firstName: name,
        lastName: "",
        dob: formatDate(dob),
        confirmPassword,
        deviceDetails: {
          deviceId: "ID",
          deviceOsType: DeviceInfo.getSystemName(),
          deviceOsVersion: DeviceInfo.getSystemVersion(),
          deviceModel: DeviceInfo.getModel(),
          appVersion: "1.0.0",
          pushNotificationToken: "PUSH_NOTIFICATION_TOKEN1",
        },
        addressDetails: {
          area: null,
          block: null,
          street: null,
          jadda: null,
          building: null,
          floor: null,
          flat: null,
        },
        language: "en",
        platform: DeviceInfo.getSystemName(),
        deliveryTime: 1,
      }
      Animated.timing(transAnim, {
        toValue: 0,
        easing: Easing.in(Easing.elastic(1)),
        duration: 1600,
        useNativeDriver: true,
      }).start()
      profileHandler(registerInfo)
    }
  }

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const onNextPress = () => {
    const check = checkRegInfo()
    if (check === 2) {
      setIsLoading(true)
      checkUserExistance()
    } else if (check === 0) {
      Alert.alert(lang[lang.lang].register_alert_6)
    } else if (check === 3) {
      Alert.alert(lang[lang.lang].register_alert_8)
    }
  }

  const profileHandler = registerdata => {
    navigation.navigate("HowItWorks", {
      registerdata,
    })
    // Make the login is the current default value to return to it after registeration process
    setIsLoading(false)
  }
  const onChangeLanguage = () => {
    if (lang.lang === "ar") {
      lang.lang = "en"
      setLanguage(lang.lang)
    } else {
      lang.lang = "ar"
      setLanguage(lang.lang)
    }
  }

  const PhoneLeftAccessory = useMemo(
    () =>
      function PhoneLeftAccessory() {
        return <Icon icon={"phone"} />
      },
    [],
  )

  const UserLeftAccessory = useMemo(
    () =>
      function PhoneLeftAccessory() {
        return <AntDesign name={"user"} size={16} color={colors.green} />
      },
    [],
  )

  const MailLeftAccessory = useMemo(
    () =>
      function PhoneLeftAccessory() {
        return <Ionicons name={"mail-outline"} size={16} color={colors.green} />
      },
    [],
  )

  const PasswordLeftAccessory = useMemo(
    () =>
      function PasswordLeftAccessory() {
        return <Icon icon={"key"} />
      },
    [],
  )
  const registrationForm = () => {
    return (
      <Animated.View
        style={[
          styles.animatedRegistrationView,
          {
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -2 * windowWidth],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.signupFormContainer}>
          <TextField
            autoCorrect={false}
            label={lang[lang.lang].register_2}
            placeholder={lang[lang.lang].register_2}
            onChangeText={onChangeName}
            textAlign={lang.lang === "ar" ? "right" : "left"}
            containerStyle={{ marginBottom: spacing.medium }}
            LeftAccessory={UserLeftAccessory}
            LabelTextProps={{
              style: {
                textAlign: lang.lang === "ar" ? "right" : "left",
              },
            }}
          />

          <TextField
            autoCorrect={false}
            label={lang[lang.lang].register_3}
            placeholder={lang[lang.lang].register_3}
            onChangeText={onChangeMobilePhone}
            textAlign={lang.lang === "ar" ? "right" : "left"}
            containerStyle={{ marginBottom: spacing.medium }}
            LeftAccessory={PhoneLeftAccessory}
            LabelTextProps={{
              style: {
                textAlign: lang.lang === "ar" ? "right" : "left",
              },
            }}
          />

          <TextField
            autoCorrect={false}
            label={lang[lang.lang].register_4}
            placeholder={lang[lang.lang].register_4}
            onChangeText={onChangeEmail}
            textAlign={lang.lang === "ar" ? "right" : "left"}
            LeftAccessory={MailLeftAccessory}
            LabelTextProps={{
              style: {
                textAlign: lang.lang === "ar" ? "right" : "left",
              },
            }}
          />
          <TouchableOpacity
            style={styles.field}
            onPress={() => {
              setSelectedDob(true)
              Keyboard.dismiss()
            }}>
            <Text preset="footnote">
              {lang[lang.lang].register_5}
              <Text text={formatDate(dob)} preset="t3" />
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButtonStyle}
            onPress={() => {
              onNextPress()
            }}>
            <Text preset="button02" color={colors.white}>
              {lang[lang.lang].register_9}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("SigninScreen")}>
            <Text preset="t3" style={styles.signupTextStyle}>
              {lang[lang.lang].register_10}
              <Text preset="t3" text={lang[lang.lang].register_11} color={colors.yellow} />
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  const renderOtpForm = () => {
    return (
      <Animated.View
        style={[
          styles.animatedOtpView,
          {
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [windowWidth, -windowWidth],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.spacing25} />
        <Text preset="t1">{lang[lang.lang].login_4}</Text>
        <Text preset="t3">{lang[lang.lang].login_5}</Text>
        <Text preset="t3">
          {lang[lang.lang].login_6}
          {/* {trueOtp} */}
        </Text>

        <View style={styles.otpFormContainer}>
          {isOtp && (
            <OTPTextView
              tintColor={colors.yellow}
              handleTextChange={e => {
                setOtpNumber(e)
                if (e.length === 6) {
                  if (parseInt(e, 10) === parseInt(trueOtp, 10)) {
                    Keyboard.dismiss()
                    Animated.timing(transAnim, {
                      toValue: 1,
                      easing: Easing.in(Easing.elastic(1)),
                      duration: 1600,
                      useNativeDriver: true,
                    }).start()
                  } else {
                    Alert.alert(lang[lang.lang].register_alert_16)
                  }
                }
              }}
              containerStyle={styles.textInputContainer}
              textInputStyle={styles.roundedTextInput}
              defaultValue=""
              selectionColor={colors.white}
              inputCount={6}
              keyboardType={"number-pad"}
            />
          )}

          <TouchableOpacity>
            <Text preset="t3" style={styles.textAlign}>
              {lang[lang.lang].login_7}
              <Text preset="t3">{lang[lang.lang].register_15}</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.changeNumberButton}
            onPress={() => {
              Animated.timing(transAnim, {
                toValue: 0,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1600,
                useNativeDriver: true,
              }).start()
              setIsOtp(false)
            }}>
            <Text preset="button02" color={colors.white}>
              {lang[lang.lang].register_17}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }

  const renderPasswordForm = () => {
    return (
      <Animated.View
        style={[
          styles.passwordAnimatedView,
          {
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2 * windowWidth, 0],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.passwordForm}>
          <TextField
            value={password}
            label={lang[lang.lang].register_18}
            placeholder={lang[lang.lang].register_18}
            autoCorrect={false}
            secureTextEntry={true}
            onChangeText={onChangePassword}
            textAlign={lang.lang === "ar" ? "right" : "left"}
            containerStyle={{ marginBottom: spacing.medium }}
            LeftAccessory={PasswordLeftAccessory}
            LabelTextProps={{
              style: {
                textAlign: lang.lang === "ar" ? "right" : "left",
              },
            }}
          />

          <TextField
            value={confirmPassword}
            label={lang[lang.lang].register_19}
            placeholder={lang[lang.lang].register_19}
            secureTextEntry={true}
            onChangeText={onChangeConfirmPassword}
            textAlign={lang.lang === "ar" ? "right" : "left"}
            containerStyle={{ marginBottom: spacing.medium }}
            LeftAccessory={PasswordLeftAccessory}
            LabelTextProps={{
              style: {
                textAlign: lang.lang === "ar" ? "right" : "left",
              },
            }}
          />

          <View
            style={{
              width: "80%",
              flexDirection: lang.lang == "ar" ? "row-reverse" : "row",
            }}>
            <CheckBox
              value={isSelected}
              onValueChange={setSelection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />
            <Text preset="t3">{lang[lang.lang].register_20}</Text>
          </View>

          <TouchableOpacity
            style={[styles.button]}
            onPress={() => {
              setIsLoading(true)
              register()
            }}>
            <Text preset="button02" color={colors.white}>
              {lang[lang.lang].register_22}
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    )
  }
  const bgImage = require("../../assets/images/login-background.png")

  return (
    <ImageBackground
      style={[{ height: "100%", width: "100%", alignSelf: "center", alignItems: "center" }]}
      imageStyle={[{ resizeMode: "cover", height: "100%", width: "100%", alignSelf: "center" }]}
      source={bgImage}>
      {selectedDob && (
        <View style={styles.dobContainer}>
          <View style={styles.calendarWrapperView}>
            <CalendarPicker
              selectedDayColor={config.color_1}
              onDateChange={onChangeDob}
              width={0.8 * windowWidth}
            />
          </View>
          <TouchableOpacity
            style={styles.confirmButtonStyle}
            onPress={() => {
              setSelectedDob(false)
            }}>
            <Text preset="button02" color={colors.white}>
              {lang[lang.lang].register_1}
            </Text>
          </TouchableOpacity>
          <View style={{ marginTop: 360 }}>
            <Loading isLoading={isLoading} />
          </View>
        </View>
      )}

      <View
        style={[
          styles.headerView,
          {
            top: topHeight,
          },
        ]}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack()
          }}>
          <Ionicons name="arrow-back" size={28} color={colors.black} />
        </TouchableOpacity>
        <Image source={crossFatLogo} resizeMode={"contain"} style={styles.logoStyle} />
        <TouchableOpacity style={globalStyle.rowCenter} onPress={onChangeLanguage}>
          <Text
            preset="t3"
            color={colors.yellow}
            text={lang.lang === "ar" ? "English" : "العربية"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.inputBody}>
        {/* First Registeration Page */}
        {registrationForm()}

        {/* OTP Verification Page */}
        {renderOtpForm()}

        {/* Password Page */}
        {renderPasswordForm()}
      </View>
    </ImageBackground>
  )
}

export default Register

const styles = StyleSheet.create({
  body: {
    flex: 1,
    height: "100%",
    width: "100%",
    alignSelf: "center",
    position: "absolute",
    alignItems: "center",
  },
  textInputContainer: {
    marginBottom: 20,
    marginTop: 40,
  },

  roundedTextInput: {
    borderRadius: 10,
    backgroundColor: "white",
    borderWidth: 1,
  },

  inputBody: {
    alignItems: "center",
    flex: 1,
  },
  button: {
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.yellow,
    padding: spacing.small,
    marginTop: spacing.medium,
  },

  field: {
    width: "90%",
    height: 50,
    zIndex: 999,
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    marginTop: "5%",
  },
  signupFormContainer: {
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 24,
    borderColor: colors.lightYellow,
    alignSelf: "stretch",
    backgroundColor: colors.white,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.large,
    marginHorizontal: spacing.extraLarge,
  },
  nextButtonStyle: {
    backgroundColor: colors.yellow,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    marginTop: spacing.large,
  },
  signupTextStyle: {
    textAlign: "center",
    marginTop: spacing.medium,
  },
  confirmButtonStyle: {
    backgroundColor: colors.yellow,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    alignSelf: "stretch",
    marginHorizontal: spacing.medium,
  },
  calendarWrapperView: {
    justifyContent: "center",
    backgroundColor: "white",
    borderColor: colors.yellow,
    borderWidth: 4,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    marginTop: "60%",
    margin: 20,
    borderRadius: 20,
  },
  dobContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: colors.lightYellow,
    zIndex: 9999,
    alignItems: "center",
    flex: 1,
  },
  animatedRegistrationView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  otpFormContainer: {
    borderWidth: 1,
    backgroundColor: colors.white,
    borderRadius: 24,
    borderColor: colors.lightYellow,
    paddingVertical: spacing.medium,
    marginTop: spacing.large,
  },
  textAlign: {
    textAlign: "center",
  },
  changeNumberButton: {
    backgroundColor: colors.yellow,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding: spacing.small,
    marginTop: spacing.medium,
  },
  spacing25: { height: "25%" },
  animatedOtpView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
  },
  passwordForm: {
    alignSelf: "stretch",
    justifyContent: "center",
    borderWidth: 1,
    marginHorizontal: spacing.extraLarge,
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: spacing.large,
    borderColor: colors.lightYellow,
  },
  checkboxStyle: {
    borderRadius: 4,
    marginTop: "1%",
    marginRight: spacing.extraSmall,
  },
  passwordAnimatedView: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  headerView: {
    position: "absolute",
    zIndex: 999,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: spacing.medium,
  },
  logoStyle: {
    width: 140,
    height: 32,
    left: 24,
  },
})
