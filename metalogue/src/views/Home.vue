<template>
  <div class="home">
    <DialogueContainer
    v-for="val in dialogueData"
    v-bind:key="val.id"
    v-bind:msg="val.msg"
    v-bind:id="val.id"
    v-bind:name="val.name"
    v-bind:mod="val.mod"
    />
    <b-button v-on:click="createDialogue()">+</b-button>
  </div>
</template>

<script>
// @ is an alias to /src
import DialogueContainer from '@/components/DialogueContainer.vue'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    DialogueContainer
  },
  computed: {
    ...mapState([
      'dialogueData'
    ])
  },
  methods: {
    ...mapActions([
      'addDialogue'
    ]),
    createDialogue () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      const created = { id: id, name: 'charx', msg: '', mod: [] }
      this.addDialogue(created)
    }
  },
  data () {
    return {
    }
  }
}
</script>
