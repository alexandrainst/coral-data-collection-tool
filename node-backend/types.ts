import * as z from 'zod'
import languageNames from 'countries-list/minimal/languages.en.min.json'
import countryNames from 'countries-list/minimal/countries.en.min.json'

const ACCEPTED_AUDIO_TYPE = 'audio/wav'

const COUNTRY_CODES = Object.keys(countryNames)
const LANGUAGE_CODES = Object.keys(languageNames)

export const UserDataSchema = z.object({
  email: z.string(),
  name: z.string(),
  age: z.number(),
  sex: z.string(),
  dialect: z.string(),
  nativeLanguage: z
    .string()
    .refine(langCode => LANGUAGE_CODES.some(code => code === langCode)),
  spokenLanguages: z
    .array(z.string())
    .refine(
      arr =>
        !arr.some(langCode => LANGUAGE_CODES.some(code => code === langCode))
    ),
  postalCodeSchool: z.number(),
  postalCodeAddress: z.number(),
  levelOfEducation: z.string(),
  placeOfBirth: z
    .string()
    .refine(countryCode => COUNTRY_CODES.some(code => code === countryCode)),
  occupation: z.string(),
})

export const TranscriptionSchema = z.object({
  id: z.string(),
  text: z.string(),
})
export const RecordingSchema = z.object({
  id: z.string(),
  recording: z.any().refine(file => file?.type === ACCEPTED_AUDIO_TYPE),
})

export const RecordingTestSchema = z.object({
  id: z.string(),
})

export type UserData = z.infer<typeof UserDataSchema>
export type Recording = z.infer<typeof RecordingSchema>
export type Transcription = z.infer<typeof TranscriptionSchema>
export type RecordingTest = z.infer<typeof RecordingTestSchema>
