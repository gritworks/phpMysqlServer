<template>
<div>
  
  <transition  name="fade" v-on:after-leave="transitionEnd">
    <div v-if="show" class="modal-container">
        <div class="modal">
          <div class="message">{{message}}</div>
           <div class="bar-container">
            <div class="bar">
              <div ref="bar-animate" class="bar-animate"></div>
            </div>
           </div>
        </div>
    </div>
    </transition>
    
  </div>
</template>

<script>

import anime from 'animejs/lib/anime.es.js';

export default {
  name: 'ui-loader',
  props: ['message'],
  data:function(){
    return {
      show:true,
    }
  },
  methods:{
    closing:function(){
      this.show=false;
    },
    transitionEnd:function(){
      this.$emit('cancel');
    },
    animateIn(){
      
      
      this.barAnimate.style.scaleX="0";
      this.barAnimate.style.transformOrigin="left 0";
      anime({
          targets: this.barAnimate,
          scaleX:1,
          duration: 450,
          easing:"easeInOutCirc",
        }).finished.then(()=>{
          this.animateOut();
        })
    },
    animateOut(){
      
      
      this.barAnimate.style.scaleX="1";
      this.barAnimate.style.transformOrigin="right 0";
      anime({
          targets: this.barAnimate,
          scaleX:0,
          duration: 450,
          easing:"easeInOutCirc",
        }).finished.then(()=>{
          setTimeout(()=>{
            this.animateIn();
          },500)
          
        })
    }
  },
  beforeDestroy(){
     this.$off('ui-loader-close',this.closing)
  },
  created(){
    //
    this.show=false;
  },
  mounted:function(){
    
    
    this.$on('ui-loader-close',this.closing)
    this.show=true;

    // to be sure the modal is showing
    this.$nextTick(()=>{
      this.barAnimate=this.$refs['bar-animate'];
      this.animateIn();
    })
    
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
  padding-bottom:15px;
  box-shadow: 4px 4px 12px rgba(0,0,0,.4);
}
.message{
  padding:20px;
}

.bar{
  height:6px;
  background-color:#FFFFFF;
  border:1px solid rgba(0,0,0,.03);
  padding:1px;
  width:90%;
  margin: 0 auto;
}

.bar-animate{
  background-color:#00ccff;
  height:100%;
  width:100%;
  transform:scaleX(.2);
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


</style>
