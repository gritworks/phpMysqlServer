
import Modal from './UiModal.vue'
import Input from './UiInput.vue'
import Alert from './UiAlert.vue'
import Loader from './UiLoader.vue'
import Vue from 'vue';


class ModalService{
  constructor(){
    this.vueInstance=null;
  }

  createModal(message){
    if (this.vueInstance){
      //console.log("modal or dialog is still open..");
      return
    }
    
    return new Promise((resolve, reject)=>{
      this.renderModal(resolve,reject,message);
    })
  }

  createInput(message){
    if (this.vueInstance){
      //console.log("modal or dialog is still open..");
      return
    }
    
    return new Promise((resolve, reject)=>{
      this.renderInput(resolve,reject,message);
    })
  }

  createAlert(message){
    if (this.vueInstance){
      //console.log("modal or dialog is still open..");
      return
    }
    return new Promise((resolve, reject)=>{
      this.renderAlert(resolve,reject,message);
    })
  }

  createLoader(message){
    if (this.vueInstance){
      //console.log("loader is still open..");
      return
    }
    return this.renderLoader(message);
  }

  // creating new modal with ok and cancel button
  renderModal(resolve,reject,message){

    
    this.vueInstance= new Vue({
      render: h => h( Modal,{
        props:{
          message:message
        },
        on:{
          ok:() => { this.ok(resolve)},
          cancel:()=>{ this.cancel(reject) }
        }
      })
    }).$mount();
    document.body.appendChild(this.vueInstance.$el);
  }

  // creating new loader alert
  renderAlert(resolve,reject,message){

      this.vueInstance= new Vue({
        render: h => h( Alert,{
          props:{
            message:message
          },
          on:{
            ok:() => { this.ok(resolve)},
            cancel:()=>{ this.cancel(reject) }
          }
        })
      }).$mount();
      document.body.appendChild(this.vueInstance.$el);

  }

  renderInput(resolve,reject,message){

    this.vueInstance= new Vue({
      render: h => h( Input,{
        props:{
          message:message
        },
        on:{
          ok:() => { this.ok(resolve)},
          //cancel:()=>{ this.cancel(reject) }
        }
      })
    }).$mount();
    document.body.appendChild(this.vueInstance.$el);

}

  // creating new alert with ok  button
  renderLoader(message){
    this.vueInstance= new Vue({
      render: h => h( Loader,{
        props:{
          message:message
        },
        on:{
          cancel:()=>{ this.destroyInstance() }
        }
      })
    }).$mount();
    document.body.appendChild(this.vueInstance.$el);
    
    // close loader from instance
    this.vueInstance.close=function(){
      this.$children[0].closing(null);
    }

    return this.vueInstance;
  }



  // ok button clicked
  ok(resolve){
    this.destroyInstance();
    resolve();
  }

  // cancel button clicked
  cancel(reject){
   this.destroyInstance();
    reject();
  }

  destroyInstance(){
    document.body.removeChild(this.vueInstance.$el);
    this.vueInstance=null;
  }

}

// exporting 'singleton' here
export let modalService = new ModalService();