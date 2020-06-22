<template>
    <div>
        <b-button-group vertical>
            <b-button-group>
                <SpeakerSelect />
                <b-button>E</b-button>
            </b-button-group>
            <b-button-group>
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
                <b-button>Q</b-button>
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
      selectedMod: 'Normal'
    }
  },
  methods: {
    updateMod (mod) {
      this.selectedMod = mod
    }
  }
}
</script>
