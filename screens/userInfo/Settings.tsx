import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Feather from "react-native-vector-icons/Feather"
import axios from "axios"
import React, { useRef } from "react"
import {
  Alert,
  Animated,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  Image,
} from "react-native"

import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const PersonalInfo = ({
  editProfileHandler,
  personalHandler,
  settingsHandler,
  setIsLoading,
  handleBack,
  dislikeHandler,
  logoutHandler,
}) => {
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  const deleteAccount = () => {
    setIsLoading(true)
    axios
      .post(
        config.baseURL + "/api/auth/deleteAccount",
        {
          key: 0,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        console.log(response)
        if (response.data.message === "success") {
          logoutHandler()
        }
      })
      .catch(e => {
        console.log(e)
      })
  }

  const onDeleteAccountPress = () => {
    Alert.alert(lang[lang.lang].personal_profile_8, lang[lang.lang].personal_profile_5, [
      { text: lang[lang.lang].personal_profile_6 },
      {
        text: lang[lang.lang].personal_profile_7,
        onPress: () =>
          Alert.alert(lang[lang.lang].personal_profile_8, lang[lang.lang].personal_profile_9, [
            {
              text: lang[lang.lang].personal_profile_10,
              onPress: () => deleteAccount(),
            },
            { text: lang[lang.lang].personal_profile_11 },
          ]),
      },
    ])
  }

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.headingInnerStyle}>
          <TouchableOpacity
            onPress={() => {
              handleBack()
            }}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="t1" color={colors.white}>
            {lang[lang.lang].personal_profile_13}
          </Text>
          <TouchableOpacity
            onPress={() => {
              settingsHandler(true)
            }}>
            <Ionicons name="settings-outline" size={24} color={colors.yellow} />
          </TouchableOpacity>
        </View>
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
        <View style={styles.userInfoContainer}>
          <View style={styles.userProfileView}>
            <Entypo name="user" size={60} />
          </View>

          <View>
            <Text style={styles.textAlign} preset="largeTitle">
              {config.profile.name}
            </Text>
            <Text style={styles.textAlign} preset="button02">
              {config.profile.email}
            </Text>
          </View>
        </View>

        <RowItem
          title={lang[lang.lang].personal_profile_1}
          onPress={() => {
            editProfileHandler()
          }}
          leftIcon={<AntDesign name="user" size={28} />}
          rightIcon={<Entypo name="chevron-right" size={24} />}
        />

        <RowItem
          title={lang[lang.lang].personal_profile_2}
          onPress={() => {
            setIsLoading(true)
            personalHandler()
          }}
          leftIcon={<Feather name="box" size={28} />}
          rightIcon={<Entypo name="chevron-right" size={24} />}
        />
        <RowItem
          title={lang[lang.lang].personal_profile_12}
          onPress={() => {
            handleBack()
          }}
          leftIcon={
            <Image
              source={require("../../assets/icons/calendar2.png")}
              style={{ width: 26, height: 26 }}
            />
          }
          rightIcon={<Entypo name="chevron-right" size={24} />}
        />
        <RowItem
          title={lang[lang.lang].personal_profile_122}
          onPress={() => {
            dislikeHandler()
          }}
          leftIcon={
            <Image
              source={require("../../assets/icons/dislike.png")}
              style={{ width: 26, height: 26 }}
            />
          }
          rightIcon={<Entypo name="chevron-right" size={24} />}
        />
        <RowItem
          title={lang[lang.lang].logout}
          onPress={() => {
            logoutHandler()
          }}
          leftIcon={
            <Image
              source={require("../../assets/icons/logout2.png")}
              style={{ width: 28, height: 28 }}
            />
          }
          rightIcon={<Entypo name="chevron-right" size={24} />}
        />

        <RowItem
          title={lang[lang.lang].personal_profile_4}
          onPress={onDeleteAccountPress}
          leftIcon={<MaterialIcons name="delete-sweep" size={28} />}
          rightIcon={<Entypo name="chevron-right" size={24} />}
        />
      </Animated.View>
    </View>
  )
}

const RowItem = ({ title, onPress, rightIcon, leftIcon }) => (
  <TouchableOpacity style={styles.rowItem} onPress={onPress}>
    {leftIcon}
    <View style={styles.rowTextWrapper}>
      <Text preset="button01" text={title} />
    </View>
    {rightIcon}
  </TouchableOpacity>
)

export default PersonalInfo

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
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
  userProfileView: {
    width: 120,
    height: 120,
    backgroundColor: colors.lightGreen,
    borderRadius: 60,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.medium,
    alignContent: "center",
  },
  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: spacing.small,
  },
  rowTextWrapper: {
    flex: 1,
    marginHorizontal: spacing.medium,
  },
  textAlign: {
    textAlign: "center",
  },
})
