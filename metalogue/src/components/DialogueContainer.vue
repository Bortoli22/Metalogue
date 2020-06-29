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
              v-bind:modProp="mod"
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
              v-bind:key="sentId"
              v-model="eventMsg"
              placeholder="Event Message..."
              v-on:blur="eventBlur"
              v-on:keyup.enter="createDialogue"
            ></b-form-input>
            <FlagSet
              align="left"
              v-if="activeContainerID === sentId"
              v-bind:id="sentId"
              v-bind:name="charname"
              v-bind:starter="modStarter"
              v-bind:eventFlag="eventFlag"
              @propUpdate="propUpdate"
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
    console.log(this.id)
    for (modifier of this.mod) {
      var sendMod = {
        mod: modifier.flag,
        updateState: false,
        emitting: true,
        args: modifier.args,
        created: true
      }
      // If an event wasn't actually emitting, it wouldn't be in this mod loop, hence the true
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
    eventBlur () {
      this.updateMod({ mod: 'Event', emitting: this.eventFlag, updateState: true, created: false })
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
        var sendMod = {
          mod: '',
          updateState: true,
          emitting: this.eventFlag,
          args: [],
          created: false
        }
        this.nested--
        if (this.parentId) {
          const parent = this.dialogueData.find(element => element.id === this.parentId)
          console.log('parentMod id: ' + parent.id)
          if (parent.mod.findIndex(element => element.flag === 'Response') > -1) {
            console.log('We made')
            sendMod.mod = 'Response'
            // sendMod.args = [parent.parent]
            this.parentId = parent.parent
            this.updateMod(sendMod)
          }
        }
      }
      return null
    },
    updateMod (payload) {
      // console.log('Payload: ' + payload)
      switch (payload.mod) {
        case 'Event':
          this.eventFlag = payload.emitting
          if (!this.eventFlag) {
            this.eventMsg = ''
          }
          if (payload.created) {
            this.eventMsg = payload.args
          }
          if (payload.updateState) {
            if (this.eventFlag) {
              const cIndex = this.mod.findIndex(opt => opt.flag === 'Event')
              if (cIndex === -1) {
                this.mod.push({ flag: 'Event', args: [this.eventMsg] })
              } else {
                this.mod[cIndex].args = this.eventMsg
              }
            } else {
              this.spliceMod('Event')
            }
          }
          break
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
          if (payload.updateState) {
            if (this.mod.findIndex(opt => opt.flag === 'Response') === -1) {
              this.mod.push({ flag: 'Response', args: payload.args })
            }
          }
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
