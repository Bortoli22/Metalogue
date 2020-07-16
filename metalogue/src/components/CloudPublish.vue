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
      'projectBank'
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
      // very expensive complete user re-write
      // add watchers/snapshots if you ever pay for a higher quota :)

      this.projectSync({ project: this.activeProjectID, scene: this.activeSceneID })

      this.isExporting = true
      var p = this.projectBank.find(element => element.id === this.activeProjectID)
      // set project fields
      try {
        await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(p.name).set({
          name: p.name,
          id: p.id
        })
        var s
        for (s of p.sceneBank) {
          // set scene fields
          await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(p.name).collection('scenes').doc(s.name).set({
            name: s.name,
            id: s.id
          })
          var d
          for (d of s.data) {
            // set dialogue fields
            await fire.usersCollection.doc(fire.auth.currentUser.uid)
              .collection('projects').doc(p.name).collection('scenes').doc(s.name).collection('data').doc(d.id).set({
                id: d.id,
                name: d.name,
                msg: d.msg,
                parent: d.parent,
                nest: d.nest
              })
            var m
            var fireModBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
              .collection('projects').doc(p.name).collection('scenes').doc(s.name)
              .collection('data').doc(d.id).collection('mod').get()
            for (m of fireModBank.docs) {
              // delete mod fields
              m.ref.delete()
            }
            for (m of d.mod) {
              // set mod fields
              await fire.usersCollection.doc(fire.auth.currentUser.uid)
                .collection('projects').doc(p.name).collection('scenes')
                .doc(s.name).collection('data').doc(d.id).collection('mod').doc(m.flag).set({
                  flag: m.flag,
                  args: m.args
                })
            }
          }
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
