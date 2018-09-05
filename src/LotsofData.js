const fs = require('fs')
const faker = require('faker')
const { name } = faker

const size = 100
const fileName = 'add_randomElement_size' + size
const data = {}
for (let i = 0; i < size; i++) {
  let word = name.firstName()
  if(!data[word]) {
    data[word] = 1
  } else {
    data[word]++
  }
  // console.log('A',(i+10).toString(36))
  
}
/**
 * Input
 */
const stream = fs.createWriteStream(fileName + '.in')
stream.once('open', () => {
  Object.keys(data).forEach(key => stream.write('A ' + key + '\n'))
  const total = Object.keys(data).length
  stream.write('S ' + Object.keys(data)[0] + '\n') // search first element in list
  stream.write('S ' + Object.keys(data)[total-1] + '\n') // search last element in list
  stream.write('P\n')
  stream.write('RA ' + Object.keys(data)[0] + '\n') // remove first
  stream.write('RA ' + Object.keys(data)[total-1] + '\n') // remove last
  stream.write('Q')
  console.log('To be removed first ' + Object.keys(data)[0])
  console.log('To be removed last ' + Object.keys(data)[total-1])
  // delete data[Object.keys(data)[0]]
  // delete data[Object.keys(data)[total-2]]
  stream.end()
})
/**
 * Search output
 */
const streamS = fs.createWriteStream(fileName + '.search.exp')
streamS.once('open', () => {
  const total = Object.keys(data).length
  const first = data[Object.keys(data)[0]]
  const last = data[Object.keys(data)[total-1]]
  streamS.write(Object.keys(data)[0] + ' ' + first + '\n')
  streamS.write(Object.keys(data)[total-1] + ' ' + last + '\n')
  // delete data[Object.keys(data)[0]]
  // delete data[Object.keys(data)[total-2]]
  streamS.end()
})

/**
 * Print output
 */
const streamO = fs.createWriteStream(fileName + '.exp')
streamO.once('open', () => {
  Object.keys(data).forEach(key => streamO.write(key + ' | ' + data[key] + '\n'))
  streamO.end()
})