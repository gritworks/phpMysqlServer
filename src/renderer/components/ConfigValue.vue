<template>
  
   <div class="config-prop">
     <div>{{text}}</div>
     <input @input="changed" v-model="inputData">
  </div>
</template>

<script>

import { mapState } from 'vuex'


export default {
  name: 'prop-value',
  props:{
    text:{default:"no text set"},
    prop:{default:"no prop set"},
  },
  data () {
    return {
      //inputData:this.prop
    }
  },
  computed: {
    ...mapState({
      config: state => state.FileSystem.config,
    }),
    inputData: {
      get () {
        return this.config[this.prop];
      },
      set (value) {
        this.$store.dispatch('set_config_val', {"name":this.prop,"value":value})
      }
    }
  },
  methods:{
   changed(){
     this.$store.dispatch('save_user_config');
   }
  },
  
  mounted: function () {
     
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.config-prop{
  font-size:.75em;
  display:flex;
  border-bottom:1px solid #EEEEEE;
  align-items: center;
}
.config-prop *{
  flex:1;
}
</style>
