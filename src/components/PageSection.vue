<template>
    <v-layout class="page-section">
      <v-flex>
        <slot name="content">
          <p> to be included... </p>
        </slot>
      </v-flex>
    </v-layout>
</template>

<script>
  export default {
    name: "PageSection",
  }
</script>

<style scoped>
  .page-section{
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
  }

  .page-section>div.flex, .page-section>div.flex>div{
    width: 100%;
    height: 100%;
  }
</style>
