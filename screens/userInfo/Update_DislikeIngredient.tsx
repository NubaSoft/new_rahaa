import React, { useEffect, useState } from "react"
import {
  Alert,
  FlatList,
  I18nManager,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"

import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { lang } from "../../lang"
import axios from "axios"
import { config } from "../../config"
import { Image } from "react-native"
import Ionicons from "react-native-vector-icons/Ionicons"

const Update_DislikeIngredient = (params: any) => {
  console.log("params.route.params?.dislikemeals----------", params.route.params)

  const [search, setSearch] = useState<string>("")
  const [meals, setAllMeals] = useState<any>([])

  const [firstItems, setFirstItems] = useState<any[]>([])
  const [items, setItems] = useState<any[]>([])
  const [selectItemDisliked, setSelectItemDisliked] = useState<any[]>([])

  const getDislikeIngredient = () => {
    axios
      .get(config.baseURL + "/api/meals/allitems")
      .then(response => {
        const flattenedMeals = Object.values(response?.data?.dislikes).flat()
        setAllMeals(flattenedMeals)
        const dropdownItems = flattenedMeals.map(item => ({
          label: I18nManager.isRTL ? item.name_ar : item.name_en,
          value: item.id,
        }))
        setItems(dropdownItems)
        setFirstItems(dropdownItems)
      })
      .catch(err => {
        console.log("error----", err)
      })
  }

  useEffect(() => {
    setSelectItemDisliked(params.route.params?.dislikeItems)
    getDislikeIngredient()
  }, [])

  useEffect(() => {
    var dataBeforeSearch: any[] = []
    if (search == "") {
      dataBeforeSearch = firstItems
    } else {
      for (let i = 0; i < firstItems?.length; i++) {
        if (firstItems[i].label.search(search) >= 0) {
          dataBeforeSearch.push(firstItems[i])
        }
      }
    }
    setItems(dataBeforeSearch)
  }, [search])

  const onNextButtonPress = () => {
    var array_for_disliked_item: any = []
    for (let i = 0; i < selectItemDisliked?.length; i++) {
      array_for_disliked_item.push(selectItemDisliked[i]?.value)
    }
    axios
      .post(
        config.baseURL + "/api/meals/DislikeItems",
        {
          item_ids: array_for_disliked_item,
        },
        {
          headers: {
            Authorization: `bearer ${config.Token}`,
          },
        },
      )
      .then(response => {
        if (response?.status == 201) {
          params.navigation.goBack()
          Alert.alert(lang[lang.lang].dataModifiedSuccessfully)
        }
      })
      .catch(err => {
        console.log("error----", err)
      })
  }

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    let selectedItem: boolean =
      [...selectItemDisliked].findIndex((e: any) => e.value === item.value) != -1
    const setArray = (item: any) => {
      var _Array: any = selectItemDisliked
      const find = [...selectItemDisliked].findIndex((e: any) => e.value === item.value)
      find == -1 ? _Array.push(item) : _Array.splice(find, 1)
      setSelectItemDisliked([..._Array])
    }
    return (
      <TouchableOpacity onPress={() => setArray(item)} style={styles.itemContainer}>
        <Text preset="formHelper" color={colors.white} style={styles.itemText}>
          {item?.label}
        </Text>
        {selectedItem && (
          <Image source={require("../../assets/icons/check.png")} style={styles.itemIcon} />
        )}
      </TouchableOpacity>
    )
  }

  const renderItemSelected = ({ item, index }: { item: any; index: number }) => {
    let selectedItem: boolean =
      [...selectItemDisliked].findIndex((e: any) => e.value === item.value) != -1
    const setArray = (item: any) => {
      var _Array: any = selectItemDisliked
      const find = [...selectItemDisliked].findIndex((e: any) => e.value === item.value)
      find == -1 ? _Array.push(item) : _Array.splice(find, 1)
      setSelectItemDisliked([..._Array])
    }
    return (
      <TouchableOpacity onPress={() => setArray(item)} style={styles.itemSelectContainer}>
        <Text preset="formHelper" color={colors.white} style={styles.itemSelectText}>
          {item?.label}
        </Text>
        {selectedItem && (
          <Image source={require("../../assets/icons/close.png")} style={styles.itemSelectIcon} />
        )}
      </TouchableOpacity>
    )
  }
  return (
    <View style={styles.body}>
      <SafeAreaView
        style={Platform.OS == "android" ? styles.safeAreaViewStyle : styles.safeAreaViewStyleIos}>
        <View style={styles.headingInnerStyle}>
          <StatusBar />
          <TouchableOpacity onPress={() => params.navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
          <Text preset="button01" color={colors.white}>
            {lang[lang.lang].personal_profile_123}
          </Text>
          <Ionicons name="settings-outline" size={24} color={colors.yellow} />
        </View>
      </SafeAreaView>
      <View style={{ height: Platform.OS == "android" ? "88%" : "80%" }}>
        <View style={{ paddingHorizontal: spacing.medium }}>
          <Text text={lang[lang.lang].personal_profile_1233} preset="t2" />
        </View>
        {/* //================== */}
        <View style={styles.listSelectedContainer}>
          <View style={styles.arrowDownContainer}>
            <View style={styles.arrowDownListContainer}>
              {selectItemDisliked?.length >= 1 ? (
                <View>
                  <FlatList
                    horizontal
                    showsVerticalScrollIndicator={false}
                    data={selectItemDisliked}
                    renderItem={renderItemSelected}
                    keyExtractor={item => `${item?.id}`}
                  />
                </View>
              ) : (
                <View>
                  <Text text={lang[lang.lang].personal_profile_1233} preset="body" color={"#999"} />
                </View>
              )}
            </View>
            {/* <TouchableOpacity style={styles.arrowDownView}>
              <Image
                source={require("../../assets/icons/arrowDown.png")}
                style={styles.arrowDownIcon}
              />
            </TouchableOpacity> */}
          </View>
          <View style={styles.search}>
            <TextInput
              value={search}
              placeholder={"search..."}
              onChangeText={(text: string) => setSearch(text)}
              numberOfLines={1}
              style={styles.input}
            />
          </View>
          <View style={styles.listContainer}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={items}
              renderItem={renderItem}
              keyExtractor={item => `${item?.id}`}
            />
          </View>
        </View>
        {/* //================== */}
      </View>
      <TouchableOpacity style={styles.button} onPress={onNextButtonPress}>
        <Text preset="button01" color={colors.white}>
          {lang[lang.lang].complete_profile_6}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Update_DislikeIngredient

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
  },
  safeAreaViewStyleIos: {
    height: 100,
    backgroundColor: colors.yellow,
    width: "100%",
    alignItems: "center",
  },
  headingInnerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.medium,
    paddingVertical: spacing.extraSmall,
    width: "100%",
  },
  listSelectedContainer: {
    width: "92%",
    height: "90%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.black,
    marginTop: 12,
    alignSelf: "center",
  },
  arrowDownContainer: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBlockColor: colors.black,
    borderBottomWidth: 1,
  },
  arrowDownListContainer: {
    width: "100%",
  },
  search: {
    width: "100%",
    height: 54,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderBlockColor: colors.black,
    borderBottomWidth: 1,
  },
  input: {
    width: "100%",
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 12,
    borderColor: colors.black,
    borderWidth: 1,
    textAlign: I18nManager.isRTL ? "left" : "left",
  },
  listContainer: {
    width: "100%",
    height: "80%",
  },
  buttonsContainer: {
    width: "100%",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: -16,
  },
  button: {
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: colors.green,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.extraSmall,
  },
  itemContainer: {
    width: "100%",
    height: 36,
    borderBottomColor: colors.grey,
    borderBottomWidth: 0.4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
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
  itemSelectContainer: {
    paddingRight: 4,
    height: 32,
    borderRadius: 6,
    marginEnd: 6,
    backgroundColor: colors.yellow,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  itemSelectText: {
    color: colors.white,
    fontSize: 12,
  },
  itemSelectIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 6,
  },
})
