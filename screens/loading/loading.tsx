import React from "react"
import { ActivityIndicator, View, StyleSheet } from "react-native"

import { colors } from "../../app/theme"

export default function Loading({ isLoading }) {
  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    )
  } else {
    return <View></View>
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",

    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
})
