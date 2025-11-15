import Ionicons from "react-native-vector-icons/Ionicons"
import CheckBox from '@react-native-community/checkbox';
import React, { useRef, useState } from "react"
import { Alert, Animated, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native"

import { Icon, Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { lang } from "../../lang"

const RenewalProcess = ({ handler, backHandler, allowFast, setIsLoading }) => {
  const [fastSelected, setCashSelection] = useState(false)
  const [newSubSelected, setCardSelection] = useState(false)
  //Animation
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <TouchableOpacity
          style={styles.backIconStyle}
          onPress={() => {
            backHandler()
          }}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          {lang[lang.lang].subscription_data_8}
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
        <TouchableOpacity
          onPress={() => {
            setCashSelection(!fastSelected)
            setCardSelection(false)
          }}
          style={styles.cardStyle}>
          <View style={styles.cardFirstRowStyle}>
            <CheckBox
              value={fastSelected}
              onValueChange={setCashSelection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />
            <Icon icon="timePast" style={{ marginTop: spacing.large }} />
          </View>
          <View style={styles.cardSecondRowStyle}>
            <Text preset="t2">{lang[lang.lang].subscription_data_9}</Text>
            <Text
              preset="t3"
              style={{
                marginTop: spacing.extraSmall,
              }}>
              {lang[lang.lang].subscription_data_10}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            setCardSelection(!newSubSelected)
            setCashSelection(false)
          }}
          style={styles.cardStyle}>
          <View style={styles.cardFirstRowStyle}>
            <CheckBox
              value={newSubSelected}
              onValueChange={setCardSelection}
              color={colors.yellow}
              style={styles.checkboxStyle}
            />
            <Icon icon="subscription" style={{ marginTop: spacing.large }} />
          </View>
          <View style={styles.cardSecondRowStyle}>
            <Text preset="t2">{lang[lang.lang].subscription_data_11}</Text>
            <Text
              preset="t3"
              style={{
                marginTop: spacing.extraSmall,
              }}>
              {lang[lang.lang].subscription_data_12}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!allowFast && fastSelected) {
            Alert.alert(lang[lang.lang].subscription_data_14)
          } else if (newSubSelected && fastSelected) {
            Alert.alert(lang[lang.lang].subscription_data_15)
          } else if (newSubSelected) {
            handler(2)
            setIsLoading(true)
          } else if (fastSelected) {
            handler(1)
            setIsLoading(true)
          } else {
            Alert.alert(lang[lang.lang].subscription_data_16)
          }
        }}>
        <Text preset="button02" color={colors.white}>
          {lang[lang.lang].subscription_data_13}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default RenewalProcess

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
  cardStyle: {
    borderWidth: 1,
    borderRadius: 14,
    borderColor: colors.grey,
    padding: spacing.medium,
    flexDirection: "row",
    marginBottom: spacing.medium,
  },
  cardFirstRowStyle: {
    flex: 0.2,
  },
  checkboxStyle: {
    borderRadius: 6,
    marginTop: spacing.tiny,
  },
  cardSecondRowStyle: {
    flex: 1,
    justifyContent: "space-between",
  },
})
