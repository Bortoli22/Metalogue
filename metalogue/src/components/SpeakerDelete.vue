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
import * as fire from '../firebase'

export default {
  created () {
    for (var e of this.selectedBank) {
      this.selectedBank.pop()
    }
    const toModIndex = this.projectBank.findIndex(element => element.id === this.activeProjectID)
    if (toModIndex > -1) {
      for (e of this.projectBank[toModIndex].characterBank) {
        if (e.spID !== '00000') { this.selectedBank.push(e) }
      }
    }
  },
  computed: {
    ...mapState([
      'projectBank'
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
      try {
        this.remSpeaker({ spID: this.toDelete, pID: this.activeProjectID })
        await fire.usersCollection.doc(fire.auth.currentUser.uid)
          .update({ projects: this.projectBank })
      } catch (err) {
        console.log(err)
      }
      this.toDelete = ''
      this.$emit('close', null)
    },
    speakerSelect (speaker) {
      this.toDelete = speaker.spID
    }
  },
  props: {
    activeProjectID: String
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
    color: #f5f7fa;
  }
  .table {
    margin-bottom: 10px
  }
</style>
