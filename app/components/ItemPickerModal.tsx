import AntDesign from "react-native-vector-icons/AntDesign"
import { Picker } from "@react-native-picker/picker"
import React from "react"
import { StyleSheet, View, TouchableOpacity } from "react-native"
import Modal from "react-native-modal"

import { Text } from "./Text"
import { globalStyle, colors, spacing } from "../theme"

interface ItemPickerModalProps {
  isModalVisible: boolean
  onDonePress: () => void
  onClosePress: () => void
  heading: string
  data: Item[]
  selectedValue: string | number
  onValueChange: (value: string | number) => void
}
type Item = {
  value: string | number
  name: string
}
export const ItemPickerModal = ({
  isModalVisible,
  onDonePress,
  onClosePress,
  heading,
  data,
  selectedValue,
  onValueChange,
}: ItemPickerModalProps) => {
  const getPickerItems = () => {
    return data.map(item => {
      return <Picker.Item label={item.name} value={item.value} key={item.value} />
    })
  }

  return (
    <Modal isVisible={isModalVisible} style={styles.modal}>
      <View style={styles.innerContainer}>
        <View style={styles.headerWrapper}>
          <View style={styles.innerHeaderContainer}>
            <TouchableOpacity onPress={onClosePress} style={styles.closeButton}>
              <AntDesign name="close" size={spacing.large} color={colors.black} />
            </TouchableOpacity>
            <Text text={heading} preset="t2" color={colors.yellow} style={styles.text} />
          </View>
          <TouchableOpacity onPress={() => onDonePress()}>
            <Text text="Done" preset="button02" color={colors.yellow} style={styles.text} />
          </TouchableOpacity>
        </View>
        <View style={styles.bodyContainer}>
          <Picker
            selectedValue={selectedValue}
            onValueChange={value => {
              onValueChange(value)
            }}
            mode="dropdown" // Android only
            style={styles.picker}>
            {getPickerItems()}
          </Picker>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  bodyContainer: {
    flexDirection: "row",
    width: "100%",
  },
  closeButton: {
    marginEnd: spacing.small,
  },
  headerWrapper: {
    ...globalStyle.rowAlignBetweenBaseline,
    alignItems: "center",
    alignSelf: "stretch",
  },
  innerContainer: {
    backgroundColor: colors.white,
    borderTopEndRadius: 20,
    borderTopStartRadius: 20,
    padding: 22,
  },
  innerHeaderContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  modal: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
  },
  picker: {
    alignSelf: "center",
    flex: 3,
    marginVertical: spacing.medium,
  },
  text: {
    textAlign: "center",
  },
})
