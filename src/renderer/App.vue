<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

  var CryptoJS = require("crypto-js");
  const fs = require('fs');
  //import SystemInformation from './LandingPage/SystemInformation'
  const { BrowserWindow } = require('electron').remote
  const app = require('electron').remote.app;
  const {shell} = require('electron');
  import path from 'path'

  export default {
    name: 'app',
    components: {

    },
    data:function(){
      return {
      }
    },
    methods: {
    },
    destroyed(){
      
    },
    mounted(){
      
      this.$electron.ipcRenderer.on('navigate', (e, routePath) => {
        this.$router.push(routePath)
      })
   
    }
  }
</script>

<style>
  /* CSS */
  hr{
    border:none;
    border-top:1px dashed lightslategray;
  }
  input{
    outline:none;
  }
</style>
