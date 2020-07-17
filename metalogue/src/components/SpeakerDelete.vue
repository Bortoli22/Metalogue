<template>
    <div>
        <b-card class="middark">
          <p class="card-text">Select a speaker, then select 'Delete' to confirm</p>
          <b-list-group class="table">
              <b-list-group-item
                v-for="speaker in selectedBank"
                v-bind:key="speaker.spID"
                v-bind:class="[{'activated' : (toDelete === speaker.spID ? true : false)},
                  {'hoverable' : (toDelete === speaker.spID ? false : true)}]"
                v-on:click="speakerSelect(speaker)"
                > {{ speaker.spName }}
              </b-list-group-item>
          </b-list-group>
          <p v-if="this.selectedBank.length === 0">No speakers to delete</p>
          <b-button-group>
              <b-button v-on:click="deleteMod()" variant="danger" size="sm">Delete</b-button>
              <b-button v-on:click="close()" variant="info" size="sm">Cancel</b-button>
          </b-button-group>
        </b-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  created () {
    for (var e of this.selectedBank) {
      this.selectedBank.pop()
    }
    for (e of this.characterBank) {
      if (e.spID !== '00000') { this.selectedBank.push(e) }
    }
  },
  computed: {
    ...mapState([
      'characterBank'
    ])
  },
  data () {
    return {
      toDelete: '',
      selectedBank: []
    }
  },
  methods: {
    ...mapActions([
      'remSpeaker'
    ]),
    close () {
      this.$emit('close', null)
      this.toDelete = ''
    },
    async deleteMod () {
      if (this.toDelete === '') {
        return
      }
      this.remSpeaker(this.toDelete)
      this.toDelete = ''
      this.$emit('close', null)
    },
    speakerSelect (speaker) {
      this.toDelete = speaker.spID
    }
  }
}
</script>

<style scoped>
  .activated {
    background: #b085f5
  }
  .hoverable {
    background: #3e4c59
  }
  .activated, .hoverable {
    color: #f5f7fa;
    border: none
  }
  .hoverable:hover {
    cursor: pointer;
    background: #323f4b
  }
  .middark {
    background-color: #3E4C59;
  }
  .table {
    margin-bottom: 5px
  }
</style>
