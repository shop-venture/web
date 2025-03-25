// pages/_app.js
import { ChakraProvider } from '@chakra-ui/react'
import Navigation from '../components/navigation'
import Footer from '../components/footer'
import '../styles/globals.css'
function MyApp({ Component, pageProps }) {
    return (
        <ChakraProvider>
            <Navigation />
            <Component {...pageProps} />
            <Footer />
        </ChakraProvider>
    )
}

export default MyApp