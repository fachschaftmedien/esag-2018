<template>
    <header class="headline-container">
      <flat-surface-shader role="presentation" class="shader" id="front-shader"
                           type="webgl"
                           :light="{ambient: '#3709a9', diffuse: '#54b8ff', draw: true, autopilot: false, speed: calculatedSpeed, number: calculatedLightNumber, minLimit: 2, maxLimit: null}"
                           :mesh="{depth: 5, segments: 10, slices: 8, width: 1.2, height: 1.2, speed: 0.0007, ambient: '#292929', diffuse: '#838383'}">
      </flat-surface-shader>
      <img src="../assets/ersti_front_wide.webp" class="front" alt="ESAG 2018" onerror="this.onerror=null;this.src='./resources/ersti_front_wide.png';console.log('fallback to '+this.src);" :style="'pointer-events: none;'+(isEdge ? 'background-color: rgb(25, 44, 87)' : '')">
    </header>
</template>

<script>
    export default {
        name: "Start",
        data(){
          return {
            calculatedSpeed: 2,
            calculatedLightNumber: 2,
            isEdge: window.navigator.userAgent.indexOf('Edge') >= 0
          }
        },
        mounted(){
          window.addEventListener('load', function () {
            window.dispatchEvent(new Event('resize'))
          });
          window.addEventListener('resize', () => {
            this.calculatedSpeed = 0.0001 * Math.pow(1000, Math.min(window.innerWidth / 800, 1));
            this.calculatedLightNumber = window.innerWidth < 800 ? 1: 2
          })
        }
    }
</script>

<style scoped>
  .headline-container{
    position: relative;
    padding-top: 5vh;
    width: 100%;
    height: 100%;
    background-color: white;
    clip-path: polygon(94% 0.1%, 94% 100%, 6% 100%, 6% 0.1%);
  }

  .front{
    position: relative;
    width: 90%;
    left: 5%;
    height: auto;
    max-height: 90vh;
    pointer-events: none;
    object-fit: contain;
    box-shadow: 0 0 0 100vh white;
    z-index: 0;
  }

  .shader {
    position: absolute;
    z-index: -1;
    height: 99%;
    width: 100%;
  }

  .shader>canvas{
    background-color: #3709a9;
  }
</style>
