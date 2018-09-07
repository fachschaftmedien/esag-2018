<template>
    <div id="evaluation-container" role="region" aria-labelledby="evaluation-headline">
      <h1 id="evaluation-headline">
        Feedback
      </h1>
      <article>
        Wenn die Ersti-Woche bereits fortgeschritten,
        oder vorbei ist wären wir über Informationen von euch zu euren Eindrücken zur Erstiwoche sehr interessiert.
        Wie fandet ihr es insgesamt? Was war gut, was wahr schlecht?
        Eure Meinung ist gefragt und übrigens auch sehr wichtig
        (da die Befragungsergebnisse immer in die nächste Ersti-Wochen-Planung einfließen)
      </article>
      <div class="spacer"></div>
      <div class="questions">
        <div class="group">
          <v-label for="course-selection-group">In welchem Studiengang studierst du jetzt? *</v-label>
          <v-radio-group v-model="course" required id="course-selection-group">
            <v-radio :label="item" v-for="item in courses" :key="item" :value="item"></v-radio>
          </v-radio-group>
        </div>
        <div class="group">
          <v-label for="rating-group">Wie würdest du die Ersti-Woche bewerten? *</v-label>
          <v-rating id="rating-group" v-model="rating" large length=3 color="rgb(25, 44, 87)"></v-rating>
        </div>
        <div class="group">
          <v-text-field label="Was hat dir gut gefallen?" counter="900" v-model="good" @focus="stopScroll()" @blur="startScroll"/>
        </div>
        <div class="group">
          <v-text-field label="Was hat dir nicht gefallen?" counter="900" v-model="bad" @focus="stopScroll()" @blur="startScroll"/>
        </div>
        <div class="group">
          <v-btn id="send" @click="send()">Senden</v-btn>
        </div>
        <div class="group result" id="result-container" :style="'color: ' + (error ? 'red' : 'green')">

        </div>
      </div>
    </div>
</template>

<script>
  export default {
    name: "Feedback",
    props: {
      scroll: Object
    },
    data(){
      return {
        courses: ["BMI (Medieninformatik)","BMT (Medientechnik)","TUB (Ton & Bild)"],
        rating: 0,
        course: 0,
        good: "",
        bad: "",
        error: false
      }
    },
    methods: {
      stopScroll(){
        this.scroll.pauseScrollTo(true);
      },
      startScroll(){
        this.scroll.pauseScrollTo(false);
      },
      clear(){
        document.getElementById('result-container').innerText = "";
        this.course = "";
        this.good = "";
        this.bad = "";
        this.rating = 0;
        this.error = false;
      },
      send(){
        const resultContainer = document.getElementById('result-container');
        resultContainer.innerText = "sende Daten...";
        fetch(window.location.origin+'/evaluation/save.php', {
          method: "POST",
          body: JSON.stringify({
            course: this.course,
            good: this.good,
            bad: this.bad,
            rating: this.rating
          })
        })
          .then(res => {
            this.error = !res.ok;
            return res.text();
          })
          .then(text => resultContainer.innerText = text)
          .then(() => this.error ? 0 : this.clear());
      }
    }
  }
</script>

<style scoped>
  #evaluation-container{
    min-height: 100vh;
    width: 90vw;
    padding: 5vw;
    height: 100%;
  }

  button#send{
    background-color: rgb(25, 44, 87);
    color: white;
  }
</style>
