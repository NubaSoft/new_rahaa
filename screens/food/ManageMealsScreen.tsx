import Ionicons from "react-native-vector-icons/Ionicons"
import AntDesign from "react-native-vector-icons/AntDesign"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
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
  FlatList,
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
  console.log("meals======>>>>>>>", meals[0]?.category[0].mealListItems)

  // {
  //   "category": [
  //     {
  //       "mealListItems": [Array], "snackSort": 1, "snackTypeId": 1, "snackTypeName": "Salad", "titleAr": "فطار", "titleEn": "breakfast"}
  //   ],
  //   "categoryId": 1,
  //   "mealId": 1,
  //   "menuId": 32,
  //   "portion": 1,
  //   "sortId": 0,
  //   "status": 1,
  //   "titleAr": "فطار",
  //   "titleEn": "breakfast"
  // }

  // [
  //   {
  //     "calories": 1,
  //     "carbs": 1,
  //     "categoryId": 1,
  //     "date": "2024-12-18",
  //     "dayId": 5,
  //     "fats": 0,
  //     "favourite": 0,
  //     "fixedMicros": 0,
  //     "heatingInstruction": "",
  //     "heatingTime": 0,
  //     "id": 1,
  //     "ingredientsNutrition": "",
  //     "isAmend": 0,
  //     "isHighCal": 0,
  //     "isSpicy": 0,
  //     "itemCode": "1195",
  //     "itemId": 1195,
  //     "kitchenConfirmed": false,
  //     "mealId": 1,
  //     "mealImage": "https://nubasoft.net/mdiet/1195.jpg",
  //     "mealSelected": false,
  //     "menuId": 32,
  //     "mid": 74,
  //     "newMeal": 0,
  //     "originAr": "",
  //     "originEn": "",
  //     "portionValue": 1,
  //     "proteins": 1,
  //     "rating": 0,
  //     "snack_typ": 0,
  //     "titleAr": "اومليت بالسبانخ",
  //     "titleEn": "spinach omlete",
  //     "weekId": 2,
  //     "wonderOfTheDish": "",
  //     "wonderOfTheDishAr": ""
  //   },
  //   {"calories": 1, "carbs": 1, "categoryId": 1, "date": "2024-12-18", "dayId": 5, "fats": 0, "favourite": 0, "fixedMicros": 0, "heatingInstruction": "", "heatingTime": 0, "id": 2, "ingredientsNutrition": "", "isAmend": 0, "isHighCal": 0, "isSpicy": 0, "itemCode": "855", "itemId": 855, "kitchenConfirmed": false, "mealId": 1, "mealImage": "https://nubasoft.net/mdiet/855.jpg", "mealSelected": false, "menuId": 32, "mid": 76, "newMeal": 0, "originAr": "", "originEn": "", "portionValue": 1, "proteins": 1, "rating": 0, "snack_typ": 0, "titleAr": "سندوتش لبنه", "titleEn": "Labneh Sandwesh", "weekId": 2, "wonderOfTheDish": "", "wonderOfTheDishAr": ""},
  //   {"calories": 1, "carbs": 1, "categoryId": 1, "date": "2024-12-18", "dayId": 5, "fats": 0, "favourite": 0, "fixedMicros": 0, "heatingInstruction": "", "heatingTime": 0, "id": 3, "ingredientsNutrition": "", "isAmend": 0, "isHighCal": 0, "isSpicy": 0, "itemCode": "1570", "itemId": 1569, "kitchenConfirmed": false, "mealId": 1, "mealImage": "https://nubasoft.net/mdiet/1570.jpg", "mealSelected": false, "menuId": 32, "mid": 77, "newMeal": 0, "originAr": "", "originEn": "", "portionValue": 1, "proteins": 1, "rating": 0, "snack_typ": 0, "titleAr": "انجليش كيك", "titleEn": "English cake", "weekId": 2, "wonderOfTheDish": "", "wonderOfTheDishAr": ""},
  //   {"calories": 1, "carbs": 1, "categoryId": 1, "date": "2024-12-18", "dayId": 5, "fats": 0, "favourite": 0, "fixedMicros": 0, "heatingInstruction": "", "heatingTime": 0, "id": 4, "ingredientsNutrition": "", "isAmend": 0, "isHighCal": 0, "isSpicy": 0, "itemCode": "842", "itemId": 842, "kitchenConfirmed": false, "mealId": 1, "mealImage": "https://nubasoft.net/mdiet/842.jpg", "mealSelected": true, "menuId": 32, "mid": 0, "newMeal": 0, "originAr": "", "originEn": "", "portionValue": 1, "proteins": 1, "rating": 0, "snack_typ": 6, "titleAr": "كلوب ساندوش", "titleEn": "CLUB SANDWICH", "weekId": 2, "wonderOfTheDish": "", "wonderOfTheDishAr": ""}
  // ]

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

  const [back, setBack] = useState<boolean>(false)
  const [categortIndex, setCategortIndex] = useState<number>(0)
  const [categoreas, setCategoreas] = useState<any>([])
  const [selectCategory, setSelectCategory] = useState<any>({})
  const [mealsInCategory, setMealsInCategory] = useState<any>([])
  const [selectMealInCategory, setSelectMealInCategory] = useState<any>({})

  useEffect(() => {
    setCategoreas(meals)
    setSelectCategory(meals[0])
    setMealsInCategory(meals[0]?.category[0]?.mealListItems)
    setCategortIndex(0)
  }, [])

  console.log("categoreas-------", categoreas)
  console.log("mealsInCategory-------", mealsInCategory)

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
    const savedMeals: any = []
    const savedMealsForRequest: any = []

    for (let r = 0; r < categoreas?.length; r++) {
      const meals: any = categoreas[r]?.category[0]?.mealListItems
      for (let m = 0; m < meals?.length; m++) {
        if (meals[m].mealSelected) {
          savedMeals.push({
            ...meals[m],
            ...{
              categoryId: categoreas[r]?.categoryId,
              snackTypeId: categoreas[r]?.category[0]?.snackTypeId,
            },
          })
        }
      }
    }
    if (savedMeals.length != categoreas?.length) {
      Alert.alert(alertTitle, alertMessage)
    } else {
      for (let s = 0; s < savedMeals?.length; s++) {
        var savedMeal = {
          centerId,
          oid: parseInt(oId),
          date: usedDate,
          subMealId: parseInt(savedMeals[s].categoryId),
          mealNameAr: savedMeals[s].titleAr,
          mealNameEn: savedMeals[s].titleEn,
          portionValue: savedMeals[s].portionValue,
          snackType: savedMeals[s].snack_typ,
          sid: parseInt(savedMeals[s].snackTypeId),
          itemId: parseInt(savedMeals[s].itemId),
          itemCode: savedMeals[s].itemCode,
          weekId: parseInt(savedMeals[s].weekId),
          dayId: parseInt(savedMeals[s].dayId),
          menuId: parseInt(savedMeals[s].menuId),
          mealId: parseInt(savedMeals[s].mealId),
        }
        savedMealsForRequest.push(savedMeal)
      }
      // send meals
      setIsLoading(true)
      axios
        .post(
          config.baseURL + "/api/meal/setMeals",
          {
            meals: savedMealsForRequest,
          },
          {
            headers: {
              Authorization: `bearer ${config.Token}`,
            },
          },
        )
        .then(response => {
          console.log("savedMealsForRequest---------", response?.config?.data)
          setIsLoading(false)
          CalendarBackHandler()
        })
        .catch(e => {
          console.log(e)
          setIsLoading(false)
        })
    }
    // {"meals":[
    //   {"centerId":1,"oid":2,"date":"2024-12-18","subMealId":1,"mealNameAr":"اومليت بالسبانخ","mealNameEn":"spinach omlete","portionValue":1,"snackType":0,"sid":1,"itemId":1195,"itemCode":"1195","weekId":2,"dayId":5,"menuId":32,"mealId":1},
    //   {"centerId":1,"oid":2,"date":"2024-12-18","subMealId":2,"mealNameAr":"بيف ايوورب ستيو بالكينوا","mealNameEn":"Beef eropean stew with qunuioa bowl","portionValue":1,"snackType":0,"sid":1,"itemId":2336,"itemCode":"2337","weekId":2,"dayId":5,"menuId":32,"mealId":2},
    //   {"centerId":1,"oid":2,"date":"2024-12-18","subMealId":3,"mealNameAr":"شاورما لحم صحن","mealNameEn":"Meat Shawarma bowl","portionValue":1,"snackType":0,"sid":1,"itemId":1477,"itemCode":"1478","weekId":2,"dayId":5,"menuId":32,"mealId":3},
    //   {"centerId":1,"oid":2,"date":"2024-12-18","subMealId":28,"mealNameAr":"حمص بالفلفل المدخن  .","mealNameEn":"Smoked pepper Hommus .","portionValue":1,"snackType":1,"sid":1,"itemId":2403,"itemCode":"2404","weekId":2,"dayId":5,"menuId":32,"mealId":27},
    //   {"centerId":1,"oid":2,"date":"2024-12-18","subMealId":24,"mealNameAr":"حمص بالفلفل المدخن  .","mealNameEn":"Smoked pepper Hommus .","portionValue":1,"snackType":1,"sid":1,"itemId":2403,"itemCode":"2404","weekId":2,"dayId":5,"menuId":32,"mealId":28},
    //   {"centerId":1,"oid":2,"date":"2024-12-18","subMealId":25,"mealNameAr":"حمص بالفلفل المدخن  .","mealNameEn":"Smoked pepper Hommus .","portionValue":1,"snackType":1,"sid":1,"itemId":2403,"itemCode":"2404","weekId":2,"dayId":5,"menuId":32,"mealId":29}]
    // }
    // [
    //   {"centerId": 1, "date": "2024-12-18", "dayId": 5, "itemCode": "1195", "itemId": 1195, "mealId": 1, "mealNameAr": "اومليت بالسبانخ", "mealNameEn": "spinach omlete", "menuId": 32, "oid": 2, "portionValue": 1, "sid": 1, "snackType": 0, "subMealId": 1, "weekId": 2},
    //   {"centerId": 1, "date": "2024-12-18", "dayId": 5, "itemCode": "2337", "itemId": 2336, "mealId": 2, "mealNameAr": "بيف ايوورب ستيو بالكينوا", "mealNameEn": "Beef eropean stew with qunuioa bowl", "menuId": 32, "oid": 2, "portionValue": 1, "sid": 1, "snackType": 0, "subMealId": 2, "weekId": 2},
    //   {"centerId": 1, "date": "2024-12-18", "dayId": 5, "itemCode": "1478", "itemId": 1477, "mealId": 3, "mealNameAr": "شاورما لحم صحن", "mealNameEn": "Meat Shawarma bowl", "menuId": 32, "oid": 2, "portionValue": 1, "sid": 1, "snackType": 0, "subMealId": 3, "weekId": 2},
    //   {"centerId": 1, "date": "2024-12-18", "dayId": 5, "itemCode": "2404", "itemId": 2403, "mealId": 27, "mealNameAr": "حمص بالفلفل المدخن  .", "mealNameEn": "Smoked pepper Hommus .", "menuId": 32, "oid": 2, "portionValue": 1, "sid": 1, "snackType": 1, "subMealId": 28, "weekId": 2},
    //   {"centerId": 1, "date": "2024-12-18", "dayId": 5, "itemCode": "2404", "itemId": 2403, "mealId": 28, "mealNameAr": "حمص بالفلفل المدخن  .", "mealNameEn": "Smoked pepper Hommus .", "menuId": 32, "oid": 2, "portionValue": 1, "sid": 1, "snackType": 1, "subMealId": 24, "weekId": 2},
    //   {"centerId": 1, "date": "2024-12-18", "dayId": 5, "itemCode": "2404", "itemId": 2403, "mealId": 29, "mealNameAr": "حمص بالفلفل المدخن  .", "mealNameEn": "Smoked pepper Hommus .", "menuId": 32, "oid": 2, "portionValue": 1, "sid": 1, "snackType": 1, "subMealId": 25, "weekId": 2}
    // ]
    // if (Object.keys(selectedMeals).length === 0) {
    //   error = true
    // } else {
    //   for (let i = 0; i < meals.length; i++) {
    //     if (meals[i].categoryId in selectedMeals && selectedMeals[meals[i].categoryId] !== -1) {
    //       const mealsList = []

    //       for (let k = 0; k < meals[i]["category"].length; k++) {
    //         for (let c = 0; c < meals[i]["category"][k]["mealListItems"].length; c++) {
    //           mealsList.push(meals[i]["category"][k]["mealListItems"][c])
    //         }
    //       }

    //       for (let j = 0; j < mealsList.length; j++) {
    //         if (mealsList[j]["id"] === selectedMeals[meals[i].categoryId]) {
    //           var savedMeal = {
    //             centerId,
    //             oid: parseInt(oId),
    //             date: usedDate,
    //             subMealId: parseInt(meals[i]["categoryId"]),
    //             mealNameAr: mealsList[j]["titleAr"],
    //             mealNameEn: mealsList[j]["titleEn"],
    //             portionValue: mealsList[j]["portionValue"],
    //             snackType: mealsList[j]["snack_typ"],
    //             sid: parseInt(selectedCat["snackTypeId"]),
    //             itemId: parseInt(mealsList[j]["itemId"]),
    //             itemCode: mealsList[j]["itemCode"],
    //             weekId: parseInt(mealsList[j]["weekId"]),
    //             dayId: parseInt(mealsList[j]["dayId"]),
    //             menuId: parseInt(mealsList[j]["menuId"]),
    //             mealId: parseInt(mealsList[j]["mealId"]),
    //           }

    //           break
    //         }
    //       }
    //       savedMeals.push(savedMeal)
    //     } else {
    //       alertMessage = alertMessage + "Select " + meals[i].titleEn + "\n"
    //       error = true
    //     }
    //   }
    // }

    // if (error) {
    //   Alert.alert(alertTitle, alertMessage)
    // } else {
    //   //send meals
    //   setIsLoading(true)
    //   axios
    //     .post(
    //       config.baseURL + "/api/meal/setMeals",
    //       {
    //         meals: savedMeals,
    //       },
    //       {
    //         headers: {
    //           Authorization: `bearer ${config.Token}`,
    //         },
    //       },
    //     )
    //     .then(response => {
    //       setIsLoading(false)
    //       CalendarBackHandler()
    //     })
    //     .catch(e => {
    //       console.log(e)
    //       setIsLoading(false)
    //     })
    // }
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

  const headerSection = () => {
    const onBack = () => {
      if (back) {
        Alert.alert("Ignorance", "Do you want to go back and ignore the edits?", [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => CalendarBackHandler() },
        ])
      } else {
        CalendarBackHandler()
      }
    }

    return (
      <SafeAreaView style={styles.safeAreaViewStyle}>
        <TouchableOpacity style={styles.backIconStyle} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text preset="button01" color={colors.white} style={styles.headingText}>
          {lang[lang.lang].personal_profile_13}
        </Text>
      </SafeAreaView>
    )
  }

  const canEditSection = () => {
    return (
      <Text preset="t2" style={styles.textAlignCenter} color={colors.red}>
        {lang[lang.lang].add_meals_1}
      </Text>
    )
  }

  const saveSection = () => {
    return (
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
    )
  }

  const canBeModifiedSection = () => {
    return (
      <View style={{ width: "100%", paddingHorizontal: 24, alignItems: "center" }}>
        <Text preset="default" color={colors.red}>
          {lang[lang.lang].add_meals_31}
        </Text>
      </View>
    )
  }

  const categoreasListSection = () => {
    const onSelectCategory = (item?: any, index?: number) => {
      setSelectCategory(item)
      setMealsInCategory(item?.category[0]?.mealListItems)
      setCategortIndex(index)
    }

    return (
      <View style={styles.mainCategoryStyle}>
        {categoreas?.length >= 1 &&
          categoreas?.map((item: any, index: number) => {
            const selectedBackgroundColor =
              selectCategory?.categoryId === item?.categoryId ? colors.yellow : colors.white
            const selectedBorderColor =
              selectCategory?.categoryId === item?.categoryId ? colors.yellow : colors.grey
            const textColor =
              selectCategory?.categoryId === item?.categoryId ? colors.white : colors.black
            return (
              <TouchableOpacity
                key={item.mealId}
                style={[
                  styles.mealCategoryCardStyle,
                  {
                    backgroundColor: selectedBackgroundColor,
                    borderColor: selectedBorderColor,
                  },
                ]}
                onPress={() => onSelectCategory(item, index)}>
                <Text
                  preset="button02"
                  text={lang.lang === "ar" ? item.titleAr : item.titleEn}
                  color={textColor}
                />
              </TouchableOpacity>
            )
          })}
      </View>
    )
  }

  const snacksListSection = () => {
    return (
      <View>
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
              const selectedBorderColor = selectedCat === typeCategory ? colors.yellow : colors.grey
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
    )
  }

  const mealsListSection = () => {
    const onSelectMeal = (item: any) => {
      setBack(true)
      const currentCategoreas: any = categoreas
      const currentMeals: any = mealsInCategory
      var newMeals: any = []
      var newCategoreas: any = []
      for (let i = 0; i < currentMeals?.length; i++) {
        if (item?.id == currentMeals[i]?.id) {
          newMeals.push({ ...currentMeals[i], ...{ mealSelected: true } })
        } else {
          newMeals.push({ ...currentMeals[i], ...{ mealSelected: false } })
        }
      }
      setMealsInCategory(newMeals)
      for (let c = 0; c < currentCategoreas?.length; c++) {
        if (selectCategory.categoryId == currentCategoreas[c]?.categoryId) {
          const category: any = [{ ...selectCategory.category[0], ...{ mealListItems: newMeals } }]
          newCategoreas.push({ ...currentCategoreas[c], ...{ category: category } })
        } else {
          newCategoreas.push(currentCategoreas[c])
        }
      }
      setCategoreas(newCategoreas)
      if (categortIndex + 1 < newCategoreas.length) {
        setCategortIndex(categortIndex + 1)
        setSelectCategory(newCategoreas[categortIndex + 1])
        setMealsInCategory(newCategoreas[categortIndex + 1]?.category[0]?.mealListItems)
      } else {
        setCategortIndex(0)
        setSelectCategory(newCategoreas[0])
        setMealsInCategory(newCategoreas[0]?.category[0]?.mealListItems)
      }
    }
    const renderMealItem = ({ item, index }: { item: any; index: number }) => {
      const select = item?.mealSelected
      const selectedItemColor = select
        ? status === 3
          ? config.color_2 + "77"
          : "#22ad51"
        : "#FFFFFF77"

      return (
        <TouchableOpacity
          key={item.id}
          style={[styles.mealCardStyle, { backgroundColor: selectedItemColor }]}
          disabled={status === 3}
          onPress={() => {
            onSelectMeal(item)
          }}>
          <View style={styles.mealImageWrapper}>
            <ImageBackground source={placeholder} style={styles.mealImageStyle}>
              {validURL(item.mealImage) ? (
                <Image
                  source={{
                    uri: item.mealImage,
                  }}
                  style={styles.mealImageStyle}
                />
              ) : (
                <Image source={placeholder} style={styles.mealImageStyle} />
              )}
            </ImageBackground>
          </View>
          <AntDesign
            name={item.favourite === 1 ? "star" : "staro"}
            size={24}
            color={item.favourite === 1 ? colors.yellow : colors.white}
            style={styles.favoriteIconStyle}
            onPress={() => onFavoritePressHandle(item)}
          />
          <View
            style={{
              padding: 4,
            }}>
            <Text numberOfLines={2} preset="t3" style={styles.mealNameStyle}>
              {lang.lang === "ar" ? item.titleAr : item.titleEn}
            </Text>
            <View style={styles.mealCardInfoStyle}>
              <TouchableOpacity
                onPress={() => {
                  setShowInfo(true)
                  setShowMeal(item)
                }}>
                {select ? (
                  <AntDesign name="check" size={26} color={colors.yellow} />
                ) : (
                  <Ionicons name="information-circle-outline" size={26} color={colors.yellow} />
                )}
              </TouchableOpacity>

              <AntDesign name="arrowright" size={26} color={colors.yellow} />
            </View>
          </View>
        </TouchableOpacity>
      )
    }
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={mealsInCategory}
        renderItem={item => renderMealItem(item)}
        numColumns={2}
      />
    )
  }

  const infoSection = () => {
    return (
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
              }}
            />
          )}
        </ImageBackground>
        <View
          style={{
            width: "95%",
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
              color: colors.white,
              textShadowColor: config.color_1,
              textShadowRadius: 3,
              fontSize: 14,
              marginVertical: 8,
            }}>
            {lang.lang === "ar" ? showMeal?.ingredientsNutrition : showMeal?.wonderOfTheDish}
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.body}>
      {headerSection()}
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
        {status === 3 && canEditSection()}
        {saveSection()}
        {!can_be_modified && canBeModifiedSection()}
        {categoreasListSection()}
        {snacksListSection()}
        {mealsListSection()}
      </Animated.View>
      {showInfo && infoSection()}
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
