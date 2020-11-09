<template>
<div>
  
  <transition  name="fade" v-on:after-leave="transitionEnd">
    <div v-if="show" class="modal-container">
        <div class="modal">
          <div class="message">{{message}}</div>
          <input type="text" v-model="input">
            <div class="button-container">
              
              <div class="button button-ok" v-on:click.stop="closing()">ok</div>
              <div class="center-space"></div>
              
            </div>
        </div>
    </div>
    </transition>
    
  </div>
</template>

<script>
export default {
  name: 'ui-input',
  props: ['message'],
  data:function(){
    return {
      show:false,
      input:""
    }
  },
  methods:{
    closing:function(){
      this.show=false;
    },
    transitionEnd:function(){
      this.$emit(this.input);
    }
  },
  mounted:function(){
    this.show=true;
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal-container{
  color:#707070;
  z-index:900000;
  position:fixed;
  background-color:rgba(0,0,0,.3);
  display:flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform:scale(1);
}
.modal{
  border-radius:4px;
  min-width:280px;
  width:50%;
  text-align:center;
  min-width:280px;
  position:relative;
  background-color:#FFFFFF;
  border:1px solid #EEEEEE;
  display:flex;
  flex-direction:column;
  box-shadow: 4px 4px 12px rgba(0,0,0,.4);
}
.message{
  padding:20px;
}
.button-container{
  border-top:1px solid #EEEEEE;
  display:flex;
  flex-direction:row;
}
.center-space{
  flex:1 1 auto;
  border-left:1px solid #EEEEEE;
 
  
}
.button{
  
  padding:5px;
  flex:0 0 auto;
  min-width:100px;
  cursor:pointer;
  text-align:center;

}

.button-ok{
  color:#00ccff;
}

/* fade modal background */
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

/* scale modal */
.fade-enter-active .modal, .fade-leave-active .modal {
  transition: transform .5s;
  transform:scale(1);
}
.fade-enter .modal, .fade-leave-to .modal{
  transform:scale(1.35);
}
input{
  margin:10px;
  box-shadow: 2px 2px 4px rgba(0,0,0,.15) inset;
  border:1px solid #CCCCCC;
}

</style>
