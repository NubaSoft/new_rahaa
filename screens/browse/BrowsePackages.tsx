import AntDesign from "react-native-vector-icons/AntDesign"
import React, { useEffect } from "react"
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  I18nManager,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"

import { Icon, Text } from "../../app/components"
import { getGuestPackagesApi } from "../../app/services/meals"
import { colors, globalStyle, spacing } from "../../app/theme"
import { Packages } from "../../app/types"
import { lang } from "../../lang"

const dimensions = Dimensions.get("window")

export const BrowsePackages = ({ navigation }) => {
  const [loading, setLoading] = React.useState(false)
  const [packages, setPackages] = React.useState<Packages[] | any>([])
  const [activeMealType, setActiveMealType] = React.useState(0)

  useEffect(() => {
    if (packages.length === 0) {
      getPackages()
    }
  }, [])

  const getPackages = () => {
    setLoading(true)
    getGuestPackagesApi()
      .then(res => {
        if (res.kind === "ok") {
          setPackages(res.data.topSubs)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const renderMealTypeItem2 = ({ item, index }) => {
    console.log("item------------------", item)

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
          text={I18nManager.isRTL ? item.class_name_ar : item.class_name_en}
          preset="button01"
          style={styles.mealTypeStyle}
          color={activeTextColor}
        />
      </TouchableOpacity>
    )
  }
  console.log("packages------------", packages)

  const renderTableItem = ({ item, index }) => {
    return (
      <View style={styles.tableHeaderContainer}>
        <View style={[styles.tableHeaderView, { backgroundColor: colors.white }]}>
          <Text preset="t3">{item.day}</Text>
        </View>
        <View style={[styles.tableHeaderView, { backgroundColor: colors.white }]}>
          <Text preset="t3">{item.price}</Text>
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
        <Text text={lang[lang.lang].welcome_browse_packages} preset="t1" />
      </View>
      <ActivityIndicator animating={loading} color={colors.yellow} />
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={packages?.topSubs}
        renderItem={item => renderMealTypeItem2(item)}
        contentContainerStyle={{ height: 48, marginBottom: 16 }}
      />
      {packages?.topSubs?.length >= 1 && packages?.topSubs[activeMealType]?.subscriptions && (
        <FlatList
          data={packages?.topSubs[activeMealType].subscriptions}
          renderItem={({ item }) => {
            console.log("item.subscriptionMinDays-----------", item.subscriptionMinDays)
            console.log("item.subscriptionMinPrice----------", item.subscriptionMinPrice)
            var array = []
            for (let i = 0; i < item.subscriptionMinPrice.length; i++) {
              array.push({ day: item.subscriptionMinDays[i], price: item.subscriptionMinPrice[i] })
            }

            console.log("array-------------", array)

            const maxDays =
              item.subscriptionMinDays === item.subscriptionMaxDays
                ? ""
                : `- ${item.subscriptionMaxDays}`
            const maxPrice =
              item.subscriptionMinPrice === item.subscriptionMaxPrice
                ? ""
                : `- ${item.subscriptionMaxPrice}`

            return (
              <View>
                <TouchableOpacity style={[styles.cardStyle]}>
                  <View style={styles.checkmarkWrapper}>
                    <Icon icon="checkMark" />
                  </View>
                  <View style={globalStyle.flexOne}>
                    <Text preset="button02">
                      {lang.lang === "ar" ? item.subscriptionNameAr : item.subscriptionName}
                    </Text>
                    <View>
                      <View style={styles.tableHeaderContainer}>
                        <View style={styles.tableHeaderView}>
                          <Text preset="t3">{lang[lang.lang].welcome_browse_packages1}</Text>
                        </View>
                        <View style={styles.tableHeaderView}>
                          <Text preset="t3">{lang[lang.lang].welcome_browse_packages2}</Text>
                        </View>
                      </View>
                      <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={array}
                        renderItem={item => renderTableItem(item)}
                        contentContainerStyle={{ height: 48, marginBottom: 16 }}
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // backgroundColor: colors.white,
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
  checkmarkWrapper: { flex: 0.1, marginTop: spacing.tiny },

  mealTypeItemStyle: {
    marginHorizontal: spacing.extraSmall,
    borderRadius: 10,
    paddingHorizontal: spacing.small,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
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
  mealTypeStyle: {
    textTransform: "capitalize",
  },

  tableHeaderContainer: {
    width: "90%",
    height: 32,
    flexDirection: "row",
  },
  tableHeaderView: {
    width: "50%",
    height: 32,
    flexDirection: "row",
    alignItems: "center",
    paddingStart: 12,
    backgroundColor: "#e0951f",
    borderWidth: 1,
    borderColor: colors.grey,
  },
})
