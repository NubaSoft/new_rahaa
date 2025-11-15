import AntDesign from "react-native-vector-icons/AntDesign"
import axios from "axios"
import React, { useEffect } from "react"
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  I18nManager,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { Text } from "../../app/components"
import { colors, spacing } from "../../app/theme"
import { lang } from "../../lang"
import { config } from "../../config"

const dimensions = Dimensions.get("window")

export const BrowseMenu = ({ navigation }) => {
  const [activeSuberMealType, setActiveSuberMealType] = React.useState(0)
  const [activeMealType, setActiveMealType] = React.useState(0)
  const [suberMenuList, setSuberMenuList] = React.useState([])
  const [menuList, setMenuList] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    if (menuList.length === 0) {
      getMeals()
    }
  }, [])

  function validURI(uri) {
    if (uri) {
      if (uri.includes("http")) {
        return true
      } else {
        return false
      }
    }
    return false
  }

  const getMeals = () => {
    setLoading(true)

    // getMealsApi()
    //   .then(res => {
    //     if (res.kind === "ok") {
    //       setMenuList(res.data.topMeals)
    //     }
    //     setLoading(false)
    //   })
    //   .catch(() => {
    //     setLoading(false)
    //   })

    axios
      .get(config.baseURL + "/api/getTopMealsH?center_id=" + config.branch_code)
      .then(response => {
        // console.log(response.data)
        console.log("response.data--------", response.data.topMeals)

        setSuberMenuList(response.data.topMeals)
        setMenuList(response.data.topMeals[0].meals)
        setLoading(false)
      })
      .catch(function (error) {
        console.log(error)
        Alert.alert("Error loading menu")
        setLoading(false)
      })
  }
  const renderMealTypeItem1 = ({ item, index }) => {
    const activeBackground = activeSuberMealType === index ? colors.yellow : colors.white
    const activeTextColor = activeSuberMealType === index ? colors.white : colors.text
    const borderColor = activeSuberMealType === index ? colors.yellow : colors.grey
    return (
      <TouchableOpacity
        style={[
          styles.mealTypeItemStyle,
          {
            borderColor,
            backgroundColor: activeBackground,
          },
        ]}
        onPress={() => {
          setActiveSuberMealType(index)
          setMenuList(suberMenuList[index].meals)
          setActiveMealType(0)
        }}>
        <Text
          text={I18nManager.isRTL ? item.classNameAr : item.classNameEn}
          preset="button01"
          style={styles.mealTypeStyle}
          color={activeTextColor}
        />
      </TouchableOpacity>
    )
  }

  const renderMealTypeItem2 = ({ item, index }) => {
    const activeBackground = activeMealType === index ? colors.yellow : colors.white
    const activeTextColor = activeMealType === index ? colors.white : colors.text
    const borderColor = activeMealType === index ? colors.yellow : colors.grey
    return (
      <TouchableOpacity
        style={[
          styles.mealTypeItemStyle,
          {
            borderColor,
            backgroundColor: activeBackground,
          },
        ]}
        onPress={() => {
          setActiveMealType(index)
        }}>
        <Text
          text={I18nManager.isRTL ? item.mealTypeAr : item.mealTypeEn}
          preset="button01"
          style={styles.mealTypeStyle}
          color={activeTextColor}
        />
      </TouchableOpacity>
    )
  }

  const renderMealCard = ({ item, index }) => {
    const isLastItem =
      menuList[activeMealType].items?.length % 2 === 1 &&
      index === menuList[activeMealType].items?.length - 1
    return (
      <View style={[styles.mealCard, isLastItem ? styles.lastItemCard : {}]}>
        {validURI(item.mealImage) ? (
          <Image
            source={{ uri: item.mealImage }}
            defaultSource={require("../../assets/icon.png")}
            style={styles.mealImageStyle}
            resizeMode="stretch"
          />
        ) : (
          <Image
            source={{ uri: config.logo }}
            defaultSource={require("../../assets/icon.png")}
            style={styles.mealImageStyle}
          />
        )}

        <View style={styles.mealInfo}>
          <Text text={item.itemNameEn} preset="t3" numberOfLines={2} style={styles.mealNameText} />
          <View style={styles.macrosContainerStyle}>
            <View>
              <Text text="Protien" preset="t3" size="xxs" color={colors.text} />
              <Text text={`${item.proteins ?? 0}`} size="xxs" preset="t3" color={colors.yellow} />
            </View>
            <View>
              <Text text="Calories" preset="t3" size="xxs" color={colors.text} />
              <Text text={`${item.calories ?? 0}`} size="xxs" preset="t3" color={colors.yellow} />
            </View>
            <View>
              <Text text="Carbs" preset="t3" size="xxs" color={colors.text} />
              <Text text={`${item.carbs ?? 0}`} size="xxs" preset="t3" color={colors.yellow} />
            </View>
            <View>
              <Text text="Fats" preset="t3" size="xxs" color={colors.text} />
              <Text text={`${item.fats ?? 0}`} size="xxs" preset="t3" color={colors.yellow} />
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerStyle}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <AntDesign name="close" size={24} />
        </TouchableOpacity>
        <Text text={lang[lang.lang].browse_heading} preset="t1" />
      </View>
      <ActivityIndicator animating={loading} color={colors.yellow} />
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={suberMenuList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={item => renderMealTypeItem1(item)}
          contentContainerStyle={styles.mealTypeContentContainerStyle}
        />
      </View>
      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={menuList}
          keyExtractor={(_, index) => index.toString()}
          renderItem={item => renderMealTypeItem2(item)}
          contentContainerStyle={styles.mealTypeContentContainerStyle}
        />
      </View>
      <View style={styles.mealListWrapperStyle}>
        <FlatList
          extraData={menuList}
          numColumns={2}
          keyExtractor={(_, index) => index.toString()}
          data={menuList.length > 0 ? menuList[activeMealType].items : []}
          renderItem={({ item, index }) => renderMealCard({ item, index })}
          contentContainerStyle={styles.mealListContentContainerStyle}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: spacing.large,

    backgroundColor: colors.white,
  },
  backIcon: {
    position: "absolute",
    left: 0,
  },
  headerStyle: {
    alignItems: "center",
    margin: spacing.medium,
    justifyContent: "center",
  },
  mealTypeStyle: {
    textTransform: "capitalize",
  },
  mealTypeItemStyle: {
    marginHorizontal: spacing.extraSmall,
    borderRadius: 10,
    paddingHorizontal: spacing.small,
    paddingVertical: spacing.tiny,

    borderWidth: 1,
  },
  mealTypeContentContainerStyle: {
    paddingHorizontal: spacing.extraSmall,
    marginEnd: spacing.medium,
    marginBottom: spacing.small,
  },
  mealCard: {
    borderWidth: 1,
    borderColor: colors.grey,
    flex: 1,
    marginEnd: spacing.extraSmall,
    borderRadius: 8,
    marginVertical: spacing.extraSmall,
  },
  mealImageStyle: {
    width: "80%",
    height: 110,
    alignSelf: "center",
    borderRadius: 8,
  },
  mealNameText: {
    textTransform: "capitalize",
  },
  macrosContainerStyle: {
    marginTop: spacing.extraSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealListWrapperStyle: { flex: 1, marginTop: spacing.extraSmall },
  mealInfo: {
    padding: spacing.extraSmall,
  },
  mealListContentContainerStyle: {
    padding: spacing.extraSmall,
    paddingBottom: spacing.huge,
  },
  lastItemCard: {
    flex: 0,
    flexShrink: 1,
    width: (dimensions.width - 30) / 2,
  },
})
