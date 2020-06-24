export default [
  {
    id: '1aS4D',
    name: 'Speaker',
    msg: 'This is message 1',
    mod: [],
    parent: '',
    nest: 0
  },
  {
    id: '22jJi',
    name: 'Listener',
    msg: 'This is an option',
    mod: [{ flag: 'Option', args: ['2j4kl', '235d4'] }],
    parent: '',
    nest: 0
  },
  {
    id: '2j4kl',
    name: 'Speaker',
    msg: 'This is an option',
    mod: [],
    parent: '22jJi',
    nest: 1
  },
  {
    id: '235d4',
    name: 'Speaker',
    msg: 'This is another option',
    mod: [],
    parent: '22jJi',
    nest: 1
  }
]
