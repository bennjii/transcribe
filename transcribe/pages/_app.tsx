
import '../styles/globals.css'
import type { AppProps /*, AppContext */ } from 'next/app'
import { CssBaseline, GeistProvider, Themes } from '@geist-ui/react'

const defaultLight = Themes.createFromLight({
  type: 'defaultLight',
  font: {
    mono: "Public Sans",
    sans: "Public Sans"
  },
  palette: {
    selection: '#dfe5ff',
    accents_8: "#597298",
    accents_1: "#F4F2F2",
    // foreground: "#597298"
  },
})

function App({ Component, pageProps }: AppProps) {
  return (
    <GeistProvider themes={[defaultLight]} themeType="defaultLight">
      {/* <CssBaseline />  */}
      <Component {...pageProps} />
    </GeistProvider>
  )
  
}

export default App
