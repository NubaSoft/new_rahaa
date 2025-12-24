import Ionicons from "react-native-vector-icons/Ionicons"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import DeviceInfo from 'react-native-device-info';
import React, { useEffect, useMemo, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Easing,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
  StatusBar,
  Platform,
  ImageBackground,
} from "react-native"
import OTPTextView from "react-native-otp-textinput"

import { Icon, Text, TextField } from "../../app/components"
import { colors, globalStyle, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"
import { useNavigation } from "@react-navigation/native"
import Loading from "../loading/loading"

const crossFatLogo = require("../../assets/images/cross-fat.png")

const Login = () => {
  const navigation = useNavigation<any>()
  const [mobilephone, onChangeMobilePhone] = useState("")
  const [password, onChangePassword] = useState("")
  const [ResetPasswordFlag, setResetPasswordFlag] = useState(false)
  const [confirmPassword, onChangeConfirmPassword] = useState("")
  const [otpNumber, setOtpNumber] = useState("")
  const [trueOtp, setTrueOtp] = useState("")
  const [_, setLanguage] = useState(lang.lang)
  const [isLoading, setIsLoading] = useState(false)

  const statusBarHeight = StatusBar.currentHeight
  const topHeight = Platform.OS === "ios" ? 70 : statusBarHeight

  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  useEffect(() => {
    setIsLoading(false)
    Keyboard.dismiss()
  }, [])
  //Actions

  const checkUserExistance = mobilephone => {
    axios
      .post(config.baseURL + "/api/register/signupGetUserPersonlInfo", {
        mobileNumber: mobilephone,
      })
      .then(response => {
        setIsLoading(false)
        // Animated.timing(pageAnim, {
        //   toValue: 0.5,
        //   easing: Easing.in(Easing.elastic(1)),
        //   duration: 1000,
        //   useNativeDriver: true,
        // }).start()

        if (response.data.registerUser === 2) {
          // user tried before to do registration but he didn’t complete
          navigation.navigate("subscription", {
            fromWhere: "Account",
          })
        } else if (response.data.registerUser === 1) {
          navigation.navigate("meals")
          // navigation.navigate("personal");
        }
        // Make the login is the current default value to return to it in logout process 97723905 - E12345678
      })
      .catch(e => {
        setIsLoading(false)
        console.log(e)
      })
  }

  const AfterLoginHandler = mobilephone => {
    // Check user information to navigate
    checkUserExistance(mobilephone)
  }

  const login = async () => {
    const fcmtoken = JSON.parse(await AsyncStorage.getItem("fcmtoken"))
    console.log("fcmtoken--fcmtoken----------", fcmtoken)
    if (password == null || password.length < 4) {
      Alert.alert(lang[lang.lang].passwordMustGreaterThan8Characters)
      setIsLoading(false)
    } else {
    axios
      .post(config.baseURL + "/api/auth/login", {
        mobileNumber: mobilephone,
        fcmtoken,
        password,
        deviceId: "ID",
        deviceOsType: DeviceInfo.getSystemName(),
        deviceOsVersion: DeviceInfo.getSystemVersion(),
        deviceModel: DeviceInfo.getModel(),
        appVersion: "1.0.0",
        language: "en",
        platform: DeviceInfo.getSystemName(),
        pushNotificationToken: "PUSH_NOTIFICATION_TOKEN1",
      })
      .then(function (response) {
        console.log("response-------login----------", response)
        config.Token = response.data.accessToken
        config.profile = response.data
        AsyncStorage.setItem("keepLoggedIn", JSON.stringify(true))
        AsyncStorage.setItem("data", JSON.stringify(response.data))

        AfterLoginHandler(mobilephone)
        setIsLoading(false)
      })
      .catch(err => {
        Alert.alert("Login Failed", "Please check login data and try again!")
        setIsLoading(false)
      })
    }
  }

  const checkUserExistance_forgot = () => {
    axios
      .post(config.baseURL + "/api/sendSmsOtp", {
        mobileNumber: mobilephone,
        language: "en",
      })
      .then(function (response) {
        console.log("response-----checkUserExistance_forgot---------------", response)
        if (response.data.message == "success") {
          setTrueOtp(response.data.otpCode)
          Animated.timing(transAnim, {
            toValue: 0.5,
            easing: Easing.in(Easing.elastic(1)),
            duration: 1600,
            useNativeDriver: true,
          }).start()
        } else {
          Alert.alert("Can't Send OTP to this mobile number, Please try again!")
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const backHandler = () => {
    setResetPasswordFlag(false)
    Animated.timing(transAnim, {
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
      duration: 1600,
      useNativeDriver: true,
    }).start()
  }

  const resetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert(lang[lang.lang].didntMatchTryAgain)
      setIsLoading(false)
    } else if (password == null || password.length < 4) {
      Alert.alert(lang[lang.lang].passwordMustGreaterThan8Characters)
      setIsLoading(false)
    } else {
      try {
        const response1: any = await axios.post(config.baseURL + "/api/auth/verifyResetOtpCode", {
          mobileNumber: mobilephone,
          otpCode: otpNumber,
          centerId: config.branch_code,
        })
        if (response1?.data?.accessToken) {
          config.Token = response1.data.accessToken
          const response2: any = await axios.post(
            config.baseURL + "/api/auth/resetPassword",
            {
              newPassword: password,
              centerId: config.branch_code,
            },
            {
              headers: {
                Authorization: `bearer ${config.Token}`,
              },
            },
          )
          if (response2) {
            Alert.alert(lang[lang.lang].changedSuccessfully)
            setResetPasswordFlag(false)
            setIsLoading(false)
            Animated.timing(transAnim, {
              toValue: 0,
              easing: Easing.in(Easing.elastic(1)),
              duration: 1600,
              useNativeDriver: true,
            }).start()
          } else {
            Alert.alert(lang[lang.lang].cantTesetPasswordTryAgain)
            setResetPasswordFlag(false)
            setIsLoading(false)
            Animated.timing(transAnim, {
              toValue: 0,
              easing: Easing.in(Easing.elastic(1)),
              duration: 1600,
              useNativeDriver: true,
            }).start()
          }
        } else {
          Alert.alert(lang[lang.lang].cantVerifyOtp)
          setResetPasswordFlag(false)
          setIsLoading(false)
          Animated.timing(transAnim, {
            toValue: 0,
            easing: Easing.in(Easing.elastic(1)),
            duration: 1600,
            useNativeDriver: true,
          }).start()
        }
      } catch (e) {
        setIsLoading(false)
        Alert.alert(lang[lang.lang].error, e.message)
        return { kind: "bad-data" }
      }
    }
  }

  const register = () => {
    //register in backend
    if (password !== confirmPassword) {
      Alert.alert("Password didn't match, Please try again!")
      setIsLoading(false)
    } else if (password == null || password.length < 4) {
      Alert.alert("Password must be greater than 4 characters!")
      setIsLoading(false)
    } else {
      axios
        .post(config.baseURL + "/api/auth/verifyResetOtpCode", {
          mobileNumber: mobilephone,
          otpCode: otpNumber,
        })
        .then(response => {
          config.Token = response.data.accessToken
          axios
            .post(
              config.baseURL + "/api/auth/resetPassword",
              {
                newPassword: password,
              },
              {
                headers: {
                  Authorization: `bearer ${config.Token}`,
                },
              },
            )
            .then(response => {
              Alert.alert("Password Changed Successfully")
              setResetPasswordFlag(false)
              setIsLoading(false)
              Animated.timing(transAnim, {
                toValue: 0,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1600,
                useNativeDriver: true,
              }).start()
            })
            .catch(e => {
              console.log(e)
              Alert.alert("Can't reset password please try again!")
              setResetPasswordFlag(false)
              setIsLoading(false)
              Animated.timing(transAnim, {
                toValue: 0,
                easing: Easing.in(Easing.elastic(1)),
                duration: 1600,
                useNativeDriver: true,
              }).start()
            })
        })
        .catch(e => {
          console.log(e)
          Alert.alert("Can't verify otp")
          setResetPasswordFlag(false)
          setIsLoading(false)
          Animated.timing(transAnim, {
            toValue: 0,
            easing: Easing.in(Easing.elastic(1)),
            duration: 1600,
            useNativeDriver: true,
          }).start()
        })
      onChangePassword("")
    }
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

  const onBackIconPress = () => {
    if (ResetPasswordFlag) {
      backHandler()
      return
    }
    Keyboard.dismiss()
    navigation.goBack()
  }

  const PhoneLeftAccessory = useMemo(
    () =>
      function PhoneLeftAccessory() {
        return <Icon icon={"phone"} />
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

  const loginForm = () => {
    return (
      <View style={styles.inputBody}>
        <Animated.View
          style={[
            styles.loginAnimatedContainer,
            {
              transform: [
                {
                  translateX: transAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -2000],
                  }),
                },
              ],
            },
          ]}>
          <View style={styles.loginFormContainer}>
            <TextField
              label={lang[lang.lang].login_12}
              placeholder={lang[lang.lang].login_12}
              keyboardType="number-pad"
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
              label={lang[lang.lang].login_13}
              placeholder={lang[lang.lang].login_13}
              value={password}
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

            <TouchableOpacity
              style={styles.forgotPasswordStyle}
              onPress={() => {
                setResetPasswordFlag(true)
              }}>
              <Text preset="footnote" text={lang[lang.lang].login_14} color={colors.yellow} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginButtonStyle}
              onPress={() => {
                setIsLoading(true)
                login()
              }}>
              <Text preset="button02" color={colors.white} text={lang[lang.lang].login_15} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButtonStyle}
              onPress={() => navigation.navigate("RegisterScreen")}>
              <Text preset="t3">
                {lang[lang.lang].login_16}
                <Text text={lang[lang.lang].login_17} preset="t3" color={colors.yellow} />
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    )
  }

  const renderForgotPassword = () => {
    return (
      <Animated.View
        style={[
          styles.forgotPasswordAnimatedContainer,
          {
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -4000],
                }),
              },
            ],
          },
        ]}>
        <Text preset="t1" text={lang[lang.lang].login_1} style={styles.forgotPasswordText} />

        <View style={styles.forgotPasswordForm}>
          <TextField
            autoCorrect={false}
            autoComplete={"tel"}
            keyboardType="number-pad"
            label={lang[lang.lang].login_2}
            placeholder={lang[lang.lang].login_2}
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

          <TouchableOpacity
            style={styles.sendOtpButtonStyle}
            onPress={async () => {
              checkUserExistance_forgot()
            }}>
            <Text preset="button02" color={colors.white}>
              {lang[lang.lang].login_3}
            </Text>
          </TouchableOpacity>
          <View style={{ position: "absolute", alignSelf: "center" }}>
            <Loading isLoading={isLoading} />
          </View>
        </View>
      </Animated.View>
    )
  }

  const renderOtpVerification = () => {
    return (
      <Animated.View
        style={[
          styles.otpAnimatedContainer,
          {
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [2000, -2000],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.spacingView} />

        <Text preset="t1">{lang[lang.lang].login_4}</Text>
        <Text preset="t3">{lang[lang.lang].login_5}</Text>
        <Text preset="t3">
          {lang[lang.lang].login_6}
          {/* {trueOtp} */}
        </Text>
        <View style={styles.otpFormContainer}>
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
                  Alert.alert("Please enter a valid OTP number!")
                }
              }
            }}
            containerStyle={styles.textInputContainer}
            textInputStyle={styles.roundedTextInput}
            defaultValue=""
            selectionColor={"black"}
            inputCount={6}
          />

          <TouchableOpacity>
            <Text preset="t3" style={styles.textAlign}>
              {lang[lang.lang].login_7}
              <Text preset="t3">{lang[lang.lang].login_8}</Text>
            </Text>
          </TouchableOpacity>
          <View style={{ position: "absolute", alignSelf: "center" }}>
            <Loading isLoading={isLoading} />
          </View>
        </View>
      </Animated.View>
    )
  }

  const renderPasswordPage = () => {
    return (
      <Animated.View
        style={[
          styles.passwordAnimatedContainer,
          {
            transform: [
              {
                translateX: transAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4000, 0],
                }),
              },
            ],
          },
        ]}>
        <View style={styles.passwordSpacingHeight} />
        <Text text="Create Password" preset="t1" style={styles.textAlign} />
        <View style={styles.createPasswordForm}>
          <TextField
            label={lang[lang.lang].login_9}
            placeholder={lang[lang.lang].login_9}
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
            label={lang[lang.lang].login_10}
            placeholder={lang[lang.lang].login_10}
            autoCorrect={false}
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
          <TouchableOpacity
            style={styles.resetPasswordButton}
            onPress={() => {
              setIsLoading(true)
              // register()
              resetPassword()
            }}>
            <Text preset="button02" color={colors.white}>
              {lang[lang.lang].login_11}
            </Text>
          </TouchableOpacity>
          <View style={{ position: "absolute", alignSelf: "center" }}>
            <Loading isLoading={isLoading} />
          </View>
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

      {ResetPasswordFlag ? (
        <View style={styles.inputBody}>
          {/* Forgot Password Page */}
          {renderForgotPassword()}

          {/* OTP Verification Page */}
          {renderOtpVerification()}

          {/* Password Page */}
          {renderPasswordPage()}
        </View>
      ) : (
        loginForm()
      )}
    </ImageBackground>
  )
}

export default Login

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
    flex: 1,
    alignItems: "center",
  },

  forgotPasswordStyle: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  loginButtonStyle: {
    borderRadius: 14,
    backgroundColor: colors.yellow,
    padding: spacing.medium,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.medium,
  },
  loginFormContainer: {
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 24,
    borderColor: colors.lightYellow,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.large,
    paddingVertical: spacing.large,
    marginHorizontal: spacing.extraLarge,
    alignSelf: "stretch",
  },
  signupButtonStyle: {
    alignSelf: "center",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  loginAnimatedContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  forgotPasswordText: {
    marginVertical: spacing.large,
  },
  sendOtpButtonStyle: {
    backgroundColor: colors.yellow,
    borderRadius: 14,
    padding: spacing.small,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.extraLarge,
  },
  forgotPasswordForm: {
    alignSelf: "stretch",
    justifyContent: "center",
    borderWidth: 1,
    marginHorizontal: spacing.extraLarge,
    backgroundColor: colors.white,
    borderRadius: 25,
    padding: spacing.large,
    borderColor: colors.lightYellow,
  },
  forgotPasswordAnimatedContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    marginTop: "30%",
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
  otpAnimatedContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
    alignItems: "center",
    marginTop: "30%",
  },
  spacingView: { height: "12%" },
  resetPasswordButton: {
    backgroundColor: colors.yellow,
    padding: spacing.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
  },
  createPasswordForm: {
    alignItems: "stretch",
    borderWidth: 1,
    marginHorizontal: spacing.extraLarge,
    padding: spacing.large,
    borderRadius: 24,
    borderColor: colors.lightYellow,
    backgroundColor: colors.white,
    marginTop: spacing.large,
  },
  passwordAnimatedContainer: {
    position: "absolute",
    height: "100%",
    width: "100%",
  },
  passwordSpacingHeight: { height: "20%" },
  logoStyle: {
    width: 140,
    height: 32,
    left: 24,
  },
})
