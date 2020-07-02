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
            </b-card>
        </b-collapse>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      mainButtonText: 'New Scene',
      newScene: ''
    }
  },
  methods: {
    ...mapActions([
      'addScene'
    ]),
    createScene () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var toSend = { sceneName: this.newScene, sceneID: id }
      this.addScene(toSend)
      this.newScene = ''
    },
    swapMainButtonText (newText) {
      this.mainButtonText = newText
    }
  }
}
</script>
