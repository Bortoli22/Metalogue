<template>
    <div>
        <b-button-group vertical>
            <b-button-group>
                <SpeakerSelect @propUpdate="propUpdate"
                    v-bind:id="parentID"
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
                  v-on:click="updateEvent()"
                >Event</b-button>
                <b-button v-bind:pressed.sync="queued">Queue</b-button>
            </b-button-group>
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
      parentID: '',
      charname: '',
      selectedMod: 'Normal',
      payload: {}
    }
  },
  created () {
    this.parentID = this.id
    this.charname = this.name
    if (this.starter !== 'Normal') {
      this.updateMod(this.starter)
    }
  },
  methods: {
    propUpdate (payload) {
      this.sentId = payload.id
      this.charname = payload.name
      this.$emit('propUpdate', payload)
    },
    updateEvent () {
      this.payload = { emitting: this.emitting }
      this.$emit('updateEvent', this.payload)
    },
    updateMod (mod) {
      this.selectedMod = mod
      this.payload = { mod: this.selectedMod, updateState: true }
      this.$emit('updateMod', this.payload)
    }
  },
  props: {
    id: String,
    name: String,
    starter: String
  }
}
</script>
