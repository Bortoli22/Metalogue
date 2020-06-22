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
              ref="dialogue"
              id="dtext"
              v-model="text"
              placeholder="Dialogue Here..."
              rows="2"
              v-bind:formatter="formatter"
              v-on:keyup.enter="createDialogue"
              v-on:keyup.delete="removeDialogueCheck(1)"
              v-on:keydown.delete="removeDialogueCheck(0)"
              v-on:blur="modifyDialogue"
            ></b-form-textarea>
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
      charname: '',
      recentDeleteWasKeyup: false
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
  mounted () {
    this.$nextTick(function () {
      this.$refs.dialogue.focus()
    })
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
    bufferKey () {
      this.text = ''
    },
    createDialogue () {
      this.$refs.dialogue.blur()
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      const created = { id: id, name: this.charname, msg: '', mod: [] }
      this.addDialogue(created)
    },
    removeDialogueCheck (keyup) {
      if (this.text === '') {
        if (keyup) {
          if (this.recentDeleteWasKeyup) {
            this.remDialogue(this.sentId)
          } else {
            this.recentDeleteWasKeyup = true
          }
        }
      } else {
        this.recentDeleteWasKeyup = false
      }
    },
    formatter (value) {
      return value.replace('\n', '')
    }
  }

}
</script>
