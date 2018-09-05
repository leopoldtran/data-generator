const fs = require('fs')
const faker = require('faker')
const { name, random, image, internet, date, lorem, company, address, phone } = faker

const NUMBERS = {
  user: 10,
  profile: 5,
  badge: 5,
  certificate: 15, 
  issuerPerProfile: 5,
  certifierPerBadge: 2,
}

const checkInRange = ({ number, min, max }) => (number >= min && number <= max)

const randomNumbers = ({ min, max, total }) => {
  const numbers = []
  // if (total === max - min) {

  // }
  while (numbers.length < total) {
    let num = random.number({ min, max })
    if (!numbers.includes(num)) {
      numbers.push(num)
    }
  }
  return numbers
}


const randomElementFromArray = ({ arr, min = 0, max = 0 }) => {
  const index = random.number({ min, max })
  if (checkInRange({ number: index, min: 0, max: arr.length - 1 })) {
    return arr[index]
  }
  return arr[0]
}

const randomElementsFromArray = ({ arr, numOfElements }) => {
  const indexes = randomNumbers({ min: 0, max: arr.length - 1, total: numOfElements })
  return arr.filter((e, i) => (indexes.includes(i)))
}

const randomUser = () => ({
  id: random.uuid(),
  firstName: name.firstName(),
  lastName: name.lastName(),
  email: internet.email(),
  image: image.avatar(),
  username: internet.userName(),
})

const randomProfile = ({ users }) => ({
  id: random.uuid(),
  name: company.companyName(),
  telephone: phone.phoneNumber(),
  description: lorem.paragraphs(),
  url: internet.url(),
  image: image.technics(),
  email: internet.email(),
  address: `${address.streetAddress()}, ${address.city()}, ${address.country()}`,
  issuers: randomElementsFromArray({ arr: users, numOfElements: NUMBERS.issuerPerProfile }).map(e => e.id)
})

const randomBadge = ({ profiles }) => {
  const profile = randomElementFromArray({ arr: profiles, min: 0, max: profiles.length - 1 })
  const { issuers } = profile
  return ({
    id: random.uuid(),
    name: random.words(3),
    description: lorem.sentence(),
    image: image.abstract(),
    criteria: [random.word(), random.word()],
    issuer: profile.id,
    certifiers: randomElementsFromArray({arr: issuers, numOfElements: NUMBERS.certifierPerBadge}),
    alignment: [lorem.sentences()],
    tags: [random.word(), random.word()],
  })
}

const randomeCertificate = ({ badges, users, profiles }) => {
  const revoked = random.boolean()
  const badge = randomElementFromArray({ arr: badges, min: 0, max: badges.length - 1 })
  const profile = randomElementFromArray({ arr: profiles, min: 0, max: profiles.length - 1 })
  return ({
    id: random.uuid(),
    badge: badge.id,
    issuedOn: date.past(),
    image: image.animals(),
    evidence: [lorem.sentence(), lorem.sentence()],
    narrative: [lorem.sentence(), lorem.sentence()],
    expires: date.future(),
    revoked,
    revocationReason: revoked ? lorem.sentence() : '',
    name: random.words(5),
    description: lorem.paragraphs(),
    certifier: randomElementFromArray({ arr: badge.certifiers, min: 0, max: badge.certifiers.length - 1 }),
    issuer: profile.id,
    issuerName: profile.name,
  })
}

const users = []
for (let i = 0; i < NUMBERS.user; i++) {
  users.push(randomUser())
}
const profiles = []
for (let i = 0; i < NUMBERS.profile; i++) {
  profiles.push(randomProfile({ users }))
}
const badges = []
for (let i = 0; i < NUMBERS.badge; i++) {
  badges.push(randomBadge({ profiles }))
}
const certificates = []
for (let i = 0; i < NUMBERS.certificate; i++) {
  certificates.push(randomeCertificate({ users, badges, profiles }))
}
const data = {
  users,
  profiles,
  badges,
  certificates,
}
fs.writeFile('./SampleData.json', JSON.stringify(data), err => {
  if(err) {
    console.log('Cannot write to file')
    return
  }
  console.log('Write successfully')
})

