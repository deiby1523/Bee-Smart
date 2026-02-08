export const theme = {
  colors: {
    white: '#FFFFFF',
    lightGray: '#F5F5F5',
    mediumGray: '#CCCCCC',
    darkGray: '#666666',
    black: '#000000',
    success: '#4CAF50',
    error: '#F44336',
    primary: '#E7882E',
    secondary: '#FFB366',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xll: 80,
  },
  typography: {
    heading: {
      fontSize: 24,
      fontWeight: '700' as const,
    },
    title: {
      fontSize: 18,
      fontWeight: '600' as const,
    },
    body: {
      fontSize: 16,
      fontWeight: '400' as const,
    },

    caption: {
      fontSize: 14,
      fontWeight: '400' as const,
    },
    term: {
      fontSize: 10,
      fontWeight: '400' as const,
    },
  },
  borderRadius: 8,
  ligth: {
    shadowColor: '#00000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
};
