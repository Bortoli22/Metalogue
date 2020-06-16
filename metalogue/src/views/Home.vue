<template>
  <div class="home">
    <b-button v-on:click="createDialogue()">+</b-button>
    <DialogueContainer
    v-for="val in dialogueData"
    v-bind:key="val.id"
    v-bind:msg="val.msg"
    v-bind:id="val.id"
    v-bind:name="val.name"
    />
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
      const created = { id: id, name: 'charx', msg: 'added' }
      this.addDialogue(created)
    }
  },
  data () {
    return {
    }
  }
}
</script>
