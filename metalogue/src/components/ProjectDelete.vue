<template>
    <div>
        <b-button v-b-toggle.projectDelete variant="danger"> {{ mainButtonText }} </b-button>
        <b-collapse id="projectDelete" class="mt-2" v-on:show="swapMainButtonText('Collapse')" v-on:hide="swapMainButtonText('Delete Project')">
            <b-card>
            <p class="card-text">Are you sure you would like to delete this project and all of its contents?</p>
            <b-button-group>
                <b-button v-b-toggle.projectDelete v-on:click="deleteProject()" variant="danger" size="sm">Delete</b-button>
                <b-button v-b-toggle.projectDelete variant="info" size="sm">Cancel</b-button>
            </b-button-group>
            </b-card>
        </b-collapse>
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
  data () {
    return {
      mainButtonText: 'Delete Project'
    }
  },
  methods: {
    ...mapActions([
      'remProject',
      'swapProject'
    ]),
    deleteProject () {
      this.remProject(this.activeProjectID)
      this.swapAction()
    },
    swapAction () {
      this.swapProject({ old: this.activeProjectID, sceneID: this.activeSceneID })
      if (this.projectBank.length > 0) {
        this.$emit('setActiveProjectID', this.projectBank[0].id)
      }
    },
    swapMainButtonText (newText) {
      this.mainButtonText = newText
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
  }
}
</script>
