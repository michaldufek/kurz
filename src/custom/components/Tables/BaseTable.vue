<template>
  <table class="table tablesorter" :class="tableClass">
    <thead :class="theadClasses">
    <tr>
      <slot name="columns">
        <th v-for="column in columns" 
            :key="column"
            @dblclick="filter(column)"
            @keyup.esc="filtering = {}"
            style="text-align: right;"
            :class="{ 'sortable': sortable || filterable }"            
            :title="headerTitle">
            <b @click="sort(column)">{{column}}</b>&nbsp;<i v-if="column in sorting" :class="[ sorting[column] === 'asc' ? 'tim-icons icon-minimal-up' : 'tim-icons icon-minimal-down' ]"></i>
            <base-input v-if="column in filtering && filterable" placeholder="Filter" v-model="filterText" style="min-width: 75px"/>
        </th>
      </slot>
    </tr>
    </thead>
    <tbody :class="tbodyClasses">
    <tr v-for="(item, index) in sortedFilteredData" :key="index">
      <slot :row="item">
        <td v-for="(column, index) in columns"
            :key="index" 
            :title="valueTitle(item, column)"
            v-if="hasValue(item, column)" 
            style="text-align: right; white-space: pre-wrap;">{{ itemValue(item, column) | toFixed2 }}</td>
      </slot>
    </tr>
    </tbody>
  </table>
</template>
<script>
  import helper from '@/custom/assets/js/helper';
  
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
      headerTitle: {
        type: String,
        description: "Table header description"
      },
      type: {
        type: String, // striped | hover
        default: "",
        description: "Whether table is striped or hover type"
      },
      sortable: {
        type: Boolean,
        description: "Whether columns can be sorted by header click"
      },
      filterable: {
        type: Boolean,
        description: "Whether columns can be filtered by header double-click"
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

    data() {
      return {
        sorting: {},
        filtering: {},
        filterText: null
      }
    },

    computed: {
      sortedFilteredData() {
        let data = this.data

        if (!(Object.keys(this.filtering).length === 0 && this.filtering.constructor === Object)) { // object not empty 
          let column = Object.keys(this.filtering)[0]
          data = data.filter(item => column in this.filtering && this.filterText 
                                      && String(item[column.toLowerCase()]).toLowerCase().includes(this.filterText.toLowerCase()) 
                                      || !(column in this.filtering) || !this.filterText)
        }
        
        if (!(Object.keys(this.sorting).length === 0 && this.sorting.constructor === Object)) { // object not empty
          data = data.sort((item1,item2) => {        
            let column = Object.keys(this.sorting)[0].toLowerCase()          
            let order = Object.values(this.sorting)[0]
            let item1nr = Number(String(item1[column]).split(' ')[0])
            return isNaN(item1nr)   // ie.is String
                    ? (order === 'asc' 
                        ? String(item1[column]).localeCompare(String(item2[column])) 
                        : String(item2[column]).localeCompare(String(item1[column])))
                    : (order === 'asc' 
                        ? item1nr - Number(String(item2[column]).split(' ')[0])
                        : Number(String(item2[column]).split(' ')[0]) - item1nr)
           })
        }

        return data
      },

      tableClass() {
        return this.type && `table-${this.type}`;
      }
    },

    filters: {
      toFixed2(nr) {
        if (!nr || Number.isInteger(nr)) {
          return nr
        }

        if (helper.isNumber(nr)) {
          return nr.toFixed(2)
        }

        // split because in portfolio card it is in '<statisticName>: <number>' format
        let sep = ': '
        let nrSplitted = nr.split(sep)
        let nrIndex = nrSplitted.length - 1
        
        nrSplitted[nrIndex] = nrSplitted[nrIndex].split(' ').length === 1 && isNaN(Number(nrSplitted[nrIndex]))
                              ? nrSplitted[nrIndex]
                              : helper.roundToFixed(!isNaN(Number(nrSplitted[nrIndex])) ? Number(nrSplitted[nrIndex]) : nrSplitted[nrIndex])
        return nrSplitted.join(sep)
      }
    },

    methods: {
      sort(column) {
        if (this.sortable) {
          let origOrder = this.sorting[column]
          this.sorting = {} // to-do: sort by multiple columns?
          this.sorting[column] = origOrder === 'asc' ? 'desc' : 'asc'
        }
      },
      filter(column) {
        this.filtering = {}
        this.filterText = null
        this.filtering[column] = true
      },

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
.sortable {
  cursor: pointer
}
</style>