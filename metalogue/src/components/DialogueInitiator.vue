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
      'projectBank',
      'dialogueBank'
    ])
  },
  created () {
    this.alterName()
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
      const id = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      let name = ''
      const toModIndex = this.projectBank.findIndex(element => element.id === this.activeProjectID)
      if (toModIndex > -1) {
        name = this.projectBank[toModIndex].characterBank[0].spName
      }
      const created = { id: id, name: name, msg: '', mod: [], nest: 0, active: -1, parent: '', importKey: 0 }
      this.addDialogue(created)
    },
    alterName () {
      const getName = this.dialogueBank.find(e => e.id === this.activeSceneID)
      if (getName === '' || getName === undefined) {
        return
      }
      this.activeSceneName = getName.name
    }
  },
  props: {
    activeSceneID: String,
    activeProjectID: String
  },
  watch: {
    activeSceneID: {
      handler: function (newVal, oldVal) {
        this.alterName()
      }
    }
  }
}
</script>

<style scoped>
 .jumbotron {
    background-color: #3E4C59;
    color: #f5f7fa;
 }
</style>
