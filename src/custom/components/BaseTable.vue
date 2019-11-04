<template>
  <table class="table tablesorter" :class="tableClass">
    <thead :class="theadClasses">
    <tr>
      <slot name="columns">
        <th v-for="column in columns" :key="column">{{column}}</th>
      </slot>
    </tr>
    </thead>
    <tbody :class="tbodyClasses">
    <tr v-for="(item, index) in data" :key="index">
      <slot :row="item">
        <td v-for="(column, index) in columns"
            :key="index" 
            :title="valueTitle(item, column)"
            v-if="hasValue(item, column)">
          {{ itemValue(item, column) | toFixed2 }}
        </td>
      </slot>
    </tr>
    </tbody>
  </table>
</template>
<script>
  export default {
    name: 'base-table',

    props: {
      columns: {
        type: Array,
        default: () => [],
        description: "Table columns"
      },
      data: {
        type: Array,
        default: () => [],
        description: "Table data"
      },
      titles: {
        type: Object,
        default: () => {},
        description: "Table data values descriptions"
      },
      type: {
        type: String, // striped | hover
        default: "",
        description: "Whether table is striped or hover type"
      },
      theadClasses: {
        type: String,
        default: '',
        description: "<thead> css classes"
      },
      tbodyClasses: {
        type: String,
        default: '',
        description: "<tbody> css classes"
      }
    },

    computed: {
      tableClass() {
        return this.type && `table-${this.type}`;
      }
    },

    filters: {
      toFixed2(nr) {
        if (!nr) {
          return nr
        }

        if (nr instanceof Number || typeof nr === 'number') {
          return nr.toFixed(2)
        }

        // split because in portfolio card it is in '<statisticName>: <number>' format
        let sep = ': '  // to-do: get rid of copy-pasting this        
        let nrSplitted = nr.split(sep)
        let nrIndex = nrSplitted.length - 1
        
        nrSplitted[nrIndex] = isNaN(Number(nrSplitted[nrIndex])) ? nrSplitted[nrIndex] : Number(nrSplitted[nrIndex]).toFixed(2) 
        return nrSplitted.join(sep)
      }
    },

    methods: {
      hasValue(item, column) {
        return item[column.toLowerCase()] !== "undefined";
      },

      itemValue(item, column) {
        return item[column.toLowerCase()];
      },
      
      valueTitle(item, column) {
        let value = this.itemValue(item, column)

        if (!value || !(typeof value === 'string' || value instanceof String) || !this.titles) {
          return null
        }

        // split because in portfolio card it is in '<statisticName>: <number>' format
        return this.titles[value.split(': ')[0].toLowerCase()];
      }
    }
  }
</script>
<style>
</style>