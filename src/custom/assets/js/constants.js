import i18n from "@/i18n"

const baseUrl = process.env.NODE_ENV === 'production' ? window.location.origin : "https://dev.analyticalplatform.com"
// const baseUrl = "https://dev.analyticalplatform.com"
const APIPartUrl = "/api"
const SPPartUrl = APIPartUrl + "/sp"
const PLPartUrl = APIPartUrl + "/pl"
const livedeplPartUrl = APIPartUrl + "/livedepl"
const tickerPartUrl = "/Ticker"
const patternPartUrl = "/Pattern"
const gwStartPartUrl = "/GatewayStart"
const patternResultsPartUrl = "/PatternResults"
const alertPartUrl = "/Alert"
const searchPartUrl = "?search="
const reportPartUrl = "/api/xreport"
const statsPartUrl = reportPartUrl + "/last_report"
const chartPartUrl = reportPartUrl + "/compute"
const mfPartUrl = "/mf"
const uvxyPartUrl = "/uvxy"

export default {
    // maximum number of rows shown in fancy tables
    maxRows: 20, // to-do: use some pagination or More... button for all rows

    defaultUnit: i18n.t('research.patternLab.units')[0],        // will not translate during runtime !!!

    colors: {
        tradeEntry: 'blue',
        tradeStopLoss: 'yellow',
        tradeExit: 'darkred'
    },
    
    intervals: { 
        // interval for realoading charts and tables data from sources
        dataReload: 1000 * 60 * 10, // 10 minutes 

        // interval for checking whether we should play some orderStatus change sound
        soundSignal: 1000 * 60, // minute

        // time of shaking of login forms if unsuccessful
        shake: 500, // half second

        // time of effect of login forms showing
        loginShow: 230,

        // time of checking whether Backtest patterns backtests are done
        backtestsDone: 1000 * 3 // 3 seconds
    },    

    urls: {
        liveDepl: {
            gwStart : baseUrl + livedeplPartUrl + gwStartPartUrl
        },

        tickerSP: {
             base : baseUrl + SPPartUrl + tickerPartUrl,
             stock: baseUrl + SPPartUrl + tickerPartUrl + "OHLC?ticker="
        },
        patternLab: {
            asset: baseUrl + PLPartUrl + tickerPartUrl + searchPartUrl,
            pattern: baseUrl + PLPartUrl + patternPartUrl + searchPartUrl,
            chart: baseUrl + PLPartUrl + "/HistoryData/",
            patternsHistory: baseUrl + PLPartUrl + patternPartUrl + "Tests",
            backtestPatterns: {
                results: baseUrl + PLPartUrl + patternResultsPartUrl,
                status: baseUrl + PLPartUrl + patternResultsPartUrl + "Status"
            },
            alert: baseUrl + PLPartUrl + alertPartUrl + "/",
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

    storeKeys: {
        assetsPatternsPicker: 'research.patternLab.AssetsPatternsPicker',
        backtestPatterns: 'research.patternLab.backtestPatterns'
    },

    translationKeys: {
        patterns: 'research.patternLab.backtestPatterns.performanceResults.patterns',
        trades: 'research.patternLab.backtestPatterns.performanceResults.trades',
        performanceMetrics: 'research.patternLab.backtestPatterns.performanceResults.performanceMetrics'
    },

    strings: {
        networkError: "Network Error",
        etc: "...",
        all: "all",
        bullish: "Bullish",
        bearish: "Bearish"
    }
}