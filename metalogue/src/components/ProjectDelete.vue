<template>
    <div>
        <b-card class="middark">
          <p class="card-text">Are you sure you would like to delete this project and all of its contents?</p>
          <b-button-group>
              <b-button v-on:click="deleteProject()" variant="danger" size="sm">Delete</b-button>
              <b-button v-on:click="close()" variant="info" size="sm">Cancel</b-button>
          </b-button-group>
        </b-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import * as fire from '../firebase'

export default {
  computed: {
    ...mapState([
      'projectBank',
      'dialogueBank'
    ])
  },
  methods: {
    ...mapActions([
      'remProject',
      'swapProject'
    ]),
    close () {
      this.$emit('close', null)
    },
    async deleteProject () {
      try {
        var name = this.projectBank.find(e => e.id === this.activeProjectID).name
        await fire.usersCollection.doc(fire.auth.currentUser.uid)
          .collection('projects').doc(name).delete()
      } catch (err) {
        console.log(err)
      }
      this.remProject(this.activeProjectID)
      await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
        projects: this.projectBank
      })
      this.swapAction()
    },
    async swapAction () {
      if (this.projectBank.length > 0) {
        try {
          // set settings for last worked dialogue
          await fire.usersCollection.doc(fire.auth.currentUser.uid)
            .update({ currentProject: this.projectBank[0].name, currentProjectID: this.projectBank[0].id })
          // get scene collection
          var fireSceneBank = await fire.usersCollection.doc(fire.auth.currentUser.uid)
            .collection('projects').doc(this.projectBank[0].name).collection('scenes').get()
        } catch (err) {
          console.log(err)
          return
        }
        var sBank = []
        for (const doc2 of fireSceneBank.docs) {
        // Obtain data for each scene
          sBank.push(doc2.data())
        }
        try {
        // pull charBank
          var getProject = await fire.usersCollection.doc(fire.auth.currentUser.uid).get()
          var getChar = await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('projects').doc(getProject.data().currentProject).get()
          var charToSend = getChar.data().characterBank

          this.swapProject({ sBank: sBank, pID: this.projectBank[0].id, characterBank: charToSend })
          this.$emit('setActiveProjectID', this.projectBank[0].id)
          if (this.dialogueBank.length > 0) {
            this.$emit('setActiveSceneID', this.dialogueBank[0].id)
          }
        } catch (err) {
          console.log(err)
          return
        }
      } else {
        this.swapProject({ pID: '' })
      }
      this.$emit('close', null)
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
  }
}
</script>

<style scoped>
  .middark {
    background-color: #3E4C59;
    color: #f5f7fa;
  }
</style>
