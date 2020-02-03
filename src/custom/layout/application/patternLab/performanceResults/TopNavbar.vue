<template>
  <nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div style="margin-top: -40px;">
          <router-link class="navbar-brand" to="/research/patternLab/backtestPatterns/performanceResults/patterns">{{$t("research.patternLab.backtestPatterns.performanceResults.patterns.title")}}</router-link>
          <router-link class="navbar-brand" to="/research/patternLab/backtestPatterns/performanceResults/trades">{{$t("research.patternLab.backtestPatterns.performanceResults.trades.title")}}</router-link>
          <router-link class="navbar-brand" to="/research/patternLab/backtestPatterns/performanceResults/performanceMetrics">{{$t("research.patternLab.backtestPatterns.performanceResults.performanceMetrics.title")}}</router-link>
          <router-link class="navbar-brand" to="/research/patternLab/backtestPatterns/performanceResults/chart">{{$t("research.patternLab.backtestPatterns.performanceResults.chart.title")}}</router-link>

          <base-button native-type="submit" type="secondary" size="sm" @click="exportClick">{{ $t('research.patternLab.backtestPatterns.export') }}</base-button>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    methods: {
      exportClick() {}
    }
  };
</script>
<style>
</style>