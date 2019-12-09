<template>
  <nav class="navbar navbar-expand-lg navbar-absolute"
       :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}">
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <div style="margin-top: -10px;">
          <router-link class="navbar-brand" to="/research/patternLab/chart">{{$t("patternLab.chart.title")}}</router-link>
          <!-- <router-link class="navbar-brand" to="/research/patternLab/patternStatistics" style="margin-left: 250px;">{{$t("patternLab.patternStatistics.title")}}</router-link> -->
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
