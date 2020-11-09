import path from 'path'
import Vue from 'vue';

const remote = require('electron').remote;
//const electron = require('electron');
const app = remote.app;

//console.log(app.getPath('userData'))

//var CryptoJS = require("crypto-js");
const fs = require('fs');

const base_dir = app.getPath('userData')+"/";

const { exec } = require("child_process");


const state = {
  configFilePath:path.join(base_dir, '/user_config.json'),
  log:"",
  // default config file
  config:{
    yml_version:"3.3",
    php_image:"php:7.3-apache",
    php_port:"80",
    php_ext_dep:[],
    php_extensions:['mysqli'],
    php_post_max_size:"50M",
    php_upload_max_filesize:"50M",
    php_max_execution_time:"20",
    php_max_input_time:"60",
    php_memory_limit:"8M",
    mysql_server:"mysql-server",
    mysql_image:"mysql:5.6.47",
    mysql_database:"test",
    mysql_username:"test",
    mysql_password:"test",
    mysql_port:"3306",
  }
}

const mutations = {
  
  ADD_LOG(state,txt){
    
    state.log+=txt
    state.log+="<br>";
  },
  CLEAR_LOG(state){
    state.log="";
  },
  SET_CONFIG_VAL(state,options){
   state.config[options.name]=options.value
  },
  DELETE_EXTENSION(state,index){
    Vue.delete(state.config.php_extensions, index);
  },
  ADD_EXTENSION(state,name){
    state.config.php_extensions.push(name)
  },
  DELETE_EXTENSION_DEPENDENCY(state,index){
    Vue.delete(state.config.php_ext_dep, index);
  },
  ADD_EXTENSION_DEPENDENCY(state,name){
    state.config.php_ext_dep.push(name)
  }
}

const actions = {
  delete_extension_dependency({commit,dispatch},index){
    commit("DELETE_EXTENSION_DEPENDENCY",index);
    dispatch('save_user_config');
    dispatch('save_docker_file');
  },
  add_extension_dependency({commit,dispatch},dep_name){
    commit("ADD_EXTENSION_DEPENDENCY",dep_name);
    dispatch('save_user_config');
    dispatch('save_docker_file');
  },
  delete_extension({commit,dispatch},index){
    commit("DELETE_EXTENSION",index);
    dispatch('save_user_config');
    dispatch('save_docker_file');
  },
  add_extension({commit,dispatch},ext_name){
    commit("ADD_EXTENSION",ext_name);
    dispatch('save_user_config');
    dispatch('save_docker_file');
  },

  systemCheck({dispatch}){
   
    return new Promise((resolve)=>{

    exec("docker version", (error, stdout, stderr) => {
      
      if (error) {
        dispatch('log',error.message);
      return;
      }
      if (stderr) {
        dispatch('log',stderr);
        return;
      }
      if(stdout){
        // if we are here docker should be ready
        dispatch('log',stdout);
        resolve("ok");
      }
      });

    })
    
  },
  set_config_val({commit},options){
    commit("SET_CONFIG_VAL",options);
  },
  log({commit},txt){
    commit('ADD_LOG',txt);
  },
  clear_log({commit}){
    commit('CLEAR_LOG');
  },
  save_user_config_default({state,dispatch}){
    if (!fs.existsSync(state.configFilePath)) {
      dispatch('log','- saving default user config..')
      dispatch('save_user_config');
    }
  },
  load_user_config({state,commit}){
    if (fs.existsSync(state.configFilePath)) {
      var raw= fs.readFileSync(state.configFilePath)
      var json = JSON.parse(raw);
      commit('SET_USER_DATE',json);
    }
  },
  
  save_user_config({state,dispatch}){
    // changing a configValue triggers this
    // saving default user config if not exists
    fs.writeFileSync(state.configFilePath,  JSON.stringify(state.config));
    dispatch("save_php_ini_file");
    dispatch("save_docker_file");
  },
  save_php_ini_file(){
    var ini_file=`
    post_max_size = `+state.config.php_post_max_size+`
    upload_max_filesize = `+state.config.php_upload_max_filesize+`
    max_execution_time = `+state.config.php_max_execution_time+`
    max_input_time = `+state.config.php_max_input_time+`
    memory_limit = `+state.config.php_memory_limit+`
    `;
    
    const file = path.join(base_dir, '/custom.php.ini')
    fs.writeFileSync(file,  ini_file);
  },
  save_docker_file({state}){
    var dockerfile='FROM '+state.config.php_image+'\n';

    if(state.config.php_ext_dep.length){
      dockerfile+="RUN apt-get update -y && apt-get install -y ";
    }
    
    state.config.php_ext_dep.forEach(ext_dep=>{
    dockerfile+=ext_dep+" ";
    });
    if(state.config.php_ext_dep.length){
      dockerfile+="\n";
    }

    state.config.php_extensions.forEach(extension=>{
    dockerfile+="RUN docker-php-ext-install "+extension+"\n";
    dockerfile+="RUN docker-php-ext-enable "+extension+"\n";
    })

    const dockerFile = path.join(base_dir, '/dockerfile')
    fs.writeFileSync(dockerFile,  dockerfile);

  },
  save_yaml_file({state,dispatch},folder){

    // create dockerfile for php image
    dispatch("save_php_ini_file");
    dispatch("save_docker_file");


    // create yaml file for docker compose
    var yml=`
version: '`+state.config.yml_version+`'
services:
  php:
    build: .
    container_name: damp-php
    ports:
      - '`+state.config.php_port+`:80'
    volumes:
      - type: 'bind'
        source: `+folder+`
        target: /var/www/html
      - ./custom.php.ini://usr/local/etc/php/conf.d/custom.php.ini
    networks:
      - code-network
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: damp-phpmyadmin
    environment:
      - UPLOAD_LIMIT=120M
      - PMA_HOST=`+state.config.mysql_server+`
      - MYSQL_USER=`+state.config.mysql_username+`
      - MYSQL_PASSWORD=`+state.config.mysql_password+`
    restart: always
    ports:
      - 8081:80
    volumes:
      - ./damp-phpmyadmin-volume:/var/lib/phpmyadmin
    networks:
      - code-network
  #mysql-server:
  `+state.config.mysql_server+`:
    image: "`+state.config.mysql_image+`"
    container_name: damp-mysql-server
    restart: always
    environment:
      MYSQL_DATABASE: '`+state.config.mysql_database+`'
      # So you don't have to use root, but you can if you like
      MYSQL_USER: '`+state.config.mysql_username+`'
      # You can use whatever password you like
      MYSQL_PASSWORD: '`+state.config.mysql_password+`'
      # Password for root access
      MYSQL_ROOT_PASSWORD: 'xnot'
    ports:
      # <Port exposed> : < MySQL Port running inside container>
      - `+state.config.mysql_port+`:3306
    expose:
      # Opens port 3306 on the container
      - `+state.config.mysql_port+`
    networks:
      - code-network
      # Where our data will be persisted
    volumes:
      - damp-mysql-volume:/var/lib/mysql
# Names our volume
volumes:
  damp-mysql-volume:
  damp-phpmyadmin-volume:

#networks
networks:
  code-network:
    driver: bridge
`   
    const dockerComposeFile = path.join(base_dir, '/docker-compose.yml')
    
    fs.writeFileSync(dockerComposeFile,  yml);
    
    dispatch('log','- yaml file saved')
  },
  stopServers({dispatch}){

    dispatch('log','- stopping and removing containers');

    var pathToAsset= base_dir.replace(" ", "\\ ")
    dispatch("exec_command","cd "+pathToAsset+" && docker-compose down");
    
  },
  startServers({dispatch}){
    dispatch('log','- starting servers, pulling the php image could take a minute..')
    var pathToAsset = path.join(base_dir, '/');
    var pathToAsset= base_dir.replace(" ", "\\ ");
    dispatch("exec_command","cd "+pathToAsset+" && docker-compose up -d --build");
   
  },
  remove_volumes({dispatch}){
    dispatch('log','- removing volumes')
    var pathToAsset= base_dir.replace(" ", "\\ ");
    dispatch("exec_command","cd "+pathToAsset+" && docker-compose down -v");
  },
  exec_command({dispatch},command){
    var command = exec(command);
    command.on('close',(code)=>{
        dispatch('log','- error code: '+code)
      })
      command.stderr.on('data',(data)=>{
        dispatch('log','- '+data)
      })
      command.stdout.on('data',(data)=>{
        dispatch('log','- '+data)
      })
  }

}

export default {
  state,
  mutations,
  actions
}
