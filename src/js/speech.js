import annyang from 'annyang'

export default class Speech{
  constructor(scroll, notify = false){
    fetch('/resources/jokes.json').then(res => res.json())
      .then(jokes => this.jokes = jokes).then(jokes => localStorage.setItem('jokes', JSON.stringify(jokes)))
      .catch(() => this.jokes = JSON.parse(localStorage.getItem('jokes')) || []);
    this.scroll = scroll;
    this.notify = notify;
    this.a = annyang;
    this.a.setLanguage('de-DE');
    this.a.addCommands({
      "debug an": () => this.a.debug(true),
      "debug aus": () => this.a.debug(false),
      "Hallo": () => this.speak("Hallo!"),
      "Kopf oder Zahl": () => this.speak(this.randomPick(['Kopf', 'Zahl'])),
      "(nenn mir) (eine) Zahl zwischen :low und :high": (low, high) => this.speak(Math.floor(Math.random()*(~~high - ~~low + 1) + ~~low)),
      "(ich) suche nach *wort": (query) => this.search(query),
      "(hey Alexa) spiel despacito": () => this.goto("https://www.youtube.com/watch?v=kJQP7kiw5Fk"),
      "(hey Alexa) play despacito": () => this.goto("https://www.youtube.com/watch?v=kJQP7kiw5Fk"),
      "Allahu akbar": () => this.goto("https://www.youtube.com/watch?v=aCUAXVueCbk"),
      "sage :wort": (wort) => this.speak(wort),
      "(Seite) ganz nach oben": () => this.scroll.scrollToPageTop(),
      "(Seite) ganz nach unten": () => this.scroll.scrollToPageBottom(),
      "(Seite) zum Anfang": () => this.scroll.first(),
      "(Seite) nach oben": () => this.scroll.prev(),
      "(Seite) nach unten": () => this.scroll.next(),
      "(Seite) zum Ende": () => this.scroll.last(),
      "(Seite) nächster Abschnitt": () => this.scroll.next(),
      "(Seite) weiter": () => this.scroll.next(),
      "(Seite) zurück": () => this.scroll.prev(),
      "(Seite) vorheriger Abschnitt": () => this.scroll.prev(),
      "buchstabiere :wort": (wort) => this.spell(wort),
      "erzähl (mir) einen Witz": () => this.speak(this.randomPick(this.jokes)),
      "(Oh) magische Miesmuschel *frage": () => this.speak(this.randomPick(['Ja','Definitiv','Vielleicht','Nein','Auf gar keinen Fall'])),
      "Stein Schere Papier": () => this.speak(this.randomPick(['Stein','Schere','Papier'])),
      "Wo findet :event statt": (event) => this.speak(this.schedule({event}).location),
      "Wann findet :event statt": (event) => this.speak(this.schedule({event}).start),
      "Was ist (der)(die)(das) :event": (event) => this.speak(this.schedule({event}).description),
      "Was findet am :day um :time statt": (day, time) => this.speak(this.schedule({day, time}).name),
      "Was findet am :day statt": (day) => this.speak(this.schedule({day})),
      "JBS": () => this.speak('Jay B S is love, Jay B S is life','en-US'),
      "GPS": () => this.speak('Jay B S is love, Jay B S is life','en-US'),
      "Marco": () => this.speak('Polo'),
      "Ich liebe dich": () => this.speak('Ha, gay!!!','en-US'),
      "Wie geht es dir": () => this.speak('Ich kann nicht klagen, das wurde nicht vorgesehen'),
      "Was ist die Fachschaft": () => this.speak('Jeder Student eines Fachbereichs. Der Fachschaftsrat sind die gewählten Vertreter, der Fachschaftsraum der Sitz des Rates'),
      "Dahm": () => this.speak("Hätten sie in MCI besser aufgepasst, wüssten sie, warum das hier für Usability und Accessibility eine schlechte Idee ist"),
      "Gesundheit": () => this.speak("Ich hab mir wohl einen Virus eingefangen"),
      "zeig mir Katzen": () => this.goto('https://www.youtube.com/watch?v=8ZkOf4iaP8c'),
      "ich habe Hunger": () => this.goto('https://www.google.de/maps/search/Restaurant'),
      "ich habe Durst": () => this.goto('https://www.google.de/maps/search/Kneipe'),
      "Bahnverbindungen": () => this.goto('http://efa.vrr.de/vrrstd/XSLT_TRIP_REQUEST2?language=de&itdLPxx_transpCompany=vrr'),
      "Danke": () => this.speak('Kein Problem')
    });
    this.a.start({autoRestart: true, continuous: false});
  }

  stop(){
    this.a.abort();
  }

  randomPick(arr){
    const len = arr.length;
    return arr[Math.floor(Math.random() * len)];
  }

  speak(text, lang='de'){
    if(window.speechSynthesis){
      lang = lang.toLowerCase();
      let voice = window.speechSynthesis.getVoices().filter(voice => voice.lang && voice.lang.toLowerCase().startsWith(lang))
      if(voice) voice = voice[0];
      else throw new Error('No supported voice for the given Language');
      let utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = voice;
      window.speechSynthesis.speak(utterance)
    }else{
      throw new Error('no speech synthesis support');
    }
    if(this.notify){
      const n = new Notification('Die Antwort ist:',{
        body: text,
        lang: 'de-DE',
        icon: 'https://esag.fachschaftmedien.de/static/images/icons/favicon.png',
        id: text
      });
      const t = setTimeout(() => {
        n.close();
        clearTimeout(t);
      }, 3000);
    }
  }

  spell(word){
    this.speak(word.split('').join('! ')+' ... '+word);
  }

  search(term){
    window.location.href= 'https://google.de/search?q='+window.encodeURIComponent(term);
  }

  goto(url){
    window.location.href = url;
  }

  schedule(query){
    const entrylist = (schedule) => Object.keys(schedule.days).reduce((all, day) => all.concat(schedule.days[day].map(entry => entry.day = day)));
    const awaitSchedule = new Promise(resolve => {
      fetch("https://esag.fachschaftmedien.de/resources/calendar.json")
        .then(response => {
          if(response.ok) return response.json()
          else throw new Error();
        })
        .then(entries => resolve(entrylist(entries)))
        .catch(err => {
          console.error(err);
          resolve(entrylist(localStorage.getItem('calendar')));
        })
    });
    if(query.event){
        return awaitSchedule
        .then(entries => entries.filter(entry => entry.name === query.event))
    }else if(query.day &&  query.time) {
      return awaitSchedule
        .then(entries => entries.filter(entry => entry.day === query.day && entry.time === query.time))
    }else if(query.day){
      return awaitSchedule
        .then(entries => entries.filter(entry => entry.day === query.day))
    }else if(query.location){
      return awaitSchedule
        .then(entries => entries.filter(entry => entry.location === query.location))
    }else{
      return {}
    }

  }

}
