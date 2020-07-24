<template>
    <div>
        <b-card class="middark">
          <p class="card-text">Select a mod, then select 'Delete' to confirm</p>
          <b-list-group class="table">
              <b-list-group-item
                v-for="mod in customMod"
                v-bind:key="mod.flag"
                v-bind:class="[{'activated' : (toDelete === mod.flag ? true : false)},
                  {'hoverable' : (toDelete === mod.flag ? false : true)}]"
                v-on:click="modSelect(mod)"
                > {{ mod.flag }}
              </b-list-group-item>
          </b-list-group>
          <p v-if="this.customMod.length === 0">No custom mod to delete</p>
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
  computed: {
    ...mapState([
      'customMod'
    ])
  },
  data () {
    return {
      toDelete: ''
    }
  },
  methods: {
    ...mapActions([
      'remCMod'
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
        await fire.usersCollection.doc(fire.auth.currentUser.uid).collection('mods').doc('All').set({
          mods: this.customMod
        })
      } catch (err) {
        console.log(err)
      }
      this.remCMod(this.toDelete)
      this.toDelete = ''
      this.$emit('close', null)
    },
    modSelect (mod) {
      this.toDelete = mod.flag
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
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
