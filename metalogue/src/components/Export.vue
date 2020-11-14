<template>
    <div>
        <b-spinner v-if="isExporting" label="Loading..."></b-spinner>
        <b-dropdown v-if="!isExporting" id="dropdown-right" right text="Export">
            <b-dropdown-group id="dropdown-group-2" header="Project">
                <b-dropdown-item v-on:click="exporting('mm')">Export as MM </b-dropdown-item>
                <b-dropdown-item v-on:click="exporting('json')">Export as JSON </b-dropdown-item>
            </b-dropdown-group>
        </b-dropdown>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'dialogueData',
      'dialogueBank',
      'characterBank',
      'customMod',
      'activeUser',
      'projectBank'
    ])
  },
  data () {
    return {
      isExporting: false,
      toModIndex: -1
    }
  },
  methods: {
    exporting (type) {
      this.isExporting = true
      this.toModIndex = this.projectBank.findIndex(e => e.id === this.activeProjectID)
      var name = 'ProjectExport'
      if (this.toModIndex > -1) {
        name = this.projectBank[this.toModIndex].name
      }
      try {
        var toSend = this.pack(type)
      } catch (err) {
        console.log(err)
        this.isExporting = false
        return
      }
      var element = document.createElement('a')
      if (type === 'mm') {
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(toSend))
        name += '.res'
      } else {
        element.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(toSend))
      }
      element.setAttribute('download', name)
      element.style.display = 'none'
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      this.isExporting = false
    },
    pack (type) {
      var packed = ''
      var element
      var subelement
      var passFlag = ''
      var index = 0
      if (type === 'mm') {
        var pName = this.projectBank.find(e => e.id === this.activeProjectID).name
        packed += '/* ' + pName + ' ' + this.activeProjectID + ' */\n\n'
        // pack characterBank
        if (this.toModIndex < 0) {
          return packed
        }
        packed += '/* CharacterBank */\n'
        for (element of this.projectBank[this.toModIndex].characterBank) {
          packed += '/* ' + element.spName + ' ' + element.spID + ' */\n'
        }
        packed += '\n'
        for (element of this.dialogueBank) {
          packed += '/* ' + element.name + ' ' + element.id + ' */\n'
          for (subelement of element.data) {
            // assign opener, sequence, and/or terminus
            if (index === 0) {
              passFlag = '-z '
            } else if (index === element.data.length - 1) {
              passFlag = '-t '
            } else {
              passFlag = '-s '
            }
            packed += this.mm(subelement, passFlag)
            index++
          }
          index = 0
          packed += '\n'
        }
      } else if (type === 'json') {
        var getP = this.projectBank.find(e => e.id === this.activeUser.currentProjectID)
        var p = { name: getP.name, id: this.activeUser.currentProjectID, sceneBank: this.dialogueBank, characterBank: getP.characterBank }
        packed = JSON.stringify(p)
      }
      return packed
    },
    mm (element, passFlag) {
      var mmString = '/* '
      var sName
      if (this.projectBank[this.toModIndex].characterBank.find(e => e.spName === element.name) === undefined) {
        sName = '00000'
      } else {
        sName = this.projectBank[this.toModIndex].characterBank.find(e => e.spName === element.name).spID
      }
      mmString = mmString + sName + ' ' + element.id + ' ' + passFlag
      var f
      var arg
      var cMod
      var addArgs = false
      for (f of element.mod) {
        // assign option, roulette, event and/or custom flag
        switch (f.flag) {
          case 'Option':
            mmString += '-o '
            addArgs = true
            break
          case 'Roulette':
            mmString += '-rl '
            addArgs = true
            break
          case 'Response':
            mmString += '-r '
            addArgs = true
            break
          case 'Queue':
            mmString += '-q '
            addArgs = true
            break
          case 'Event':
            mmString = mmString + '-x ' + f.args + ' '
            addArgs = false
            break
          default:
            cMod = this.customMod.find(e => e.flag === f.flag)
            if (cMod !== undefined) {
              mmString = mmString + cMod.shorthand + ' ' + f.args + ' '
            }
            addArgs = false
            break
        }
        if (addArgs) {
          for (arg of f.args) {
            mmString = mmString + arg + ' '
          }
        }
      }
      mmString = mmString + '` ' + element.nest + ' ' + element.importKey + ' ' + element.parent + ' */ ' + element.msg + '\n'
      return mmString
    }
  },
  props: {
    activeProjectID: String,
    activeSceneID: String
  }
}
</script>
