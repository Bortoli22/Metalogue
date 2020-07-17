<template>
    <div>
            <b-button-group>
                <SpeakerSelect @propUpdate="propUpdate"
                    v-bind:id="id"
                    v-bind:name="charname"
                />
                <b-dropdown right v-bind:text="selectedMod">
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
            </b-button-group>
    </div>
</template>

<script>
import SpeakerSelect from '@/components/SpeakerSelect.vue'

export default {
  components: {
    SpeakerSelect
  },
  data () {
    return {
      emitting: false,
      queued: false,
      charname: '',
      selectedMod: 'Normal',
      payload: {}
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
    propUpdate (payload) {
      this.charname = payload.name
      this.$emit('propUpdate', payload)
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
    eventFlag: Boolean
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
