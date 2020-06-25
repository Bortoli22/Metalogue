<template>
    <div>
        <SpeakerSelect @propUpdate="propUpdate"
            v-bind:id="this.id"
            v-bind:name="this.name"
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
      mod: [],
      payload: {}
    }
  },
  created () {
    this.mod = this.modProp
  },
  methods: {
    propUpdate (payload) {
      this.$emit('propUpdate', payload)
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
