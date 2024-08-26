import { z } from 'zod'
import { zfd } from 'zod-form-data'
import countries from '../common_assets/countries.json'
import languages from '../common_assets/languages.json'

const COUNTRY_CODES = Object.keys(countries)
const LANGUAGE_CODES = Object.keys(languages)
const GENDERS = ['male', 'female', 'nonbinary']

export const SpeakerSchema = z.object({
  id_speaker: z.optional(z.string()),
  name: z.string(),
  email: z.string().toLowerCase(),
  age: z.number(),
  gender: z
    .string()
    .toLowerCase()
    .refine(gender => GENDERS.some(g => g === gender)),
  dialect: z.string().toLowerCase(),
  language_native: z
    .string()
    .refine(langCode => LANGUAGE_CODES.some(code => code === langCode)),
  language_spoken: z
    .string()
    .array()
    .refine(arr =>
      arr.every(langCode => LANGUAGE_CODES.some(code => code === langCode))
    ),
  zipcode_school: z.number(),
  zipcode_birth: z.number(),
  country_birth: z
    .string()
    .refine(countryCode => COUNTRY_CODES.some(code => code === countryCode)),
  education: z.string(),
  occupation: z.string(),
})

export const RecordingSchema = z.object({
  // DB properties
  id_recording: z.optional(z.string()),
  id_speaker: z.string(),
  id_sentence: z.string(),
  location: z.string(),
  location_roomdim: z.string(),
  noise_level: z.string(),
  noise_type: z.string(),
  datetime_start: z.string().datetime(),
  datetime_end: z.string().datetime(),
  // File properties
  file: z.instanceof(File),
  ext: z.string(),
})

export const RecordingFormDataSchema = zfd.formData(RecordingSchema)

export const SentenceSchema = z.object({
  id_sentence: z.string(),
  text: z.string(),
})

export type Speaker = z.infer<typeof SpeakerSchema>
export type Recording = z.infer<typeof RecordingSchema>
export type Sentence = z.infer<typeof SentenceSchema>
