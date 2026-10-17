import React, { useState } from 'react';

import {
  Box,
  Button,
  GlobalStyles,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';

import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import VpnKeyRoundedIcon from '@mui/icons-material/VpnKeyRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';

import { useNavigate } from 'react-router-dom';

const BLUE = '#5B9FE3';
const BLUE_DARK = '#397DBE';
const BORDER = '#C9D0D8';
const TEXT = '#303942';
const MUTED = '#707A85';
const BG = '#EEF1F4';

const STORAGE_KEY = import.meta.env.VITE_STORAGE_SECRET;

const DEFAULT_SETTINGS = {
  serverUrl: 'https://exami.api.phcore.com.br',
  orthancAddress: 'http://192.168.1.100:8042',
  syncIntervalMinutes: 5,
  authToken: '',
  autoSync: true,
};

/* ================================================================
   PERSISTÊNCIA (memória do dispositivo)
================================================================ */

const readSettings = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (!raw) return { ...DEFAULT_SETTINGS };

    const parsed = JSON.parse(raw);

    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

const writeSettings = (settings) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    return true;
  } catch {
    return false;
  }
};

/* ================================================================
   TELA
================================================================ */
const Config = () => {
  const navigate = useNavigate();

  const [settings, setSettings] = useState(() => readSettings());
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    const ok = writeSettings(settings);
    setSaved(ok);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <>
      <GlobalStyles
        styles={{
          'html, body, #root': {
            margin: 0,
            padding: 0,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          },
        }}
      />

      <Box
        sx={{
          width: '100vw',
          height: '100vh',

          display: 'flex',
          flexDirection: 'column',

          overflow: 'hidden',

          bgcolor: BG,
          color: TEXT,

          fontFamily: '"Segoe UI", Arial, sans-serif',
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            height: 52,
            minHeight: 52,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            px: 1.5,

            bgcolor: '#FFFFFF',

            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Button
              onClick={handleBack}
              startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 16 }} />}
              sx={{
                minWidth: 0,
                height: 26,
                px: 1,

                borderRadius: '3px',

                color: MUTED,

                textTransform: 'none',

                fontSize: 11,
                fontWeight: 600,

                '&:hover': { bgcolor: '#F0F2F4' },
              }}
            >
              Início
            </Button>

            <Box
              sx={{
                width: 1,
                height: 20,

                bgcolor: BORDER,
              }}
            />

            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 800,
                lineHeight: 1,
                color: TEXT,
                letterSpacing: '0.5px',
              }}
            >
              CONFIGURAÇÕES
            </Typography>
          </Stack>

          <Button
            onClick={handleSave}
            variant="contained"
            size="small"
            startIcon={
              saved ? (
                <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
              ) : (
                <SaveRoundedIcon sx={{ fontSize: 15 }} />
              )
            }
            sx={{
              height: 27,

              px: 1.3,

              borderRadius: '3px',

              bgcolor: saved ? '#3CA66B' : BLUE,

              boxShadow: 'none',

              textTransform: 'uppercase',

              fontSize: 9,
              fontWeight: 700,

              '&:hover': {
                bgcolor: saved ? '#359761' : BLUE_DARK,
                boxShadow: 'none',
              },
            }}
          >
            {saved ? 'Salvo' : 'Salvar'}
          </Button>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            flex: 1,
            minHeight: 0,

            display: 'flex',
            justifyContent: 'center',

            p: 1.2,
            overflow: 'auto',
          }}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: 760,

              display: 'flex',
              flexDirection: 'column',
              gap: 1.2,
            }}
          >
            {/* SERVIDOR PRINCIPAL */}
            <Panel title="SERVIDOR PRINCIPAL">
              <Box sx={{ p: 1.5 }}>
                <Field
                  label="URL do servidor principal"
                  icon={<CloudDoneRoundedIcon />}
                  value={settings.serverUrl}
                  onChange={(e) => update('serverUrl', e.target.value)}
                  placeholder="https://exami.api.phcore.com.br"
                  helperText="Endereço base da API do Exami."
                />
              </Box>
            </Panel>

            {/* ORTHANC */}
            <Panel title="ORTHANC">
              <Box sx={{ p: 1.5 }}>
                <Field
                  label="Endereço do Orthanc"
                  icon={<StorageRoundedIcon />}
                  value={settings.orthancAddress}
                  onChange={(e) => update('orthancAddress', e.target.value)}
                  placeholder="http://192.168.1.100:8042"
                  helperText="Host e porta da instância Orthanc."
                />
              </Box>
            </Panel>
            {/* SINCRONIZAÇÃO */}
            <Panel title="SINCRONIZAÇÃO">
              <Box sx={{ p: 1.5 }}>
                <Field
                  label="Tempo de sincronização (minutos)"
                  icon={<ScheduleRoundedIcon />}
                  type="number"
                  value={settings.syncIntervalMinutes}
                  onChange={(e) =>
                    update('syncIntervalMinutes', Number(e.target.value) || 1)
                  }
                  inputProps={{ min: 1, step: 1 }}
                  helperText="Intervalo entre execuções automáticas."
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{
                    mt: 1.2,

                    px: 1,

                    height: 40,

                    border: `1px solid ${BORDER}`,
                    borderRadius: '3px',

                    bgcolor: '#F8FAFC',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={0.8}>
                    <Box
                      sx={{
                        width: 7,
                        height: 7,

                        bgcolor: settings.autoSync ? '#3CA66B' : '#B0B7BE',

                        borderRadius: '50%',
                      }}
                    />

                    <Typography
                      sx={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: TEXT,
                      }}
                    >
                      Sincronização automática
                    </Typography>

                    <Typography
                      sx={{
                        fontSize: 9.5,
                        color: MUTED,
                      }}
                    >
                      {settings.autoSync ? 'ativada' : 'desativada'}
                    </Typography>
                  </Stack>

                  <Switch
                    size="small"
                    checked={settings.autoSync}
                    onChange={(e) => update('autoSync', e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: BLUE_DARK,
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                        {
                          bgcolor: BLUE,
                        },
                    }}
                  />
                </Stack>
              </Box>
            </Panel>

            {/* AUTENTICAÇÃO */}
            <Panel title="AUTENTICAÇÃO">
              <Box sx={{ p: 1.5 }}>
                <Field
                  label="Token de autenticação"
                  icon={<VpnKeyRoundedIcon />}
                  value={settings.authToken}
                  onChange={(e) => update('authToken', e.target.value)}
                  placeholder="Cole aqui o token de acesso à API"
                  helperText="Enviado em cada requisição ao servidor principal."
                />
              </Box>
            </Panel>

            {/* INFO */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.6,

                px: 1,

                minHeight: 30,

                bgcolor: '#E8EEF5',
                border: `1px solid ${BORDER}`,
                borderRadius: '3px',
              }}
            >
              <Typography
                sx={{
                  fontSize: 9,
                  color: MUTED,
                  letterSpacing: '0.3px',
                }}
              >
                As configurações são gravadas na memória deste dispositivo e
                permanecem mesmo após reiniciar o aplicativo.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};
/* ================================================================
   PANEL
================================================================ */

const Panel = ({ title, children }) => (
  <Paper
    elevation={0}
    sx={{
      width: '100%',

      minWidth: 0,

      bgcolor: '#FFFFFF',

      border: `1px solid ${BORDER}`,

      borderRadius: '2px',

      overflow: 'hidden',
    }}
  >
    {title && (
      <Box
        sx={{
          height: 25,

          px: 1,

          display: 'flex',
          alignItems: 'center',

          bgcolor: '#F0F2F4',

          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <Typography
          sx={{
            fontSize: 8.5,
            fontWeight: 700,

            letterSpacing: '0.6px',

            color: '#5E6873',
          }}
        >
          {title}
        </Typography>
      </Box>
    )}

    {children}
  </Paper>
);

/* ================================================================
   FIELD
================================================================ */

const Field = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  helperText,
  type = 'text',
  inputProps,
}) => (
  <Box sx={{ mb: 1.2, '&:last-of-type': { mb: 0 } }}>
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{ mb: 0.4 }}
    >
      <Box
        sx={{
          width: 18,
          height: 18,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          color: BLUE,

          border: `1px solid #BFD7ED`,
          bgcolor: '#F5F9FD',

          borderRadius: '2px',
        }}
      >
        {React.cloneElement(icon, { sx: { fontSize: 11 } })}
      </Box>

      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 700,

          color: MUTED,

          letterSpacing: '0.4px',

          textTransform: 'uppercase',
        }}
      >
        {label}
      </Typography>
    </Stack>

    <TextField
      fullWidth
      size="small"
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      helperText={helperText}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Box
              sx={{
                width: 5,
                height: 5,

                bgcolor: BLUE,

                borderRadius: '50%',
              }}
            />
          </InputAdornment>
        ),
      }}
      inputProps={inputProps}
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '3px',

          bgcolor: '#FBFCFD',

          fontSize: 11,

          '&.Mui-focused fieldset': {
            borderColor: BLUE,
          },
        },

        '& .MuiFormHelperText-root': {
          fontSize: 8.5,
          color: MUTED,
          ml: 0,
        },
      }}
    />
  </Box>
);

export default Config;