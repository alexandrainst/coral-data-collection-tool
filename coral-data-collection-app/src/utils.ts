import countries from '../../common_assets/countries.json' assert { type: 'json' }
import languages from '../../common_assets/languages.json' assert { type: 'json' }
import selectables from './assets/selectables.json' assert { type: 'json' }
import { type RouterInputs } from './trpc'
import { SupervisorInputData, UserInputData } from './types'

const COUNTRY_CODES_PRIORITIES = [
  'DK',
  'GB-ENG',
  'DE',
  'FR',
  'SE',
  'NO',
].reverse()

const LANGUAGE_CODES_PRIORITIES = ['da', 'en', 'de', 'fr', 'sv', 'no'].reverse()

export const countryOptions = Object.entries(countries)
  .sort((a, b) => a[1].localeCompare(b[1], 'da', { sensitivity: 'accent' }))
  .sort(
    (a, b) =>
      COUNTRY_CODES_PRIORITIES.indexOf(b[0]) -
      COUNTRY_CODES_PRIORITIES.indexOf(a[0])
  )
  .map(l => l[1])

export const languageOptions = Object.entries(languages)
  .sort((a, b) => a[1].localeCompare(b[1], 'da', { sensitivity: 'accent' }))
  .sort(
    (a, b) =>
      LANGUAGE_CODES_PRIORITIES.indexOf(b[0]) -
      LANGUAGE_CODES_PRIORITIES.indexOf(a[0])
  )
  .map(c => c[1])

export const dimensionsRegex = new RegExp('^\\d{1,},\\d{1,},\\d{1,}$')
export const dimensionsInputRegex = new RegExp('^(?:\\d{1,},){0,2}\\d*$')
const emailRegex = new RegExp('(.+)@(.+){2,}.(.+){2,}', 'i')

export const basicValidText = (text: string): boolean => text.length > 0

export const validNumber = (number: number, min?: number, max?: number) =>
  number >= (min ?? number) && number <= (max ?? number)

export const validDimensionsInput = (dimensions: string): boolean =>
  dimensionsInputRegex.test(dimensions)

export const validDimensions = (dimensions: string): boolean =>
  dimensionsRegex.test(dimensions)

export const validEmail = (email: string): boolean => emailRegex.test(email)

export const validPostalCode = (zipCode: number): boolean =>
  zipCode >= 1000 && zipCode <= 99999

export const generateEmptyUserData = (): UserInputData => ({
  email: '',
  name: '',
  age: '',
  sex: '',
  dialect: '',
  nativeLanguage: '',
  spokenLanguages: [],
  postalCodeSchool: '',
  postalCodeAddress: '',
  levelOfEducation: '',
  placeOfBirth: '',
  occupation: '',
})

export const generateEmptySupervisorData = (): SupervisorInputData => ({
  noiseType: '',
  recordingAddress: '',
  backgroundNoise: '',
  roomHeight: '',
  roomWidth: '',
  roomLength: '',
})

export const userInputDataToServerType = (
  data: UserInputData
): RouterInputs['user'] => {
  const languagesList = Object.entries(languages)
  return {
    name: data.name,
    email: data.email,
    age: Number(data.age),
    gender: selectables.sexes.find(s => s.label === data.sex)?.code ?? data.sex,
    dialect: data.dialect,
    language_native:
      languagesList.find(e => e[1] === data.nativeLanguage)?.[0] ??
      data.nativeLanguage,
    language_spoken: data.spokenLanguages.map(
      l => languagesList.find(e => e[1] === l)?.[0] ?? l
    ),
    zip_school: Number(data.postalCodeSchool),
    zip_childhood: Number(data.postalCodeAddress),
    country_birth:
      Object.entries(countries).find(c => c[1] === data.placeOfBirth)?.[0] ??
      data.placeOfBirth,
    education: data.levelOfEducation,
    occupation: data.occupation,
  }
}
