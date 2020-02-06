<template>
  <table class="table tablesorter" :class="tableClass">
    <thead :class="theadClasses">
    <tr>
      <slot name="columns">
        <th v-for="column in columns" 
            :key="column"
            :title="headerTitle"
            @dblclick="filter(column)"
            @keyup.esc="filtering = {}"
            :class="{ 'interactive': sortable || filterable }"
            style="text-align: right;" >
            <b @click="sort(column)">{{column}}</b>&nbsp;<i v-if="column in sorting" :class="[ sorting[column] === 'asc' ? 'tim-icons icon-minimal-up' : 'tim-icons icon-minimal-down' ]"></i>
            <base-input v-show="filterable && column in filtering" placeholder="Filter" v-model="filterText" style="min-width: 75px" />
        </th>
      </slot>
    </tr>
    </thead>
    <tbody :class="tbodyClasses">
    <tr v-for="(item, rowIndex) in sortedFilteredData" :key="rowIndex">
      <slot :row="item">
        <td v-for="(column, clIndex) in columns"
            :key="clIndex"
            v-if="hasValue(item, column)"
            :title="valueTitle(item, column)"
            @dblclick="edit(rowIndex, item, column)"
            @keyup.enter="finishEdit(rowIndex, column)" 
            @keyup.esc="editing = null"            
            :class="{ 'interactive': editable }"           
            style="text-align: right; white-space: pre-wrap;">
              <base-input v-show="isEditing(rowIndex, column)" v-model="editText" style="min-width: 75px" />
              <p v-show="!isEditing(rowIndex, column)">{{ itemValue(item, column) | toFixed2 }}</p>
            </td>
      </slot>
    </tr>
    </tbody>
  </table>
</template>
<script>
  import helper from '@/custom/assets/js/helper'
  
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
      sortable: {
        type: Boolean,
        description: "Whether columns can be sorted by header click"
      },
      filterable: {
        type: Boolean,
        description: "Whether columns can be filtered by header double-click"
      },
      editable: {
        type: Boolean,
        description: "Whether values can be directly edited by double-click"
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
        filterText: null,

        editing: null,
        editText: null
      }
    },

    computed: {
      sortedFilteredData() {
        let data = this.data.map(row => row instanceof Map ? Object.fromEntries(row) : row)

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
      },

      headerTitle() {
        let title = ''

        if (this.sortable) {
          title += this.$t('titles.sort')
        }
        if (this.filterable) {
          title += ' ' + this.$t('titles.filter')
        }

        return title
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

      edit(index, item, column) { 
        let val = this.itemValue(item, column)   
        this.editText = val ? ((!isNaN(Number(val)) ? String(val) : val).split(' (')[0]) : ''
        this.editing = [index, column]
      },
      finishEdit(index, column) {
        this.$emit('edited', {
          position: [index, column],
          value: this.editText})
        this.editing = null
      },
      isEditing(rowIndex, column) {
        return this.editable && this.editing && this.editing[0] === rowIndex && this.editing[1] === column
      },      

      hasValue(item, column) {
        return item[column.toLowerCase()] !== "undefined";
      },

      itemValue(item, column) {
        return item[column.toLowerCase()];
      },
      
      valueTitle(item, column) {
        let suffix = this.editable ? ' ' + this.$t('titles.edit') : ''
        let value = this.itemValue(item, column)

        if (!value || !(typeof value === 'string' || value instanceof String) || !this.titles) {
          return suffix
        }

        // split because in portfolio card it is in '<statisticName>: <number>' format
        return this.titles[value.split(': ')[0].toLowerCase()] + suffix
      }
    }
  }
</script>
<style>
.interactive {
  cursor: pointer
}
</style>