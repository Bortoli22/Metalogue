<template>
    <div>
        <b-button v-b-toggle.sceneDelete variant="danger"> {{ mainButtonText }} </b-button>
        <b-collapse id="sceneDelete" class="mt-2" v-on:show="swapMainButtonText('Collapse')" v-on:hide="swapMainButtonText('Delete Scene')">
            <b-card>
            <p class="card-text">Are you sure you would like to delete this scene and all of its contents?</p>
            <b-button-group>
                <b-button v-b-toggle.sceneDelete v-on:click="deleteScene()" variant="danger" size="sm">Delete</b-button>
                <b-button v-b-toggle.sceneDelete variant="info" size="sm">Cancel</b-button>
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
      'dialogueBank'
    ])
  },
  data () {
    return {
      mainButtonText: 'Delete Scene'
    }
  },
  methods: {
    ...mapActions([
      'remScene',
      'swapBank'
    ]),
    deleteScene () {
      this.swapAction()
      this.remScene(this.activeSceneID)
    },
    swapAction () {
      this.swapBank({ old: this.activeSceneID })
      this.$emit('setActiveScene', this.dialogueBank[0].id)
    },
    swapMainButtonText (newText) {
      this.mainButtonText = newText
    }
  },
  props: {
    activeSceneID: String
  }
}
</script>
