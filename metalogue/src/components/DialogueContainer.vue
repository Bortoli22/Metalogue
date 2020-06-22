<template>
    <div>
      <b-container fluid>
        <b-row>
          <b-col class="col-md-auto">
            <FlagSet
              v-bind:id="sentId"
              v-bind:name="charname"
              @propUpdate="propUpdate"
            />
          </b-col>
          <b-col>
            <b-form-textarea
              id="dtext"
              v-model="text"
              placeholder="Dialogue Here..."
              rows="2"
              max-rows="6"
              v-on:keyup.enter="createDialogue"
              v-on:keyup.delete="removeDialogueCheck"
            ></b-form-textarea>
          </b-col>
          <b-col class="col-md-auto">
            <b-button v-on:click="modifyDialogue()">Commit</b-button>
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import FlagSet from '@/components/FlagSet.vue'

export default {
  components: {
    FlagSet
  },
  data () {
    return {
      text: '',
      sentId: '',
      charname: ''
    }
  },
  props: {
    id: String,
    msg: String,
    name: String,
    mod: Array
  },
  created () {
    this.text = this.msg
    this.sentId = this.id
    this.charname = this.name
  },
  methods: {
    ...mapActions([
      'modDialogue',
      'addDialogue',
      'remDialogue'
    ]),
    modifyDialogue () {
      this.modDialogue({ id: this.sentId, msg: this.text })
    },
    propUpdate (payload) {
      this.sentId = payload.id
      this.charname = payload.name
    },
    createDialogue () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      const created = { id: id, name: 'charx', msg: '', mod: [] }
      this.addDialogue(created)
    },
    removeDialogueCheck () {
      if (this.text === '') {
        this.remDialogue(this.sentId)
      }
    }
  }

}
</script>
