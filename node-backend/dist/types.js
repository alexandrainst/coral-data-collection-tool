"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecordingTestSchema = exports.RecordingSchema = exports.TranscriptionSchema = exports.UserDataSchema = void 0;
const z = __importStar(require("zod"));
const languages_en_min_json_1 = __importDefault(require("countries-list/minimal/languages.en.min.json"));
const countries_en_min_json_1 = __importDefault(require("countries-list/minimal/countries.en.min.json"));
const ACCEPTED_AUDIO_TYPE = 'audio/wav';
const COUNTRY_CODES = Object.keys(countries_en_min_json_1.default);
const LANGUAGE_CODES = Object.keys(languages_en_min_json_1.default);
exports.UserDataSchema = z.object({
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
        .refine(arr => !arr.some(langCode => LANGUAGE_CODES.some(code => code === langCode))),
    postalCodeSchool: z.number(),
    postalCodeAddress: z.number(),
    levelOfEducation: z.string(),
    placeOfBirth: z
        .string()
        .refine(countryCode => COUNTRY_CODES.some(code => code === countryCode)),
    occupation: z.string(),
});
exports.TranscriptionSchema = z.object({
    id: z.string(),
    text: z.string(),
});
exports.RecordingSchema = z.object({
    id: z.string(),
    recording: z.any().refine(file => file?.type === ACCEPTED_AUDIO_TYPE),
});
exports.RecordingTestSchema = z.object({
    id: z.string(),
});
