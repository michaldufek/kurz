const baseUrl = process.env.NODE_ENV === 'production' ? window.location.origin : "https://frs.analyticalplatform.com"
const tickerPartUrl = "/api/sp/Ticker"
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

    urls: {
        ticker: {
             base : baseUrl + tickerPartUrl,
             stock: baseUrl + tickerPartUrl + "OHLC?ticker="
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
    }
}