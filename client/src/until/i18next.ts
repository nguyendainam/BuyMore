import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import homeVi from './languageVi/home.json'
import homeEn from './languageEn/home.json'

const resources = {
    en: {
        home: homeEn
    },
    vi: {
        home: homeVi
    }
}

const defaultNS = 'home'

i18n.use(initReactI18next).init({
    resources,
    debug: true,
    lng: 'vi',
    fallbackLng: 'vi',
    defaultNS,
    interpolation: {
        escapeValue: false, // not needed for react as it escapes by default
    },
})


export default i18n