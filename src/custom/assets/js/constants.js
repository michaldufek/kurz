export default { 
    // interval for realoading charts and tables data from sources
    dataReloadInterval: 1000 * 60 * 10, // 10 minutes 

    // interval for checking whether we should play some orderStatus change sound
    soundSignalInterval: 1000 * 60, // minute

    // time of shaking of login forms if unsuccessful
    shakeInterval: 500, // half minute

    // time of effect of login forms showing
    modalShowInterval: 230,

    apiUrls: {
        "MF Report": "https://app1.objectively.info/api/mfreport",
        "UVXY Report": "https://app1.objectively.info/api/uvxyreport"
    }
}