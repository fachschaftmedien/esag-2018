<template>
    <nav class="navigation elevated bg-standard" role="navigation">
      <div class="mobile-row" @click="mobileActive = !mobileActive">
        <span class="hamburger material-icons" role="button">menu</span>
        <h1 class="mobile-title">Erstsemester-Woche Medien</h1>
      </div>
      <ul :class="'flex-row exotic-font '+(mobileActive ? 'mobile-display' : 'mobile-hidden')" :aria-expanded="mobileActive" role="menubar">
        <li v-for="(section, index) in sections" :key="index" @click="select(index)" :class="(index === scroll.currentIndex) ? 'active' : 'inactive'" role="none">
          <div role="link">{{section}}</div>
        </li>
      </ul>
    </nav>
</template>

<script>
    export default {
      name: "Navigation",
      data(){
        return {
          mobileActive: false
        }
      },
      methods: {
        select(index){
          this.mobileActive = false;
          this.scroll.to(index);
        }
      },
      props:{
        sections: Array,
        scroll: Object
      }
    }
</script>

<style scoped>
  nav.navigation{
    position: fixed;
    width: 100%;
    height: 6vh;
    min-height: 2rem;
    max-height: 3rem;
    z-index: 10;
    padding: 1vh 0;
  }

  nav.navigation>ul{

  }

  nav.navigation li{
    cursor: pointer;
  }

  nav.navigation li.active{
    color: orange;
  }

  .mobile-row{
    width: 98%;
    height: 100%;
    padding: 0 1%;
    display: none;
    flex-direction: row;
    align-items: center;
  }

  .hamburger{
    width: 10%;
  }

  .mobile-title{
    width: 90%;
    text-align: center;
  }

  @media only screen and (max-width: 600px){
    .mobile-row{
      display: flex;
    }

    .mobile-display{
    }

    .mobile-hidden{
    }



    nav ul.flex-row{
      flex-direction: column;
      flex-wrap: nowrap;
      background-color: white;
    }

    .mobile-hidden{
      max-height: 0;
      transition: max-height ease-out .5s;
      overflow: hidden;
    }

    .mobile-display{
      max-height: 100vh;
      transition: max-height ease-in .5s;
    }

    nav ul li{
      overflow: hidden;
      display: block;
      height: auto;
      margin: 3%;
      width: 100%;
      text-align: center;
    }
  }
</style>
