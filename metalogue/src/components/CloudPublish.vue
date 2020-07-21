<template>
    <div>
        <b-button v-on:click="pushData()">
            <b-spinner small v-if="isExporting" label="Loading..."></b-spinner>
            Save to Cloud
        </b-button>
    </div>
</template>

<script>
import * as fire from '../firebase'
import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState([
      'projectBank',
      'characterBank',
      'customMod'
    ])
  },
  data () {
    return {
      isExporting: false
    }
  },
  methods: {
    ...mapActions([
      'projectSync'
    ]),
    async pushData () {
      // pushData is a complete user re-write
      // add watchers/snapshots if you ever pay for a higher quota :)
      this.projectSync({ project: this.activeProjectID, scene: this.activeSceneID })
      this.isExporting = true

      // push characters
      try {
        await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('characters').doc('All').set({
          characters: this.characterBank
        })
      } catch (err) {
        console.log(err)
      }

      // push custom mods
      try {
        await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('mods').doc('All').set({
          mods: this.customMod
        })
      } catch (err) {
        console.log(err)
      }

      // push project
      var p = this.projectBank.find(element => element.id === this.activeProjectID)
      try {
        await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(p.name).set({
          name: p.name,
          id: p.id
        })
        var s
        for (s of p.sceneBank) {
          await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(p.name).collection('scenes').doc(s.name).set({
            name: s.name,
            id: s.id,
            data: s.data
          })
        }
      } catch (err) {
        console.log(err)
      }
      this.isExporting = false
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
  }
}
</script>

<style scoped>
  .btn.btn-secondary, .btn.btn-secondary:hover,
  .btn.btn-secondary:focus {
    background: #b085f5;
    color: #f5f7fa;
    border-color: #b085f5;
  }
</style>
