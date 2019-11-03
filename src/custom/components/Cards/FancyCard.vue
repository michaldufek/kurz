<template>
  <card :class="[ { noDataClass : !statsData.length }, fancyCardClass ]">
    <section v-if="isError">
      <p>{{$t('errorPrefix') + " " + title.toLowerCase() + ". " + $t('errorSuffix')}}</p>
    </section>
    <section v-else>
      <DualRingLoader v-if="loading" :color="'#54f1d2'" :class="[ statsData.length ? dataClass : noDataClass, loaderClass ]"/>
      <div>
        <div v-for="(item, value) in statsData.slice(0, Math.ceil(statsData.length / 2))" style="width:50%; float: left;">
          <p :title="titles[item]">{{item}}: </p><p>{{value | roundToFixed}}</p>
        </div>
        <div v-for="(item, value) in statsData.slice(Math.ceil(statsData.length / 2), statsData.length)" style="width:50%; float: right;">
          <p :title="titles[item]">{{item}}: </p><p>{{value | roundToFixed}}</p>
        </div>
      </div>
    </section>
  </card>
</template>
<script>
import DualRingLoader from '@bit/joshk.vue-spinners-css.dual-ring-loader';

import axios from '@/../node_modules/axios';
import constants from '@/custom/assets/js/constants';


export default {
  name: 'fancy-card',
  components: {
    DualRingLoader
  },
  props: {
    title: {
      type: String,
      description: "Card title"
    },
    apiUrl: {
      type: String,
      description: "URL to API data source"
    },
    items: {
      type: Array,
      default: () => [],
      description: "Performance statistics names"
    },  
    valuesCreator: {
      type: Function,
      default: (responseData) => {
        return new Array(this.items.length)
      },
      description: "How to create items values (of shape [#items]) from response.data"
    },
    titles: {
      type: Object,
      default: () => {},
      description: "Items descriptions"
    }
  },

  data() {
    return {
      error: false,
      loading: false,
      statsData: [],
      // css classes
      dataClass: 'data',      
      noDataClass: 'noData',
      loaderClass: 'loader',
      fancyCardClass: 'fancyCard'
    }
  },

  computed: {
    isError() {
      return !this.statsData.length && this.error
    }
  },

  methods: {
    initData() {
      this.loadData();
        
      setInterval(() => { 
        this.loadData();
      }, constants.dataReloadInterval );
    },

    loadData() {
      this.statsData = []
      this.loading = true
      this.error = false      

      axios
      .get(this.apiUrl)
      .then(response => {
        let itemNr = 0
        
        this.valuesCreator(response.data).forEach(value => {
          let pair = {}         

          // index value by statistic name
          pair[this.items[itemNr]] = value

          this.statsData.push(pair)
          itemNr++
        });
      })
      .catch(error => {
        console.log(error);

        this.error = true
        this.notifyAudio('connectionLost', 'danger', this.$t('notifications.connectionLost') + '(' + this.title + ' card)')
      })
      .finally(() => {
        this.loading = false
      });
    },   

    notifyAudio(audioEl, type, msg) {
      document.getElementById(audioEl).play();

      this.$notify({
        type: type, 
        message: msg
      })
    }
  },

  mounted() {
    this.initData();
  }
};
</script>
<style>
.loader {
  width: 80px; 
  height: 80px; 
  position: absolute;
}

.loader.data {   
  top: 40%; 
  left: 45%;
}

.loader.noData {
  top: 10%; 
  left: 42.5%;    
}

.fancyCard.noData {
  height: 100px;    
}
</style>