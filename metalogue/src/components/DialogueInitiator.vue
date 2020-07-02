<template>
    <div>
        <div>
        <b-jumbotron v-bind:header="activeSceneID" lead="Scene is empty">
            <p>No dialogue data here. Create some!</p>
            <b-button variant="info" v-on:click="createDialogue()">+</b-button>
        </b-jumbotron>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions([
      'addDialogue'
    ]),
    createDialogue () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      const created = { id: id, name: 'charx', msg: '', mod: [], nest: 0 }
      this.addDialogue(created)
    }
  },
  props: {
    activeSceneID: String
  }
}
</script>
