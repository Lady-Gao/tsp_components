import Vue from "vue"
import VueI18n from "vue-i18n"
import locale from "element-ui/lib/locale"
import zn from "./zh-cn"
import en from "./en"
const DEFAULT_LANG = "zh-cn";
const LOCAL_KEY = "localeLanguage";

Vue.use(VueI18n);
const locales = {
    "zh-cn": zn,
    "en": en
};

const i18n = new VueI18n({
    locale:localStorage.getItem("localeLanguage") ||  DEFAULT_LANG,
    messages: locales
})
//兼容elementUI
locale.i18n((key, value) => i18n.t(key, value));

export const setup = lang => {
    if (lang === undefined) {
        lang = window.localStorage.getItem(LOCAL_KEY)
        if (locales[lang] === undefined) {
            lang = DEFAULT_LANG
        }
    }
    window.localStorage.setItem(LOCAL_KEY, lang);
    /**这里是给body添加语种相关的class,因为不同语言，
     * 会导致排版错乱，如果要适配一下，可以从这里读取语言来适配class
     * 如果这里用不上，可以删除，也可以留下为以后这种考虑做准备
     * */
    Object.keys(locales).forEach(lang => {
        document.body.classList.remove(`lang-${lang}`)
    })
    document.body.classList.add(`lang-${lang}`)
    document.body.setAttribute('lang', lang)
    /**
     * 配置语言
     */
    Vue.config.lang = lang;
    i18n.locale = lang;

}
setup();
/**
 * 挂载到window下，非vue实例也可以用使用、
 * i18n.t()
 *  */
console.log(111)
window.i18n = i18n;
export default i18n;