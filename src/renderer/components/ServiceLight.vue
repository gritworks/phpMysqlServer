<template>
  <div class="container-light">
    <div class="light" :class="{on : enabled}">
    </div>
    <div class="text">{{text}}</div>
    
  </div>
</template>

<script>

import { mapState } from 'vuex'


export default {
  name: 'service-light',
  props:{
    enabled:{default:false},
    text:{default:"text not set.."}
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState([
    ]),
  },
  methods:{
   
  },
  
  mounted: function () {
     
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.container-light{
 font-size:.9em;
  display:flex;
  align-items: center;
  border-bottom:1px solid #EEEEEE;
  padding:2px;
  font-weight:bold;
}
.on{
  background-color:#1dd10c!important;
}

.light{
  position:relative;
  width:10px;
  height:10px;
  background-color:#FF0000;
  border-radius:5px;
  box-shadow:inset 0px 0px 5px rgba(0,0,0,.9);
}
.light:after{
  content:"";
  position:absolute;
  top:30%;
  right:30%;
  width:2px;
  height:2px;
  background-color:rgba(255,255,255,.6);
  border-radius:2px;
}
.text{
  padding:2px;
  padding-left:5px;
  flex:1;
}
</style>
