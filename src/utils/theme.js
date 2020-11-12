import { DefaultTheme } from 'react-native-paper';

const customTheme = {
    roundness: 4,
    colors: {
        ...DefaultTheme.colors,
        primary: '#0366d6',
        primaryDark: '#003da4',
        primaryLight: '#6093ff',
        accent: '#FFFF00',
        background: '#f6f6f6',
        placeholder: '#ccc'
    },
}

export default customTheme;