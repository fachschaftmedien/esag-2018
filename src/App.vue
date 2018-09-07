<template>
  <v-container id="app">
    <navigation :sections="Object.values(components).map(c => c.name)" :scroll="scroll"></navigation>
    <div class="spacer"></div>
    <front></front>
    <page-section v-for="(component, name) in components" :key="name" :id="name">
      <template slot="content">
        <component :is="component" :scroll="scroll"></component>
      </template>
    </page-section>
  </v-container>
</template>

<script>
import front from './components/Front'
import intro from './components/Intro'
import schedule from './components/Schedule'
import evaluation from './components/Evaluation'
import navigation from './components/Navigation'
import social from './components/Social'
import impressum from './components/Impressum'
import pageSection from './components/PageSection'
import Scroll from './js/scroll.js'

const components = {
  intro,
  schedule,
  social,
  evaluation,
  impressum
};


export default {
  name: 'App',
  components: {
    pageSection,
    navigation,
    front,
    ...components,
  },
  data(){
    return {
      components,
      scroll: {}
    }
  },
  methods: {

  },
  mounted(){
    this.scroll = new Scroll(Object.keys(this.components).map(c => document.getElementById(c)));
  },
  beforeDestroy(){
    this.scroll.clear();
  }
}
</script>

<style>
  html, body{
    overflow-x: hidden;
  }

  *{
    margin: 0;
    padding: 0;
    background-color: transparent;
  }

  #app {
    font-family: 'Overpass', Helvetica, Arial, sans-serif;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    background-color: white;
  }

  h1, h2, a{
    font-family: 'Bad Script', Arial, sans-serif;
    color: rgb(25, 44, 87);
  }

  a{
    font-family: 'Roboto', sans-serif;
  }

  canvas{
    background: rgb(25, 44, 87);
  }

  nav :focus, nav :active, nav .active, nav ::selection{
    outline: none !important;
  }

  nav a{
    font-family: 'Bad Script', Arial, sans-serif;
  }

  .exotic-font{
    font-family: 'Bad Script', Arial, sans-serif;
  }

  article{
    line-height: 2.5rem;
    font-size: 1.2rem;
    color: rgba(50,50,50,0.75);
  }

  input[type=text], button{
    border: none;
  }

  .spacer{
    display: block;
    width: 100%;
    height: 5vh;
  }

  .elevated{
    box-shadow: 0 0 30px rgba(50,50,50,0.1);
  }

  .main-color{
    color: rgb(25, 44, 87);
    border-color: rgb(25, 44, 87);
  }

  .bg-main-color{
    background-color: rgb(25, 44, 87);
    color: white;
  }

  .bg-standard{
    background-color: white;
  }

  ul{
    list-style: none;
  }

  .flex-row{
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-evenly;
  }

  .on-view h1{
    color: rgb(25, 44, 87);
    transition: color 1s ease;
  }

  .off-view h1{
    color: rgba(61, 113, 200, 0.53);
  }
</style>
