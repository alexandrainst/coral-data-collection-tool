import { SupervisorInputData, UserInputData } from './types'
import selectables from './assets/selectables.json' assert { type: 'json' }
import languages from 'countries-list/minimal/languages.native.min.json'
import countries from 'countries-list/minimal/countries.native.min.json'
import { type RouterInputs } from './trpc'

export const countryOptions = Object.values(countries)
export const languageOptions = Object.values(languages)

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
  return {
    email: data.email,
    name: data.name,
    age: Number(data.age),
    sex: selectables.sexes.find(s => s.label === data.sex)?.code ?? data.sex,
    dialect: data.dialect,
    nativeLanguage:
      Object.entries(languages).find(e => e[1] === data.nativeLanguage)?.[0] ??
      data.nativeLanguage,
    spokenLanguages: data.spokenLanguages.map(
      l => Object.entries(languages).find(e => e[1] === l)?.[0] ?? l
    ),
    postalCodeSchool: Number(data.postalCodeSchool),
    postalCodeAddress: Number(data.postalCodeAddress),
    levelOfEducation: data.levelOfEducation,
    placeOfBirth:
      Object.entries(countries).find(c => c[1] === data.placeOfBirth)?.[0] ??
      data.placeOfBirth,
    occupation: data.occupation,
  }
}
