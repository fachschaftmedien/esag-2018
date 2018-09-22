<template>
    <div id="search-container" :style="active ? 'display: block' : 'display: none'">
      <div class="background-overlay" @click="toggle(false)">

      </div>
      <v-container class="search-form elevated">
        <div class="close" @click="toggle(false)">
          x
        </div>
        <header>
          <h2> Einstellungen <i class="material-icons">search</i> </h2>
        </header>
        <br class="spacer">
        <section>
          <label> Sprachsteuerung </label>
          <span class="spacer"></span>
          <div class="fieldset row">
            <v-switch v-model="voice" color="indigo" value label="Aktiviere Spracherkennung u. -steuerung (ähnlich zu Siri oder Alexa)" @change="toggleVoice()"></v-switch>
          </div>
          <span class="spacer"></span>
          <div class="fieldset row">
            <v-switch v-model="notifications" color="indigo" value label="erlaube Ergebnisaus- bzw. Wiedergabe der Spracherkennung über Notifications" @change="toggleNotifications()"></v-switch>
          </div>
        </section>
        <section v-if="!supportsSpeech || !online">
          {{supportsSpeech ? '' : 'Spracherkennung wird zur Zeit nur in Chrome unterstützt'}}
          {{online ? '' : 'Spracherkennung im Offlinemodus nicht möglich'}}
        </section>
      </v-container>
    </div>
</template>

<script>
    import Speech from '../js/speech.js'

    export default {
        name: "Search",
        props: {
          active: {
            type: Boolean,
            default: false
          },
          scroll: Object
        },
        data(){
          return {
            notifications: false,
            voice: false,
            stream: null,
            bot: null,
            online: window.navigator.onLine !== false,
            supportsSpeech: window.annyang !== null
          }
        },
        methods: {
          toggle(value){
            if(!value && value !== false) value = !this.active;
            this.$emit('search', value);
          },
          persist(){
            window.localStorage.setItem('settings',JSON.stringify({notifications: this.notifications, voice: this.voice}));
          },
          toggleNotifications(){
            this.persist();
            if(this.notifications){
              this.initNotifications();
              if(this.bot) this.bot.stop();
              if(this.voice) this.bot = new Speech(this.scroll, this.notifications);
            }
            if(!this.voice && this.notifications){
              this.voice = true;
              this.toggleVoice();
            }
          },
          toggleVoice(){
            this.persist();
            if(this.voice){
              this.initVoice();
            }else{
              this.closeStream();
            }
          },
          closeStream(){
            if(this.stream){
              this.stream.getTracks().forEach(track => track.stop());
              this.stream = null;
            }
            if(this.bot){
              this.bot.stop();
              this.bot = null;
            }
          },
          initVoice(){
            this.injectVoiceScripts();
            window.navigator.mediaDevices.getUserMedia({audio: true, video: false})
              .then(async (stream) => {
                this.stream = stream;
                if(this.bot) this.bot.stop();
                this.bot = new Speech(this.scroll, this.notifications);
              })
              .catch((err) => {
                this.voice = false;
                console.error(err);
                this.persist();
              });
          },
          injectScript(id, url){
            if(!document.getElementById(id)){
              const script = document.createElement('script');
              script.async = true;
              script.src = url;
              script.id = id;
              document.head.appendChild(script);
            }
          },
          injectVoiceScripts(){
            this.injectScript('adapter','https://cdnjs.cloudflare.com/ajax/libs/webrtc-adapter/6.4.0/adapter.min.js');
            this.injectScript('annyang','https://cdnjs.cloudflare.com/ajax/libs/annyang/2.6.1/annyang.min.js');
          },
          injectNotificationScripts(){
            this.injectScript('notify','https://cdnjs.cloudflare.com/ajax/libs/HTML5Notification/3.0.0/Notification.min.js');
          },
          initNotifications(){
            this.injectNotificationScripts();
            window.Notification.requestPermission()
              .then((result) => {
                if(result === 'denied') throw new Error('denied notifications');
              })
              .catch((err) => {
                this.notifications = false;
                console.error(err);
                this.persist();
              });
          },
          toggleOnline(isOnline){
            this.online = isOnline;
          }
        },
        created(){
          let saved = window.localStorage.getItem('settings');
          if(saved) saved = JSON.parse(saved);
          if(saved){
            this.voice = saved.voice || false;
            if(this.voice) this.initVoice();
            this.notifications = saved.notifications || false;
            if(this.notifications) this.initNotifications();
          }
          window.addEventListener('online', this.toggleOnline.bind(this,true));
          window.addEventListener('offline', this.toggleOnline.bind(this,false))
        },
        destroyed(){
          window.removeEventListener('online', this.toggleOnline.bind(this,true));
          window.removeEventListener('offline', this.toggleOnline.bind(this,false))
        }
    }
</script>

<style scoped>
  #search-container{
    width: 100vw;
    height: 100vh;
  }

  .close{
    position: absolute;
    width: 2rem;
    height: 2rem;
    right: 1rem;
    top: 1rem;
    text-align: center;
    font-weight: bold;
    user-select: none;
    color: grey;
  }

  .background-overlay{
    z-index: 10;
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(50,50,50,0.3);
  }

  .search-form{
    z-index: 11;
    position: fixed;
    top: 5vh;
    left: 5vw;
    padding: 5vh 5vw;
    width: 80vw;
    height: 80vh;
    background-color: white;


  }


</style>
