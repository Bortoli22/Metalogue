<template>
    <div>
      <b-container fluid>
        <b-row>
          <b-col
          class="col-md-auto"
          v-bind:key="sentId + num"
          v-for="num in nested">
            <b-avatar v-if="settings.cat" src='@/assets/cats/cat01.png'></b-avatar>
            <b-avatar disabled size="10px" class="dottab" text=" " v-if="!settings.cat" rounded="lg"></b-avatar>
          </b-col>
          <b-col cols="1">
            <FlagSetSimple
              v-bind:id="sentId"
              v-bind:name="charname"
              v-bind:modProp="mod"
            />
          </b-col>
          <b-col>
            <b-form-textarea
              class="middark"
              ref="dialogue"
              id="dtext"
              v-model="text"
              placeholder="Dialogue Here..."
              rows="2"
              no-resize
              v-bind:formatter="formatter"
              v-on:keyup.enter="createDialogue"
              v-on:keyup.delete="removeDialogueCheck(1)"
              v-on:keydown.delete="removeDialogueCheck(0)"
              v-on:blur="modifyDialogue"
              v-on:focus="setActiveContainerID"
            ></b-form-textarea>
            <b-form-input
              class="middark eventbox"
              v-bind:class="{'eventboxspacing' : (activeContainerID === sentId ? false : true)}"
              v-if="eventFlag"
              v-bind:key="sentId"
              v-model="eventMsg"
              placeholder="Event Message..."
              v-on:blur="eventBlur"
              v-on:keyup.enter="createDialogue"
            ></b-form-input>
            <FlagSet
              class="flagset"
              align="left"
              v-if="activeContainerID === sentId"
              v-bind:id="sentId"
              v-bind:name="charname"
              v-bind:starter="modStarter"
              v-bind:eventFlag="eventFlag"
              v-bind:queueFlag="queueFlag"
              v-bind:mod="mod"
              v-bind:activeContainerID="activeContainerID"
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
      'dialogueData',
      'dialogueBank',
      'settings'
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
      queueFlag: false,
      optionsFlag: false,
      responseFlag: false,
      rouletteFlag: false,
      sendMod: {
        mod: '',
        updateState: false,
        emitting: false,
        args: [],
        created: false
      },
      elimBank: []
    }
  },
  props: {
    id: String,
    msg: String,
    name: String,
    modProp: Array,
    nestProp: Number,
    parentProp: String,
    activeContainerID: String,
    activeProjectID: String,
    activeSceneID: String,
    importKey: Number
  },
  created () {
    this.text = this.msg
    this.sentId = this.id
    this.charname = this.name
    this.nested = this.nestProp
    this.parentId = this.parentProp
    this.mod = this.modProp
    var modifier
    // console.log(this.id)
    for (modifier of this.mod) {
      this.sendMod = {
        mod: modifier.flag,
        updateState: false,
        emitting: true,
        args: modifier.args,
        created: true
      }
      // If an event wasn't actually emitting, it wouldn't be in this mod loop, hence the true
      this.updateMod(this.sendMod)
    }
  },
  mounted () {
    this.$nextTick(function () {
      if (this.$refs.dialogue !== undefined) {
        this.$refs.dialogue.focus()
      }
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
      const id = [...Array(10)].map(i => (~~(Math.random() * 36)).toString(36)).join('')
      var computedNest = this.nested
      var computedName = this.charname
      var computedParent = ''
      var computedMod = []
      var computedActive = -1
      if (this.optionsFlag || this.responseFlag || this.rouletteFlag) {
        // add to new DC nest value, push response flag if needed
        computedNest++
        computedParent = this.sentId
        if (this.responseFlag) {
          // current DC is response, change speaker for convenience
          const parent = this.dialogueData.find(element => element.id === this.parentId)
          computedName = parent.name
        } else {
          // current DC is option/roulette, so child will be response
          computedMod.push({ flag: 'Response', args: [this.sentId] })
          var mIndex
          if (this.optionsFlag) {
            mIndex = this.mod.findIndex(element => element.flag === 'Option')
          } else {
            mIndex = this.mod.findIndex(element => element.flag === 'Roulette')
          }
          if (mIndex !== -1) {
            this.mod[mIndex].args.push(id)
            this.modifyDialogue()
          }
        }
      } else {
        computedParent = this.parentId
      }
      var dIndex = this.dialogueData.findIndex(e => e.id === this.activeContainerID)
      if (dIndex !== this.dialogueData.length - 1) {
        // current DC must be inserted somewhere in the array instead of pushed
        computedActive = dIndex
      }
      const toAdd = {
        id: id,
        name: computedName,
        msg: '',
        mod: computedMod,
        parent: computedParent,
        nest: computedNest,
        active: computedActive,
        importKey: this.importKey
      }
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
        nest: this.nested,
        importKey: this.importKey
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
      // DCs with this DC as parent must be removed
      if (this.optionsFlag || this.responseFlag || this.rouletteFlag) {
        this.elimBank = []
        this.unNestChild({ val: this.sentId, pAdjust: true, destructive: true })
        for (var elim of this.elimBank) {
          this.remDialogue(elim)
        }
      }
      if (this.nested <= 0) {
        this.remDialogue(this.sentId)
      }
      if (this.nested > 0) {
        // unNest by one and prep for mod changes
        this.sendMod.updateState = true
        this.sendMod.emitting = this.eventFlag
        this.nested--
        if (this.parentId) {
          // get parent
          var computedMod
          const parent = this.dialogueData.find(element => element.id === this.parentId)
          this.parentId = parent.parent
          this.charname = parent.name
          if (parent.mod.findIndex(element => element.flag === 'Response') > -1) {
            // parent is response, becomes a response itself
            this.sendMod.mod = 'Response'
            this.sendMod.args = [parent.parent]
            this.updateMod(this.sendMod)
            const doubleParent = this.dialogueData.find(element => element.id === parent.parent)
            if (doubleParent !== null) {
              // push the id of new response to args of parent's Option flag
              computedMod = doubleParent.mod
              var cMI = computedMod.findIndex(e => e.flag === 'Option')
              if (cMI === -1) {
                cMI = computedMod.findIndex(e => e.flag === 'Roulette')
              }
              computedMod[cMI].args.push(this.sentId)
              this.modDialogue({
                id: doubleParent.id,
                name: doubleParent.name,
                msg: doubleParent.msg,
                mod: computedMod,
                parent: doubleParent.parent,
                nest: doubleParent.nest,
                importKey: this.importKey
              })
            }
          } else {
            // parent is not response, meaning this DC is the response, becomes normal
            this.spliceMod('Response')
            this.responseFlag = false
            computedMod = parent.mod
            var mIndex = computedMod.findIndex(e => e.flag === 'Option')
            if (mIndex === -1) {
              mIndex = computedMod.findIndex(e => e.flag === 'Roulette')
            }
            var aIndex = computedMod[mIndex].args.findIndex(e => e === this.sentId)
            computedMod[mIndex].args.splice(aIndex, 1)
            this.modDialogue({
              id: parent.id,
              name: parent.name,
              msg: parent.msg,
              mod: computedMod,
              parent: parent.parent,
              nest: parent.nest,
              importKey: this.importKey
            })
          }
        }
        // Options kept for unNestChild conditionals spliced
        this.spliceMod('Roulette')
        this.spliceMod('Option')
      }
      return null
    },
    unNestChild (payload) {
      this.dialogueData.forEach((element) => {
        if (element.parent === payload.val) {
          if (!payload.destructive) {
            if (payload.pAdjust) {
              var p = this.dialogueData.find(e => e.id === payload.val)
              element.parent = p.parent
              // corner case unNest option, remove it
              var rIndex = element.mod.findIndex(i => i.flag === 'Response')
              if (rIndex > -1) {
                element.mod.splice(rIndex, 1)
              }
            }
            element.nest -= 2
            if (element.nest < 0) {
              element.nest = 0
            }
          }
          this.unNestChild({ val: element.id, pAdjust: false, destructive: payload.destructive })
          if (payload.destructive) {
            this.elimBank.push(element.id)
          }
        }
      })
    },
    updateMod (payload) {
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
        case 'Queue':
          this.queueFlag = !this.queueFlag
          if (payload.updateState) {
            if (this.queueFlag) {
              const cIndex = this.mod.findIndex(opt => opt.flag === 'Queue')
              if (cIndex === -1) {
                this.mod.push({ flag: 'Queue', args: [] })
              }
            } else {
              this.spliceMod('Queue')
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
            const mIndex = this.mod.findIndex(opt => opt.flag === 'Response')
            if (mIndex !== -1) {
              this.spliceMod('Response')
            } else {
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
          if (this.optionsFlag || this.rouletteFlag) {
            // When an Option or Roulette becomes a Normal
            var arg
            if (this.optionsFlag) {
              arg = this.mod.find(a => a.flag === 'Option').args
            } else {
              arg = this.mod.find(a => a.flag === 'Roulette').args
            }
            this.optionsFlag = false
            this.rouletteFlag = false
            if (arg !== undefined) {
              // There are responses to this option
              var tec
              for (tec of arg) {
                // Responses are unset as responses, nest decreases
                var toMod = this.dialogueData.find(x => x.id === tec)
                var toNest = toMod.nest - 1
                if (toNest < 0) {
                  toNest = 0
                }
                var xSend = []
                var xParse
                for (xParse of toMod.mod) {
                  if (xParse.flag !== 'Response') {
                    xSend.push(xParse)
                  }
                }
                var obtainParent = this.dialogueData.find(x => x.id === toMod.parent)
                this.modDialogue({
                  id: toMod.id,
                  name: toMod.name,
                  msg: toMod.msg,
                  mod: xSend,
                  parent: obtainParent.parent,
                  nest: toNest,
                  importKey: this.importKey
                })
                this.unNestChild({ val: toMod.id, pAdjust: true, destructive: false })
              }
            }
          }
          this.responseFlag = false
          this.modStarter = 'Normal'
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

<style scoped>
  .middark, .middark:focus {
    background-color: #3E4C59;
    color: #f5f7fa;
    border-style: none;
    border-color: Transparent;
    overflow: auto;
  }

  .middark:focus {
    outline-color: #9e98a8;
    box-shadow: 0 0 5px #7e57c2;
  }

  .flagset {
    padding-left: 15px;
  }

  .dottab {
    background-color: #b085f5;
    margin-top: 10px
  }

  .eventbox {
    margin-top: 2px;
  }

  .eventboxspacing {
    margin-bottom: 12px;
  }
</style>
