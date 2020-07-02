<template>
    <div>
        <b-button v-b-toggle.speakerCreate variant="info"> {{ mainButtonText }} </b-button>
        <b-collapse id="speakerCreate" class="mt-2" v-on:show="swapMainButtonText('Collapse')" v-on:hide="swapMainButtonText('New Speaker')">
            <b-card>
            <p class="card-text">Create a new speaker to take part in the dialogue</p>
            <b-form-input v-model="newSpeaker" placeholder="Enter Name..." v-on:keyup.enter="addCharacter()"></b-form-input>
            <b-button-group>
                <b-button v-b-toggle.speakerCreate v-on:click="addCharacter()" variant="info" size="sm">Add</b-button>
                <b-button v-b-toggle.speakerCreate variant="danger" size="sm">Close</b-button>
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
      mainButtonText: 'New Speaker',
      newSpeaker: ''
    }
  },
  methods: {
    ...mapActions([
      'addSpeaker'
    ]),
    addCharacter () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var toSend = { spID: id, spName: this.newSpeaker }
      this.addSpeaker(toSend)
      this.newSpeaker = ''
    },
    swapMainButtonText (newText) {
      this.mainButtonText = newText
    }
  }
}
</script>
