<template>
  <nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div style="margin-top: -10px;">
          <router-link class="navbar-brand" :to="{ name: 'patterns', params: { params } }">{{$t("research.patternLab.backtestPatterns.performanceResults.patterns.title")}}</router-link>
          <router-link class="navbar-brand" to="/research/patternLab/backtestPatterns/performanceResults/trades" style="margin-left: 100px;">{{$t("research.patternLab.backtestPatterns.performanceResults.trades.title")}}</router-link>
          <router-link class="navbar-brand" to="/research/patternLab/backtestPatterns/performanceResults/performanceMetrics" style="margin-left: 175px;">{{$t("research.patternLab.backtestPatterns.performanceResults.performanceMetrics.title")}}</router-link>
          <router-link class="navbar-brand" to="/research/patternLab/backtestPatterns/performanceResults/chart" style="margin-left: 375px;">{{$t("research.patternLab.backtestPatterns.performanceResults.chart.title")}}</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    props: {
      params: {
        type: Object,
        default: () => {
          return {
            pattern: null,
            strategy: null
          }
        },
        description: 'Parameters for components linked by router here.'
      }
    },

    mounted() {
      // console.log('NavBar:')
      // console.log(this.params)
    }
  };
</script>
<style>
</style>