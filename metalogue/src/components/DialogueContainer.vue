<template>
    <div>
      <b-container fluid>
        <b-row>
          <b-col
          class="col-md-auto"
          v-bind:key="sentId + num"
          v-for="num in nested">
            <b-avatar variant="info" src="https://placekitten.com/300/300"></b-avatar>
          </b-col>
          <b-col class="col-md-auto">
            <FlagSet
              v-bind:id="sentId"
              v-bind:name="charname"
              v-bind:starter="modStarter"
              @propUpdate="propUpdate"
              @updateEvent="updateEvent"
              @updateMod="updateMod"
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
            <b-form-input
              v-if="eventFlag"
              id="event-message"
              v-model="eventMsg"
              placeholder="Event Message..."
            ></b-form-input>
          </b-col>
          <b-col class="col-md-auto">
            <b-button v-on:click="upNested()">+</b-button>
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
      parentId: '',
      charname: '',
      recentDeleteWasKeyup: false,
      eventFlag: false,
      eventMsg: '',
      optionsFlag: false,
      nested: 0,
      linkto: [],
      linkfrom: [],
      modStarter: 'Normal'
    }
  },
  props: {
    id: String,
    msg: String,
    name: String,
    mod: Array,
    nestProp: Number,
    parentProp: String
  },
  created () {
    this.text = this.msg
    this.sentId = this.id
    this.charname = this.name
    this.nested = this.nestProp
    this.parentId = this.parentProp
    var modifier
    var arg
    // console.log(this.id)
    for (modifier of this.mod) {
      // console.log(modifier.flag)
      // console.log(modifier.args)
      switch (modifier.flag) {
        case 'Option':
          this.optionsFlag = true
          this.modStarter = 'Option'
          for (arg of modifier.args) {
            this.linkto.push(arg)
          }
          break
        default:
          break
      }
    }
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
      const created = this.createDialoguePackaging()
      this.addDialogue(created)
    },
    createDialoguePackaging () {
      const id = [...Array(5)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var computedNest = this.nested
      var computedParent = ''
      if (this.optionsFlag) {
        computedNest++
        computedParent = this.sentId
      }
      const toAdd = { id: id, name: this.charname, msg: '', mod: [], parent: computedParent, nest: computedNest }
      return toAdd
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
    },
    upNested () {
      this.nested += 1
    },
    updateEvent (payload) {
      this.eventFlag = payload.emitting
    },
    updateMod (payload) {
      if (payload.mod === 'Option') {
        this.optionsFlag = true
      } else {
        this.optionsFlag = false
      }
    }
  }

}
</script>
