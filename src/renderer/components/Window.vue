<template>
  
   <div class="window">
     <div class="bar">{{title}}
       <div class="icons"><slot name="icons"></slot></div>
     </div>
     <div class="content" :class="{scroll : scrollable}">
       <slot></slot>
     </div>
  </div>
</template>

<script>

import { mapState } from 'vuex'


export default {
  name: 'window',
  props:{
    title:{default:"no text set"},
    scrollable:{default:false},
    content:{default:""},
  },
  data () {
    return {
      //inputData:this.prop
    }
  },
  computed: {
    ...mapState({
    }),
    
  },
  methods:{
   
  },
  
  mounted: function () {
     
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.window{
  width:100%;
  font-size:.75em;
  display:flex;
  flex-direction: column;
  height:100%;
  border:1px solid #DDDDDD;
  overflow:hidden;
}
.bar{
  border:1px solid #BBBBBB;
  padding:2px;
  width:100%;
  background: rgb(119,119,119);
  background: linear-gradient(270deg, rgba(204,204,204,1) 0%, rgba(238,238,238,1) 100%);
  display:flex;
  align-items: center;
  box-shadow:0 2px 4px rgba(0,0,0,.15);
  white-space:nowrap;
}
.bar:before{
  content:"";
  width:10px;
  height:10px;
  display:inline-block;
  background-color:#CCCCCC;
  margin-right:2px;
  box-shadow:inset 1px 1px 1px rgba(0,0,0,.35);
  display:flex;
  border-radius:2px;
}
.content{
  position:relative;
  padding:2px;
  flex:1;
}
.scroll{
  overflow:hidden;
  overflow-y:scroll;
}
.icons{
  flex:1;
  text-align:right;
}
</style>
