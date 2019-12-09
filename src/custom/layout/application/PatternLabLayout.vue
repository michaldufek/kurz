<template>
  <div class="wrapper">
    <div class="main-panel">
      <top-navbar></top-navbar>

      <dashboard-content @click.native="toggleSidebar">

      </dashboard-content>

      <!-- <content-footer></content-footer> -->
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
import TopNavbar from "@/custom/apps/research/patternLab/TopNavbar.vue"
import ContentFooter from "@/custom/layout/application/ContentFooter.vue";
import DashboardContent from "@/layout/dashboard/Content.vue";
import MobileMenu from "@/layout/dashboard/MobileMenu";

export default {
  components: {
    TopNavbar,
    // ContentFooter,
    DashboardContent,
    MobileMenu
  },
  methods: {
    toggleSidebar() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.displaySidebar(false);
      }
    }
  }
};
</script>
