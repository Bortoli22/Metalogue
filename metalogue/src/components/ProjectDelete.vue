<template>
    <div>
        <b-card>
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

export default {
  computed: {
    ...mapState([
      'projectBank'
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
    deleteProject () {
      this.remProject(this.activeProjectID)
      this.swapAction()
      this.$emit('close', null)
    },
    swapAction () {
      this.swapProject({ old: this.activeProjectID, sceneID: this.activeSceneID })
      if (this.projectBank.length > 0) {
        this.$emit('setActiveProjectID', this.projectBank[0].id)
      }
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
  }
}
</script>
