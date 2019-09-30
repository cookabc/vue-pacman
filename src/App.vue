<template>
  <PacMan />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PacMan from './components/PacMan.vue'

@Component({
  components: {
    PacMan,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  height: 100vh;
}
</style>
