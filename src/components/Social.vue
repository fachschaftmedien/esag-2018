<template>
    <div id="social-container" role="region" aria-labelledby="social-headline" itemscope itemtype="http://schema.org/Organization">
      <h1 id="social-headline">
        Soziale Netzwerke
      </h1>
      <link itemprop="url" href="https://fachschaftmedien.de">
      <article>
        Wir sind übrigens auch auf einigen sozialen Netzwerken vertreten,
        über die ihr uns für Fragen gerne anschreiben könnt. Zum Beispiel könnt ihr uns auf Facebook
        (<a href="https://de-de.facebook.com/fachschaftmedien.de/" target="_blank" itemprop="sameAs">s.fachschaftmedien.de/facebook</a>)
        oder auf Twitter (<a href="https://twitter.com/diefachschaft" target="_blank" itemprop="sameAs">twitter.com/diefachschaft</a>) folgen.
        Unsere Website, auf der wir immer mal wieder Informationen veröffentlichen erreicht ihr über <a href="https://fachschaftmedien.de">www.fachschaftmedien.de</a>.
        Zur besseren Koordination der Erstsemester haben wir auch eine Whatsapp-Gruppe für euch erstellt.
      </article>
      <div class="whatsapp-container column">
        <h3>Ersti-Whatsapp Gruppe</h3>
        <img src="../assets/whatsappQR.webp" alt="http://s.fachschaftmedien.de/whatsapp" onerror="this.onerror=null;this.src='./resources/whatsappQR.png';console.log('fallback to '+this.src);">
        <a href="https://chat.whatsapp.com/invite/5Z5UeayUtiF9WswJagC68m" target="_blank">http://s.fachschaftmedien.de/whatsapp</a>
      </div>
    </div>
</template>

<script>
    export default {
      name: "Soziales",
      data(){
        return {

        }
      }
    }
</script>

<style scoped>
  #social-container{
    width: 90vw;
    padding: 5vw;
  }

  .whatsapp-container{
    margin: 5%;
  }

  .whatsapp-container>*{
    margin: 2% 0;
  }

  .column{
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
  }
</style>
