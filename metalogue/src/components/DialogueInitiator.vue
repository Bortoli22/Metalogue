<template>
    <div>
        <div>
        <b-jumbotron v-bind:header="activeSceneName" lead="Scene is empty">
            <p>No dialogue data here. Create some!</p>
            <b-button variant="info" v-on:click="createDialogue()">+</b-button>
        </b-jumbotron>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'characterBank',
      'dialogueBank'
    ])
  },
  created () {
    const getName = this.dialogueBank.find(e => e.id === this.activeSceneID)
    this.activeSceneName = getName.name
  },
  data () {
    return {
      activeSceneName: ''
    }
  },
  methods: {
    ...mapActions([
      'addDialogue'
    ]),
    createDialogue () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      let name = ''
      if (this.characterBank.length > 0) {
        name = this.characterBank[0].spName
      }
      const created = { id: id, name: name, msg: '', mod: [], nest: 0 }
      this.addDialogue(created)
    }
  },
  props: {
    activeSceneID: String
  }
}
</script>
