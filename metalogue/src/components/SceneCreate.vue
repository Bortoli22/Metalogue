<template>
    <div>
      <b-card  class = "middark">
      <p class="card-text">Create a new scene for additional dialogue interaction</p>
      <b-form-input v-model="newScene" placeholder="Scene Name..." v-on:keyup.enter="createScene()"></b-form-input>
      <b-button-group>
          <b-button v-on:click="createScene()" variant="info" size="sm">Add</b-button>
          <b-button v-on:click="close()" variant="danger" size="sm">Close</b-button>
      </b-button-group>
      {{ error }}
      </b-card>
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
      newScene: '',
      error: ''
    }
  },
  methods: {
    ...mapActions([
      'addScene'
    ]),
    close () {
      this.$emit('close', null)
    },
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
      this.$emit('created', null)
      this.error = ''
      this.addScene(toSend)
      this.newScene = ''
    }
  }
}
</script>

<style scoped>
  .middark {
    background-color: #3E4C59;
  }
</style>
