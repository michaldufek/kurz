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
    <filters-content></filters-content>
  </div>
</template>
<script>
  import FiltersContent from "@/custom/apps/research/stockPickingLab/Filters.vue";

  export default {
    components: {
      FiltersContent
    }
  };
</script>
<style>
</style>