<template>
    <div>
      <b-card>
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

export default {
  computed: {
    ...mapState([
      'dialogueBank'
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
    deleteScene () {
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
    activeSceneID: String
  }
}
</script>
