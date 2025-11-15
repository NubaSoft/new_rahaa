import {
  Inter_100Thin as inter100Thin,
  Inter_200ExtraLight as inter200ExtraLight,
  Inter_300Light as inter300Light,
  Inter_400Regular as inter400Regular,
  Inter_500Medium as inter500Medium,
  Inter_600SemiBold as inter600SemiBold,
  Inter_700Bold as inter700Bold,
  Inter_800ExtraBold as inter800ExtraBold,
  Inter_900Black as inter900Black,
} from 'react-native-fonts'

export const customFontsToLoad = {
  inter100Thin,
  inter200ExtraLight,
  inter300Light,
  inter400Regular,
  inter500Medium,
  inter600SemiBold,
  inter700Bold,
  inter800ExtraBold,
  inter900Black,
}

const fonts = {
  inter: {
    // Cross-platform Google font.
    thin: "inter100Thin",
    extraLight: "inter200ExtraLight",
    light: "inter300Light",
    normal: "inter400Regular",
    medium: "inter500Medium",
    semiBold: "inter600SemiBold",
    bold: "inter700Bold",
    extraBold: "inter800ExtraBold",
    black: "inter900Black",
  },
}

export const typography = {
  /**
   * The fonts are available to use, but prefer using the semantic name.
   */
  inter: fonts.inter,
}
