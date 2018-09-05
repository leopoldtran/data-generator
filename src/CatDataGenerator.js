const fs = require('fs')
const faker = require('faker')

const MAX_RECORDS = 20

const { name, random, image, address, commerce, lorem } = faker

const randomCat = id => ({
  id: id,
  name: name.firstName(),
  image: image.cats(),
  description: lorem.words(),
  color: commerce.color(),
  address: address.streetAddress(),
})
const cats = []
for(let i = 0; i < MAX_RECORDS; i++) {
  cats.push(randomCat(i))
}

const stream = fs.createWriteStream('cats.txt')
stream.once('open', () => {
  cats.forEach(cat => stream.write(Object.values(cat).join() + '\n'))
  stream.end()
})