<template>
    <div>
      <b-row>
        <b-button-group>
          <b-dropdown v-bind:text="charname" id="spsl">
            <b-dropdown-item-button
            v-for="character in characterBank"
            v-bind:key="character.spID"
            v-on:click="propUpdate(character)"
            > {{ character.spName }}
            </b-dropdown-item-button>
          </b-dropdown>

          <b-dropdown v-bind:text="selectedMod">
              <b-dropdown-item
                  key="Normal"
                  v-on:click="updateMod('Normal')"
                  >Normal</b-dropdown-item>
              <b-dropdown-item
                  key="Option"
                  v-on:click="updateMod('Option')"
                  >Option</b-dropdown-item>
              <b-dropdown-item
                  key="Roulette"
                  v-on:click="updateMod('Roulette')"
                  >Roulette</b-dropdown-item>
          </b-dropdown>

          <b-button
            v-bind:pressed.sync="emitting"
            v-on:click="updateMod('Event')"
          >Event</b-button>

          <b-button v-bind:pressed.sync="queued">Queue</b-button>

          <b-dropdown right text="Custom Mod">
            <b-dropdown-item-button v-if="customMod.length === 0">
            No Custom Mods Created
            </b-dropdown-item-button>
            <b-dropdown-item-button
            v-for="mod in customMod"
            v-bind:key="mod.flag"
            v-on:click="showArg(mod)"
            > {{ mod.flag }}
            </b-dropdown-item-button>
          </b-dropdown>
        </b-button-group>
      </b-row>
      <b-row>
        <b-col sm>
          <b-form-input v-if="argEnter" v-on:keyup.enter="clickedCustom()" v-model="argRaw" placeholder="Enter args separated by space..."></b-form-input>
        </b-col>
        <b-col>
          <b-button v-if="argEnter" v-on:click="clickedCustom()" sm>Add</b-button>
          <b-button v-if="argEnter" v-on:click="closeArg()" sm>Cancel</b-button>
        </b-col>
      </b-row>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'customMod',
      'characterBank'
    ])
  },
  data () {
    return {
      emitting: false,
      queued: false,
      charname: '',
      selectedMod: 'Normal',
      payload: {},
      argEnter: false,
      argRaw: '',
      cMod: null
    }
  },
  created () {
    this.charname = this.name
    if (this.starter !== 'Normal') {
      this.updateMod(this.starter)
    }
    if (this.eventFlag) {
      this.emitting = true
    }
  },
  methods: {
    ...mapActions([
      'addCModToDC',
      'remCModFromDC',
      'modSpeaker'
    ]),
    clickedCustom () {
      this.cMod.args = this.argRaw.split()
      this.addCModToDC({ id: this.activeContainerID, mod: this.cMod })
      this.argRaw = ''
      this.closeArg()
    },
    closeArg () {
      this.argEnter = false
    },
    propUpdate (payload) {
      this.charname = payload.spName
      var pL = { id: this.id, name: payload.spName }
      this.modSpeaker(pL)
      this.$emit('propUpdate', pL)
    },
    showArg (m) {
      const modFound = this.mod.findIndex(e => e.flag === m.flag)
      this.cMod = m
      if (modFound > -1) {
        this.remCModFromDC({ id: this.activeContainerID, mod: this.cMod })
      } else {
        this.argEnter = true
      }
    },
    updateMod (mod) {
      var modToSend = ''
      if (mod === 'Event') {
        modToSend = 'Event'
      } else {
        this.selectedMod = mod
        modToSend = mod
      }
      this.payload = { mod: modToSend, updateState: true, emitting: this.emitting, created: false }
      this.$emit('updateMod', this.payload)
    }
  },
  props: {
    id: String,
    name: String,
    starter: String,
    eventFlag: Boolean,
    mod: Array,
    activeContainerID: String
  }
}
</script>

<style scoped>
  .btn-secondary, .btn-secondary:hover,
  .btn-secondary:focus, .btn-secondary:active {
    background: #b085f5;
    color: #f5f7fa;
    border-color: #b085f5;
  }
</style>
