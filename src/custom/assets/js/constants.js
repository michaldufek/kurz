const baseUrl = process.env.NODE_ENV === 'production' ? window.location.origin : "https://frs.analyticalplatform.com/"
const statsPartUrl = "api/xreport/last_report/"
const chartPartUrl = "api/xreport/compute/"
const mfPartUrl = "mf"
const uvxyPartUrl = "uvxy"

export default { 
    // interval for realoading charts and tables data from sources
    dataReloadInterval: 1000 * 60 * 10, // 10 minutes 

    // interval for checking whether we should play some orderStatus change sound
    soundSignalInterval: 1000 * 60, // minute

    // time of shaking of login forms if unsuccessful
    shakeInterval: 500, // half minute

    // time of effect of login forms showing
    cardlShowInterval: 230,    

    urls: {
        ticker: baseUrl + "api/sp/Ticker",

        auth: baseUrl + "rest-auth",

        stats: {
            "MF Report": baseUrl + statsPartUrl + mfPartUrl, //"/api/xreport/old/mfreport",
            "UVXY Report": baseUrl + statsPartUrl + uvxyPartUrl //"/api/xreport/old/uvxyreport"
        },

        chart: {
            "MF Report": baseUrl + chartPartUrl + mfPartUrl, 
            "UVXY Report": baseUrl + chartPartUrl + uvxyPartUrl
        }
    }
}