import { SupervisorInputData, UserDataKey, UserInputData } from './types'
import selectables from './assets/selectables.json' assert { type: 'json' }
import { TLanguageCode, getCountryCode } from 'countries-list'

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
  nativeLanguage: [],
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
  roomDimensions: '',
})

export const userInputDataToDataKey = (data: UserInputData): UserDataKey => {
  const countryCode = getCountryCode(data.placeOfBirth)
  return {
    email: data.email,
    name: data.name,
    age: data.age,
    sex: selectables.sexes.find(s => s.label === data.sex)?.code ?? data.sex,
    dialect: data.dialect,
    nativeLanguage: data.nativeLanguage.map(l => l as TLanguageCode),
    spokenLanguages: data.nativeLanguage.map(l => l as TLanguageCode),
    postalCodeSchool: data.postalCodeSchool,
    postalCodeAddress: data.postalCodeAddress,
    levelOfEducation: data.levelOfEducation,
    placeOfBirth: countryCode === false ? data.placeOfBirth : countryCode,
    occupation: data.occupation,
  }
}
