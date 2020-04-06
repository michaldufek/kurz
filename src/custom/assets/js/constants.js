import i18n from "@/i18n"

const baseUrlLocal = "http://localhost"
const baseUrlDev = "https://dev.analyticalplatform.com"
const baseUrlProd = process.env.NODE_ENV === 'production' ? window.location.origin : baseUrlDev
// const baseUrl = baseUrlLocal
// const baseUrl = baseUrlDev
const baseUrl = baseUrlProd

const APIPartUrl = baseUrl + "/api"
const optPartUrl = APIPartUrl + "/optimization"
const dwhPartUrl = APIPartUrl + "/datawarehouse"
const sweepPartUrl = "/Sweep"
const requestPartUrl = "Request"
const SPPartUrl = APIPartUrl + "/sp"
const PLminiPartUrl = "pl"
const PLPartUrl = APIPartUrl + "/" + PLminiPartUrl
const PL2PartUrl = APIPartUrl + "/pl2"
const livedeplPartUrl = APIPartUrl + "/livedepl"
const tickerPartUrl = "/Ticker"
const patternPartUrl = "/Pattern"
const gwPartUrl = "/Gateway"
const patternResultsPartUrl = "/Pattern"
const resultPartUrl = "Result"
const alertPartUrl = "/Alert"
const searchPartUrl = "?search="
const reportPartUrl = APIPartUrl + "/xreport"
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
        backtestsDone: 1000 * 3, // 3 seconds,

        // time of downloading features engineering results
        featEngReload: 1000 * 5 // 5 seconds
    },    

    urls: {
        liveDepl: {
            gwStart: livedeplPartUrl + gwPartUrl + "Start/",
            gwStop: livedeplPartUrl + gwPartUrl + "Stop/",
            gwStatus: livedeplPartUrl + gwPartUrl + "Status",
            gwLogs: livedeplPartUrl + gwPartUrl + "Logs",
            report: livedeplPartUrl + "/Report/",
            liquidate: livedeplPartUrl + "/Liquidate/"
        },

        tickerSP: {
            base : SPPartUrl + tickerPartUrl,
            stock: SPPartUrl + tickerPartUrl + "OHLC?ticker="
        },

        patternLab: {
            abbreviation: PLminiPartUrl,
            asset: PLPartUrl + tickerPartUrl + searchPartUrl,
            pattern: PLPartUrl + patternPartUrl + searchPartUrl,
            chart: PLPartUrl + "/HistoryData/",
            patternsHistory: PLPartUrl + patternPartUrl + "Tests",
            backtestPatterns: {
                results: PLPartUrl + patternResultsPartUrl + resultPartUrl + "s",
                results2: PL2PartUrl + patternResultsPartUrl + resultPartUrl + "s",
                status: PLPartUrl + patternResultsPartUrl  + resultPartUrl + "s" + "Status"
            },
            alert: PLPartUrl + alertPartUrl + "/",
            alerts: PLPartUrl + alertPartUrl + "s"
        },

        featEng: {
            sweepRequest: optPartUrl + sweepPartUrl + requestPartUrl + "/"
        },

        datawarehouse: {
            result: dwhPartUrl + "/" + resultPartUrl + "/",
            results: dwhPartUrl + "/" + resultPartUrl + "s",
        },

        auth: baseUrl + "/rest-auth",

        stats: {
            "MF Report": statsPartUrl + mfPartUrl,
            "UVXY Report": statsPartUrl + uvxyPartUrl
        },

        chart: {
            "MF Report": chartPartUrl + mfPartUrl, 
            "UVXY Report": chartPartUrl + uvxyPartUrl
        }
    },

    storeKeys: {
        assetsPatternsPicker: 'research.patternLab.AssetsPatternsPicker',
        backtestPatterns: 'research.patternLab.backtestPatterns'
    },

    translationKeys: {
        patterns: 'research.patternLab.backtestPatterns.performanceResults.patterns',
        trades: 'research.patternLab.backtestPatterns.performanceResults.trades',
        performanceMetrics: 'research.patternLab.backtestPatterns.performanceResults.performanceMetrics',
        IBLogin: 'login.IB'
    },

    strings: {
        networkError: "Network Error",
        etc: "...",
        all: "all",
        bullish: "Bullish",
        bearish: "Bearish"
    }
}