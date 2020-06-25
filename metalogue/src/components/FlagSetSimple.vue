<template>
    <div>
        <SpeakerSelect @propUpdate="propUpdate"
            v-bind:id="parentID"
            v-bind:name="charname"
        />
        <b-row>
            <p v-if="this.mod.length === 1">Flag:  </p>
            <p v-if="this.mod.length > 1">Flags:  </p>
            <p v-for="modifier in mod" v-bind:key="modifier.flag">{{ modifier.flag }}, </p>
        </b-row>
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
      parentID: '',
      charname: '',
      mod: [],
      selectedMod: 'Normal',
      payload: {}
    }
  },
  created () {
    this.parentID = this.id
    this.charname = this.name
    this.mod = this.modProp
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
    starter: String,
    modProp: Array
  }
}
</script>
