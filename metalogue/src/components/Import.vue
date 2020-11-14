<template>
    <div>
        <b-card class="middark">
            <p class="card-text">Import a Project (MM or JSON)</p>
            <b-form-file
            v-model="file"
            :state="Boolean(file)"
            placeholder="Choose a file or drop it here..."
            drop-placeholder="Drop file here..."
            accept=".json, .txt, .res"
            ></b-form-file>
            <b-row id="upload" align-h="center">
              <b-button-group>
                <b-button v-on:click="importing()" variant="info" size="sm">Import</b-button>
                <b-button v-on:click="close()" variant="danger" size="sm">Close</b-button>
              </b-button-group>
            </b-row>
            {{ error }}
        </b-card>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import * as fire from '../firebase'

export default {
  computed: {
    ...mapState([
      'characterBank',
      'dialogueBank',
      'projectBank',
      'activeUser',
      'customMod'
    ])
  },
  data () {
    return {
      file: null,
      error: '',
      addedProject: false
    }
  },
  methods: {
    ...mapActions([
      'imScene',
      'addProject',
      'swapProject',
      'remProject'
    ]),
    async caughtError (err, msg, id) {
      console.log(err)
      this.error = msg
      this.file = null
      if (this.addedProject) {
        this.addedProject = false
        this.remProject(id)
        await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
          projects: this.projectBank
        })
      }
    },
    importing () {
      if (this.file === null) {
        this.error = 'Please upload a valid file'
        return
      }
      this.error = this.file.type
      if (this.file.type === 'text/plain') {
        // importing MM
        this.manageMM()
      } else if (this.file.type === 'application/json') {
        // importing JSON
        this.manageJSON()
      } else {
        this.error = 'Please upload a valid file'
      }
    },
    manageJSON () {
      var parsedData = new FileReader()
      parsedData.onload = async (e) => {
        var dupSearch
        try {
          var jsonData = JSON.parse(e.target.result)
        } catch (err) {
          this.caughtError(err, 'Invalid JSON', null)
          return
        }

        try {
          // import a JSON project
          dupSearch = this.projectBank.findIndex(e => e.id === jsonData.id)
          if (dupSearch >= 0) {
            this.error = 'Project exists, overwriting...'
          } else {
            this.addProject({ projectName: jsonData.name, projectID: jsonData.id, characterBank: jsonData.characterBank })
            await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
              projects: this.projectBank
            })
            this.addedProject = true
          }
          this.swapProject({ sBank: jsonData.sceneBank, pID: jsonData.id, characterBank: jsonData.characterBank })
          this.$emit('setActiveProjectID', jsonData.id)
          if (this.dialogueBank.length > 0) {
            this.$emit('setActiveSceneID', this.dialogueBank[0].id)
          }
        } catch (err) {
          this.caughtError(err, 'There was an error importing this JSON project', jsonData.id)
          return
        }
        this.error = 'Import Complete'
      }
      parsedData.readAsText(this.file)
    },
    manageMM () {
      var parsedData = new FileReader()
      parsedData.onload = async (e) => {
        var dupSearch, toObject, sceneData, el
        var rawText = e.target.result.split('\n')
        try {
          // import a MM project
          var sBank = []
          var cBank = []
          var pIndex = 3
          var rawSplit
          for (el = pIndex; el < rawText.length; el++) {
            pIndex = el
            rawSplit = rawText[el].split(' ')
            if (rawSplit.length < 2) {
              break
            }
            cBank.push({ spName: rawSplit[1], spID: rawSplit[2] })
          }

          sceneData = rawText[pIndex + 1].split(' ')
          toObject = { name: sceneData[1], id: sceneData[2], data: [] }
          for (el = pIndex + 2; el < rawText.length; el++) {
            rawSplit = rawText[el].split(' ')
            if (rawSplit.length === 4) {
              // new scene
              sBank.push(toObject)
              toObject = { name: rawSplit[1], id: rawSplit[2], data: [] }
            } else if (rawSplit.length > 5) {
              toObject.data.push(this.MMextract(rawText[el], cBank))
            }
          }
          sBank.push(toObject)

          // add project
          var projectData = rawText[0].split(' ')
          dupSearch = this.projectBank.findIndex(e => e.id === projectData[2])
          if (dupSearch >= 0) {
            this.error = 'Project exists, overwriting...'
          } else {
            this.addProject({ projectName: projectData[1], projectID: projectData[2], characterBank: cBank })
            await fire.usersCollection.doc(fire.auth.currentUser.uid).update({
              projects: this.projectBank
            })
            this.addedProject = true
          }

          // swap to project
          this.swapProject({ sBank: sBank, pID: projectData[2], characterBank: cBank })
          this.$emit('setActiveProjectID', projectData[2])
          if (sBank.length > 0) {
            this.$emit('setActiveSceneID', sBank[0].id)
          }
        } catch (err) {
          this.caughtError(err, 'There was an error importing this MM project', projectData[2])
          return
        }

        this.error = 'Import Complete'
      }
      parsedData.readAsText(this.file)
    },
    MMextract (el, cBank) {
      const regex = /[&<>]/g
      var metaParse = el.substring(0, el.lastIndexOf('*/') + 2).split(' ')

      // get mods
      var getMod = []
      var getArgs = []
      var modName = ''
      var parseIndex = 3
      while (metaParse[parseIndex] !== '`' && parseIndex < 1000) {
        modName = ''
        switch (metaParse[parseIndex]) {
          case '-x':
            modName = 'Event'
            break
          case '-r':
            modName = 'Response'
            break
          case '-rl':
            modName = 'Roulette'
            break
          case '-o':
            modName = 'Option'
            break
          case '-q':
            modName = 'Queue'
            break
          default:
            var cmI = this.customMod.findIndex(e => e.shorthand === metaParse[parseIndex])
            if (cmI >= 0) {
              modName = this.customMod[cmI].flag
            }
            break
        }

        // get args
        if (modName !== '') {
          parseIndex++
          while (metaParse[parseIndex].indexOf('-') === -1 && metaParse[parseIndex] !== '`' && parseIndex < 1000) {
            getArgs.push(metaParse[parseIndex])
            parseIndex++
          }
          parseIndex--
          if (modName === 'Event') {
            getMod.push({ flag: modName, args: getArgs[0] })
          } else {
            getMod.push({ flag: modName, args: getArgs })
          }
          getArgs = []
        }
        parseIndex++
      }

      // get parent
      var getParent = ''
      if (metaParse[parseIndex + 3] !== '*/') {
        getParent = metaParse[parseIndex + 3]
      }

      // create and send object
      var createdDC = {
        id: metaParse[2],
        name: cBank.find(e => e.spID === metaParse[1]).spName,
        msg: el.substring(el.lastIndexOf('*/') + 3, el.length).replace(regex, 'bad'),
        mod: getMod,
        nest: parseInt(metaParse[parseIndex + 1]),
        importKey: parseInt(metaParse[parseIndex + 2]) + 1,
        parent: getParent
      }
      return createdDC
    },
    close () {
      this.$emit('close', null)
      this.file = null
      this.error = ''
    }
  },
  props: {
    activeSceneID: String
  }
}
</script>

<style scoped>
  .middark {
    background-color: #3E4C59;
    color: #f5f7fa;
  }
  #upload {
      margin-top: 10px;
  }
</style>
