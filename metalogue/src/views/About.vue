<template>
  <div class="about">
    <!-- The forbidden feast -->
    <h1>About Metalogue</h1>
    <b-container id="abouttext">
      <p align="left">
        Welcome, friend!
        <br><br>Metalogue is an online, text-editing interface that caters to the creation of game dialogue.
        For each line of dialogue you write, metadata is created in the background that can be used
        with the appropriate scripting in the creation of a full-fledged dialogue system.

        <br><br>Dialogue you write can be exported using Metalogue's metadata (MM) scheme as a text file,
        which can then be parsed by and interpreted by the associated scripts in your game engine. Dialogue can also be
        exported as a JSON file, though it maintains a fixed scheme that may not play nice with
        preexisting scripting. The dialogue you write can be saved to the cloud, though it is currently done manually
        to keep read accesses low. Please remember to save, but do so sparingly. Local editing is also
        supported, as any exported files can be imported and worked on, even offline.

        <br><br>There's little here in the way of tutorials or introductions at the moment.
        'Work in Progress' and all that.
        Navigate to the 'Home' tab in the navbar up top to get right into it, or check out the links
        below.

        <br><br>Enjoy :)
      </p>
      <div>
        <b-button v-on:click="goHome" class="links">Go to Editor</b-button>
        <b-button class="links" href="https://github.com/Bortoli22/Metalogue">Metalogue GitHub</b-button>
        <b-button class="links" disabled href="#">Accompanying GDScript [Coming Soon]</b-button>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  methods: {
    goHome () {
      this.$router.replace({ path: '/' }).catch(doubleNav => {})
    }
  }
}
</script>

<style scoped>
  .about {
    color: #f5f7fa;
  }
  .links {
    margin-left: 5px;
    margin-right: 5px;
  }
</style>
