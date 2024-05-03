import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Link,
  Popper,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import {
  IBlobEvent,
  IMediaRecorder,
  MediaRecorder,
} from 'extendable-media-recorder'
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import './App.css'
import { styles } from './style'
import { DialectOption, SupervisorInputData, UserInputData } from './types'
import {
  basicValidText,
  countryOptions,
  generateEmptySupervisorData,
  generateEmptyUserData,
  languageOptions,
  userInputDataToServerType,
  validDimensionsInput,
  validEmail,
  validNumber,
  validPostalCode,
} from './utils'

import SkipNextIcon from '@mui/icons-material/SkipNext'
import getBlobDuration from 'get-blob-duration'
import selectables from './assets/selectables.json' assert { type: 'json' }
import { trpc } from './trpc.ts'

const dialectOptions: DialectOption[] = Object.entries(
  selectables.dialects
).flatMap(entry =>
  entry[1].map(dialect => ({ group: entry[0], label: dialect }))
)

const USER_DATA_TOKEN = 'userDataToken'
const SUPERVISOR_DATA_TOKEN = 'supervisorDataToken'
const AUDIO_FORMAT = 'wav'

const validUserDataKeys = new Set<string>(Object.keys(generateEmptyUserData()))
const validSupervisorDataKeys = new Set<string>(
  Object.keys(generateEmptySupervisorData())
)

const recordingStopTimeMS = 1000

function App() {
  const { t } = useTranslation('common')

  const mediaRecorder = useRef<IMediaRecorder | undefined>()

  const [userDataErrors, setUserDataErrors] = useState<
    Record<keyof UserInputData, string>
  >(
    Object.keys(generateEmptyUserData()).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: '',
      }),
      {} as Record<keyof UserInputData, string>
    )
  )

  const [supervisorDataErrors, setSupervisorDataErrors] = useState<
    Record<keyof SupervisorInputData, string>
  >(
    Object.keys(generateEmptySupervisorData()).reduce(
      (prev, curr) => ({
        ...prev,
        [curr]: '',
      }),
      {} as Record<keyof SupervisorInputData, string>
    )
  )

  const [userData, setUserData] = useState<UserInputData>(
    generateEmptyUserData()
  )

  const [supervisorData, setSupervisorData] = useState<SupervisorInputData>(
    generateEmptySupervisorData()
  )

  const [displayUserDataDialog, setDisplayUserDataDialog] = useState(true)

  const [displayLegalDialog, setDisplayLegalDialog] = useState(false)

  const [displaySupervisorDialog, setDisplaySupervisorDialog] = useState(false)

  const [termsAccepted, setTermsAccepted] = useState<boolean>(false)
  const [displayTermsAcceptedErrorText, setDisplayTermsAcceptedErrorText] =
    useState<boolean>(false)

  const [
    displayInvalidSupervisorDataText,
    setDisplayInvalidSupervisorDataText,
  ] = useState<boolean>(false)

  const popperAnchor = useRef<HTMLElement | null>(null)
  const [openPopper, setOpenPopper] = useState<boolean>(false)

  const serverConnectionErr = useRef<boolean>(false)

  const id_speaker = useRef<string>('')

  const textToRecordQuery = trpc.textToRecord.useQuery(undefined, {
    enabled:
      displayUserDataDialog || displayLegalDialog || displayUserDataDialog,
    throwOnError: e => {
      if (!serverConnectionErr.current) {
        console.log(`Text query response error!`)
        console.log(e.shape)
        alert(t('serverResponseErr'))
        serverConnectionErr.current = true
      }
      return false
    },
  })

  const recordingMutation = trpc.recording.useMutation({
    onError: e => {
      if (!serverConnectionErr.current) {
        console.log(`Rercording mutation response error!`)
        console.log(e.shape)
        alert(t('serverResponseErr'))
        serverConnectionErr.current = true
      }
      return false
    },
  })
  const userDataMutation = trpc.user.useMutation({
    onError: e => {
      if (!serverConnectionErr.current) {
        console.log(`User data mutation response error!`)
        console.log(e.shape)
        alert(t('serverResponseErr'))
        serverConnectionErr.current = true
      }
      return false
    },
  })

  useEffect(() => {
    const setBlob = async (e: IBlobEvent) => {
      const timestamp = Date.now()

      const formData = new FormData()
      // TODO: ensure that the correct parameters are set the correct way
      formData.append('id_sentence', textToRecordQuery.data?.id_sentence ?? '')
      formData.append('id_speaker', id_speaker.current)
      formData.append('location', supervisorData.recordingAddress)
      formData.append(
        'dim_room',
        [
          supervisorData.roomHeight,
          supervisorData.roomWidth,
          supervisorData.roomLength,
        ].toString()
      )
      formData.append('noise_level', supervisorData.backgroundNoise)
      formData.append('noise_type', supervisorData.noiseType)
      formData.append(
        'datetime_start',
        new Date(
          timestamp - (await getBlobDuration(e.data)) * 1000
        ).toISOString()
      )
      formData.append('datetime_end', new Date(timestamp).toISOString())

      formData.append('file', new File([e.data], ''))
      formData.append('ext', AUDIO_FORMAT)

      recordingMutation.mutateAsync(formData)
      textToRecordQuery.refetch()
    }

    mediaRecorder.current?.addEventListener('dataavailable', setBlob)

    return () => {
      mediaRecorder.current?.removeEventListener('dataavailable', setBlob)
    }
  }, [
    textToRecordQuery.data,
    recordingMutation,
    supervisorData,
    textToRecordQuery,
  ])

  // Parse cached data and setup mediarecorder
  useEffect(() => {
    const cachedSupervisorData = localStorage.getItem(SUPERVISOR_DATA_TOKEN)
    const cachedUserData = localStorage.getItem(USER_DATA_TOKEN)

    if (cachedSupervisorData !== null) {
      setSupervisorData(JSON.parse(cachedSupervisorData))
    }

    if (cachedUserData !== null) {
      setUserData(JSON.parse(cachedUserData))
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then(audioStream => {
        mediaRecorder.current = new MediaRecorder(audioStream, {
          mimeType: `audio/${AUDIO_FORMAT}`,
        })
      })
      .catch(e => {
        console.error(`Unable to get audiostream: ${e}`)
      })
  }, [])

  // Add eventlisteners to handle recording
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timerId: any = 0
    let keyHold = false
    const handleKeyDown = async (e: KeyboardEvent) => {
      if (e.key === 'r' && !keyHold) {
        clearTimeout(timerId)
        keyHold = true
        setOpenPopper(keyHold)
        try {
          mediaRecorder.current?.stop()
          mediaRecorder.current?.start()
        } catch (e) {
          console.error('Recording start error:', e)
        }
      }
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'r' && keyHold) {
        keyHold = false
        setOpenPopper(keyHold)
        timerId = setTimeout(() => {
          try {
            mediaRecorder.current?.stop()
          } catch (e) {
            console.error('Recording stop error:', e)
          }
        }, recordingStopTimeMS)
      }
    }
    if (!displayUserDataDialog) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('keyup', handleKeyUp)
    }

    return () => {
      clearTimeout(timerId)
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [displayUserDataDialog])

  const supervisorDataToErrorText = useCallback(
    () =>
      ({
        noiseType: basicValidText(supervisorData.noiseType)
          ? ''
          : t('noiseTypeErrorText'),
        recordingAddress: basicValidText(supervisorData.recordingAddress)
          ? ''
          : t('recordingAddressErrorText'),
        backgroundNoise: validNumber(
          Number(supervisorData.backgroundNoise),
          1,
          160
        )
          ? ''
          : t('backgroundNoiseErrorText', { min: 1, max: 160 }),
        roomHeight: basicValidText(supervisorData.roomHeight)
          ? ''
          : t('roomHeightErrorText'),
        roomWidth: basicValidText(supervisorData.roomWidth)
          ? ''
          : t('roomWidthErrorText'),
        roomLength: basicValidText(supervisorData.roomLength)
          ? ''
          : t('roomLengthErrorText'),
      }) as Record<keyof SupervisorInputData, string>,
    [supervisorData, t]
  )

  const handleSupervisorDataSubmit = () => {
    const errTextRecord = supervisorDataToErrorText()
    setSupervisorDataErrors(errTextRecord)
    const invalidInput = Object.values(errTextRecord).some(v => v !== '')
    if (!invalidInput) {
      localStorage.setItem(
        SUPERVISOR_DATA_TOKEN,
        JSON.stringify(supervisorData)
      )
    }
    setDisplaySupervisorDialog(invalidInput)
  }

  const handleUserDataSubmit = () => {
    const errTextRecord: Record<keyof UserInputData, string> = {
      email: validEmail(userData.email) ? '' : t('emailErrorText'),
      name: basicValidText(userData.name) ? '' : t('nameErrorText'),
      age: validNumber(Number(userData.age), 1, 100)
        ? ''
        : t('ageErrorText', { min: 1, max: 100 }),
      sex: basicValidText(userData.sex) ? '' : t('sexErrorText'),
      dialect: basicValidText(userData.dialect) ? '' : t('dialectErrorText'),
      nativeLanguage: basicValidText(userData.nativeLanguage)
        ? ''
        : t('nativeLanguagesErrorText'),
      spokenLanguages:
        userData.spokenLanguages.length > 0
          ? ''
          : t('spokenLanguagesErrorText'),
      postalCodeSchool: validPostalCode(Number(userData.postalCodeSchool))
        ? ''
        : t('postalCodeLengthErrorText'),
      postalCodeAddress: validPostalCode(Number(userData.postalCodeAddress))
        ? ''
        : t('postalCodeLengthErrorText'),
      levelOfEducation: basicValidText(userData.levelOfEducation)
        ? ''
        : t('levelOfEducationErrorText'),
      placeOfBirth: basicValidText(userData.placeOfBirth)
        ? ''
        : t('placeOfBirthErrorText'),
      occupation: '',
    }

    setUserDataErrors(errTextRecord)
    setDisplayTermsAcceptedErrorText(!termsAccepted)
    const supervisorErrorTexts = supervisorDataToErrorText()
    const invalidSupervisorData = Object.values(supervisorErrorTexts).some(
      v => v !== ''
    )
    setDisplayInvalidSupervisorDataText(invalidSupervisorData)
    if (invalidSupervisorData) {
      setSupervisorDataErrors(supervisorErrorTexts)
    }
    const invalidInput =
      !termsAccepted ||
      Object.values(errTextRecord).some(v => v !== '') ||
      invalidSupervisorData
    if (!invalidInput) {
      localStorage.setItem(USER_DATA_TOKEN, JSON.stringify(userData))
      userDataMutation
        .mutateAsync(userInputDataToServerType(userData))
        .then(e => (id_speaker.current = e))
    }
    setDisplayUserDataDialog(invalidInput)
  }

  const handleUserDataSelectChange = (
    name: string,
    value: string[] | string
  ) => {
    if (validUserDataKeys.has(name)) {
      setUserData({
        ...userData,
        [name]: value,
      })
    }
  }

  const handleSupervisorDataTextFieldChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
    validatorFunc?: (value: string) => boolean
  ) => {
    const validInput =
      validSupervisorDataKeys.has(e.target.name) &&
      (validatorFunc?.(e.target.value) ?? true)
    if (validInput) {
      setSupervisorData({
        ...supervisorData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleUserDataTextFieldChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (validUserDataKeys.has(e.target.name)) {
      setUserData({
        ...userData,
        [e.target.name]: e.target.value,
      })
    }
  }

  const handleClearUserData = () => {
    localStorage.removeItem(USER_DATA_TOKEN)
    setUserData(generateEmptyUserData())
    setDisplaySupervisorDialog(false)
  }

  const handleSkipText = () => {
    textToRecordQuery.refetch()
  }

  return (
    <>
      <Box sx={styles.root}>
        {!displayLegalDialog &&
          !displaySupervisorDialog &&
          !displayUserDataDialog && (
            <>
              <Stack
                sx={styles.collectionStack}
                direction={'column'}
                alignItems={'center'}
                spacing={5}
              >
                <span
                  style={{ marginTop: '10px', height: '0%', width: '0%' }}
                  id="popperAnchor"
                  ref={popperAnchor}
                />
                <Popper
                  sx={styles.popperBox}
                  open={openPopper}
                  anchorEl={popperAnchor.current}
                  placement={'bottom'}
                  keepMounted
                >
                  <Typography variant="h5">{t('recording')}</Typography>
                </Popper>

                <Stack
                  sx={styles.collectionTypographyStack}
                  spacing={0.5}
                  direction={'column'}
                  alignItems={'flex-start'}
                >
                  <Typography variant="h1">
                    {t('dataCollectionTitle')}
                  </Typography>
                  <Typography fontFamily={'serif'} variant="h3">
                    {t('dataCollectionText1')}
                  </Typography>
                  <Typography fontFamily={'serif'} variant="h3">
                    {t('dataCollectionText2')}
                  </Typography>
                </Stack>
                <Box sx={{ width: '50%', height: '100%' }}>
                  <Box sx={styles.textRecordBox}>
                    <Typography align="left" variant="h2">
                      {textToRecordQuery.data?.text ?? ''}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
              <IconButton
                sx={{ position: 'fixed', bottom: 0 }}
                size="large"
                onClick={handleSkipText}
              >
                <SkipNextIcon />
              </IconButton>
            </>
          )}
      </Box>
      {/* SUPERVISOR INPUT DIALOG */}
      <Dialog fullWidth maxWidth="xl" open={displaySupervisorDialog}>
        <DialogContent>
          <TextField
            required
            error={supervisorDataErrors.roomHeight !== ''}
            helperText={supervisorDataErrors.roomHeight}
            id="roomHeight"
            name="roomHeight"
            margin="dense"
            label={t('roomDimH')}
            type="text"
            fullWidth
            variant="standard"
            value={supervisorData.roomHeight}
            onChange={e =>
              handleSupervisorDataTextFieldChange(e, validDimensionsInput)
            }
          />
          <TextField
            required
            error={supervisorDataErrors.roomWidth !== ''}
            helperText={supervisorDataErrors.roomWidth}
            id="roomWidth"
            name="roomWidth"
            margin="dense"
            label={t('roomDimW')}
            type="text"
            fullWidth
            variant="standard"
            value={supervisorData.roomWidth}
            onChange={e =>
              handleSupervisorDataTextFieldChange(e, validDimensionsInput)
            }
          />
          <TextField
            required
            error={supervisorDataErrors.roomLength !== ''}
            helperText={supervisorDataErrors.roomLength}
            id="roomLength"
            name="roomLength"
            margin="dense"
            label={t('roomDimL')}
            type="text"
            fullWidth
            variant="standard"
            value={supervisorData.roomLength}
            onChange={e =>
              handleSupervisorDataTextFieldChange(e, validDimensionsInput)
            }
          />

          <TextField
            required
            error={supervisorDataErrors.recordingAddress !== ''}
            helperText={supervisorDataErrors.recordingAddress}
            id="recordingAddress"
            name="recordingAddress"
            margin="dense"
            label={t('recordingAddress')}
            type="text"
            fullWidth
            variant="standard"
            value={supervisorData.recordingAddress}
            onChange={handleSupervisorDataTextFieldChange}
          />
          <TextField
            required
            error={supervisorDataErrors.backgroundNoise !== ''}
            helperText={supervisorDataErrors.backgroundNoise}
            id="backgroundNoise"
            name="backgroundNoise"
            margin="dense"
            label={t('backgroundNoise')}
            type="number"
            InputProps={{
              inputProps: {
                max: 160,
                min: 0,
              },
            }}
            fullWidth
            variant="standard"
            value={supervisorData.backgroundNoise}
            onChange={handleSupervisorDataTextFieldChange}
          />
          <Autocomplete
            id="noiseType"
            size="medium"
            options={selectables.noiseTypes}
            getOptionLabel={option => option}
            value={supervisorData.noiseType || null}
            renderInput={params => (
              <TextField
                {...params}
                required
                error={supervisorDataErrors.noiseType !== ''}
                helperText={supervisorDataErrors.noiseType}
                variant="standard"
                label={t('noiseType')}
              />
            )}
            onChange={(_e, v) =>
              setSupervisorData({
                ...supervisorData,
                ['noiseType']: v ?? '',
              })
            }
          />
        </DialogContent>
        <Stack
          margin={'10px'}
          direction={'row'}
          justifyContent={'space-around'}
        >
          <Button
            size="large"
            variant="contained"
            onClick={handleClearUserData}
          >
            {t('clearUserInput')}
          </Button>
          <Button
            size="large"
            variant="contained"
            onClick={handleSupervisorDataSubmit}
          >
            {t('supervisorConfirm')}
          </Button>
        </Stack>
      </Dialog>
      {/* USER INPUT DIALOG */}
      <Dialog
        sx={{
          visibility:
            displayLegalDialog || displaySupervisorDialog
              ? 'hidden'
              : 'visible',
        }}
        open={displayUserDataDialog}
        fullWidth
        maxWidth="xl"
      >
        <Stack
          sx={{ position: 'absolute', left: 0 }}
          direction={'row'}
          alignItems={'center'}
        >
          <IconButton
            color={displayInvalidSupervisorDataText ? 'error' : undefined}
            size="large"
            onClick={() => setDisplaySupervisorDialog(true)}
          >
            <SupervisedUserCircleIcon />
          </IconButton>
          <Typography
            visibility={displayInvalidSupervisorDataText ? 'visible' : 'hidden'}
            variant="h6"
            color={'error'}
          >
            {t('supervisorDataNeeded')}
          </Typography>
        </Stack>
        <Typography variant="h2" textAlign={'center'}>
          {t('recordingDialogTitle')}
        </Typography>
        <DialogContent>
          <Stack direction={'row'} spacing={0.5}>
            <Typography variant="h5">{t('dialogTextPart1')} </Typography>
            <Link
              variant="h5"
              component="button"
              onClick={() => setDisplayLegalDialog(true)}
            >
              {t('applicableTerms')}
            </Link>
          </Stack>

          <Typography variant="h5">{t('dialogTextPart2')}</Typography>
          <Typography variant="h5">{t('dialogTextPart3')}:</Typography>
          <TextField
            required
            error={userDataErrors.email !== ''}
            helperText={userDataErrors.email}
            autoFocus
            margin="dense"
            id="email"
            name="email"
            label={t('email')}
            type="email"
            fullWidth
            variant="standard"
            value={userData.email}
            onChange={handleUserDataTextFieldChange}
          />
          <TextField
            required
            error={userDataErrors.name !== ''}
            helperText={userDataErrors.name}
            margin="dense"
            id="name"
            name="name"
            label={t('name')}
            type="text"
            fullWidth
            variant="standard"
            value={userData.name}
            onChange={handleUserDataTextFieldChange}
          />
          <TextField
            required
            error={userDataErrors.age !== ''}
            helperText={userDataErrors.age}
            margin="dense"
            id="age"
            name="age"
            label={t('age')}
            InputProps={{
              inputProps: {
                max: 100,
                min: 0,
              },
            }}
            type="number"
            fullWidth
            variant="standard"
            value={userData.age}
            onChange={handleUserDataTextFieldChange}
          />
          <Autocomplete
            id="sex"
            size="medium"
            fullWidth
            options={selectables.sexes}
            getOptionLabel={option => option.label}
            value={
              selectables.sexes.find(s => s.label === userData.sex) || null
            }
            renderInput={params => (
              <TextField
                {...params}
                required
                error={userDataErrors.sex !== ''}
                helperText={userDataErrors.sex}
                variant="standard"
                label={t('sex')}
                margin="dense"
              />
            )}
            onChange={(_e, v) =>
              handleUserDataSelectChange('sex', v?.label ?? '')
            }
          />

          <Autocomplete
            id="dialect"
            size="medium"
            options={dialectOptions}
            groupBy={option => option.group}
            getOptionLabel={option => option.label}
            value={
              dialectOptions.find(d => d.label === userData.dialect) || null
            }
            renderInput={params => (
              <TextField
                {...params}
                required
                error={userDataErrors.dialect !== ''}
                helperText={userDataErrors.dialect}
                variant="standard"
                label={t('dialect')}
                margin="dense"
              />
            )}
            onChange={(_e, v) =>
              handleUserDataSelectChange('dialect', v?.label ?? '')
            }
          />

          <Autocomplete
            id="nativeLanguage"
            size="medium"
            fullWidth
            options={languageOptions}
            getOptionLabel={lang => lang}
            value={userData.nativeLanguage || null}
            renderInput={params => (
              <TextField
                {...params}
                required
                error={userDataErrors.nativeLanguage !== ''}
                helperText={userDataErrors.nativeLanguage}
                variant="standard"
                label={t('nativeLanguage')}
                margin="dense"
              />
            )}
            onChange={(_e, v) =>
              handleUserDataSelectChange('nativeLanguage', v ?? '')
            }
          />

          <Autocomplete
            multiple
            id="spokenLanguages"
            size="medium"
            options={languageOptions}
            getOptionLabel={lang => lang}
            value={userData.spokenLanguages}
            renderInput={params => (
              <TextField
                {...params}
                required
                error={userDataErrors.spokenLanguages !== ''}
                helperText={userDataErrors.spokenLanguages}
                variant="standard"
                label={t('whichLanguages')}
                margin="dense"
              />
            )}
            onChange={(_e, v) =>
              handleUserDataSelectChange('spokenLanguages', v ?? [])
            }
          />

          <TextField
            required
            error={userDataErrors.postalCodeSchool !== ''}
            helperText={userDataErrors.postalCodeSchool}
            id="postalCodeSchool"
            name="postalCodeSchool"
            margin="dense"
            label={t('postalCodeSchool')}
            InputProps={{
              inputProps: {
                max: 99999,
                min: 1000,
              },
            }}
            type="number"
            fullWidth
            variant="standard"
            value={userData.postalCodeSchool}
            onChange={handleUserDataTextFieldChange}
          />
          <TextField
            required
            error={userDataErrors.postalCodeAddress !== ''}
            helperText={userDataErrors.postalCodeAddress}
            id="postalCodeAddress"
            name="postalCodeAddress"
            margin="dense"
            label={t('postalCodeAddress')}
            InputProps={{
              inputProps: {
                max: 99999,
                min: 1000,
              },
            }}
            type="number"
            fullWidth
            variant="standard"
            value={userData.postalCodeAddress}
            onChange={handleUserDataTextFieldChange}
          />
          <Autocomplete
            id="levelOfEducation"
            size="medium"
            fullWidth
            options={selectables.levelsOfEducation}
            getOptionLabel={option => option}
            value={userData.levelOfEducation || null}
            renderInput={params => (
              <TextField
                {...params}
                required
                error={userDataErrors.levelOfEducation !== ''}
                helperText={userDataErrors.levelOfEducation}
                variant="standard"
                margin="dense"
                label={t('levelOfEducation')}
              />
            )}
            onChange={(_e, v) =>
              handleUserDataSelectChange('levelOfEducation', v ?? '')
            }
          />
          <Autocomplete
            id="placeOfBirth"
            size="medium"
            fullWidth
            options={countryOptions}
            getOptionLabel={(country: string) => country}
            value={userData.placeOfBirth || null}
            renderInput={params => (
              <TextField
                {...params}
                required
                error={userDataErrors.placeOfBirth !== ''}
                helperText={userDataErrors.placeOfBirth}
                variant="standard"
                margin="dense"
                label={t('placeOfBirth')}
              />
            )}
            onChange={(_e, v) =>
              handleUserDataSelectChange('placeOfBirth', v ?? '')
            }
          />

          <TextField
            id="occupation"
            name="occupation"
            margin="dense"
            label={t('occupation')}
            type="text"
            fullWidth
            variant="standard"
            value={userData.occupation}
            onChange={handleUserDataTextFieldChange}
          />
          <Stack spacing={0}>
            <Stack direction={'row'} spacing={0} alignItems={'center'}>
              <Checkbox
                sx={{
                  ...styles.termsCheckBox,
                  color: displayTermsAcceptedErrorText ? 'red' : 'black',
                }}
                checked={termsAccepted}
                onChange={e => setTermsAccepted(e.target.checked)}
                name="acceptTerms"
              />
              <Stack direction={'row'} spacing={0.5}>
                <Link
                  color={'inherit'}
                  id="termsAccepted1"
                  name="termsAccepted1"
                  variant="h5"
                  underline={'none'}
                  component="button"
                  onClick={() => setTermsAccepted(!termsAccepted)}
                >
                  {t('termsAcceptedText1')}
                </Link>
                <Link
                  id="termsAccepted2"
                  name="termsAccepted2"
                  variant="h5"
                  component="button"
                  onClick={() => setDisplayLegalDialog(true)}
                >
                  {`${t('termsAcceptedText2')}*`}
                </Link>
              </Stack>
            </Stack>
            <Typography
              sx={{ marginLeft: '10px' }}
              visibility={displayTermsAcceptedErrorText ? 'visible' : 'hidden'}
              variant="h6"
              color={'error'}
            >
              {t('termsAcceptedErrorText')}
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleUserDataSubmit}>
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
      {/* LEGAL DIALOG */}
      <Dialog
        fullWidth
        maxWidth="xl"
        open={displayLegalDialog}
        onClose={() => setDisplayLegalDialog(false)}
      >
        <Typography textAlign={'center'} variant="h1">
          Gældende vilkår for CoRal dataindsamlingen.
        </Typography>
        <DialogContent>
          <section style={{ margin: '5px' }}>
            <p>
              <b>Effektiv fra d. 15. april 2023</b>
            </p>
            <p>
              Alexandra Instituttet er sammen med Københavns Universitet,
              Digitaliseringsstyrelsen og virksomhederne Corti og Alvenir i gang
              med et projekt, hvor visionen er at skabe grundlag for, at dansk
              sprogteknologi (kunstig intelligens) kan komme op blandt de
              førende lande i Europa inden for taleteknologi. Projektet hedder
              “Danish Conversational and Read-aloud Speech Dataset” og forkortes
              “CoRal”. Målet er at producere 1000–1500 timers taledata fordelt
              på to taletyper: samtale og oplæsning, der indeholder en bred
              repræ-sentation af danske dialekter og talestile.
            </p>
            <p>
              Du må kun deltage i CoRal dataindsamlingen, hvis du accepterer
              følgende vilkår.
            </p>
            <h3>
              <b>Støtteberettigelse</b>
            </h3>
            <p>
              CoRal dataindsamlingen er åben for alle over 18 år. Hvis du er 18
              eller under, skal du have din forælder eller værgeres samtykke for
              at deltage i dataindsamlingen.
            </p>
            <h3>
              <b>Dine bidrag</b>
            </h3>
            Vi gør CoRal-databasen tilgængelig under Creative Commons CC0 public
            domain dedication{' '}
            <a href="https://creativecommons.org/licenses/by/2.5/dk/legalcode">
              (https://creativecommons.org/licenses/by/2.5/dk/legalcode)
            </a>
            . Det betyder, at dataet i databasen er offentligt, og vi giver
            afkald på alle ophavsrettigheder i det omfang, vi kan i henhold til
            loven. Hvis du deltager i CoRal dataindsamlingen, kræver vi, at du
            gør det samme. Du skal acceptere, at CoRal kan tilbyde alle dine
            bidrag (herunder tekst og optagelser) til offentligheden under CC0's
            offentlige domæne dedikation. For at kunne deltage i CoRal
            dataindsamlingen kræver vi også, at du stiller 2 garantier:
            <ul>
              <li>
                {' '}
                For det første, at dine bidrag er helt din egen skabelse.{' '}
              </li>
              <li>
                {' '}
                For det andet, at dine bidrag ikke krænker tredjeparts
                rettigheder.{' '}
              </li>
            </ul>
            Hvis du ikke kan stille disse garantier, kan du ikke deltage i CoRal
            dataindsamlingen
            <h3>
              <b>Ansvarsfraskrivelser</b>
            </h3>
            <p>
              Ved at deltage i CoRal indsamlingen accepterer du, at CoRal på
              ingen måde hæfter for nogen form for manglende evne til at bruge
              stemmeoptagelser eller for ethvert krav som følge af disse vilkår.
              CoRal fralægger specifikt følgende ansvar: Indirekte, særlige,
              tilfældige, følgeskader eller eksemplariske skader, direkte eller
              indirekte, skader for tab af goodwill, arbejdsophør, tabt
              fortjeneste, tab af data eller skader ved computerfejl. Du
              accepterer at CoRal er fri for ethvert ansvar eller krav, der
              følger af din deltagelse i CoRal dataindsamlingen. CoRal leverer
              tjenesten "as is" og fralægger specifikt eventuelle juridiske
              garantier eller garantier som (men ikke begrænset til)
              "salgbarhed", "egnethed til et bestemt formål", "ikke-krænkelse"
              og garantier som følge af handel, brug eller handel.
            </p>
            <h3>
              <b>Opdateringer af vilkår</b>
            </h3>
            <p>
              CoRal kan beslutte at opdatere disse vilkår løbende. De opdaterede
              vilkår vil blive offentliggjort online her på siden. Hvis du
              fortsætter med at bruge stemmeoptagelserne i databasen efter at vi
              har indsendt opdaterede vilkår, accepterer du at acceptere, at du
              accepterer sådanne ændringer. Den effektive dato øverst på denne
              side er tilgængelig for at gøre det klart hvornår vi lavede den
              seneste opdatering.
            </p>
            <h3>
              <b>Gældende lovgivning</b>
            </h3>
            <p>
              Dansk lov finder anvendelse på disse vilkår. Disse vilkår er hele
              aftalen mellem dig og CoRal i forbindelse med CoRal
              dataindsamlingen.
            </p>
            <h3>
              <b>Note vdr. håndtering af dit data</b>
            </h3>
            <p>
              Når CoRal (det er os) modtager information fra dig, gemmer vi dem
              på en server hosted af digital ocean.
            </p>
            <p>
              <h3>
                <b>Stemmeoptagelser</b>
              </h3>
              Stemmeoptagelser kan være tilgængelige i CoRal-databasen til
              offentligt forbrug og brug under en Creative Commons Zero License{' '}
              <a href="https://creativecommons.org/licenses/by/2.5/dk/legalcode">
                (https://creativecommons.org/licenses/by/2.5/dk/legalcode)
              </a>
              .
            </p>
            <h3>
              <b>Kontakt</b>
            </h3>
            <p>
              Er du interesseret i at høre mere om projektet? Eller har du
              spørgsmål til indsamlingen af data? Så kan du kontakte os på en af
              følgende emails.
            </p>
            <p>
              <i>Anders Jess Pedersen</i>{' '}
              <a href="mailto: anders.j.pedersen@alexandra.dk">
                anders.j.pedersen@alexandra.dk
              </a>
            </p>
            <p>
              <i>Dan Saatrup Nielsen</i>{' '}
              <a href="mailto: dan.nielsen@alexandra.dk">
                dan.nielsen@alexandra.dk
              </a>
            </p>
          </section>
        </DialogContent>
        <Stack marginBottom={'5px'} alignItems={'center'}>
          <Button
            sx={{ width: '10%' }}
            variant="contained"
            type="button"
            size="large"
            onClick={() => setDisplayLegalDialog(false)}
          >
            OK
          </Button>
        </Stack>
      </Dialog>
    </>
  )
}

export default App
