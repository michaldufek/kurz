<template>
  <nav class="navbar navbar-expand-lg navbar-absolute">
       <!-- :class="{'bg-white': showMenu, 'navbar-transparent': !showMenu}"> -->
    <div class="container-fluid">
      <div class="navbar-wrapper">
        <router-link class="navbar-brand" to="/stockPickingLab/filters">{{$t("research.stockPickingLab.filters.title")}}</router-link>
        <router-link class="navbar-brand" to="/stockPickingLab/results" style="margin-left: 140px;">{{$t("research.stockPickingLab.results.title")}}</router-link>        
      </div>
    </div>
  </nav>
</template>
<script>
  import { BaseButton } from "@/components";

  export default {
    components: {
      BaseButton        
    }
  };
</script>
<style>
</style>