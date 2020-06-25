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
            <FlagSetSimple
              v-bind:id="sentId"
              v-bind:name="charname"
              v-bind:starter="modStarter"
              v-bind:modProp="mod"
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
              v-on:focus="setActiveContainerID"
            ></b-form-textarea>
            <b-form-input
              v-if="eventFlag"
              id="event-message"
              v-model="eventMsg"
              placeholder="Event Message..."
            ></b-form-input>
            <FlagSet
              align="left"
              v-if="activeContainerID === sentId"
              v-bind:id="sentId"
              v-bind:name="charname"
              v-bind:starter="modStarter"
              @propUpdate="propUpdate"
              @updateEvent="updateEvent"
              @updateMod="updateMod"
            />
          </b-col>
        </b-row>
      </b-container>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import FlagSet from '@/components/FlagSet.vue'
import FlagSetSimple from '@/components/FlagSetSimple.vue'

export default {
  components: {
    FlagSet,
    FlagSetSimple
  },
  computed: {
    ...mapState([
      'dialogueData'
    ])
  },
  data () {
    return {
      text: '',
      sentId: '',
      parentId: '',
      charname: '',
      mod: [],
      eventMsg: '',
      nested: 0,
      modStarter: 'Normal',
      keyupFlag: false,
      eventFlag: false,
      optionsFlag: false,
      responseFlag: false,
      rouletteFlag: false
    }
  },
  props: {
    id: String,
    msg: String,
    name: String,
    modProp: Array,
    nestProp: Number,
    parentProp: String,
    activeContainerID: String
  },
  created () {
    this.text = this.msg
    this.sentId = this.id
    this.charname = this.name
    this.nested = this.nestProp
    this.parentId = this.parentProp
    this.mod = this.modProp
    var modifier
    // TODO: Delete Console Log
    console.log(this.id)
    for (modifier of this.mod) {
      var sendMod = { mod: modifier.flag, updateState: false }
      console.log(sendMod)
      this.updateMod(sendMod)
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
      var computedMod = []
      if (this.optionsFlag || this.responseFlag) {
        computedNest++
        computedParent = this.sentId
        if (this.optionsFlag) {
          computedMod.push({ flag: 'Response', args: [] })
        }
      }
      const toAdd = { id: id, name: this.charname, msg: '', mod: computedMod, parent: computedParent, nest: computedNest }
      return toAdd
    },
    formatter (value) {
      return value.replace('\n', '')
    },
    modifyDialogue () {
      this.modDialogue({
        id: this.sentId,
        name: this.charname,
        msg: this.text,
        mod: this.mod,
        parent: this.parentId,
        nest: this.nested
      })
    },
    propUpdate (payload) {
      this.sentId = payload.id
      this.charname = payload.name
    },
    removeDialogueCheck (keyup) {
      if (this.text === '') {
        if (keyup) {
          if (this.keyupFlag) {
            this.unNest()
          } else {
            this.keyupFlag = true
          }
        }
      } else {
        this.keyupFlag = false
      }
    },
    setActiveContainerID () {
      this.$emit('setActiveContainerID', this.sentId)
    },
    spliceMod (modName) {
      const cIndex = this.mod.findIndex(opt => opt.flag === modName)
      if (cIndex >= 0) {
        this.mod.splice(cIndex, 1)
      }
    },
    unNest () {
      if (this.nested <= 0) {
        this.remDialogue(this.sentId)
      }
      if (this.nested > 0) {
        this.nested--
        // TODO: unNest functionality
      }
      return null
    },
    updateEvent (payload) {
      this.eventFlag = payload.emitting
    },
    updateMod (payload) {
      console.log('Payload: ' + payload)
      switch (payload.mod) {
        case 'Option':
          this.optionsFlag = true
          this.rouletteFlag = false
          this.modStarter = 'Option'
          if (payload.updateState) {
            if (this.mod.findIndex(opt => opt.flag === 'Option') === -1) {
              this.mod.push({ flag: 'Option', args: [] })
            }
            this.spliceMod('Roulette')
          }
          break
        case 'Response':
          this.responseFlag = true
          break
        case 'Roulette':
          this.optionsFlag = false
          this.rouletteFlag = true
          this.modStarter = 'Roulette'
          if (payload.updateState) {
            if (this.mod.findIndex(opt => opt.flag === 'Roulette') === -1) {
              this.mod.push({ flag: 'Roulette', args: [] })
            }
            this.spliceMod('Option')
          }
          break
        default:
          this.optionsFlag = false
          this.rouletteFlag = false
          if (payload.updateState) {
            this.spliceMod('Roulette')
            this.spliceMod('Option')
          }
          break
      }
      if (payload.updateState) {
        this.modifyDialogue()
      }
    }
  }

}
</script>
