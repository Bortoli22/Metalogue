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
      this.swapAction()
      this.$emit('close', null)
    },
    swapAction () {
      this.swapProject({ old: this.activeProjectID, sceneID: this.activeSceneID })
      if (this.projectBank.length > 0) {
        this.$emit('setActiveProjectID', this.projectBank[0].id)
      }
      if (this.dialogueBank.length > 0) {
        this.$emit('setActiveSceneID', this.dialogueBank[0].id)
      }
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
