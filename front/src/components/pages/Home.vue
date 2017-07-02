<template>
  <div id="home">
    <!--<div v-for="proj in projects" :key="proj.id" class="messageBox">Project {{proj.name}} is-->
      <!--<span v-if="!proj.isProtected" >not</span> protected-->
    <!--</div>-->
    <div class="container_50">
        <span> Rejoindre recif.cc/</span>
        <input id="join_recif" class="myInput" type="text" placeholder="nom du récif"  @keyup.enter="joinRecif" v-model="recifName">
        <a class="button_small" @click="joinRecif">></a>
    </div>
    <img class="image_corail" id="corail1" src="../../assets/corail1.svg" />
    <img class="image_corail" id="corail2" src="../../assets/corail2.svg" />
    <img class="image_corail" id="corail3" src="../../assets/corail3.svg" />
    <img src="../../assets/fondmarin.svg" id="fondmarin"/>
  </div>
</template>

<script>
import * as api from 'lib/backendApi';

export default {
    name: 'test',
    data () {
        return {
            projects: [],
            recifName : ""
        }
    },
    mounted() {
        api.getRecifs()
            .then((projs) => {
                if (projs != undefined) {
                    this.projects = projs;
                }
            });
    },
    methods: {
        joinRecif() {
            this.$router.push(this.recifName);
        }
    }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
    h1, h2 {
      font-weight: normal;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: inline-block;
      margin: 0 10px;
    }

    a {
      color: #42b983;
    }
    #home{
      height: 100vh;
      background: #4dbec3;
      z-index: 0;
    }

    .image_corail{
      position: fixed;
      bottom: 0;
      height: 40vh;
      z-index: 2;
    }

    #corail1{
      left: 0;
    }

    #corail2{
      left: 35vw;
    }

    #corail3{
      bottom: 10vh;
      right: 0;
    }

    #fondmarin{
      width: 120vw;
      bottom: 0;
      position: fixed;
      z-index: 1;
      left: -10vw;
    }

    .container_50{
      width: 50%;
      top: 30vh;
      position: relative;
      margin: auto;
        color: white;
    }

    #join_recif{
      width: 50%;
      border-radius: 7px 0px 0px 7px;
        display: inline;
    }
    .button_small{
        padding: 0.97rem;
        margin: 0;
        color: white;
        background: #ed5656;
        position: relative;
        top: 0.1rem;
        left: -0.25rem;
        border-radius: 0 7px 7px 0;
    }

    .button_small:hover{
        background: #ff5c5c;
        cursor: pointer;
    }
</style>
