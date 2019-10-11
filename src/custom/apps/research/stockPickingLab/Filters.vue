<template>
  <div>
    <div>
      <h4>{{$t('research.stockPickingLab.filters.metrics')}}</h4>
      <ul style="list-style-type: none;">
        <li >
          <base-checkbox></base-checkbox>{{$t('research.stockPickingLab.filters.currency')}}
        </li>
        <li >
          <base-checkbox></base-checkbox>{{$t('research.stockPickingLab.filters.exchange') + "/" + $t('research.stockPickingLab.filters.index')}}
        </li>
        <li >
          <base-checkbox></base-checkbox>{{$t('research.stockPickingLab.filters.dividend')}}
        </li>
        <li >
          <base-checkbox></base-checkbox>{{$t('research.stockPickingLab.filters.riskProfile')}}
        </li>
        <li >
          <base-checkbox></base-checkbox>{{$t('research.stockPickingLab.filters.sampleMetrics')}}
        </li>
      </ul>
      <base-button type="secondary" fill>{{$t('research.stockPickingLab.filters.metricsSettings')}}</base-button>        
    </div>
    <div>
      <h4>{{$t('research.stockPickingLab.filters.title')}}</h4>
      <ul style="list-style-type: none;">
        <li >
          {{$t('research.stockPickingLab.filters.currency')}}
          <base-dropdown></base-dropdown>
        </li>
        <li >
          {{$t('research.stockPickingLab.filters.exchange')}}
          <base-dropdown></base-dropdown>
        </li>
        <li >
          {{$t('research.stockPickingLab.filters.index')}}
          <base-radio></base-radio>
        </li>
        <li >
          {{$t('research.stockPickingLab.filters.dividend')}}
          <base-radio></base-radio>
        </li>
        <li >
          {{$t('research.stockPickingLab.filters.riskProfile')}}
          <base-dropdown></base-dropdown>
        </li>
        <li >
          {{$t('research.stockPickingLab.filters.sector')}}
          <base-dropdown></base-dropdown>
        </li>
      </ul>
      <base-button type="secondary" fill>{{$t('research.stockPickingLab.filters.applyFilters')}}</base-button>        
    </div>
  </div>
</template>
<script>
  export default {
    components: {
    }
  };
</script>
<style>
</style>