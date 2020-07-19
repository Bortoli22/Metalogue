<template>
  <div class="settings">
    <h1>Settings</h1>
    <b-container align="left" id="abouttext">
      <b-form-checkbox v-model="debug" aria-describedby="debug-help-block">
        Debug</b-form-checkbox>
        <b-form-text id="debug-help-block">Enable Debug to add developer info to the editor. May look cluttered.</b-form-text>
      <br>
      <b-form-checkbox v-model="debug" aria-describedby="cat-help-block">
        Cat Mode</b-form-checkbox>
        <b-form-text id="cat-help-block">Replace some imagery with cat placeholders similar to those used during development.</b-form-text>
      <b-button id="save" v-on:click="saveSettings">Save Changes</b-button>
    </b-container>
  </div>
</template>

<script>
import * as fire from '../firebase'
import { mapState, mapActions } from 'vuex'

export default {
  created () {
    this.debug = this.settings.debug
  },
  computed: {
    ...mapState([
      'settings'
    ])
  },
  data () {
    return {
      debug: false
    }
  },
  methods: {
    ...mapActions([
      'syncSettings'
    ]),
    async saveSettings () {
      this.syncSettings({ debug: this.debug })
      try {
        await fire.usersCollection.doc(fire.auth.currentUser.uid).update({ debug: this.debug })
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
  .settings {
    color: #f5f7fa;
  }
  #save {
      margin-top: 15px;
  }
</style>
