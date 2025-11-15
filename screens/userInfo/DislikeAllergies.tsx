import React, { useEffect, useState } from "react"
import {
  FlatList,
  I18nManager,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"

import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { lang } from "../../lang"
import axios from "axios"
import { config } from "../../config"
import { SafeAreaView } from "react-native-safe-area-context"
import Ionicons from "react-native-vector-icons/Ionicons"

const DislikeAllergies = (params: any) => {
  const [dislikeItems, setDislikeItems] = useState<any>([])
  const [dislikemeals, setDislikemeals] = useState<any>([])
  const [dislikeallergyitems, setDislikeallergyitems] = useState<any>([])

  const getDislikeItems = () => {
    axios

      .get(config.baseURL + "/api/meals/DislikeItems", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then(response => {
        console.log("response-------------", response)

        const flattenedMeals = Object.values(response?.data?.dislikes).flat()
        const dropdownItems = flattenedMeals.map(item => ({
          label: I18nManager.isRTL ? item.name_ar : item.name_en,
          value: item.id,
        }))
        setDislikeItems(dropdownItems)
      })
      .catch(err => {
        console.log("error----", err)
      })
  }
  const getDislikemeals = () => {
    axios
      .get(config.baseURL + "/api/meals/dislikemeals", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then(response => {
        console.log("response-----getDislikemeals-------->>>>>", response.data)
        const flattenedMeals = Object.values(response?.data?.meals).flat()
        const dropdownItems = flattenedMeals.map(item => ({
          label: I18nManager.isRTL ? item.name_ar : item.name_en,
          value: item.id,
        }))
        setDislikemeals(dropdownItems)
      })
      .catch(err => {
        console.log("error----", err)
      })
  }
  const getDislikeallergyitems = () => {
    axios
      .get(config.baseURL + "/api/meals/dislikeallergyitems", {
        headers: {
          Authorization: `bearer ${config.Token}`,
        },
      })
      .then(response => {
        console.log("response------------->>>>>", response.data?.allergies)
        const flattenedMeals = Object.values(response?.data?.allergies).flat()
        const dropdownItems = flattenedMeals.map(item => ({
          label: I18nManager.isRTL ? item.name_ar : item.name_en,
          value: item.id,
        }))
        setDislikeallergyitems(dropdownItems)
      })
      .catch(err => {
        console.log("error----", err)
      })
  }

  useEffect(() => {
    getDislikeItems()
    getDislikemeals()
    getDislikeallergyitems()
  }, [])

  useEffect(() => {
    const unsubscribe = params.navigation.addListener("focus", () => {
      getDislikeItems()
      getDislikemeals()
      getDislikeallergyitems()
    })
    return unsubscribe
  }, [params.navigation])

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <View style={styles.itemContainer}>
        <Text preset="formHelper" color={colors.white} style={styles.itemText}>
          {item?.label}
        </Text>
        <Image source={require("../../assets/icons/check.png")} style={styles.itemIcon} />
      </View>
    )
  }
  // const renderitem1 = ({ item, index }) => {
  //   return (
  //     <View style={styles.listItemContainer}>
  //       <Text style={styles.listItemText}>{item?.label}</Text>
  //     </View>
  //   )
  // }
  // const renderitem2 = ({ item, index }) => {
  //   return (
  //     <View style={styles.listItemContainer}>
  //       <Text style={styles.listItemText}>{item?.label}</Text>
  //     </View>
  //   )
  // }
  // const renderitem3 = ({ item, index }) => {
  //   return (
  //     <View style={styles.listItemContainer}>
  //       <Text style={styles.listItemText}>{item?.label}</Text>
  //     </View>
  //   )
  // }
  return (
    <View style={styles.body}>
      <SafeAreaView
        style={Platform.OS == "android" ? styles.safeAreaViewStyle : styles.safeAreaViewStyleIos}>
        <View style={styles.headingInnerStyle}>
          <TouchableOpacity onPress={() => params.navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="t1" color={colors.white}>
            {lang[lang.lang].personal_profile_122}
          </Text>
          <Ionicons name="settings-outline" size={24} color={colors.yellow} />
        </View>
      </SafeAreaView>
      {/* <SafeAreaView
        style={Platform.OS == "android" ? styles.safeAreaViewStyle : styles.safeAreaViewStyleIos}>
        <View style={styles.headingInnerStyle}>
          <StatusBar />
          <TouchableOpacity onPress={() => params.navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="button01" color={colors.white}>
            {lang[lang.lang].personal_profile_122}
          </Text>
          <Ionicons name="settings-outline" size={24} color={colors.yellow} />
        </View>
      </SafeAreaView> */}

      <View style={styles.dataContainer}>
        <View style={styles.dataItemContainer}>
          <View style={styles.dataItemTitleContainer}>
            <Text style={styles.dataItemTitle}>{lang[lang.lang].personal_profile_123}</Text>
            <TouchableOpacity
              onPress={() =>
                params.navigation.navigate("Update_DislikeIngredient", { dislikeItems })
              }>
              <Text style={styles.dataItemEdit}>{lang[lang.lang].payment_3}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dataItemListContainer}>
            {dislikeItems?.length >= 1 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={dislikeItems}
                renderItem={renderItem}
                keyExtractor={item => `${item?.id}`}
              />
            ) : (
              <View style={styles.dontHaveDataContainer}>
                <Image
                  source={require("../../assets/icons/dinner.png")}
                  style={styles.dontHaveDataImage}
                />
                <Text style={styles.dontHaveDataText}>{lang[lang.lang].personal_profile_1245}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.dataItemContainer}>
          <View style={styles.dataItemTitleContainer}>
            <Text style={styles.dataItemTitle}>{lang[lang.lang].personal_profile_124}</Text>
            <TouchableOpacity
              onPress={() => params.navigation.navigate("Update_DislikeMeals", { dislikemeals })}>
              <Text style={styles.dataItemEdit}>{lang[lang.lang].payment_3}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dataItemListContainer}>
            {dislikemeals?.length >= 1 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={dislikemeals}
                renderItem={renderItem}
                keyExtractor={item => `${item?.id}`}
              />
            ) : (
              <View style={styles.dontHaveDataContainer}>
                <Image
                  source={require("../../assets/icons/dinner.png")}
                  style={styles.dontHaveDataImage}
                />
                <Text style={styles.dontHaveDataText}>{lang[lang.lang].personal_profile_1245}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.dataItemContainer}>
          <View style={styles.dataItemTitleContainer}>
            <Text style={styles.dataItemTitle}>{lang[lang.lang].personal_profile_125}</Text>
            <TouchableOpacity
              onPress={() => params.navigation.navigate("Update_Allergy", { dislikeallergyitems })}>
              <Text style={styles.dataItemEdit}>{lang[lang.lang].payment_3}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dataItemListContainer}>
            {dislikeallergyitems?.length >= 1 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                data={dislikeallergyitems}
                renderItem={renderItem}
                keyExtractor={item => `${item?.id}`}
              />
            ) : (
              <View style={styles.dontHaveDataContainer}>
                <Image
                  source={require("../../assets/icons/dinner.png")}
                  style={styles.dontHaveDataImage}
                />
                <Text style={styles.dontHaveDataText}>{lang[lang.lang].personal_profile_1245}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  )
}

export default DislikeAllergies

const styles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: colors.white,
    flexDirection: "column",
  },
  safeAreaViewStyle: {
    height: 44,
    backgroundColor: colors.yellow,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  safeAreaViewStyleIos: {
    backgroundColor: colors.yellow,
    height: 100,
  },

  headingInnerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.medium,
    height: 44,
    width: "100%",
  },
  dataContainer: {
    flex: 1,
  },
  dataItemContainer: {
    width: "100%",
    height: "31%",
  },
  dataItemTitleContainer: {
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dataItemTitle: {
    fontSize: 16,
    color: colors.black,
    fontWeight: "bold",
  },
  dataItemEdit: {
    fontSize: 14,
    color: "#999",
    fontWeight: "400",
  },
  dataItemListContainer: {
    width: "90%",
    height: "83%",
    marginTop: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.black,
    alignSelf: "center",
  },
  listItemContainer: {
    backgroundColor: "#ccc",
    paddingHorizontal: 8,
    height: 28,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 8,
    marginBottom: 8,
  },
  listItemText: {
    fontSize: 14,
    color: colors.yellow,
    fontWeight: "600",
  },
  itemContainer: {
    width: "100%",
    height: 36,
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignSelf: "center",
  },
  itemText: {
    width: "80%",
    color: colors.black,
    fontSize: 14,
  },
  itemIcon: {
    width: 20,
    height: 20,
  },
  dontHaveDataContainer: {
    alignSelf: "center",
    marginTop: "12%",
    alignItems: "center",
    justifyContent: "center",
  },
  dontHaveDataImage: {
    width: 64,
    height: 64,
    marginBottom: 4,
  },
  dontHaveDataText: {
    fontSize: 14,
    color: colors.yellow,
    fontWeight: "600",
  },
})
