<template>
  <div class="home">
    <b-button v-on:click="createDialogue()">+</b-button>
    <DialogueContainer
    v-for="val in dialogueData"
    v-bind:key="val"
    v-bind:msg="val.msg"
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
      const created = { name: 'charx', msg: 'added' }
      this.addDialogue(created)
    }
  },
  data () {
    return {
    }
  }
}
</script>
