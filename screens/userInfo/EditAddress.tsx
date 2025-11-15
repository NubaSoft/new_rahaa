import Ionicons from "react-native-vector-icons/Ionicons"
import Entypo from "react-native-vector-icons/Entypo"
import axios from "axios"
import React, { useEffect, useState } from "react"
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View, SafeAreaView } from "react-native"
import DropDownPicker from "react-native-dropdown-picker"
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"

import { Text, TextField } from "../../app/components"
import { colors, globalStyle, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const EditProfile = ({ backHandler, setIsLoading }) => {
  //Animation
  const [block, onChangeBlock] = useState("")
  const [building, onChangebuilding] = useState("")
  const [jadda, onChangejadda] = useState("")
  const [notes, onChangenotes] = useState("")
  const [street, onChangeStreet] = useState("")
  const [flat, onChangeflat] = useState("")
  const [floor, onChangeFloor] = useState("")
  const [areaOpen, setareaOpen] = useState(false)
  const [areaValue, setareaValue] = useState(0)
  const [areaItems, setareaItems] = useState([
    { label: lang[lang.lang].edit_profile_6, value: "0" },
  ])
  const [governOpen, setgovernOpen] = useState(false)
  const [governValue, setgovernValue] = useState(0)
  const [governItems, setgovernItems] = useState([
    { label: "Hawaly", value: "hawaly" },
    { label: "Salmeya", value: "salmeya" },
  ])
  const [deliveryDaysOpen, setdeliveryDaysOpen] = useState(false)
  const [deliveryDaysValue, setdeliveryDaysValue] = useState([])
  const [deliveryDaysItems, setdeliveryDaysItems] = useState([])

  const [deliveryTimeOpen, setdeliveryTimeOpen] = useState(false)
  const [deliveryTimeValue, setdeliveryTimeValue] = useState(0)
  const [deliveryTimeItems, setdeliveryTimeItems] = useState([])
  const [governAreasResponse, setGovernAreasResponse] = useState([])
  const [addresses, setAddresses] = useState([])
  const [isAdd, setIsAdd] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [addressName, setAddressName] = useState("")
  const [delivaryDays, setDeliveryDays] = useState([])
  const [editAdressID, setEditAdressID] = useState(0)

  const [status, setStatus] = useState(1)
  const textAlign = lang.lang === "ar" ? "right" : "left"

  useEffect(() => {
    getAddresses()
    getTimeSlots()
    getAreas()
    getWeekDays()
  }, [])

  useEffect(() => {
    if (governValue !== 0) {
      let areasf = []
      for (let i = 0; i < governAreasResponse.length; i++) {
        if (governAreasResponse[i].governmentId === governValue) {
          areasf = governAreasResponse[i].data
        }
      }
      // Change this code to set areas

      const areasItemsformat = []
      for (let i = 0; i < areasf.length; i++) {
        areasItemsformat.push({
          label: lang.lang === "ar" ? areasf[i].name : areasf[i].nameEn,
          value: areasf[i].id,
        })
      }
      setareaItems(areasItemsformat)
    } else {
      setareaItems([{ label: lang[lang.lang].edit_profile_6, value: "0" }])
    }
  }, [governValue])

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
              lang.lang == "ar"
                ? response.data[i].governmentNameAr
                : response.data[i].governmentNameEn,
            value: response.data[i].governmentId,
          })
        }
        setgovernItems(Governs)

        axios
          .get(config.baseURL + "/api/address/getAdresses")
          .then(response => {
            setDeliveryDays(response.data[0].deliveryDays)
            setIsLoading(false)
          })
          .catch(() => {
            setIsLoading(false)
          })
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  const getAddresses = () => {
    setIsLoading(true)
    axios
      .get(config.baseURL + "/api/address/getAdresses", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then(response => {
        if (response.status === 200) {
          setAddresses(response.data)
        }

        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  const deleteAddress = address => {
    setIsLoading(true)
    axios
      .delete(config.baseURL + "/api/address/deleteAddress", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
        data: {
          addressId: address.did,
        },
      })
      .then(response => {
        getAddresses()
      })
      .catch(() => {
        Alert.alert(lang[lang.lang].edit_profile_alert_28, lang[lang.lang].edit_profile_alert_29)

        setIsLoading(false)
      })
  }

  const addAddress = () => {
    setIsLoading(true)

    axios
      .post(
        config.baseURL + "/api/address/addAddress",
        {
          addressName,
          area: areaValue,
          block,
          street,
          jadda,
          building,
          floor,
          flat,
          timeslot: deliveryTimeValue,
          deliveryDays: deliveryDaysValue,
          notes,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        if (response.data.hasOwnProperty("message")) {
          getAddresses()
          Alert.alert(
            lang[lang.lang].edit_profile_alert_30,
            lang[lang.lang].edit_profile_alert_31 +
              addressName +
              lang[lang.lang].edit_profile_alert_32,
          )
          setIsAdd(false)
          setIsLoading(false)
        } else {
          getAddresses()
          Alert.alert(lang[lang.lang].edit_profile_alert_28, response.data.errorMessage)
          setIsLoading(false)
        }
      })
      .catch(() => {
        setIsLoading(false)
      })
  }
  const getTimeSlots = () => {
    axios
      .post(
        config.baseURL + "/api/address/deliveryTimes",
        { centerId: 1 },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        const Timeslots = []
        for (let i = 0; i < response.data.length; i++) {
          Timeslots.push({
            label:
              (lang.lang == "ar" ? response.data[i].nameAr : response.data[i].nameEn) +
              "( from: " +
              response.data[i].startTime +
              " to: " +
              response.data[i].endTime +
              ")",
            value: response.data[i].id,
          })
        }
        setdeliveryTimeItems(Timeslots)

        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  const getWeekDays = () => {
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
        const weekDaysArr = []
        for (let i = 0; i < response.data.weekDays.length; i++) {
          weekDaysArr.push({
            label: lang[lang.lang][response.data.weekDays[i]],
            value: response.data.weekDays[i],
          })
        }
        setdeliveryDaysItems(weekDaysArr)
      })
      .catch(() => {
        // Do nothing
      })
  }
  const setEditAdressValues = adressChoosen => {
    let areaID = 0
    for (let i = 0; i < governAreasResponse.length; i++) {
      for (let j = 0; j < governAreasResponse[i].data.length; j++) {
        if (governAreasResponse[i].data[j].name === adressChoosen.area) {
          areaID = governAreasResponse[i].data[j].id
        }
      }
    }
    setEditAdressID(adressChoosen.did)
    setAddressName(adressChoosen.addressName)
    setareaValue(areaID)
    onChangeBlock(adressChoosen.block)
    onChangeStreet(adressChoosen.street)
    onChangejadda(adressChoosen.jadda)
    onChangebuilding(adressChoosen.building)
    setdeliveryTimeValue(adressChoosen.timeSlotId)
    setdeliveryDaysValue(adressChoosen.deliveryDays)
    onChangenotes(adressChoosen.notes)
  }
  const editAdress = () => {
    setIsLoading(true)

    axios
      .put(
        config.baseURL + "/api/address/editAddress",
        {
          addressId: editAdressID,
          addressName,
          area: areaValue,
          block,
          street,
          jadda,
          building,
          timeslot: deliveryTimeValue,
          deliveryDays: deliveryDaysValue,
          notes,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        getAddresses()
        Alert.alert(
          lang[lang.lang].edit_profile_alert_25,
          lang[lang.lang].edit_profile_alert_31 +
            addressName +
            lang[lang.lang].edit_profile_alert_32,
        )
        setIsEdit(false)
        setIsLoading(false)
      })
      .catch(() => {
        setIsLoading(false)
      })
  }

  const daysString = days => {
    let daysStr = ""
    for (let i = 0; i < days.length; i++) {
      daysStr += lang[lang.lang][days[i]] + ", "
    }
    return daysStr
  }

  const onDeleteAddressPress = address => {
    Alert.alert(
      lang[lang.lang].edit_profile_alert_33,
      lang[lang.lang].edit_profile_alert_34 + address.addressName,
      [
        {
          text: lang[lang.lang].edit_profile_alert_35,
          onPress: () => {
            // do nothing
          },
        },
        {
          text: lang[lang.lang].edit_profile_alert_36,
          onPress: () => deleteAddress(address),
        },
      ],
    )
  }

  const renderListOfAddress = () => {
    return (
      <View style={styles.listOfAddressContainer}>
        <ScrollView
          contentContainerStyle={{
            padding: spacing.medium,
          }}>
          {addresses.map(address => (
            <View key={address.did} style={styles.addressCardStyle}>
              <View style={globalStyle.rowBetween}>
                <Text preset="t2">{address.addressName}</Text>

                <View style={globalStyle.rowStart}>
                  <TouchableOpacity
                    style={{
                      marginHorizontal: spacing.small,
                    }}
                    onPress={() => onDeleteAddressPress(address)}>
                    <Ionicons name="trash-bin" size={20} color={colors.yellow} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setEditAdressValues(address)
                      setIsEdit(true)
                    }}>
                    <Ionicons name="pencil" size={20} color={colors.yellow} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.deliveryTimeWrapper}>
                <View style={styles.timeView}>
                  <Text preset="t2" color={colors.green} text={address.fromTime} />
                  <Text preset="t3" color={colors.green} text={lang[lang.lang].edit_profile_13} />
                </View>
                <View style={styles.timeView}>
                  <Text preset="t2" color={colors.green} text={address.toTime} />
                  <Text preset="t3" color={colors.green} text={lang[lang.lang].edit_profile_14} />
                </View>
              </View>
              <View>
                <View style={styles.headingWrapper}>
                  <Text preset="footnote" text={lang[lang.lang].edit_profile_11} />
                </View>
                <Text preset="t3">{daysString(address.deliveryDays)}</Text>

                <View>
                  <View style={styles.headingWrapper}>
                    <Text preset="footnote">{lang[lang.lang].edit_profile_12}</Text>
                  </View>
                  <Text preset="t3">{`${lang[lang.lang].edit_profile_15} ${address.area}`}</Text>
                  <Text preset="t3">{`${lang[lang.lang].edit_profile_17} ${address.block}`}</Text>
                  <Text preset="t3">{`${lang[lang.lang].edit_profile_18} ${
                    address.building
                  }`}</Text>
                  <Text preset="t3">{`${lang[lang.lang].edit_profile_21} ${address.flat}`}</Text>
                  <Text preset="t3">{`${lang[lang.lang].edit_profile_22} ${address.floor}`}</Text>
                  {address.jadda !== null && (
                    <Text preset="t3">{`${lang[lang.lang].edit_profile_19} ${address.jadda}`}</Text>
                  )}
                  <Text preset="t3">{`${lang[lang.lang].edit_profile_20} ${address.street}`}</Text>
                  {address.notes !== "" && (
                    <Text preset="t3">{`${lang[lang.lang].edit_profile_16} ${address.notes}`}</Text>
                  )}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    )
  }

  const renderEditAddress = () => {
    return (
      <View
        style={{
          padding: spacing.medium,
        }}>
        <View
          style={{
            zIndex: 999,
          }}>
          <Text preset="t2">{lang[lang.lang].edit_profile_2}</Text>
          <DropDownPicker
            style={styles.dropdownStyle}
            textStyle={{
              textAlign,
            }}
            multiple={true}
            searchable={true}
            open={deliveryDaysOpen}
            value={deliveryDaysValue}
            items={deliveryDaysItems}
            setOpen={setdeliveryDaysOpen}
            setValue={setdeliveryDaysValue}
            setItems={setdeliveryTimeItems}
          />
        </View>
        <View
          style={{
            zIndex: 900,
          }}>
          <Text preset="t2">{lang[lang.lang].edit_profile_3}</Text>

          <DropDownPicker
            style={styles.dropdownStyle}
            textStyle={{
              textAlign,
            }}
            multiple={false}
            searchable={true}
            open={deliveryTimeOpen}
            value={deliveryTimeValue}
            items={deliveryTimeItems}
            setOpen={setdeliveryTimeOpen}
            setValue={setdeliveryTimeValue}
            setItems={setdeliveryTimeItems}
          />
        </View>

        <TextField
          value={notes}
          label={lang[lang.lang].complete_residence_6}
          placeholder={lang[lang.lang].complete_residence_6}
          autoCorrect={false}
          onChangeText={onChangenotes}
          textAlign={lang.lang === "ar" ? "right" : "left"}
          containerStyle={{ marginBottom: spacing.medium }}
          inputWrapperStyle={styles.inputWrapperStyle}
          LabelTextProps={{
            preset: "t2",
          }}
        />
      </View>
    )
  }

  const renderAddAddress = () => {
    return (
      <View style={styles.flex}>
        {status === 1 ? (
          <View
            style={{
              padding: spacing.medium,
            }}>
            <View style={styles.deliveryDaysWrapper}>
              <Text preset="t2">{lang[lang.lang].edit_profile_2}</Text>
              <DropDownPicker
                style={styles.dropdownStyle}
                textStyle={{
                  textAlign,
                }}
                multiple={true}
                searchable={true}
                open={deliveryDaysOpen}
                value={deliveryDaysValue}
                items={deliveryDaysItems}
                setOpen={setdeliveryDaysOpen}
                setValue={setdeliveryDaysValue}
                setItems={setdeliveryTimeItems}
              />
            </View>
            <View style={styles.deliveryTimeDropdownWrapper}>
              <Text preset="t2">{lang[lang.lang].edit_profile_3}</Text>

              <DropDownPicker
                style={styles.dropdownStyle}
                textStyle={{
                  textAlign,
                }}
                multiple={false}
                searchable={true}
                open={deliveryTimeOpen}
                value={deliveryTimeValue}
                items={deliveryTimeItems}
                setOpen={setdeliveryTimeOpen}
                setValue={setdeliveryTimeValue}
                setItems={setdeliveryTimeItems}
              />
            </View>

            <View style={styles.governDropdownWrapper}>
              <Text preset="t2">{lang[lang.lang].edit_profile_4}</Text>
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
              />
            </View>

            <View style={styles.areaDropdownWrapper}>
              <Text preset="t2">{lang[lang.lang].edit_profile_5}</Text>

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
              />
            </View>

            <TouchableOpacity
              style={styles.nextButtonStyle}
              onPress={() => {
                if (
                  areaValue !== 0 &&
                  governValue !== 0 &&
                  deliveryTimeValue !== 0 &&
                  deliveryDaysValue.length > 0
                ) {
                  setStatus(2)
                } else {
                  Alert.alert(lang[lang.lang].complete_residence_alert_15)
                }
              }}>
              <Text preset="button02" color={colors.white}>
                {lang[lang.lang].edit_profile_7}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <KeyboardAwareScrollView
            enableAutomaticScroll={false}
            contentContainerStyle={{
              padding: spacing.medium,
            }}>
            <TextField
              value={addressName}
              label={lang[lang.lang].edit_profile_8}
              placeholder={lang[lang.lang].edit_profile_8}
              autoCorrect={false}
              onChangeText={setAddressName}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={{ marginBottom: spacing.medium }}
              inputWrapperStyle={styles.inputWrapperStyle}
            />
            <TextField
              value={notes}
              label={lang[lang.lang].complete_residence_6}
              placeholder={lang[lang.lang].complete_residence_6}
              autoCorrect={false}
              onChangeText={onChangenotes}
              textAlign={lang.lang === "ar" ? "right" : "left"}
              containerStyle={{ marginBottom: spacing.medium }}
              inputWrapperStyle={styles.inputWrapperStyle}
            />

            <View style={globalStyle.rowBetween}>
              <TextField
                value={block}
                label={lang[lang.lang].complete_residence_7}
                placeholder={lang[lang.lang].complete_residence_7}
                autoCorrect={false}
                onChangeText={onChangeBlock}
                textAlign={lang.lang === "ar" ? "right" : "left"}
                containerStyle={styles.leftContainerStyle}
                inputWrapperStyle={styles.inputWrapperStyle}
              />

              <TextField
                value={street}
                label={lang[lang.lang].complete_residence_10}
                placeholder={lang[lang.lang].complete_residence_10}
                autoCorrect={false}
                onChangeText={onChangeStreet}
                textAlign={lang.lang === "ar" ? "right" : "left"}
                containerStyle={styles.rightContainerStyle}
                inputWrapperStyle={styles.inputWrapperStyle}
              />
            </View>

            <View style={globalStyle.rowBetween}>
              <TextField
                value={building}
                label={lang[lang.lang].complete_residence_8}
                placeholder={lang[lang.lang].complete_residence_8}
                autoCorrect={false}
                onChangeText={onChangebuilding}
                textAlign={lang.lang === "ar" ? "right" : "left"}
                containerStyle={styles.leftContainerStyle}
                inputWrapperStyle={styles.inputWrapperStyle}
              />
              <TextField
                value={flat}
                label={lang[lang.lang].complete_residence_11}
                placeholder={lang[lang.lang].complete_residence_11}
                autoCorrect={false}
                onChangeText={onChangeflat}
                textAlign={lang.lang === "ar" ? "right" : "left"}
                containerStyle={styles.rightContainerStyle}
                inputWrapperStyle={styles.inputWrapperStyle}
              />
            </View>

            <View style={globalStyle.rowBetween}>
              <TextField
                value={jadda}
                label={lang[lang.lang].complete_residence_9}
                placeholder={lang[lang.lang].complete_residence_9}
                autoCorrect={false}
                onChangeText={onChangejadda}
                textAlign={lang.lang === "ar" ? "right" : "left"}
                containerStyle={styles.leftContainerStyle}
                inputWrapperStyle={styles.inputWrapperStyle}
              />

              <TextField
                value={floor}
                label={lang[lang.lang].complete_residence_12}
                placeholder={lang[lang.lang].complete_residence_12}
                autoCorrect={false}
                onChangeText={onChangeFloor}
                textAlign={lang.lang === "ar" ? "right" : "left"}
                containerStyle={styles.rightContainerStyle}
                inputWrapperStyle={styles.inputWrapperStyle}
              />
            </View>
          </KeyboardAwareScrollView>
        )}
      </View>
    )
  }

  const getHeading = () => {
    if (isAdd) {
      return lang[lang.lang].edit_profile_1
    }
    if (isEdit) {
      return lang[lang.lang].edit_profile_25
    }
    return lang[lang.lang].edit_profile_10
  }

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <View style={styles.headingInnerStyle}>
          <TouchableOpacity
            onPress={() => {
              if (isAdd || isEdit) {
                setStatus(1)
                getAddresses()
                setIsAdd(false)
                setIsEdit(false)
              } else {
                backHandler()
              }
            }}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="button01" color={colors.white}>
            {getHeading()}
          </Text>
          <View />
        </View>
      </SafeAreaView>

      {isAdd ? renderAddAddress() : isEdit ? renderEditAddress() : renderListOfAddress()}

      {isAdd && status === 2 ? (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (
              areaValue !== 0 &&
              block !== "" &&
              building !== "" &&
              street !== "" &&
              deliveryTimeValue !== 0 &&
              deliveryDaysValue.length > 0
            ) {
              addAddress()
            } else {
              Alert.alert(lang[lang.lang].complete_residence_alert_15)
            }
          }}>
          <Text preset="button02" color={colors.white}>
            {lang[lang.lang].edit_profile_9}
          </Text>
        </TouchableOpacity>
      ) : isEdit ? (
        <TouchableOpacity
          style={[styles.button, { marginTop: spacing.huge }]}
          onPress={() => {
            if (deliveryTimeValue !== 0 && deliveryDaysValue.length > 0) {
              editAdress()
            } else {
              Alert.alert(lang[lang.lang].complete_residence_alert_15)
            }
          }}>
          <Text preset="button02" color={colors.white}>
            {lang[lang.lang].edit_profile_25}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.addAddressButton}
          onPress={() => {
            setIsAdd(true)
          }}>
          <Entypo name="plus" size={30} color={colors.white} />
        </TouchableOpacity>
      )}
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
  },
  flex: { flex: 1 },

  button: {
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.small,
    bottom: 30,
    width: "60%",
    alignSelf: "center",
  },

  leftContainerStyle: {
    marginBottom: spacing.medium,
    flex: 1,
    marginRight: spacing.tiny,
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
  timeView: {
    marginHorizontal: spacing.tiny,
    padding: spacing.extraSmall,
    alignItems: "center",
    backgroundColor: colors.white,
    // add shadow offset for iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    // add shadow opacity and color (iOS)
    shadowOpacity: 0.3,
    shadowColor: colors.black,
    // add shadow offset for Android
    elevation: 2,
    borderRadius: 10,
  },
  deliveryTimeWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: spacing.medium,
  },
  headingWrapper: {
    padding: spacing.extraSmall,
    borderRadius: 10,
    backgroundColor: colors.lightGreen,
    marginVertical: spacing.extraSmall,
  },
  addressCardStyle: {
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.grey,
    alignSelf: "stretch",
    padding: spacing.small,
    marginBottom: spacing.medium,
  },
  listOfAddressContainer: {
    flex: 1,
  },
  addAddressButton: {
    borderRadius: 14,
    backgroundColor: colors.green,
    height: 50,
    width: 50,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    margin: spacing.medium,
    marginRight: spacing.large,
  },
  dropdownStyle: {
    backgroundColor: colors.white,
    marginVertical: spacing.extraSmall,
    borderColor: colors.grey,
  },
  nextButtonStyle: {
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    padding: spacing.small,
    width: "60%",
    marginTop: spacing.large,
  },
  inputWrapperStyle: {
    borderWidth: 1,
    borderColor: colors.grey,
    borderRadius: 6,
  },
  rightContainerStyle: { marginBottom: spacing.medium, flex: 1, marginLeft: spacing.tiny },
  deliveryDaysWrapper: {
    zIndex: 999,
  },
  deliveryTimeDropdownWrapper: {
    zIndex: 900,
  },
  governDropdownWrapper: {
    zIndex: 850,
  },
  areaDropdownWrapper: {
    zIndex: 800,
  },
})
