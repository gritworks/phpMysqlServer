<template>
  <div class="container">
  
  
  <div class="input-container">
    <div class="top">
      
      <window title="drop folder in here to serve php from." :scrollable="false">
       
        <div class="dropper-container">
          <input class="dropper-field" @drop="drop">
          <div class="dropper-text">
          <div><b>serving php from path:</b></div>
          <div>{{path}}</div>
          </div>
        </div>
      </window>
      
    </div>
    <div class="bottom">
      <window title="drop folder in here to serve php from." :scrollable="false" >
        <div slot="icons"><span @click="clearlog" class="icon">clr</span></div>
        <div class="logger" ref="log" v-html="log"></div>
      </window>
    </div>
  </div>

  <div class="config-field">
    <window title="preferences" :scrollable="true">
      <service-light :enabled="docker_running" text="docker engine running"></service-light>
      
      <hr>
      <button class="boxshadow full-width green" @click="startServers">start servers</button>
      <button class="boxshadow full-width green" @click="stopServers">stop servers</button>
      <button class="boxshadow full-width danger" @click="removeVolumes">remove volumes</button>
      <hr>
      <button class="boxshadow full-width blue" @click="openPhpmyadminWindow">phpmyadmin</button>
      <button class="boxshadow full-width blue" @click="openSiteWindow">site</button>
      <hr>

      <div class="info">
        Some php extensions require dependencies to load first. eg. the gd
        extension requires 'libpng-dev' as a dependency. A list of extensions is found
        <a href="https://gist.github.com/chronon/95911d21928cff786e306c23e7d1d3f3" target="_blank">here</a>
      </div>

      <div class="titler">php:</div>
      <config-value text="image" prop="php_image"></config-value>
      <config-value text="port" prop="php_port"></config-value>
      <config-value text="post max size" prop="php_post_max_size"></config-value>
      <config-value text="upload max filesize" prop="php_upload_max_filesize"></config-value>
      <config-value text="max execution time" prop="php_max_execution_time"></config-value>
      <config-value text="max input time" prop="php_max_input_time"></config-value>
      <config-value text="memory limit" prop="php_memory_limit"></config-value>
      
      <div class="titler">php extension dependencies:</div>

      <div class="add-input-container"><input class="no-border-right add-input" v-model="extensionDependencyToAdd"><button @click="addExtensionDependency" class="no-border-left">Add</button></div>
      <li class="extension" v-for="(dep,index) in config.php_ext_dep" :key="'dep'+index">
        <div class="extension-name">- {{dep}}</div>
        <div @click="deleteExtensionDependency(index)" class="delete-extension">delete</div>
      </li>


      <div class="titler">php extensions:</div>

      <div class="add-input-container"><input class="no-border-right add-input" v-model="extensionToAdd"><button @click="addExtension" class="no-border-left">Add</button></div>
      <li class="extension" v-for="(extension,index) in config.php_extensions" :key="'ext'+index">
        <div class="extension-name">- {{extension}}</div>
        <div @click="deleteExtension(index)" class="delete-extension">delete</div>
      </li>


      <div class="titler">mysql:</div>
      <config-value text="mysql image" prop="mysql_image"></config-value>
      <config-value text="mysql server" prop="mysql_server"></config-value>
      
      <config-value text="mysql database" prop="mysql_database"></config-value>
      <config-value text="mysql username" prop="mysql_username"></config-value>
      <config-value text="mysql password" prop="mysql_password"></config-value>
      <config-value text="mysql port" prop="mysql_port"></config-value>

      

      

    </window>
  </div>

  
  </div>
</template>

<script>
  import path from 'path' 
  import { mapState } from 'vuex';
  const { exec } = require("child_process");
  const remote = require('electron').remote;
  const base_dir = remote.app.getPath('userData')+"/";
  const fs = require('fs');
  const electron = require('electron')
  import { modalService } from '../services/modal/ModalService.js';
  import ServiceLight from '../components/ServiceLight.vue';
  import ConfigValue from '../components/ConfigValue.vue';
  import Window from '../components/Window.vue';
  const shell = require("electron").shell;

  export default {
    name: 'login-page',
    components: {
      ServiceLight,
      ConfigValue,
      Window
    },
    data:function(){
      return {
        path:"drop folder to set path...",
        path_set:false,
        docker_running:false,
        extensionToAdd:"",
        extensionDependencyToAdd:"",
      }
    },
    computed:{
      ...mapState({
        config: state => state.FileSystem.config,
        log: state => state.FileSystem.log,
      }),
    },
    methods: {
      addExtensionDependency(){
        if(this.extensionDependencyToAdd==""){
          modalService.createAlert("extesion dependency name should not be empty");
          return;
        }
        this.$store.dispatch('add_extension_dependency',this.extensionDependencyToAdd);
        this.extensionDependencyToAdd="";
      },
      deleteExtensionDependency(index){
        modalService.createModal("Are you sure you want to remove this php extension dependency?").then(
          ()=>{
            this.$store.dispatch('delete_extension_dependency',index);
          },
          ()=>{}
        )
      },
      deleteExtension(index){
        modalService.createModal("Are you sure you want to remove this php extension?").then(
          ()=>{
            this.$store.dispatch('delete_extension',index);
          },
          ()=>{}
        )
      },
      addExtension(){
        if(this.extensionToAdd==""){
          modalService.createAlert("extesion name should not be empty");
          return;
        }
        this.$store.dispatch('add_extension',this.extensionToAdd);
        this.extensionToAdd="";
      },
      drop(e){

        this.$store.dispatch('log','** folder dropped **');

        this.path=e.dataTransfer.files[0].path;
        this.path_set=true;

        localStorage.setItem('path', this.path);
        e.preventDefault();
        
      },
      openSiteWindow(){
        shell.openExternal('http://localhost:'+this.config.php_port);
      },
      openPhpmyadminWindow(){
        shell.openExternal('http://localhost:8081');
      },
      clearlog(){
        this.$store.dispatch('clear_log');
      },
      stopServers(){
         this.$store.dispatch('stopServers')
      },
      startServers(){
        if(!this.path_set){
          modalService.createModal("Drop the folder from where to serve content.")
          return;
        }
        // build and save new docker-compose file
        this.$store.dispatch('save_yaml_file',this.path);
        this.$store.dispatch('startServers');

      },
      preventDocumentDrop(){
        document.addEventListener('dragover',function(event){
          event.preventDefault();
          return false;
        },false);

        document.addEventListener('drop',function(event){
          event.preventDefault();
          return false;
        },false);
      },
      removeVolumes(){
        modalService.createModal("Are you sure you want to remove persistent volumes? Data will be lost!").then(
          ()=>{
            this.$store.dispatch('remove_volumes')
          },
          ()=>{}
        )
      },
      save_default_config(){
        this.$store.dispatch('save_user_config_default');
      },
      checkSystem(){
        // check docker running
        this.$store.dispatch('systemCheck').then((result)=>{
          this.docker_running=true;
        });
      },
      load_config(){
        this.$store.dispatch('load_user_config');
      },
      loadStoredPath(){
        // check for last path
        var path=localStorage.getItem('path');
        if(path){
          this.path=path
          this.path_set=true;
        }
      },
    },// methods
    mounted(){
      this.$store.dispatch('log','<div>This tool requires docker to be installed. <a href="https://docs.docker.com/get-docker/" target="_blank">Get docker here</a></div>')
      this.loadStoredPath();
      this.save_default_config();
      this.checkSystem();
      this.load_config();
      this.preventDocumentDrop();
    },
    watch: {
      log: function(newVal, oldVal) {
        // scroll to bottom for log
        this.$nextTick(()=>{
          var log=this.$refs['log'];
          log.scrollTop = log.scrollHeight;
         
        })
        
      }
    }
  }
</script>
<style>
*{
  box-sizing: border-box;
}
body{
  font-size:.8em;
  font-family: sans-serif;
  
}
</style>
<style scoped>

.container{
  display:flex;
  flex-direction:row;
  position:absolute;
  width:100%;
  height:100%;
  top:0;
  left:0;
}

.config-field{
  width:200px;
}
.input-container{
  flex:1;
  display:flex;
  flex-direction: column;
}
.input-container .top{
  flex:3;
}
.input-container .bottom{
  height:150px;
  position:relative;
}
.logger{
  padding:5px 5px;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  color: #444444;
}

.dropper-container{
  position:relative;
  width:100%;
  height:100%;
  cursor:default;
  display:flex;
  justify-content:center;
  align-items:center;
  position:relative;
}
.dropper-text{
  position:absolute;
  pointer-events:none;
}
.dropper-field{
  border:none;
  background-color:transparent;
  width:100%;
  height:100%;
}
button{
  padding:4px;
  margin-bottom:4px;
  border-radius:2px;
  border:1px solid grey;
  background-color:#EEEEEE;
  cursor:pointer;
  outline:none;
}
.boxshadow{
  box-shadow:0 1px 1px rgba(0,0,0,1);
}
.add-input{
  padding:4px;
  margin-bottom:4px;
  border-radius:2px;
  border:1px solid grey;
  outline:none;
  border-right:none;
  flex:1;
}
.add-input-container{
  display:flex;
}
.no-border-right{
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}
.no-border-left{
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.danger{
  background-color:#da3a3a;
  color:#FFFFFF;
}
.green{
  background-color:#3dd43d;
  color:#FFFFFF;
}
.blue{
  background-color:#81acd4;
  color:#FFFFFF;
}
.full-width{
  display:block;
  width:100%;
}
.titler{
  font-weight:bold;
  font-size:.9em;
  margin:10px 0px;
  padding:2px 4px;
  color:#000000;
  background-color:#EEEEEE;
  border-radius:2px;
  display:flex;
  align-items: center;
}
.titler:before{
  content:"";
  width:6px;
  height:6px;
  display:inline-block;
  background-color:#CCCCCC;
  margin-right:4px;
  box-shadow:inset 1px 1px 1px rgba(0,0,0,.25);
  border-radius:3px;
}
.extension{
  display:flex;
  align-items: center;
}
.extension-name{
  flex:1;
}
.delete-extension{
  color:#FFFFFF;
  cursor:pointer;
  background-color:red;
  padding:2px 4px;
  border-radius:10px;
  font-size:.75em;
  font-weight:bold;
}

li{
  list-style-type: none;
  padding:4px;
}
.icon{
  color:#000000;
  cursor:pointer;
  border-radius:2px;
  border:1px solid black;
  padding:0 2px;
  font-size:.75em;
  background-color:rgba(255,255,255,.5);
}
</style>
