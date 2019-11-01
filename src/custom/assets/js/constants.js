const baseUrl = process.env.NODE_ENV === 'production' ? window.location.origin : "https://frs.analyticalplatform.com"

export default { 
    // interval for realoading charts and tables data from sources
    dataReloadInterval: 1000 * 60 * 10, // 10 minutes 

    // interval for checking whether we should play some orderStatus change sound
    soundSignalInterval: 1000 * 60, // minute

    // time of shaking of login forms if unsuccessful
    shakeInterval: 500, // half minute

    // time of effect of login forms showing
    cardlShowInterval: 230,

    tickerUrl: baseUrl + "/sp/Ticker",

    authUrl: baseUrl + "/rest-auth",

    reportUrls: {
        "MF Report": baseUrl + "/api/xreport/old/mfreport",
        "UVXY Report": baseUrl + "/api/xreport/old/uvxyreport"
    }
}