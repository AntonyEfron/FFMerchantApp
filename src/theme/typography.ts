export const fontFamily = {
  light: 'Manrope_300Light',
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semiBold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extraBold: 'Manrope_800ExtraBold',
  serif: 'WorkSans_400Regular',
  serifMedium: 'WorkSans_500Medium',
  serifSemiBold: 'WorkSans_600SemiBold',
  serifBold: 'WorkSans_700Bold',
  serifExtraBold: 'WorkSans_800ExtraBold',
};

export const typography = {
  fontFamily,

  h1: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: fontFamily.semiBold,
    fontSize: 24,
    lineHeight: 32,
  },
  h4: {
    fontFamily: fontFamily.semiBold,
    fontSize: 20,
    lineHeight: 28,
  },
  h5: {
    fontFamily: fontFamily.semiBold,
    fontSize: 18,
    lineHeight: 26,
  },

  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 22,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
  },

  labelLarge: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  labelSmall: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
  },

  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  overline: {
    fontFamily: fontFamily.bold,
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },

  buttonLarge: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    lineHeight: 24,
  },
  button: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonSmall: {
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
    lineHeight: 16,
  },
} as const;
