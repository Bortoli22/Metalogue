<template>
  <div class="home">
    <b-button v-on:click="addDialogue()">+</b-button>
    <DialogueContainer
    v-for="val in dialogues"
    v-bind:key="val"
    v-bind:msg="val"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import DialogueContainer from '@/components/DialogueContainer.vue'

export default {
  name: 'Home',
  components: {
    DialogueContainer
  },
  methods: {
    addDialogue: function () {
      const x = { name: 'added', msg: 'added' }
      this.dialogues.push(x)
    }
  },
  data () {
    return {
      dialogues: [{ name: 'char1', msg: 'dialogue1' }, { name: 'char2', msg: 'dialogue2' }]
    }
  }
}
</script>
