import Vue from 'vue'
import Vuex from 'vuex'

import dialogueData from '@/data/dialogueData.js'
import characterBank from '@/data/characterBank.js'
import dialogueBank from '@/data/dialogueBank.js'
import activeUser from '@/data/user.js'
import projectBank from '@/data/projectBank.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialogueData,
    characterBank,
    dialogueBank,
    activeUser,
    projectBank
  },
  mutations: {
    appendDialogue: (state, Dialogue) => {
      state.dialogueData.push(Dialogue)
    },
    appendProject: (state, project) => {
      const toInsert = { name: project.projectName, id: project.projectID, sceneBank: [] }
      state.projectBank.push(toInsert)
    },
    modifyDialogue: (state, Dialogue) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === Dialogue.id)
      if (toModIndex > -1) {
        state.dialogueData.splice(toModIndex, 1, Dialogue)
      }
    },
    modifySpeaker: (state, Dialogue) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === Dialogue.id)
      if (toModIndex > -1) {
        state.dialogueData[toModIndex].name = Dialogue.name
      }
    },
    removeDialogue: (state, id) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === id)
      if (toModIndex > -1) {
        state.dialogueData.splice(toModIndex, 1)
      }
    },
    appendSpeaker: (state, Speaker) => {
      state.characterBank.push(Speaker)
    },
    swapBankData: (state, bank) => {
      console.log('enter swapBank: ' + bank.old + bank.new)
      // push updates to Bank
      var toModIndex = state.dialogueBank.findIndex(scene => scene.id === bank.old)
      console.log('toModIndex ' + toModIndex)
      var oldData = []
      var element
      for (element of state.dialogueData) {
        oldData.push(element)
      }
      var x, oldLength
      oldLength = state.dialogueData.length
      for (x = 0; x < oldLength; x++) {
        state.dialogueData.pop()
      }
      if (toModIndex > -1) {
        var toInsert = { name: state.dialogueBank[toModIndex].name, id: bank.old, data: oldData }
        state.dialogueBank[toModIndex] = toInsert
      }
      // swap to new Scene
      if (bank.new === undefined) {
        // swapping because of scene deletion
        console.log('swapping because of a deletion')
        toModIndex = 0
      } else {
        // swapping because of selection of another scene
        toModIndex = state.dialogueBank.findIndex(scene => scene.id === bank.new)
      }
      if (state.dialogueBank.length > 0) {
        for (element of state.dialogueBank[toModIndex].data) {
          state.dialogueData.push(element)
        }
      }
    },
    swapProjectBank: (state, project) => {
      console.log('enterswapproject: ' + project.old + ', ' + project.new)
      // push updates from dialogueData to projectBank
      var toModIndex = state.projectBank.findIndex(p => p.id === project.old)
      console.log('toModIndex ' + toModIndex)
      var oldData = []
      var element
      for (element of state.dialogueData) {
        oldData.push(element)
      }
      var x, oldLength
      oldLength = state.dialogueData.length
      for (x = 0; x < oldLength; x++) {
        state.dialogueData.pop()
      }
      if (toModIndex > -1) {
        var toInsert = { name: state.dialogueBank[toModIndex].name, id: project.old, data: oldData }
        state.dialogueBank[toModIndex] = toInsert
      }
      // swap to new Scene
      if (project.new === undefined) {
        // swapping because of scene deletion
        console.log('swapping because of a deletion')
        toModIndex = 0
      } else {
        // swapping because of selection of another scene
        toModIndex = state.dialogueBank.findIndex(scene => scene.id === project.new)
      }
      if (state.dialogueBank.length > 0) {
        for (element of state.dialogueBank[toModIndex].data) {
          state.dialogueData.push(element)
        }
      }
    },
    appendScene: (state, scene) => {
      const toInsert = { name: scene.sceneName, id: scene.sceneID, data: [] }
      state.dialogueBank.push(toInsert)
    },
    removeScene: (state, scene) => {
      // cut item from bank
      const toModIndex = state.dialogueBank.findIndex(element => element.id === scene)
      if (toModIndex > -1) {
        state.dialogueBank.splice(toModIndex, 1)
      }
    },
    changeActiveUser: (state, user) => {
      state.activeUser = user
    }
  },
  actions: {
    addDialogue: ({ commit }, added) => {
      commit('appendDialogue', added)
    },
    modDialogue: ({ commit }, modded) => {
      commit('modifyDialogue', modded)
    },
    modSpeaker: ({ commit }, modded) => {
      commit('modifySpeaker', modded)
    },
    remDialogue: ({ commit }, removed) => {
      commit('removeDialogue', removed)
    },
    addSpeaker: ({ commit }, added) => {
      commit('appendSpeaker', added)
    },
    swapBank: ({ commit }, bank) => {
      commit('swapBankData', bank)
    },
    swapProject: ({ commit }, project) => {
      commit('swapProjectBank', project)
    },
    addScene: ({ commit }, scene) => {
      commit('appendScene', scene)
    },
    remScene: ({ commit }, scene) => {
      commit('removeScene', scene)
    },
    changeUser: ({ commit }, user) => {
      commit('changeActiveUser', user)
    },
    addProject: ({ commit }, project) => {
      commit('appendProject', project)
    }
  },
  modules: {
  }
})
