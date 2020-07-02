<template>
  <div class="home">
    <b-container fluid>
      <b-row>
        <SpeakerCreate class="toolbar" align="left"/>
        <SceneCreate class="toolbar" align="left"/>
      </b-row>
      <b-row>
        <b-col class="col-md-auto">
          <SceneManager
          v-bind:activeScene="activeScene"
          @setActiveScene="setActiveScene"
          />
        </b-col>
        <b-col>
          <DialogueInitiator
          v-if="dialogueData.length == 0"
          v-bind:activeScene="activeScene"/>
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
import DialogueInitiator from '@/components/DialogueInitiator.vue'
import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    DialogueContainer,
    SpeakerCreate,
    SceneManager,
    DialogueInitiator,
    SceneCreate
  },
  computed: {
    ...mapState([
      'dialogueData'
    ])
  },
  methods: {
    setActiveContainerID (payload) {
      this.activeContainerID = payload
    },
    setActiveScene (payload) {
      this.activeScene = payload
    }
  },
  data () {
    return {
      activeContainerID: 'none',
      activeScene: 'scene1'
    }
  }
}
</script>

<style>
  .toolbar {
    padding: 0px 20px 20px 0px
  }
</style>
