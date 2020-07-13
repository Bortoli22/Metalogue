<template>
    <div>
        <b-button v-b-toggle.sceneCreate variant="info"> {{ mainButtonText }} </b-button>
        <b-collapse id="sceneCreate" class="mt-2" v-on:show="swapMainButtonText('Collapse')" v-on:hide="swapMainButtonText('New Scene')">
            <b-card>
            <p class="card-text">Create a new scene for additional dialogue interaction</p>
            <b-form-input v-model="newScene" placeholder="Scene Name..." v-on:keyup.enter="createScene()"></b-form-input>
            <b-button-group>
                <b-button v-b-toggle.sceneCreate v-on:click="createScene()" variant="info" size="sm">Add</b-button>
                <b-button v-b-toggle.sceneCreate variant="danger" size="sm">Close</b-button>
            </b-button-group>
            {{ error }}
            </b-card>
        </b-collapse>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'projectBank',
      'dialogueBank'
    ])
  },
  data () {
    return {
      mainButtonText: 'New Scene',
      newScene: '',
      error: ''
    }
  },
  methods: {
    ...mapActions([
      'addScene'
    ]),
    createScene () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var toSend = { sceneName: this.newScene, sceneID: id }
      if (this.projectBank.length === 0) {
        this.error = 'Must create a project first'
        return
      }
      var element
      for (element of this.dialogueBank) {
        if (element.name === this.newScene) {
          this.error = 'Name already used'
          return
        }
      }
      if (this.dialogueBank.length === 0) {
        this.$emit('setActiveSceneID', id)
      }
      this.error = ''
      this.addScene(toSend)
      this.newScene = ''
    },
    swapMainButtonText (newText) {
      this.mainButtonText = newText
    }
  }
}
</script>
