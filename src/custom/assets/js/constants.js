import i18n from "@/i18n"

const baseUrl = process.env.NODE_ENV === 'production' ? window.location.origin : "https://dev.analyticalplatform.com"
// const baseUrl = "https://dev.analyticalplatform.com"
const SPPartUrl = "/api/sp"
const PLPartUrl = "/api/pl"
const tickerPartUrl = "/Ticker"
const patternPartUrl = "/Pattern"
const alertPartUrl = "/Alert"
const searchPartUrl = "?search="
const reportPartUrl = "/api/xreport"
const statsPartUrl = reportPartUrl + "/last_report"
const chartPartUrl = reportPartUrl + "/compute"
const mfPartUrl = "/mf"
const uvxyPartUrl = "/uvxy"

export default { 
    // interval for realoading charts and tables data from sources
    dataReloadInterval: 1000 * 60 * 10, // 10 minutes 

    // interval for checking whether we should play some orderStatus change sound
    soundSignalInterval: 1000 * 60, // minute

    // time of shaking of login forms if unsuccessful
    shakeInterval: 500, // half minute

    // time of effect of login forms showing
    loginShowInterval: 230,   
    
    // maximum number of rows shown in fancy tables
    maxRows: 20, // to-do: use some pagination or More... button for all rows

    defaultUnit: i18n.t('research.patternLab.units')[0],

    patternLabStoreKey: 'research.patternLab.AssetsPatternsPicker',

    urls: {
        tickerSP: {
             base : baseUrl + SPPartUrl + tickerPartUrl,
             stock: baseUrl + SPPartUrl + tickerPartUrl + "OHLC?ticker="
        },
        patternLab: {
            asset: baseUrl + PLPartUrl + tickerPartUrl + searchPartUrl,
            pattern: baseUrl + PLPartUrl + patternPartUrl + searchPartUrl,
            chart: baseUrl + PLPartUrl + "/HistoryData/",
            patternsHistory: baseUrl + PLPartUrl + "/Backtests",
            backtestPatterns: baseUrl + PLPartUrl + "/ComplexBacktest",
            alerts: baseUrl + PLPartUrl + alertPartUrl + "s"
        },

        auth: baseUrl + "/rest-auth",

        stats: {
            "MF Report": baseUrl + statsPartUrl + mfPartUrl,
            "UVXY Report": baseUrl + statsPartUrl + uvxyPartUrl
        },

        chart: {
            "MF Report": baseUrl + chartPartUrl + mfPartUrl, 
            "UVXY Report": baseUrl + chartPartUrl + uvxyPartUrl
        }
    },

    strings: {
        networkError: "Network Error",
        etc: "...",
        all: "all",
        bullish: "Bullish",
        bearish: "Bearish"
    }
}