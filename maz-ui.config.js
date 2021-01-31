module.exports = {
  output: './src/assets/maz-ui/_maz-variables.scss',
  theme: {
    main: {
      primary: '#ffd700',
      secondary: '#1CD1A1',
      third: '#C41AF9',
      danger: '#ED4F32',
      success: '#3CB371',
      info: '#17A2B8',
      warning: '#FFA300',
      light: '#EEEEEE',
      dark: '#21222E',
      grey: '#999999',
      default: '#CCCCCC',
      black: 'black',
      white: 'white',
      transparent: '#FFFFFF00',
      disabled: '#F2F2F2'
    },
    typo: {
      'base-font-size': '16px',
      'base-font-family': 'Poppins, sans-serif',
      'base-font-weight': '400',
      'base-line-height': '1.5'
    },
    border: {
      'border-width': '2px',
      'border-radius': '6px'
    },
    light: {
      typo: {
        'text-color': '#212121',
        'muted-color': 'rgba(0, 0, 0, .54)',
        'placeholder-color': '#A7A7A7',
        'icon-color': '#DEDEDE'
      },
      layout: {
        'bg-color': 'white',
        'bg-color-light': '#F2F2F2',
        'overlay-color': 'rgba(86, 87, 117, .7)'
      },
      borderColor: {
        'border-color': '#EEEEEE'
      },
      state: {
        'hover-color': '#EEEEEE',
        'disabled-color': '#F2F2F2'
      }
    },
    dark: {
      typo: {
        'text-color': '#EEEEEE',
        'muted-color': 'rgba(255, 255, 255, .54)',
        'placeholder-color': 'rgba(255, 255, 255, .6)',
        'icon-color': '#65678F'
      },
      layout: {
        'bg-color': '#222831',
        'bg-color-light': '#393e46',
        'overlay-color': 'rgba(57, 62, 70, .7)'
      },
      borderColor: {
        'border-color': '#3B3C53'
      },
      state: {
        'hover-color': '#2E2F40',
        'disabled-color': '#CCCCCC'
      }
    }
  }
};
