import React, { useState } from 'react';

import {
  Box,
  Button,
  GlobalStyles,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

import logoUrl from '../assets/logo_no_background.svg';

const BLUE = '#5B9FE3';
const BLUE_DARK = '#397DBE';
const BORDER = '#C9D0D8';
const TEXT = '#303942';
const MUTED = '#707A85';
const BG = '#EEF1F4';

const SETTINGS_KEY = import.meta.env.VITE_STORAGE_SECRET;

const readSavedSettings = () => {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const Home = () => {
  const navigate = useNavigate();

  const [savedSettings] = useState(() => readSavedSettings());

  const connected = true;
  const orthancConnected = true;
  const syncing = false;
  const autoSync = savedSettings?.autoSync ?? true;

  const version = import.meta.env.VITE_APP_VERSION || '1.0';

  const stats = {
    synced: 24,
    received: 27,
    pending: 0,
    failed: 0,

    storage: 18.4,
    storageTotal: 60,

    lastSync: 'Hoje às 12:48',
    syncDuration: '00:04',

    nextSync: '12:53',
    syncInterval: `${savedSettings?.syncIntervalMinutes ?? 5} minutos`,

    orthancAddress: savedSettings?.orthancAddress || '192.168.1.100:8042',
    serverAddress:
      savedSettings?.serverUrl || import.meta.env.VITE_API_URL || '—',
  };

  const storagePercent = Math.min(
    100,
    (stats.storage / stats.storageTotal) * 100,
  );

  const storageFree = stats.storageTotal - stats.storage;

  return (
    <>
      <GlobalStyles
        styles={{
          '*, *::before, *::after': {
            boxSizing: 'border-box',
          },
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
        {/* =========================================================
            HEADER
        ========================================================= */}

        <Box
          sx={{
            height: 56,
            minHeight: 56,
            flexShrink: 0,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1.5,

            px: 1.5,

            bgcolor: '#FFFFFF',

            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          {/* LEFT: LOGO + NOME */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ minWidth: 0 }}
          >
            <Box
              component="img"
              src={logoUrl}
              alt="Exami Sync"
              sx={{
                width: 40,
                height: 40,
                flexShrink: 0,

                objectFit: 'contain',
                display: 'block',
              }}
            />


              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: TEXT,
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}
              >
                EXAMI
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  lineHeight: 1,
                  color: MUTED,
                  whiteSpace: 'nowrap',
                }}
              >
                Exami Sync
              </Typography>
            </Stack>
                
          

          {/* RIGHT: CONFIG */}
          <Button
            onClick={() => navigate('/config')}
            startIcon={<SettingsRoundedIcon sx={{ fontSize: 15 }} />}
            sx={{
              height: 26,
              flexShrink: 0,

              px: 1,

              borderRadius: '3px',

              border: `1px solid ${BORDER}`,

              bgcolor: '#FFFFFF',

              color: MUTED,

              textTransform: 'uppercase',

              fontSize: 9,
              fontWeight: 700,

              '& .MuiButton-startIcon': {
                mr: 0.5,
              },

              '&:hover': {
                bgcolor: '#F0F2F4',
                borderColor: BLUE,
                color: BLUE_DARK,
              },
            }}
          >
            Configurações
          </Button>
        </Box>

        {/* =========================================================
            CONTENT
        ========================================================= */}

        <Box
          sx={{
            flex: 1,
            minHeight: 0,

            display: 'flex',
            flexDirection: 'column',

            p: 1.2,
            gap: 1.2,

            overflowY: 'auto',
            overflowX: 'hidden',
          }}
        >
          {/* =======================================================
              CONEXÃO
          ======================================================= */}

          <Panel title="CONEXÃO">
            <Box
              sx={{
                minHeight: 72,
                flexShrink: 0,

                display: 'flex',
                alignItems: 'center',

                px: 1.5,
                py: 1,
                gap: 1,
              }}
            >
              <ConnectionItem
                icon={<StorageRoundedIcon />}
                title="ORTHANC"
                status={
                  orthancConnected ? 'Conectado' : 'Desconectado'
                }
                connected={orthancConnected}
                detail={stats.orthancAddress}
              />

              <ConnectionLine />

              <ConnectionItem
                icon={<CloudDoneRoundedIcon />}
                title="EXAMI SERVER"
                status={connected ? 'Conectado' : 'Desconectado'}
                connected={connected}
                detail={stats.serverAddress}
              />

              <ConnectionLine />

              <ConnectionItem
                icon={<SyncRoundedIcon />}
                title="SYNC"
                status={
                  syncing
                    ? 'Enviando...'
                    : stats.pending > 0
                      ? `${stats.pending} pendente(s)`
                      : 'Em dia'
                }
                connected={stats.pending === 0 && !syncing}
              />
            </Box>
          </Panel>

          {/* =======================================================
              INFORMATION (EXAMES + STORAGE)
          ======================================================= */}

          <Box
            sx={{
              flex: 1,
              minHeight: 140,

              display: 'grid',

              gridTemplateColumns:
                'minmax(0, 1.15fr) minmax(0, 0.85fr)',

              gap: 1.2,
            }}
          >
            {/* EXAMES */}
            <Panel title="EXAMES">
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,

                  display: 'grid',

                  gridTemplateColumns:
                    'repeat(4, minmax(0, 1fr))',

                  p: 1.2,
                }}
              >
                <InfoBlock
                  value={stats.received}
                  label="Recebidos"
                />

                <InfoBlock
                  value={stats.synced}
                  label="Sincronizados"
                />

                <InfoBlock
                  value={stats.pending}
                  label="Pendentes"
                  warning={stats.pending > 0}
                />

                <InfoBlock
                  value={stats.failed}
                  label="Falhas"
                  danger={stats.failed > 0}
                />
              </Box>
            </Panel>

            {/* STORAGE */}
            <Panel title="ARMAZENAMENTO">
              <Box
                sx={{
                  flex: 1,
                  minHeight: 0,

                  display: 'flex',
                  flexDirection: 'column',

                  justifyContent: 'center',

                  px: 1.5,
                  py: 1,
                }}
              >
                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  sx={{ mb: 0.8, minWidth: 0 }}
                >
                  <Typography
                    component="div"
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: TEXT,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {stats.storage.toLocaleString('pt-BR')} GB

                    <Box
                      component="span"
                      sx={{
                        fontSize: 10,
                        fontWeight: 400,
                        color: MUTED,
                        ml: 0.4,
                      }}
                    >
                      / {stats.storageTotal} GB
                    </Box>
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: BLUE_DARK,
                      flexShrink: 0,
                      ml: 1,
                    }}
                  >
                    {storagePercent.toFixed(0)}%
                  </Typography>
                </Stack>

                <LinearProgress
                  variant="determinate"
                  value={storagePercent}
                  sx={{
                    height: 8,

                    borderRadius: 0,

                    bgcolor: '#DDE2E7',

                    '& .MuiLinearProgress-bar': {
                      bgcolor: BLUE,
                      borderRadius: 0,
                    },
                  }}
                />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  sx={{ mt: 0.7, minWidth: 0 }}
                >
                  <Typography
                    sx={{
                      fontSize: 8.5,
                      color: MUTED,
                    }}
                  >
                    UTILIZADO
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 8.5,
                      color: MUTED,
                    }}
                  >
                    {storageFree.toLocaleString('pt-BR')} GB LIVRES
                  </Typography>
                </Stack>
              </Box>
            </Panel>
          </Box>

          {/* =======================================================
              SINCRONIZAÇÃO
          ======================================================= */}

          <Panel title="SINCRONIZAÇÃO">
            <Box
              sx={{
                minHeight: 56,
                flexShrink: 0,

                display: 'grid',

                gridTemplateColumns:
                  'minmax(0, 1.2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',

                alignItems: 'stretch',
              }}
            >
              <StatusCell
                icon={<SyncRoundedIcon />}
                label="STATUS"
                value={
                  syncing
                    ? 'Sincronizando'
                    : stats.pending === 0
                      ? 'Tudo sincronizado'
                      : 'Aguardando envio'
                }
                active={stats.pending === 0 && !syncing}
              />

              <StatusCell
                icon={<AccessTimeRoundedIcon />}
                label="ÚLTIMA SINCRONIZAÇÃO"
                value={stats.lastSync}
                detail={`Duração ${stats.syncDuration}`}
              />

              <StatusCell
                icon={<ScheduleRoundedIcon />}
                label="PRÓXIMA SINCRONIZAÇÃO"
                value={
                  autoSync
                    ? `Hoje às ${stats.nextSync}`
                    : 'Automática desativada'
                }
                detail={
                  autoSync
                    ? `Intervalo: ${stats.syncInterval}`
                    : undefined
                }
              />

              <StatusCell
                icon={<ErrorOutlineRoundedIcon />}
                label="OCORRÊNCIAS"
                value={
                  stats.failed === 0
                    ? 'Nenhuma ocorrência'
                    : `${stats.failed} falha(s)`
                }
                danger={stats.failed > 0}
              />
            </Box>
          </Panel>

          {/* =======================================================
              AÇÃO INFERIOR
          ======================================================= */}

          <Panel>
            <Box
              sx={{
                minHeight: 48,
                flexShrink: 0,

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,

                px: 1.2,
                py: 0.8,
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.7}
                sx={{ minWidth: 0, overflow: 'hidden' }}
              >
                <AccessTimeRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: MUTED,
                    flexShrink: 0,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 9.5,
                    color: MUTED,
                    letterSpacing: '0.4px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ÚLTIMA EXECUÇÃO:
                </Typography>

                <Typography
                  sx={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    color: TEXT,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {stats.lastSync}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 9,
                    color: '#9AA2AA',
                    ml: 0.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  • {stats.syncDuration}
                </Typography>
              </Stack>

              <Button
                variant="contained"
                size="small"
                startIcon={
                  <SyncRoundedIcon sx={{ fontSize: 15 }} />
                }
                sx={{
                  height: 28,
                  flexShrink: 0,

                  px: 1.3,

                  borderRadius: '3px',

                  bgcolor: BLUE,

                  boxShadow: 'none',

                  textTransform: 'uppercase',

                  fontSize: 9,
                  fontWeight: 700,

                  '& .MuiButton-startIcon': {
                    mr: 0.5,
                  },

                  '&:hover': {
                    bgcolor: BLUE_DARK,
                    boxShadow: 'none',
                  },
                }}
              >
                Sincronizar agora
              </Button>
            </Box>
          </Panel>
        </Box>

        {/* =========================================================
            FOOTER
        ========================================================= */}

        <Box
          sx={{
            height: 26,
            minHeight: 26,
            flexShrink: 0,

            px: 1.5,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 1,

            bgcolor: '#E3E7EB',

            borderTop: `1px solid ${BORDER}`,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={0.6}
            sx={{ minWidth: 0, overflow: 'hidden' }}
          >
            <Box
              sx={{
                width: 6,
                height: 6,
                flexShrink: 0,

                bgcolor: autoSync ? '#3CA66B' : '#B0B7BE',

                borderRadius: '50%',
              }}
            />

            <Typography
              sx={{
                fontSize: 8.5,
                color: '#59636E',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Sincronização automática{' '}
              {autoSync ? 'ativa' : 'inativa'}
              {autoSync && ` • a cada ${stats.syncInterval}`}
            </Typography>
          </Stack>

          <Typography
            sx={{
              fontSize: 8.5,
              color: '#7A838D',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Exami Sync {version}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

/* ================================================================
   PANEL
================================================================ */

const Panel = ({ title, children }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        minWidth: 0,
        minHeight: 0,

        display: 'flex',
        flexDirection: 'column',

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
            minHeight: 25,
            flexShrink: 0,

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
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </Typography>
        </Box>
      )}

      {children}
    </Paper>
  );
};

/* ================================================================
   CONNECTION ITEM
================================================================ */

const ConnectionItem = ({
  icon,
  title,
  status,
  detail,
  connected = true,
}) => {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        maxWidth: 200,

        display: 'flex',
        flexDirection: 'column',

        alignItems: 'center',
        justifyContent: 'center',

        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 32,
          height: 32,
          flexShrink: 0,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          color: connected ? BLUE : '#B0B7BE',

          border: `1px solid ${
            connected ? '#BFD7ED' : '#D5DADF'
          }`,

          bgcolor: connected ? '#F5F9FD' : '#F5F6F7',

          borderRadius: '2px',
        }}
      >
        {React.cloneElement(icon, {
          sx: { fontSize: 18 },
        })}
      </Box>

      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 700,

          mt: 0.6,

          color: TEXT,
          whiteSpace: 'nowrap',
        }}
      >
        {title}
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.4}
        sx={{ mt: 0.15, minWidth: 0, maxWidth: '100%' }}
      >
        <Box
          sx={{
            width: 5,
            height: 5,
            flexShrink: 0,

            bgcolor: connected ? '#3CA66B' : '#C94C4C',

            borderRadius: '50%',
          }}
        />

        <Typography
          sx={{
            fontSize: 8,
            color: connected ? '#4D8C69' : '#A33A3A',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {status}
        </Typography>
      </Stack>

      {detail && (
        <Typography
          sx={{
            fontSize: 7.5,
            color: '#929AA2',

            mt: 0.2,

            maxWidth: '100%',

            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
          title={detail}
        >
          {detail}
        </Typography>
      )}
    </Box>
  );
};

/* ================================================================
   CONNECTION LINE
================================================================ */

const ConnectionLine = () => {
  return (
    <Box
      sx={{
        flex: '0 0 30px',
        minWidth: 20,
        maxWidth: 60,

        height: 1,

        bgcolor: '#CBD2D9',

        position: 'relative',

        alignSelf: 'center',

        '&::after': {
          content: '""',

          position: 'absolute',

          right: 0,
          top: '50%',

          width: 5,
          height: 5,

          borderTop: '1px solid #AAB3BD',
          borderRight: '1px solid #AAB3BD',

          transform: 'translateY(-50%) rotate(45deg)',
        },
      }}
    />
  );
};

/* ================================================================
   INFO BLOCK
================================================================ */

const InfoBlock = ({
  value,
  label,
  warning = false,
  danger = false,
}) => {
  return (
    <Box
      sx={{
        minWidth: 0,

        display: 'flex',
        flexDirection: 'column',

        justifyContent: 'center',
        alignItems: 'center',

        textAlign: 'center',

        px: 1,

        borderRight: `1px solid ${BORDER}`,

        '&:last-child': {
          borderRight: 'none',
        },
      }}
    >
      <Typography
        sx={{
          fontSize: 26,
          fontWeight: 500,

          lineHeight: 1,

          color: danger
            ? '#C94C4C'
            : warning
              ? '#C58A2C'
              : BLUE_DARK,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          fontSize: 9,
          color: MUTED,

          mt: 0.6,

          textTransform: 'uppercase',

          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

/* ================================================================
   STATUS CELL
================================================================ */

const StatusCell = ({
  icon,
  label,
  value,
  detail,
  active = false,
  danger = false,
}) => {
  return (
    <Box
      sx={{
        minWidth: 0,

        display: 'flex',
        alignItems: 'center',

        px: 1.2,
        py: 0.8,

        borderRight: `1px solid ${BORDER}`,

        '&:last-child': {
          borderRight: 'none',
        },
      }}
    >
      <Box
        sx={{
          width: 26,
          height: 26,
          flexShrink: 0,

          mr: 0.9,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          bgcolor: danger
            ? '#FFF5F5'
            : active
              ? '#F1FAF4'
              : '#F5F9FD',

          color: danger
            ? '#C94C4C'
            : active
              ? '#3CA66B'
              : BLUE,

          border: `1px solid ${
            danger
              ? '#E7C1C1'
              : active
                ? '#B9D9C5'
                : '#C9DDF0'
          }`,

          borderRadius: '2px',
        }}
      >
        {React.cloneElement(icon, {
          sx: { fontSize: 15 },
        })}
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            fontSize: 7.5,
            fontWeight: 700,

            color: '#7A838D',

            letterSpacing: '0.4px',

            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {label}
        </Typography>

        <Typography
          sx={{
            fontSize: 9.5,
            fontWeight: 600,

            color: danger ? '#A33A3A' : TEXT,

            mt: 0.15,

            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          title={value}
        >
          {value}
        </Typography>

        {detail && (
          <Typography
            sx={{
              fontSize: 7.5,
              color: MUTED,

              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
            title={detail}
          >
            {detail}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default Home;