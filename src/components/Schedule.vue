<template>
  <div id="schedule-container" role="region" aria-labelledby="schedule-headline">
    <h1 id="schedule-headline">Zeitplan</h1>
    <article>
      Hier seht ihr schonmal, was alles in der Erstsemester-Woche so ansteht.
      Wie erwähnt, findet die Ersti-Woche vom <strong class="important">{{schedule.startDate}} bis zum {{schedule.endDate}}</strong> statt,
      <strong class="important">erst in der folgenden Woche beginnen die regulären Vorlesungen.</strong>
      Wir versuchen grob, jeden Tag zu studentenfreundlichen Zeiten starten,
      daher geht es frühestens um {{schedule.start}} Uhr los. Ihr könnt auf die einzelnen Veranstaltungen klicken,
      um mehr Details zu erfahren (Beschreibung unter dem Zeitplan), wir haben den Zeitplan aber auch als Google-Kalender bzw. zum abspeichern.
      (Auf dem Handy können nicht alle Tage gleichzeitig angezeigt werden, daher müsst ihr ggf. über die Buttons den Tag wechseln)
    </article>
    <div class="spacer" style="height: 2vh;"></div>
    <time-table :schedule="schedule"></time-table>
    <a :href="iCal">Zeitplan als ICS-Datei</a> &nbsp;&nbsp;&nbsp;
    <a :href="googleCal">{{googleCal}}</a>
  </div>
</template>

<script>
  export default {
    name: "Zeitplan",
    components: {
      // big component, causes big bundle, async import splits this into another js,
      // reducing initial page loading time
      TimeTable: () => import('./TimeTable.vue')
    },
    data(){
      return {
        googleCal: 'http://s.fachschaftmedien.de/calendar',
        iCal: '/resources/calendar.ics',
        schedule: {
          startDate: '24.09',
          endDate: '27.09',
          start: "09:00",
          end: "24:00",
          // preview content: displayed while actual times not loaded
          days: {
            "Montag": [
              {start: "09:00", end: "23:59", name: "Tag 1"},
            ],
            "Dienstag": [
              {start: "10:00", end: "23:59", name: "Tag 2"},
            ],
            "Mittwoch": [
              {start: "10:00", end: "23:59", name: "Tag 3"},
            ],
            "Donnerstag": [
              {start: "14:00", end: "23:59", name: "Tag 4"},
            ]
          }
        }
      }
    },
    created(){
      // get the actual calendar events and display them
      fetch(window.location.origin+'/resources/calendar.json')
        .then(res => res.json())
        .then(data => this.schedule = data)
        .catch(console.error);
    }
  }
</script>

<style scoped>
  #schedule-container{
    min-height: 100vh;
    width: 90vw;
    padding: 5vw;
    height: 100%;
  }

</style>
