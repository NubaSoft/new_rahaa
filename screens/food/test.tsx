import Ionicons from "react-native-vector-icons/Ionicons"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import AntDesign from "react-native-vector-icons/AntDesign"
import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  I18nManager,
  ImageBackground,
} from "react-native"
import Easing from "react-native/Libraries/Animated/Easing"

import { Icon, Text } from "../../app/components"
import { colors, globalStyle, spacing } from "../../app/theme"
import { config } from "../../config"
import { lang } from "../../lang"

const placeholder = require("../../assets/icon.png")

const AddMeals = ({
  date,
  usedDate,
  meals,
  CalendarBackHandler,
  setIsLoading,
  centerId,
  oId,
  can_be_modified,
  status,
}) => {
  const transAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const menuAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const mealsFadeAnim = useRef(new Animated.Value(0)).current //Initial value for translation is 0
  const [filteredMeals, setFilteredMeals] = useState([[]])
  const [selectedMeals, setSelectedMeals] = useState({})
  const [selectedMeal, setSelectedMeal] = useState(-1)

  const [currDate, setCurrDate] = useState(date)
  const [selectedType, setSelectedType] = useState(meals[0])
  const [selectedCat, setSelectedCat] = useState(meals[0]?.category[0])
  const [showInfo, setShowInfo] = useState(false)
  const [showMeal, setShowMeal] = useState<any>({})
  const [snackType, setSnackType] = useState("salad")

  const [calories, setCalories] = useState<number>(0)
  const [fats, setFats] = useState<number>(0)
  const [proteins, setProteins] = useState<number>(0)
  const [carbs, setCarbs] = useState<number>(0)

  function validURL(str) {
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i",
    ) // fragment locator
    return !!pattern.test(str)
  }
  const refreshMeal = () => {
    let listings = []
    let i = 0
    let listing = []
    if (selectedCat === undefined) {
      listings = []
    } else {
      for (const pkg of selectedCat.mealListItems) {
        if (i === 0) {
          listing.push(pkg)
          i = i + 1
        } else {
          i = 0
          listing.push(pkg)
          listings.push(listing)
          listing = []
        }
      }
    }
    if (i === 1) {
      listings.push(listing)
    }
    setFilteredMeals(listings)
  }
  useEffect(() => {
    let listings = []
    let i = 0
    let listing = []
    if (selectedCat === undefined) {
      listings = []
    } else {
      for (const pkg of selectedCat.mealListItems) {
        const selMeals = selectedMeals
        if (pkg.mealSelected) {
          selMeals[selectedCat["snackTypeId"]] = pkg["id"]
        }
        if (i === 0) {
          listing.push(pkg)
          i = i + 1
        } else {
          i = 0
          listing.push(pkg)
          listings.push(listing)
          listing = []
        }
      }
    }
    if (i === 1) {
      listings.push(listing)
    }
    setFilteredMeals(listings)
    Animated.timing(menuAnim, {
      toValue: 0,
      easing: Easing.out(Easing.in(Easing.elastic(1))),
      duration: 1000,
      useNativeDriver: true,
    }).start()

    Animated.timing(mealsFadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start()
    onCalc()
  }, [selectedCat, snackType])

  useEffect(() => {
    const selMeals = {}
    for (const idx in meals) {
      for (const catIdx in meals[idx]["category"]) {
        for (const mealIdx in meals[idx]["category"][catIdx]["mealListItems"]) {
          const meal = meals[idx]["category"][catIdx]["mealListItems"][mealIdx]
          if (meal["mealSelected"]) {
            selMeals[meals[idx].categoryId] = meal["id"]
          }
        }
      }
    }
    setSelectedMeal(selMeals["1"])
    setSelectedMeals(selMeals)
    onCalc()
  }, [meals])

  useEffect(() => {
    onCalc()
  }, [selectedMeals, selectedMeal])

  const onCalc = () => {
    console.log("savedMeals------useEffect------>>>>>>")
    const alertTitle = "Please complete your meals first \n"
    let alertMessage = ""
    let error = false
    const savedMeals = []
    let calories = 0
    let fats = 0
    let proteins = 0
    let carbs = 0

    if (Object.keys(selectedMeals).length === 0) {
      error = true
    } else {
      console.log("---meals----------------", selectedMeals)
      for (let i = 0; i < meals.length; i++) {
        if (meals[i].categoryId in selectedMeals && selectedMeals[meals[i].categoryId] !== -1) {
          const mealsList = []

          for (let k = 0; k < meals[i]["category"].length; k++) {
            for (let c = 0; c < meals[i]["category"][k]["mealListItems"].length; c++) {
              mealsList.push(meals[i]["category"][k]["mealListItems"][c])
            }
          }

          for (let j = 0; j < mealsList.length; j++) {
            if (mealsList[j]["id"] === selectedMeals[meals[i].categoryId]) {
              var savedMeal = {
                calories: mealsList[j]["calories"],
                fats: mealsList[j]["fats"],
                proteins: mealsList[j]["proteins"],
                carbs: mealsList[j]["carbs"],
              }
              calories = calories + mealsList[j]["calories"]
              fats = fats + mealsList[j]["fats"]
              proteins = proteins + mealsList[j]["proteins"]
              carbs = carbs + mealsList[j]["carbs"]
              setCalories(calories)
              setFats(fats)
              setProteins(proteins)
              setCarbs(carbs)
              break
            }
          }
          savedMeals.push(savedMeal)
          console.log("savedMeals------useEffect------", savedMeals)
        } else {
          alertMessage = alertMessage + "Select " + meals[i].titleEn + "\n"
          error = true
        }
      }
    }
  }

  const onSavePressHandle = () => {
    const alertTitle = "Please complete your meals first \n"
    let alertMessage = ""
    let error = false
    const savedMeals = []

    if (Object.keys(selectedMeals).length === 0) {
      error = true
    } else {
      for (let i = 0; i < meals.length; i++) {
        if (meals[i].categoryId in selectedMeals && selectedMeals[meals[i].categoryId] !== -1) {
          const mealsList = []

          for (let k = 0; k < meals[i]["category"].length; k++) {
            for (let c = 0; c < meals[i]["category"][k]["mealListItems"].length; c++) {
              mealsList.push(meals[i]["category"][k]["mealListItems"][c])
            }
          }

          for (let j = 0; j < mealsList.length; j++) {
            if (mealsList[j]["id"] === selectedMeals[meals[i].categoryId]) {
              var savedMeal = {
                centerId,
                oid: parseInt(oId),
                date: usedDate,
                subMealId: parseInt(meals[i]["categoryId"]),
                mealNameAr: mealsList[j]["titleAr"],
                mealNameEn: mealsList[j]["titleEn"],
                portionValue: mealsList[j]["portionValue"],
                snackType: mealsList[j]["snack_typ"],
                sid: parseInt(selectedCat["snackTypeId"]),
                itemId: parseInt(mealsList[j]["itemId"]),
                itemCode: mealsList[j]["itemCode"],
                weekId: parseInt(mealsList[j]["weekId"]),
                dayId: parseInt(mealsList[j]["dayId"]),
                menuId: parseInt(mealsList[j]["menuId"]),
                mealId: parseInt(mealsList[j]["mealId"]),
              }

              break
            }
          }
          savedMeals.push(savedMeal)
        } else {
          alertMessage = alertMessage + "Select " + meals[i].titleEn + "\n"
          error = true
        }
      }
    }

    if (error) {
      Alert.alert(alertTitle, alertMessage)
    } else {
      //send meals
      setIsLoading(true)
      axios
        .post(
          config.baseURL + "/api/meal/setMeals",
          {
            meals: savedMeals,
          },
          {
            headers: {
              Authorization: `bearer ${config.Token}`,
            },
          },
        )
        .then(response => {
          setIsLoading(false)
          CalendarBackHandler()
        })
        .catch(e => {
          console.log(e)
          setIsLoading(false)
        })
    }
  }
  const onFavoritePressHandle = filteredMeal => {
    const category = selectedCat
    const meal = filteredMeal
    const idx = category.mealListItems.findIndex(o => {
      return o.id === filteredMeal.id
    })
    if (filteredMeal.favourite === 0) {
      meal.favourite = 1
      category.mealListItems[idx] = meal

      axios
        .post(
          config.baseURL + "/api/meal/addFavouriteMeal",
          {
            mealId: filteredMeal.itemId,
          },
          {
            headers: {
              Authorization: `bearer ${config.Token}`,
            },
          },
        )
        .then(() => {
          // do something about response
        })
        .catch(e => {
          console.log(e)
        })
    } else {
      meal.favourite = 0
      category.mealListItems[idx] = meal

      axios
        .post(
          config.baseURL + "/api/meal/deleteFavouriteMeal",
          {
            mealId: filteredMeal.itemId,
          },
          {
            headers: {
              Authorization: `bearer ${config.Token}`,
            },
          },
        )
        .then(() => {
          // Do something about response
        })
        .catch(e => {
          console.log(e)
        })
    }

    setSelectedCat(category)
    refreshMeal()
  }

  const setMealsHandle = filteredMeal => {
    const selMeals = selectedMeals
    if (selectedType.categoryId in selMeals) {
      if (selMeals[selectedType.categoryId] === -1) {
        selMeals[selectedType.categoryId] = filteredMeal.id
      } else {
        if (selMeals[selectedType.categoryId] === filteredMeal.id) {
          selMeals[selectedType.categoryId] = -1
          setSelectedMeal(-1)
        } else {
          selMeals[selectedType.categoryId] = filteredMeal.id
        }
      }
    } else {
      selMeals[selectedType.categoryId] = filteredMeal.id
    }
    setSelectedMeals(selMeals)

    const idx = meals.indexOf(selectedType)

    if (
      idx + 1 < meals.length &&
      selMeals[selectedType.categoryId] !== -1 &&
      selectedType.categoryId in selMeals &&
      (selMeals[meals[idx + 1].categoryId] === -1 || !(meals[idx + 1].categoryId in selMeals))
    ) {
      setSelectedMeal(selMeals[meals[idx + 1].categoryId])
      setSelectedType(meals[idx + 1])
      setSelectedCat(meals[idx + 1].category[0])
    } else if (selMeals[selectedType.categoryId] !== -1 && selectedType.categoryId in selMeals) {
      setSelectedMeal(selMeals[selectedType.categoryId])
    }
  }

  console.log("showMeal--------------", showMeal)

  return (
    <View style={styles.body}>
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <TouchableOpacity
          style={styles.backIconStyle}
          onPress={() => {
            Alert.alert("Ignorance", "Do you want to go back and ignore the edits?", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
              { text: "OK", onPress: () => CalendarBackHandler() },
            ])
          }}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          {lang[lang.lang].personal_profile_13}
        </Text>
      </SafeAreaView>

      <Animated.View
        style={[
          styles.animatedContainer,
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
        ]}>
        {status === 3 && (
          <Text preset="t2" style={styles.textAlignCenter} color={colors.red}>
            {lang[lang.lang].add_meals_1}
          </Text>
        )}
        {/* {(
          <View style={styles.countContainer}>
            <View style={styles.countView}>
              <Text preset="t2">{lang[lang.lang].callorie}</Text>
              <Text preset="default">{calories}</Text>
            </View>
            <View style={styles.countView}>
              <Text preset="t2">{lang[lang.lang].fat}</Text>
              <Text preset="default">{fats}</Text>
            </View>
            <View style={styles.countView}>
              <Text preset="t2">{lang[lang.lang].protine}</Text>
              <Text preset="default">{proteins}</Text>
            </View>
            <View style={styles.countView}>
              <Text preset="t2">{lang[lang.lang].carb}</Text>
              <Text preset="default">{carbs}</Text>
            </View>
          </View>
        )} */}
        <View style={[styles.topInfoRowStyle]}>
          <View style={styles.currentDateView}>
            <Text preset="t2">{currDate}</Text>
          </View>

          {status === 3 || !can_be_modified ? (
            <View style={styles.saveButtonStyle1}>
              <Text preset="button02" color={colors.black}>
                {lang[lang.lang].add_meals_3}
              </Text>
            </View>
          ) : (
            <TouchableOpacity style={styles.saveButtonStyle2} onPress={onSavePressHandle}>
              <Text preset="button02" color={colors.white}>
                {lang[lang.lang].add_meals_3}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {!can_be_modified && (
          <View style={{ width: "100%", paddingHorizontal: 24, alignItems: "center" }}>
            <Text preset="default" color={colors.red}>
              {lang[lang.lang].add_meals_31}
            </Text>
          </View>
        )}
        <View>
          <View style={styles.mainCategoryStyle}>
            {meals?.length >= 1 &&
              meals?.map(cat => {
                const selectedBackgroundColor = selectedType === cat ? colors.yellow : colors.white
                const selectedBorderColor = selectedType === cat ? colors.yellow : colors.grey
                const textColor = selectedType === cat ? colors.white : colors.black
                return (
                  <TouchableOpacity
                    key={cat.mealId}
                    style={[
                      styles.mealCategoryCardStyle,
                      {
                        backgroundColor: selectedBackgroundColor,
                        borderColor: selectedBorderColor,
                      },
                    ]}
                    onPress={() => {
                      setSelectedType(cat)
                      const selMeals = selectedMeals
                      if (cat.categoryId in selMeals) {
                        setSelectedMeal(selMeals[cat.categoryId])
                      } else {
                        setSelectedMeal(-1)
                      }
                      setSelectedCat(cat.category[0])
                    }}>
                    <Text
                      preset="button02"
                      text={lang.lang === "ar" ? cat.titleAr : cat.titleEn}
                      color={textColor}
                    />
                  </TouchableOpacity>
                )
              })}
          </View>
          {selectedType?.titleEn.toLowerCase().includes("snack") && (
            <ScrollView
              horizontal
              contentContainerStyle={{
                paddingHorizontal: spacing.extraSmall,
              }}
              showsHorizontalScrollIndicator={false}>
              {selectedType.category.map(typeCategory => {
                const selectedBackgroundColor =
                  selectedCat === typeCategory ? colors.yellow : colors.white
                const selectedBorderColor =
                  selectedCat === typeCategory ? colors.yellow : colors.grey
                const textColor = selectedCat === typeCategory ? colors.white : colors.black
                return (
                  <TouchableOpacity
                    style={[
                      styles.mealCategoryCardStyle,
                      {
                        backgroundColor: selectedBackgroundColor,
                        borderColor: selectedBorderColor,
                      },
                    ]}
                    onPress={() => {
                      setSelectedCat(typeCategory)
                    }}>
                    <Text preset="button02" text={typeCategory.snackTypeName} color={textColor} />
                  </TouchableOpacity>
                )
              })}
            </ScrollView>
          )}
        </View>
        <ScrollView
          snapToInterval={165}
          contentContainerStyle={{
            padding: spacing.extraSmall,
          }}>
          {filteredMeals.map((filteredMealsRow, index) => (
            <View key={index} style={styles.filteredMealsStyle}>
              {filteredMealsRow.map(filteredMeal => {
                const selectedItemColor =
                  selectedMeal === filteredMeal.id
                    ? status === 3
                      ? config.color_2 + "77"
                      : "#22ad51"
                    : "#FFFFFF77"

                return (
                  <TouchableOpacity
                    key={filteredMeal.id}
                    style={[styles.mealCardStyle, { backgroundColor: selectedItemColor }]}
                    disabled={status === 3}
                    onPress={() => {
                      setMealsHandle(filteredMeal)
                      onCalc()
                    }}>
                    <View style={styles.mealImageWrapper}>
                      <ImageBackground source={placeholder} style={styles.mealImageStyle}>
                        {validURL(filteredMeal.mealImage) ? (
                          <Image
                            source={{
                              uri: filteredMeal.mealImage,
                            }}
                            style={styles.mealImageStyle}
                          />
                        ) : (
                          <Image source={placeholder} style={styles.mealImageStyle} />
                        )}
                      </ImageBackground>
                    </View>
                    <AntDesign
                      name={filteredMeal.favourite === 1 ? "star" : "staro"}
                      size={24}
                      color={filteredMeal.favourite === 1 ? colors.yellow : colors.white}
                      style={styles.favoriteIconStyle}
                      onPress={() => onFavoritePressHandle(filteredMeal)}
                    />
                    <View
                      style={{
                        padding: 4,
                      }}>
                      <Text numberOfLines={2} preset="t3" style={styles.mealNameStyle}>
                        {lang.lang === "ar" ? filteredMeal.titleAr : filteredMeal.titleEn}
                      </Text>
                      <View style={styles.mealCardInfoStyle}>
                        <TouchableOpacity
                          onPress={() => {
                            setShowInfo(true)
                            setShowMeal(filteredMeal)
                          }}>
                          {selectedMeal === filteredMeal.id ? (
                            <AntDesign name="check" size={26} color={colors.yellow} />
                          ) : (
                            <Ionicons
                              name="information-circle-outline"
                              size={26}
                              color={colors.yellow}
                            />
                          )}
                        </TouchableOpacity>

                        <AntDesign name="arrowright" size={26} color={colors.yellow} />
                      </View>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
          ))}
        </ScrollView>
      </Animated.View>
      {showInfo && (
        <View style={styles.infoModalContainer}>
          <TouchableOpacity
            onPress={() => {
              setShowInfo(false)
            }}
            style={styles.modalCloseIconStyle}>
            <MaterialIcons name="close" size={28} color={colors.black} />
          </TouchableOpacity>
          <ImageBackground
            source={placeholder}
            style={{
              width: "95%",
              height: 350,
              // resizeMode: "contain",
              marginTop: 5,
            }}>
            {validURL(showMeal.mealImage) ? (
              <Image
                source={{
                  uri: showMeal.mealImage,
                }}
                style={{
                  width: "100%",
                  height: 350,
                  resizeMode: "cover",
                  // marginTop: 5,
                  borderRadius: 5,
                }}
              />
            ) : (
              <Image
                source={placeholder}
                style={{
                  width: "10%",
                  height: 350,
                  resizeMode: "contain",
                  // marginTop: 5,
                }}
              />
            )}
          </ImageBackground>
          <View
            style={{
              width: "95%",
              // height: 60,
              backgroundColor: colors.yellow,
              borderRadius: 10,
              marginTop: "2%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingHorizontal: 12,
            }}>
            <Text
              numberOfLines={4}
              style={{
                textAlign: "center",
                // fontFamily: "Handlee_400Regular",
                color: colors.white,
                textShadowColor: config.color_1,
                // textShadowOffset: { x: -5, y: -5 },
                textShadowRadius: 3,
                fontSize: 14,
                marginVertical: 8,
              }}>
              {lang.lang === "ar" ? showMeal?.ingredientsNutrition : showMeal?.wonderOfTheDish}
            </Text>
            {/* <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: colors.white,
                  textShadowColor: config.color_1,
                  // textShadowOffset: { x: -5, y: -5 },
                  textShadowRadius: 3,
                  fontSize: 14,
                }}>
                {lang[lang.lang].add_meals_10}
              </Text>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: colors.white,
                  textShadowColor: config.color_2,
                  // textShadowOffset: { x: -5, y: -5 },
                  textShadowRadius: 3,
                  fontSize: 14,
                }}>
                {showMeal.calories}
              </Text>
            </View>
            <View style={{ width: "5%" }} /> */}
            {/* <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: colors.white,
                  textShadowColor: config.color_1,
                  // textShadowOffset: { x: -5, y: -5 },
                  textShadowRadius: 3,
                  fontSize: 14,
                }}>
                {lang[lang.lang].add_meals_5}
              </Text>
              <Text
                style={{
                  // fontFamily: "Handlee_400Regular",
                  color: colors.white,
                  textShadowColor: config.color_2,
                  // textShadowOffset: { x: -5, y: -5 },
                  textShadowRadius: 3,
                  fontSize: 14,
                }}>
                {showMeal.proteins + "g"}
              </Text>
            </View> */}
            {/* <View style={{ width: "5%" }} />
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text
                style={{
                  fontFamily: "Handlee_400Regular",
                  color: colors.white,
                  textShadowColor: config.color_1,
                  // textShadowOffset: { x: -5, y: -5 },
                  textShadowRadius: 3,
                  fontSize: 14,
                }}>
                {lang[lang.lang].add_meals_6}
              </Text>
              <Text
                style={{
                  fontFamily: "Handlee_400Regular",
                  color: colors.white,
                  textShadowColor: config.color_2,
                  // textShadowOffset: { x: -5, y: -5 },
                  textShadowRadius: 3,
                  fontSize: 14,
                }}>
                {showMeal.fats + "g"}
              </Text>
            </View>
            <View style={{ width: "5%" }} /> */}
            {/* <View
              style={{
                alignItems: "center",
                justifyContent: "center",
              }}>
              <Text
                style={{
                  fontFamily: "Handlee_400Regular",
                  color: colors.white,
                  textShadowColor: config.color_1,
                  // textShadowOffset: { x: -5, y: -5 },
                  textShadowRadius: 3,
                  fontSize: 14,
                }}>
                {lang[lang.lang].add_meals_7}
              </Text>
              <Text
                style={{
                  fontFamily: "Handlee_400Regular",
                  color: colors.white,
                  textShadowColor: config.color_2,
                  // textShadowOffset: { x: -5, y: -5 },
                  textShadowRadius: 3,
                  fontSize: 14,
                }}>
                {showMeal.carbs + "g"}
              </Text>
            </View> */}
          </View>
        </View>
      )}
    </View>
  )
}

export default AddMeals

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
  },

  safeAreaViewStyle: {
    backgroundColor: colors.yellow,
    width: "100%",
    alignItems: "center",
  },
  headingText: {
    marginBottom: spacing.medium,
  },
  backIconStyle: {
    position: "absolute",
    left: 10,
    bottom: 14,
  },
  currentDateView: {
    backgroundColor: colors.lightGreen,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.huge,
    marginHorizontal: spacing.tiny,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  mealNameStyle: {
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: 13,
    marginBottom: 2,
  },
  favoriteIconStyle: {
    position: "absolute",
    right: 10,
    top: 10,
  },
  mealImageStyle: {
    width: "100%",
    height: 154,
    resizeMode: "stretch",
  },
  mealCardInfoStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 0,
  },
  mealImageWrapper: {
    backgroundColor: colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  mealCardStyle: {
    borderWidth: 1,
    flex: 1,
    marginHorizontal: spacing.extraSmall,
    marginVertical: spacing.extraSmall,
    borderRadius: 10,
    overflow: "hidden",
  },
  filteredMealsStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  infoModalContainer: {
    borderRadius: 10,
    backgroundColor: colors.white,
    width: "90%",
    height: "70%",
    position: "absolute",
    top: "15%",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    borderWidth: 1,
    borderColor: colors.grey,
  },
  modalCloseIconStyle: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 999,
  },
  modalRowItem: {
    backgroundColor: colors.lightGreen,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: spacing.extraSmall,
    alignSelf: "stretch",
  },
  modalScrollViewStyle: {
    height: "100%",
    width: "100%",
    marginTop: "10%",
  },
  modalImageStyle: {
    width: "95%",
    height: 150,
    resizeMode: "cover",
    marginTop: 5,
    borderRadius: 10,
  },
  modalMealNameContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.extraSmall,
  },
  modalMealTag: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: colors.lightGreen,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    marginVertical: spacing.extraSmall,
    marginHorizontal: spacing.extraSmall,
  },
  mealCategoryCardStyle: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.grey,
    marginHorizontal: spacing.extraSmall,
    marginVertical: spacing.tiny,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButtonStyle1: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.lightGreen,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    width: "30%",
    marginHorizontal: spacing.tiny,
  },
  saveButtonStyle2: {
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.green,
    paddingVertical: spacing.extraSmall,
    paddingHorizontal: spacing.medium,
    width: "30%",
    marginHorizontal: spacing.tiny,
  },
  animatedContainer: {
    flex: 1,
    width: "100%",
  },
  topInfoRowStyle: {
    ...globalStyle.rowCenter,
    padding: spacing.extraSmall,
  },
  textAlignCenter: {
    textAlign: "center",
  },
  mainCategoryStyle: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flexWrap: "wrap",
  },

  countContainer: {
    width: "100%",
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBlockColor: colors.lightYellow,
  },
  countView: {
    width: "23%",
    height: 64,
    alignItems: "center",
    justifyContent: "center",
  },
})
