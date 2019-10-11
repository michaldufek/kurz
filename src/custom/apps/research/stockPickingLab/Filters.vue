<template>
  <div>
    <div style="float: left; margin-top: 50px; width: 50%;">
      <h4>{{$t('research.stockPickingLab.filters.metrics')}}</h4>
      <ul style="list-style-type: none; padding-left: 0px;">
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.currency')}}</base-checkbox>
        </li>
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.exchange') + "/" + $t('research.stockPickingLab.filters.index')}}</base-checkbox>
        </li>
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.dividend')}}</base-checkbox>
        </li>
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.riskProfile')}}</base-checkbox>
        </li>
        <li >
          <base-checkbox>{{$t('research.stockPickingLab.filters.sampleMetrics')}}</base-checkbox>
        </li>
      </ul>
      <base-button type="secondary" fill>{{$t('research.stockPickingLab.filters.metricsSettings')}}</base-button>        
    </div>
    <div style="float: right; margin-top: 50px; width: 50%;">
      <h4>{{$t('research.stockPickingLab.filters.title')}}</h4>
      <table>
        <tr>
          <td>{{$t('research.stockPickingLab.filters.currency')}}</td>
          <td><base-dropdown></base-dropdown></td>
        </tr>
        <tr>
          <td>{{$t('research.stockPickingLab.filters.exchange')}}</td>
          <td><base-dropdown></base-dropdown></td>
        </tr>
        <tr>
          <td>{{$t('research.stockPickingLab.filters.index')}}</td>
          <td><base-radio></base-radio></td>
        </tr>
        <tr>
          <td>{{$t('research.stockPickingLab.filters.dividend')}}</td>
          <td><base-radio></base-radio></td>
        </tr>
        <tr>
          <td>{{$t('research.stockPickingLab.filters.riskProfile')}}</td>
          <td><base-dropdown></base-dropdown></td>
        </tr>
        <tr>
          <td>{{$t('research.stockPickingLab.filters.sector')}}</td>
          <td><base-dropdown></base-dropdown></td>
        </tr>
      </table>
      <base-button type="secondary" fill>{{$t('research.stockPickingLab.filters.applyFilters')}}</base-button>        
    </div>
  </div>
</template>
<script>
  import { BaseRadio } from "@/components";

  export default {
    name: "filters-content",
    components: {
      BaseRadio
    }
  };
</script>
<style>
</style>