import selectables from './assets/selectables.json' assert { type: 'json' }
import { type RouterInputs } from './trpc'
import { SupervisorInputData, UserInputData } from './types'

export const countryOptions = Object.values(selectables.countries).sort(
  (a, b) => a.localeCompare(b, 'da', { sensitivity: 'accent' })
)
export const languageOptions = Object.values(selectables.languages).sort(
  (a, b) => a.localeCompare(b, 'da', { sensitivity: 'accent' })
)

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
  const languages = Object.entries(selectables.languages)
  return {
    name: data.name,
    email: data.email,
    age: Number(data.age),
    gender: selectables.sexes.find(s => s.label === data.sex)?.code ?? data.sex,
    dialect: data.dialect,
    language_native:
      languages.find(e => e[1] === data.nativeLanguage)?.[0] ??
      data.nativeLanguage,
    language_spoken: data.spokenLanguages.map(
      l => languages.find(e => e[1] === l)?.[0] ?? l
    ),
    zip_school: Number(data.postalCodeSchool),
    zip_childhood: Number(data.postalCodeAddress),
    country_birth:
      Object.entries(selectables.countries).find(
        c => c[1] === data.placeOfBirth
      )?.[0] ?? data.placeOfBirth,
    education: data.levelOfEducation,
    occupation: data.occupation,
  }
}
