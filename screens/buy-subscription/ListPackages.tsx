import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { Alert, Animated, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"
import Loading from "../loading/loading"

const AvailablePackages = ({ handler, subscriptionData, onBackPress }) => {
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const [pckgs, setPckgs] = useState([])
  const [selectedPckg, setSelectedPckg] = useState(-1)
  const [selectedPckgObject, setSelectedPckgObject] = useState(null)
  const [availablePackages, setAvailablePackages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const [OpenMeal, setOpenMeal] = useState(false)
  const [ValueMeal, setValueMeal] = useState("1")
  const [itemsMeal, setItemsMeal] = useState([
    { label: "1", name: "1", value: "1" },
    { label: "2", name: "2", value: "2" },
    { label: "3", name: "3", value: "3" },
    { label: "4", name: "4", value: "4" },
    { label: "5", name: "5", value: "5" },
  ])

  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("1")
  const [items, setItems] = useState([
    { label: "0", name: "0", value: "0" },
    { label: "1", name: "1", value: "1" },
    { label: "2", name: "2", value: "2" },
    { label: "3", name: "3", value: "3" },
    { label: "4", name: "4", value: "4" },
    { label: "5", name: "5", value: "5" },
  ])

  const [openDays, setOpenDays] = useState(false)
  const [valueDays, setValueDays] = useState("0")
  const [itemsDays, setItemsDays] = useState([])

  const [subdays, setSubDays] = useState<any>(0)

  const getMealLabel = () => {
    return (
      itemsMeal.find(item => item.value === ValueMeal)?.label || lang[lang.lang].package_selection_4
    )
  }
  const getSnackLabel = () => {
    return items.find(item => item.value === value)?.label || lang[lang.lang].package_selection_5
  }

  const getDaysLabel = () => {
    return (
      itemsDays.find(item => item.value === valueDays)?.label || lang[lang.lang].package_selection_2
    )
  }

  const getAvailableDays = () => {
    axios
      .post(config.baseURL + "/api/register/getActiveDays", { centerId: config.branch_code })
      .then(response => {
        const daysresp = []
        for (let i = 0; i < response.data.days.length; i++) {
          daysresp.push({
            label: String(response.data.days[i]).concat(" ", lang.lang == "ar" ? " يوم" : " Days"),
            value: response.data.days[i],
            name: String(response.data.days[i]).concat(" ", lang.lang == "ar" ? " يوم" : " Days"),
          })
        }
        setItemsDays(daysresp)
      })
      .catch(e => {
        console.log(e)
      })
  }

  useEffect(() => {
    getAvailableDays()
  }, [])

  useEffect(() => {
    setSubDays(valueDays)
  }, [valueDays, subdays])

  useEffect(() => {
    let sorted = []
    let listing = []
    let listing_new = []
    for (const pkg of availablePackages) {
      listing.push({
        price: pkg.price,
        days: pkg.days,
        menuID: pkg.menuID,
        snacks: pkg.snacks,
        meals: pkg.meals,
        nameEn: pkg.nameEn,
        nameAr: pkg.nameAr,
        notesEn: pkg.notesEn,
        notesAr: pkg.notesAr,
      })
    }

    for (let i = 0; i < listing.length; i++) {
      if (!sorted.includes(listing[i].menuID)) {
        sorted.push(listing[i].menuID)
        let dictnew = {
          menuID: listing[i].menuID,
          snacks: listing[i].snacks,
          meals: listing[i].meals,
          nameEn: listing[i].nameEn,
          nameAr: listing[i].nameAr,
          notes: listing[i].notesEn,
          note_arabic: listing[i].notesAr,

          items: [
            {
              price: listing[i].price,
              days: listing[i].days,
            },
          ],
        }
        for (let j = i + 1; j < listing.length; j++) {
          if (listing[j].menuID == listing[i].menuID) {
            dictnew.items.push({
              price: listing[j].price,
              days: listing[j].days,
            })
          }
        }
        listing_new.push(dictnew)
      }
    }
    console.log("Listings..............")
    console.log(listing_new)
    console.log("...................................")
    setPckgs(listing_new)
  }, [availablePackages])

  // Any change in value Meals,snacks,days will load the available packages
  useEffect(() => {
    setIsLoading(true)
    axios
      .post(
        config.baseURL + "/api/register/getAvailablePackagesAll",
        {
          // days: parseInt(valueDays),
          // meals: parseInt(ValueMeal),
          // snacks: parseInt(value),
          // noBreakfast: 0,
          centerId: config.branch_code,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        setAvailablePackages(response.data.packages)
        setIsLoading(false)
        // console.log("Package listing response= ", response.data)
      })
      .catch(e => {
        console.log("\nvvv Package listing error vvv")
        console.log(e)
        setIsLoading(false)
      })
  }, [])

  const SendSelectedPackage = () => {
    if (selectedPckg != -1) {
      const paymentdata = {
        days: selectedPckgObject.days,
        meals: selectedPckgObject.meals,
        snacks: selectedPckgObject.snacks,
        menuId: selectedPckgObject.menuID, // selected package menu id
        price: selectedPckgObject.price, // selected package price
        applyPromoCode: 0,
        noBreakfast: 0,
        finalPrice: selectedPckgObject.price,
        promoCode: "",
        discountPercentage: 0,
        discountValue: 0,
        marketingId: 1,
        paymentMethod: 1,
        language: "en",
        renew: 0,
        platform: "app",
        startSubscription: subscriptionData.startDate,
      }
      handler(paymentdata)
    } else {
      Alert.alert(lang[lang.lang].available_package_alert_7)
    }
  }

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <TouchableOpacity
          style={styles.backIconStyle}
          onPress={() => {
            onBackPress()
          }}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          {lang[lang.lang].available_package_1}
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
        <Loading isLoading={isLoading} />

        {/* Choosing available packages  */}
        <ScrollView
          style={{
            marginBottom: spacing.extraLarge,
          }}>
          {pckgs.map(pckg => (
            <View key={pckg.menuID}>
              <View
                style={[
                  styles.cardStyle,
                  {
                    backgroundColor: colors.white,
                  },
                ]}>
                <View style={{ width: "100%" }}>
                  {pckg.nameEn.toLowerCase().includes("ramadan") ? (
                    <Ionicons
                      name="moon-sharp"
                      size={30}
                      color={colors.green}
                      style={{ alignSelf: "center", marginBottom: "2%" }}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name="package-variant"
                      size={30}
                      color={colors.green}
                      style={{ alignSelf: "center", marginBottom: "2%" }}
                    />
                  )}

                  <Text
                    style={{ textAlign: "center" }}
                    preset="t2"
                    color={colors.green}
                    text={`${pckg.meals} ${lang[lang.lang].available_package_2} & ${pckg.snacks} ${
                      lang[lang.lang].available_package_3
                    }\n${lang.lang === "ar" ? pckg.nameAr : pckg.nameEn}\n`}
                  />
                  {pckg.note_arabic && pckg.notes ? (
                    <View>
                      <Text preset="t2" color="black" style={{ alignSelf: "center" }}>
                        {lang.lang === "ar" ? pckg.note_arabic : pckg.notes}
                        {"\n"}
                      </Text>
                    </View>
                  ) : (
                    <View></View>
                  )}

                  <View>
                    {pckg.items.map(item => (
                      <View key={item.days}>
                        <TouchableOpacity
                          style={[
                            styles.cardStyle2,
                            {
                              backgroundColor:
                                selectedPckg === pckg.menuID + item.days
                                  ? colors.lightYellow
                                  : colors.white,
                            },
                          ]}
                          onPress={() => {
                            if (selectedPckg === pckg.menuID + item.days) {
                              setSelectedPckg(-1)
                              setSelectedPckgObject(null)
                            } else {
                              setSelectedPckg(pckg.menuID + item.days)
                              setSelectedPckgObject({
                                meals: pckg.meals,
                                days: item.days,
                                snacks: pckg.snacks,
                                menuID: pckg.menuID,
                                price: item.price,
                              })
                            }
                          }}>
                          <Text preset="t2">
                            {item.days}
                            <Text preset="t3" text={lang[lang.lang].available_package_4} />
                          </Text>
                          <Text preset="t2">
                            {item.price}
                            <Text preset="t3" text={lang[lang.lang].available_package_5} />
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          SendSelectedPackage()
        }}>
        <Text preset="button01" color={colors.white}>
          {lang[lang.lang].available_package_6}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default AvailablePackages

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
    marginTop: spacing.large,
  },

  button: {
    padding: spacing.small,
    bottom: 40,
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: spacing.medium,
    paddingHorizontal: spacing.huge,
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
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.medium,
    marginHorizontal: spacing.medium,
    marginVertical: spacing.extraSmall,
    borderColor: colors.grey,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  cardStyle2: {
    borderRadius: 14,
    borderWidth: 1,
    padding: spacing.medium,
    marginHorizontal: spacing.medium,
    marginVertical: spacing.extraSmall,
    borderColor: colors.grey,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    alignSelf: "center",
    width: "70%",
  },
  checkmarkWrapper: { flex: 0.2, marginTop: spacing.tiny },
  animatedView: {
    flex: 1,
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
  filterWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: spacing.medium,
  },
  mealsContainer: {
    width: "25%",
  },
})
