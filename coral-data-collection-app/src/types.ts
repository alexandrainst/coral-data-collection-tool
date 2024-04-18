export interface TextRecordingKey {
  id: ''
  recording: Blob
}

export interface UserInputData {
  email: string
  name: string
  age: string
  sex: string
  dialect: string
  nativeLanguage: string
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
  roomHeight: string
  roomWidth: string
  roomLength: string
}

export interface SupervisorInputDataErrors {
  noiseType: string
  recordingAddress: string
  backgroundNoise: string
  roomHeight: string
  roomWidth: string
  roomLength: string
}

export interface DialectOption {
  group: string
  label: string
}
