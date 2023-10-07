// src/locales/index.js

import Vue from "vue";
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
// Import element-ui Chinese and English language packs
import elementEnLocale from "element-ui/lib/locale/lang/en";
import elementZhLocale from "element-ui/lib/locale/lang/zh-CN";
import ElementLocale from "element-ui/lib/locale";

import { getValue, setValue } from "@/utils/auth";

// Import custom language packs
import enLocale from "./lang/en";
import zhLocale from "./lang/zh-cn";

const messages = {
  en: {
    ...enLocale,
    ...elementEnLocale,
  },
  "zh-cn": {
    ...zhLocale,
    ...elementZhLocale,
  },
};

export const getLocale = () => {
  // Read the current language stored in the cookie
  const cookieLanguage = getValue("locale");
  // Returns the current language if any
  if (cookieLanguage) {
    return cookieLanguage;
  }
  // If not, get the system language
  const language = navigator.language.toLowerCase();
  // get messages language traverse
  const locales = Object.keys(messages);
  for (const locale of locales) {
    // If there is a system language in the message package, return
    if (language.indexOf(locale) > -1) {
      return locale;
    }
  }
  // Default language Simplified Chinese
  return "en";
};

const getDefaultLocale = () => {
  if (getValue("locale")) return getValue("locale");
  else {
    setValue("locale", "en");
    return "en";
  }
};

const i18n = new VueI18n({
  locale: getDefaultLocale() || "en", //localStorage.getItem('locale') || 'zh',
  messages: messages,
});
ElementLocale.i18n((key, value) => i18n.t(key, value));

export default i18n;
