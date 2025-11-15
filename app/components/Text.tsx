import React from "react"
import { Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle } from "react-native"

import { colors, typography } from "../theme"

type Sizes = keyof typeof $sizeStyles
type Weights = keyof typeof typography.inter
type Presets = keyof typeof $presets

export interface TextProps extends RNTextProps {
  text?: string

  style?: StyleProp<TextStyle>

  preset?: Presets

  weight?: Weights

  size?: Sizes

  children?: React.ReactNode

  color?: string
}

/**
 * For your text displaying needs.
 * This component is a HOC over the built-in React Native one.
 */
export function Text(props: TextProps) {
  const { weight, size, text, children, style: $styleOverride, color, ...rest } = props

  const content = text || children

  const preset: Presets = $presets[props.preset] ? props.preset : "default"

  const $colors = color ? { color } : {}

  const $styles = [
    $presets[preset],
    $fontWeightStyles[weight],
    $sizeStyles[size],
    $colors,
    $styleOverride,
  ]

  return (
    <RNText {...rest} style={$styles}>
      {content}
    </RNText>
  )
}

const $sizeStyles = {
  xxl: { fontSize: 36, lineHeight: 44 } satisfies TextStyle,
  xl: { fontSize: 24, lineHeight: 34 } satisfies TextStyle,
  lg: { fontSize: 20, lineHeight: 32 } satisfies TextStyle,
  md: { fontSize: 18, lineHeight: 26 } satisfies TextStyle,
  sm: { fontSize: 16, lineHeight: 24 } satisfies TextStyle,
  xs: { fontSize: 14, lineHeight: 21 } satisfies TextStyle,
  xxs: { fontSize: 12, lineHeight: 18 } satisfies TextStyle,
}

const $fontWeightStyles = Object.entries(typography.inter).reduce((acc, [weight, fontFamily]) => {
  return { ...acc, [weight]: { fontFamily } }
}, {}) as Record<Weights, TextStyle>

const $baseStyle: StyleProp<TextStyle> = [
  $sizeStyles.sm,
  $fontWeightStyles.normal,
  { color: colors.text },
]

const $presets = {
  default: $baseStyle,

  bold: [$baseStyle, $fontWeightStyles.bold] as StyleProp<TextStyle>,

  heading: [$baseStyle, $sizeStyles.xxl, $fontWeightStyles.bold] as StyleProp<TextStyle>,

  subheading: [$baseStyle, $sizeStyles.lg, $fontWeightStyles.medium] as StyleProp<TextStyle>,

  formLabel: [$baseStyle, $fontWeightStyles.medium] as StyleProp<TextStyle>,

  formHelper: [$baseStyle, $sizeStyles.sm, $fontWeightStyles.normal] as StyleProp<TextStyle>,

  // design system

  largeTitle: [$baseStyle, $sizeStyles.xl, $fontWeightStyles.semiBold] as StyleProp<TextStyle>,
  t1: [$baseStyle, $sizeStyles.lg, $fontWeightStyles.semiBold] as StyleProp<TextStyle>,
  t2: [$baseStyle, $sizeStyles.sm, $fontWeightStyles.semiBold] as StyleProp<TextStyle>,
  t3: [$baseStyle, $sizeStyles.xs, $fontWeightStyles.normal] as StyleProp<TextStyle>,

  body: [$baseStyle, $sizeStyles.sm, $fontWeightStyles.normal] as StyleProp<TextStyle>,

  button01: [$baseStyle, $sizeStyles.sm, $fontWeightStyles.bold] as StyleProp<TextStyle>,
  button02: [$baseStyle, $sizeStyles.xs, $fontWeightStyles.semiBold] as StyleProp<TextStyle>,
  footnote: [$baseStyle, $sizeStyles.xxs, $fontWeightStyles.bold] as StyleProp<TextStyle>,
}
