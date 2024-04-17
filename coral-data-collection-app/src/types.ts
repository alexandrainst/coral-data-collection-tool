import { TCountryCode, TLanguageCode } from 'countries-list'

export interface TextRecordingKey {
  id: ''
  recording: Blob
}

export interface UserDataKey {
  email: string
  name: string
  age: string
  sex: string
  dialect: string
  nativeLanguage: TLanguageCode[]
  spokenLanguages: TLanguageCode[]
  postalCodeSchool: string
  postalCodeAddress: string
  levelOfEducation: string
  placeOfBirth: TCountryCode | string
  occupation: string
}

export interface UserInputData {
  email: string
  name: string
  age: string
  sex: string
  dialect: string
  nativeLanguage: string[]
  spokenLanguages: string[]
  postalCodeSchool: string
  postalCodeAddress: string
  levelOfEducation: string
  placeOfBirth: string
  occupation: string
}

export interface UserInputDataErrors {
  email: string
  name: string
  age: string
  sex: string
  dialect: string
  nativeLanguage: string
  spokenLanguages: string
  postalCodeSchool: string
  postalCodeAddress: string
  levelOfEducation: string
  placeOfBirth: string
  occupation: string
}

export interface SupervisorInputData {
  noiseType: string
  recordingAddress: string
  backgroundNoise: string
  roomDimensions: string //(højde,bredde,længde)
}

export interface SupervisorInputDataErrors {
  noiseType: string
  recordingAddress: string
  backgroundNoise: string
  roomDimensions: string //(højde,bredde,længde)
}

export interface DialectOption {
  group: string
  label: string
}
