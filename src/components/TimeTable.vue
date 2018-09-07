<template>
  <div id="timetable-container">
    <div class="schedule" id="timetable">
      <div class="week-container">
        <div class="header-container">
          <span class="header slim">
            Zeit
          </span>
          <span v-for="(day, name) in schedule.days" :key="name" :class="'header '+(name === currentDay ? 'active' : 'inactive')">
            {{name}}
          </span>
        </div>
        <div class="control-mobile left">
          <button @click="switchDay(-1)">
            <span class="icon material-icons">keyboard_arrow_left</span>
          </button>
        </div>
        <div class="day-container">
          <div class="day slim">
            <div class="time entry" v-for="hour in allHours" :style="'height: '+calculateHeight({start: 0, end: 60})+'%; top: '+calculateTop(nthHourToEntry(hour))+'%'">
              {{nthHourToEntry(hour).start}}
            </div>
          </div>
          <div :class="'day '+(name === currentDay ? 'active' : 'inactive')" v-for="(day, name) in schedule.days" :key="name">
            <div @click="selected=entry" :class="'entry bg-main-color '+(selected.name === entry.name && selected.start === entry.start && selected.end === entry.end ? 'active' : 'inactive')" v-for="entry in day"
                 :style="'top: '+calculateTop(entry)+'%;'+
                 'left: '+ calculateLeft(entry)+'%;'+
                 'width: '+calculateWidth(entry)+'%;'+
                 'height: '+calculateHeight(entry)+'%;'">
              <div class="entry-content">
                <h3 itemprop="name">{{entry.name}}</h3>
              </div>
            </div>
          </div>
        </div>
        <div class="control-mobile right">
          <button @click="switchDay(1)">
            <span class="icon material-icons">keyboard_arrow_right</span>
          </button>
        </div>
        <div class="background-container">
          <div class="background-row" v-for="hour in allHours" :style="'height: '+calculateHeight({start: 0, end: 60})+'%; top: '+calculateTop(nthHourToEntry(hour))+'%'" :key="hour"></div>
        </div>
      </div>
    </div>
    <div class="spacer"></div>
    <br>
    <article v-if="selected">
      <h2 class="small-font">Infos zu {{selected.name || 'ihrer Auswahl'}}</h2>
      <strong class="important" v-if="selected.location">{{selected.location}}</strong>
      <strong class="important" v-if="selected.start || selected.end">von {{selected.start ? (selected.start + (selected.end ? '' : ' Uhr' )) : 'Anfang offen'}} bis {{selected.end ? selected.end + ' Uhr' : 'Ende offen'}} </strong><br>
      {{selected.description || 'keine Beschreibung vorhanden'}}
    </article>
  </div>
</template>

<script>
  import time from "../js/time";
  import rangemap from "../js/rangemap";
  import mod from "../js/mod";

  export default {
    name: "TimeTable",
    props: {
        schedule: Object
    },
    data(){
      return {
        current: 0,
        selected: {}
      }
    },
    computed: {
      startTime(){
        return time.parseTime(this.schedule.start);
      },
      endTime(){
        return time.parseTime(this.schedule.end);
      },
      allHours(){
        const hours = [];
        for(let i = 0; i < Math.ceil((this.endTime - this.startTime) / 60); i++){
          hours.push(i);
        }
        return hours;
      },
      currentDay(){
        return Object.keys(this.schedule.days)[this.current];
      }
    },
    methods: {
      calculateTop(entry){
        const entryStart = time.parseTime(entry.start);
        return rangemap(this.startTime, this.endTime, 0, 100, entryStart);
      },
      calculateHeight(entry){
        const entryStart = !entry.start && entry.start !== 0 ? this.startTime : time.parseTime(entry.start);
        const entryEnd = !entry.end && entry.end !== 0 ? this.endTime : time.parseTime(entry.end);
        return rangemap(0, this.endTime-this.startTime, 0, 100, entryEnd-entryStart);
      },
      calculateWidth(entry){
        if(!entry.hasOwnProperty('order')) return 100;
        else return (100/entry.order[1]);
      },
      calculateLeft(entry){
        if(!entry.hasOwnProperty('order')) return 0;
        else return (100/entry.order[1]) * entry.order[0] - (100/entry.order[1])
      },
      nthHourToEntry(n){
        return {
          start: time.toTime(this.startTime + n*60),
          end: time.toTime(this.startTime + n*60 + 59)
        };
      },
      switchDay(change){
        const days = Object.keys(this.schedule.days);
        this.current = mod(this.current+change,days.length);
      },
      duration(entry){
        if(!entry || !(entry.start && entry.end)) return "";
        const entryStart = !entry.start && entry.start !== 0 ? this.startTime : time.parseTime(entry.start);
        const entryEnd = !entry.end && entry.end !== 0 ? this.endTime : time.parseTime(entry.end);
        const [H,M] = time.toTime(entryEnd - entryStart).split(":");
        return "H"+H+"M"+M;
      }
    }
  }
</script>

<style scoped>

  #timetable-container{
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  #timetable{
    position: relative;
    width: 100%;
    min-height: 100vh;
    height: 100%;
  }

  .week-container{
    height: 100%;
    width: 100%;
  }

  .header-container, .day-container{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }

  .header-container{
    height: 5vh;
    align-items: center;
  }

  .control-mobile{
    position: absolute;
    top: 0;
    width: 10%;
    height: 100%;
    z-index: 5;
    display: none;
    pointer-events: none;
  }

  .control-mobile>button:focus, .control-mobile>button:active{
    outline: none;
  }

  .control-mobile .icon{
    background-color: white;
    border-radius: 50%;
  }

  .control-mobile.left{
    left: 0;
  }

  .control-mobile.right{
    right: 0;
  }

  .control-mobile>button{
    background-color: rgba(255,255,255,0.3);
    border: none;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 4;
  }

  .day-container{
    height: 95vh;
  }

  .header-container>div, .day-container>div{
    width: 100%;
  }

  .day, .header{
    width: 100%;
  }

  .header.slim, .day.slim{
    width: 30%;
    outline: none;
  }

  .header{
    display: inline;
  }

  .day{
    position: relative;
  }

  .entry{
    position: absolute;
    display: inline-block;
    outline: solid white thin;
    cursor: pointer;
  }

  .time{
    outline: none;
    text-align: center;
  }

  .entry-content{
    font-size: 1.7vh;
    padding: 1%;
    width: 98%;
    height: 98%;
    overflow: hidden;
    cursor: pointer;
  }

  .entry:hover{
    background-color: rgb(37, 80, 136);
  }

  .entry.active{
    background-color: rgb(37, 80, 136);
  }

  .entry-content>p{
    font-size: 1.7vh;
    font-weight: lighter;
  }

  .background-container{
    position: absolute;
    top: 5vh;
    z-index: -1;
    width: 90vw;
    height: 95vh;
  }

  .background-container>.background-row:nth-child(2n){
    background-color: rgba(50,50,50,0.1);
  }

  .small-font{
    font-size: 1.1rem;
  }

  @media only screen and (max-width: 800px){
    .day.inactive, .header.inactive{
      display: none;
    }

    .control-mobile{
      pointer-events: auto;
      display: block;
    }
  }
</style>
