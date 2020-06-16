<template>
    <div>
        <b-form-textarea
      id="dtext"
      v-model="text"
      placeholder="Dialogue Here..."
      rows="2"
      max-rows="6"
    ></b-form-textarea>
    New Message: {{text}}
    <b-button v-on:click="modifyDialogue()">Commit</b-button>
    </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      text: '',
      sentId: ''
    }
  },
  props: {
    id: String,
    msg: String
  },
  created () {
    this.text = this.msg
    this.sentId = this.id
  },
  methods: {
    ...mapActions([
      'modDialogue'
    ]),
    modifyDialogue () {
      this.modDialogue({ id: this.sentId, msg: this.text })
    }
  }

}
</script>
