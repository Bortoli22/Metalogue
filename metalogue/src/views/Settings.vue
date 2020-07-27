<template>
  <div class="settings">
    <h1>Settings</h1>
    <b-container align="left" id="abouttext">
      <b-input-group prepend="Email">
      <b-form-input disabled v-bind:placeholder="activeUser.name"></b-form-input>
      </b-input-group>
      <br>
      <b-input-group prepend="Username">
      <b-form-input v-model="changeUsername" v-bind:placeholder="activeUser.uid"></b-form-input>
      </b-input-group>
      <br>
      <b-form-checkbox v-model="debug" aria-describedby="debug-help-block">
        Debug</b-form-checkbox>
        <b-form-text id="debug-help-block">Enable Debug to add developer info to the editor. May look cluttered.</b-form-text>
      <br>
      <b-form-checkbox v-model="cat" aria-describedby="cat-help-block">
        Cat Mode<a v-if="cat"> ฅ(•ㅅ•❀)ฅ</a></b-form-checkbox>
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
    this.cat = this.settings.cat
    this.changeUsername = this.activeUser.uid
  },
  computed: {
    ...mapState([
      'settings',
      'activeUser'
    ])
  },
  data () {
    return {
      debug: false,
      cat: false,
      changeUsername: ''
    }
  },
  methods: {
    ...mapActions([
      'syncSettings'
    ]),
    async saveSettings () {
      this.syncSettings({ debug: this.debug, cat: this.cat, uid: this.changeUsername })
      try {
        await fire.usersCollection.doc(fire.auth.currentUser.uid).update({ debug: this.debug, cat: this.cat, uid: this.changeUsername })
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
