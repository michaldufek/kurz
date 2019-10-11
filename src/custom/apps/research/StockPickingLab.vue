<template>
  <div class="wrapper">
    <nav class="navbar navbar-expand-lg navbar-absolute">
      <div class="container-fluid">
        <div class="navbar-wrapper">
          <router-link class="navbar-brand" to="/stockPickingLab/filters">{{$t("research.stockPickingLab.filters.title")}}</router-link>
          <router-link class="navbar-brand" to="/stockPickingLab/results" style="margin-left: 140px;">{{$t("research.stockPickingLab.results.title")}}</router-link>
        </div>
      </div>
    </nav>
    <dashboard-content @click.native="toggleSidebar">
    </dashboard-content>
  </div>
</template>
<script>
  import DashboardContent from "@/layout/dashboard/Content.vue";

  export default {
    components: {
      DashboardContent
    }
  };
</script>
<style>
</style>