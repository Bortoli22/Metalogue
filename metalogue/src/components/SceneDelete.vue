<template>
    <div>
      <b-card class="middark">
      <p class="card-text">Are you sure you would like to delete this scene and all of its contents?</p>
      <b-button-group>
          <b-button v-on:click="deleteScene()" variant="danger" size="sm">Delete</b-button>
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
      'dialogueBank',
      'projectBank'
    ])
  },
  methods: {
    ...mapActions([
      'remScene',
      'swapBank'
    ]),
    close () {
      this.$emit('close', null)
    },
    async deleteScene () {
      try {
        var pname = this.projectBank.find(e => e.id === this.activeProjectID).name
        var sname = this.dialogueBank.find(e => e.id === this.activeSceneID).name
        await fire.usersCollection.doc(fire.auth.currentUser.uid)
          .collection('projects').doc(pname).collection('scenes').doc(sname).delete()
      } catch (err) {
        console.log(err)
      }
      this.remScene(this.activeSceneID)
      this.swapAction()
      this.$emit('close', null)
    },
    swapAction () {
      this.swapBank({ old: this.activeSceneID })
      if (this.dialogueBank.length > 0) {
        this.$emit('setActiveScene', this.dialogueBank[0].id)
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
