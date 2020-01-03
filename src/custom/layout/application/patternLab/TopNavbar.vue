<template>
  <nav class="navbar navbar-expand-lg navbar-absolute navbar-transparent">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div style="margin-top: -10px;">
          <router-link class="navbar-brand" to="/research/patternLab/chart">{{$t("research.patternLab.chart.title")}}</router-link>
          <router-link class="navbar-brand" to="/research/patternLab/patternStatistics" style="margin-left: 75px;">{{$t("research.patternLab.patternStatistics.title")}}</router-link>
          <router-link class="navbar-brand" to="/research/patternLab/backtestPatterns" style="margin-left: 225px;">{{$t("research.patternLab.backtestPatterns.title")}}</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
  };
</script>
<style>
</style>
