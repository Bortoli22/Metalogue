import Vue from 'vue'
import Vuex from 'vuex'

import dialogueData from '@/data/dialogueData.js'
import characterBank from '@/data/characterBank.js'
import dialogueBank from '@/data/dialogueBank.js'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    dialogueData,
    characterBank,
    dialogueBank
  },
  mutations: {
    appendDialogue: (state, Dialogue) => {
      state.dialogueData.push(Dialogue)
    },
    modifyDialogue: (state, Dialogue) => {
      const toModIndex = state.dialogueData.findIndex(element => element.id === Dialogue.id)
      if (toModIndex > -1) {
        state.dialogueData[toModIndex] = Dialogue
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
      console.log('enter swapBank' + bank.old + bank.new)
      // push updates to Bank
      var toModIndex = state.dialogueBank.findIndex(scene => scene.name === bank.old)
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
      var toInsert = { name: bank.old, data: oldData }
      if (toModIndex > -1) {
        state.dialogueBank[toModIndex] = toInsert
      }
      // swap to new Scene
      toModIndex = state.dialogueBank.findIndex(scene => scene.name === bank.new)
      for (element of state.dialogueBank[toModIndex].data) {
        state.dialogueData.push(element)
      }
    },
    appendScene: (state, scene) => {
      const toInsert = { name: scene.sceneName, data: [] }
      state.dialogueBank.push(toInsert)
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
    addScene: ({ commit }, scene) => {
      commit('appendScene', scene)
    }
  },
  modules: {
  }
})
