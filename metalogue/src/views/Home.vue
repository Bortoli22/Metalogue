<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <b-button v-on:click="testAdd">TEST</b-button>
        <SpeakerCreate class="toolbar" align="left"/>
        <SceneCreate class="toolbar" align="left"/>
        <SceneDelete
        v-bind:activeSceneID="activeSceneID"
        @setActiveScene="setActiveScene"
        class="toolbar" align="left"/>
      </b-row>
      <b-row>
        <b-col class="col-md-auto">
          <SceneManager
          v-bind:activeSceneID="activeSceneID"
          @setActiveScene="setActiveScene"
          />
        </b-col>
        <b-col>
          <SceneInitiator
          v-if="dialogueBank.length === 0"/>
          <DialogueInitiator
          v-if="(dialogueData.length === 0) && (dialogueBank.length > 0)"
          v-bind:activeSceneID="activeSceneID"/>
          <DialogueContainer
          v-for="val in dialogueData"
          v-bind:key="val.id+val.nest"
          v-bind:msg="val.msg"
          v-bind:id="val.id"
          v-bind:name="val.name"
          v-bind:modProp="val.mod"
          v-bind:nestProp="val.nest"
          v-bind:parentProp="val.parent"
          v-bind:activeContainerID="activeContainerID"
          @setActiveContainerID="setActiveContainerID"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
// @ is an alias to /src
import DialogueContainer from '@/components/DialogueContainer.vue'
import SpeakerCreate from '@/components/SpeakerCreate.vue'
import SceneManager from '@/components/SceneManager.vue'
import SceneCreate from '@/components/SceneCreate.vue'
import SceneDelete from '@/components/SceneDelete.vue'
import DialogueInitiator from '@/components/DialogueInitiator.vue'
import SceneInitiator from '@/components/SceneInitiator'
import { mapState } from 'vuex'

import * as fire from '../firebase.js'

export default {
  name: 'Home',
  components: {
    DialogueContainer,
    SpeakerCreate,
    SceneManager,
    DialogueInitiator,
    SceneCreate,
    SceneInitiator,
    SceneDelete
  },
  computed: {
    ...mapState([
      'dialogueData',
      'dialogueBank'
    ])
  },
  methods: {
    testAdd () {
      const test = fire.usersCollection.doc('eCJNmJMgi62bEwSmn81w').get()
      // const comment = test.data
      console.log(test)
    },
    setActiveContainerID (payload) {
      this.activeContainerID = payload
    },
    setActiveScene (payload) {
      this.activeSceneID = payload
    }
  },
  data () {
    return {
      activeContainerID: 'none',
      activeSceneID: 'dj3K9'
    }
  }
}
</script>

<style>
  .toolbar {
    padding: 0px 20px 20px 0px
  }
</style>
