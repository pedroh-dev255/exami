import React from 'react';

import {
  Box,
  Button,
  GlobalStyles,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import SyncRoundedIcon from '@mui/icons-material/SyncRounded';
import StorageRoundedIcon from '@mui/icons-material/StorageRounded';
import CloudDoneRoundedIcon from '@mui/icons-material/CloudDoneRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded';
import ScheduleRoundedIcon from '@mui/icons-material/ScheduleRounded';

import logoUrl from '../assets/logo_no_background.svg';

const BLUE = '#5B9FE3';
const BLUE_DARK = '#397DBE';
const BORDER = '#C9D0D8';
const TEXT = '#303942';
const MUTED = '#707A85';
const BG = '#EEF1F4';

const Home = () => {
  const connected = true;
  const orthancConnected = true;
  const syncing = false;
  const autoSync = true;

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
    syncInterval: '5 minutos',

    orthancAddress: '192.168.1.100:8042',
    serverAddress: import.meta.env.VITE_API_URL,
  };

  const storagePercent =
    (stats.storage / stats.storageTotal) * 100;

  const storageFree =
    stats.storageTotal - stats.storage;

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

        {/* =========================================================
            HEADER
        ========================================================= */}

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
            <Box
              component="img"
              src={logoUrl}
              alt="Exami Sync"
              sx={{
                width: 30,
                height: 30,

                bgcolor: BLUE,

                borderRadius: '3px',

                p: 0.4,

                objectFit: 'contain',
              }}
            />

            <Stack direction="row" alignItems="baseline" spacing={0.8}>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 800,
                  lineHeight: 1,
                  color: TEXT,
                  letterSpacing: '0.5px',
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
                }}
              >
                Exami Sync
              </Typography>
            </Stack>
          </Stack>

          <Box
            sx={{
              height: 26,

              px: 1,

              display: 'flex',
              alignItems: 'center',
              gap: 0.6,

              border: `1px solid ${
                connected ? '#A9D5BA' : '#E1B4B4'
              }`,

              bgcolor: connected ? '#F1FAF4' : '#FFF5F5',
            }}
          >
            <Box
              sx={{
                width: 7,
                height: 7,

                bgcolor: connected ? '#3CA66B' : '#C94C4C',

                borderRadius: '50%',
              }}
            />

            <Typography
              sx={{
                fontSize: 9.5,
                fontWeight: 600,

                color: connected ? '#287B4D' : '#A33A3A',
              }}
            >
              {connected ? 'SERVIDOR ONLINE' : 'SERVIDOR OFFLINE'}
            </Typography>
          </Box>
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
          }}
        >

          {/* =======================================================
              CONEXÃO
          ======================================================= */}

          <Panel title="CONEXÃO">

            <Box
              sx={{
                height: 72,

                display: 'flex',
                alignItems: 'center',

                px: 1.5,
              }}
            >

              <ConnectionItem
                icon={<StorageRoundedIcon />}
                title="ORTHANC"
                status={
                  orthancConnected
                    ? 'Conectado'
                    : 'Desconectado'
                }
                detail={stats.orthancAddress}
              />

              <ConnectionLine />

              <ConnectionItem
                icon={<CloudDoneRoundedIcon />}
                title="EXAMI SERVER"
                status={
                  connected
                    ? 'Conectado'
                    : 'Desconectado'
                }
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
              />

            </Box>
          </Panel>


          {/* =======================================================
              INFORMATION
          ======================================================= */}

          <Box
            sx={{
              flex: 1,
              minHeight: 0,

              display: 'grid',

              gridTemplateColumns: '1.15fr 0.85fr',

              gap: 1.2,
            }}
          >

            {/* =====================================================
                EXAMES
            ===================================================== */}

            <Panel title="EXAMES">

              <Box
                sx={{
                  height: '100%',

                  display: 'grid',

                  gridTemplateColumns:
                    'repeat(4, 1fr)',

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


            {/* =====================================================
                STORAGE
            ===================================================== */}

            <Panel title="ARMAZENAMENTO">

              <Box
                sx={{
                  height: '100%',

                  display: 'flex',
                  flexDirection: 'column',

                  justifyContent: 'center',

                  px: 1.5,
                }}
              >

                <Stack
                  direction="row"
                  alignItems="baseline"
                  justifyContent="space-between"
                  sx={{ mb: 0.8 }}
                >
                  <Typography
                    sx={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: TEXT,
                    }}
                  >
                    {stats.storage.toLocaleString('pt-BR')} GB

                    <Typography
                      component="span"
                      sx={{
                        fontSize: 10,
                        fontWeight: 400,
                        color: MUTED,
                        ml: 0.4,
                      }}
                    >
                      / {stats.storageTotal} GB
                    </Typography>
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: BLUE_DARK,
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
                  sx={{ mt: 0.7 }}
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
              SYNCHRONIZATION STATUS
          ======================================================= */}

          <Panel title="SINCRONIZAÇÃO">

            <Box
              sx={{
                height: 52,

                display: 'grid',

                gridTemplateColumns:
                  '1.2fr 1fr 1fr 1fr',

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
                active={stats.pending === 0}
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
              BOTTOM ACTION
          ======================================================= */}

          <Panel>

            <Box
              sx={{
                height: 42,

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',

                px: 1.2,
              }}
            >

              <Stack
                direction="row"
                alignItems="center"
                spacing={0.7}
              >
                <AccessTimeRoundedIcon
                  sx={{
                    fontSize: 16,
                    color: MUTED,
                  }}
                />

                <Typography
                  sx={{
                    fontSize: 9.5,
                    color: MUTED,
                    letterSpacing: '0.4px',
                  }}
                >
                  ÚLTIMA EXECUÇÃO:
                </Typography>

                <Typography
                  sx={{
                    fontSize: 9.5,
                    fontWeight: 600,
                    color: TEXT,
                  }}
                >
                  {stats.lastSync}
                </Typography>

                <Typography
                  sx={{
                    fontSize: 9,
                    color: '#9AA2AA',
                    ml: 0.5,
                  }}
                >
                  • {stats.syncDuration}
                </Typography>
              </Stack>


              <Button
                variant="contained"
                size="small"
                startIcon={
                  <SyncRoundedIcon
                    sx={{ fontSize: 15 }}
                  />
                }
                sx={{
                  height: 27,

                  px: 1.3,

                  borderRadius: '3px',

                  bgcolor: BLUE,

                  boxShadow: 'none',

                  textTransform: 'uppercase',

                  fontSize: 9,
                  fontWeight: 700,

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

            px: 1.5,

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

            bgcolor: '#E3E7EB',

            borderTop: `1px solid ${BORDER}`,
          }}
        >

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.6}
          >

            <Box
              sx={{
                width: 6,
                height: 6,

                bgcolor:
                  autoSync
                    ? '#3CA66B'
                    : '#B0B7BE',

                borderRadius: '50%',
              }}
            />

            <Typography
              sx={{
                fontSize: 8.5,
                color: '#59636E',
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
        height: '100%',

        minWidth: 0,
        minHeight: 0,

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
};


/* ================================================================
   CONNECTION ITEM
================================================================ */

const ConnectionItem = ({
  icon,
  title,
  status,
  detail,
}) => {
  return (
    <Box
      sx={{
        width: 150,

        display: 'flex',
        flexDirection: 'column',

        alignItems: 'center',

        flexShrink: 0,
      }}
    >

      <Box
        sx={{
          width: 30,
          height: 30,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          color: BLUE,

          border: `1px solid #BFD7ED`,

          bgcolor: '#F5F9FD',

          borderRadius: '2px',
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            fontSize: 17,
          },
        })}
      </Box>


      <Typography
        sx={{
          fontSize: 9,
          fontWeight: 700,

          mt: 0.6,

          color: TEXT,
        }}
      >
        {title}
      </Typography>


      <Stack
        direction="row"
        alignItems="center"
        spacing={0.4}
        sx={{ mt: 0.15 }}
      >

        <Box
          sx={{
            width: 5,
            height: 5,

            bgcolor: '#3CA66B',

            borderRadius: '50%',
          }}
        />

        <Typography
          sx={{
            fontSize: 8,
            color: '#4D8C69',
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

            mt: 0.1,

            maxWidth: 150,

            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
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
        flex: 1,

        height: 1,

        bgcolor: '#CBD2D9',

        position: 'relative',

        '&::after': {
          content: '""',

          position: 'absolute',

          right: 0,
          top: '50%',

          width: 5,
          height: 5,

          borderTop: '1px solid #AAB3BD',

          borderRight: '1px solid #AAB3BD',

          transform:
            'translateY(-50%) rotate(45deg)',
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
        display: 'flex',
        flexDirection: 'column',

        justifyContent: 'center',

        px: 1.5,

        borderRight:
          `1px solid ${BORDER}`,

        '&:last-child': {
          borderRight: 'none',
        },
      }}
    >

      <Typography
        sx={{
          fontSize: 27,
          fontWeight: 500,

          lineHeight: 1,

          color:
            danger
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
        display: 'flex',
        alignItems: 'center',

        px: 1.2,

        borderRight:
          `1px solid ${BORDER}`,

        '&:last-child': {
          borderRight: 'none',
        },
      }}
    >

      <Box
        sx={{
          width: 26,
          height: 26,

          mr: 0.9,

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          bgcolor:
            danger
              ? '#FFF5F5'
              : active
                ? '#F1FAF4'
                : '#F5F9FD',

          color:
            danger
              ? '#C94C4C'
              : active
                ? '#3CA66B'
                : BLUE,

          border:
            `1px solid ${
              danger
                ? '#E7C1C1'
                : active
                  ? '#B9D9C5'
                  : '#C9DDF0'
            }`,

          borderRadius: '2px',

          flexShrink: 0,
        }}
      >
        {React.cloneElement(icon, {
          sx: {
            fontSize: 15,
          },
        })}
      </Box>


      <Box
        sx={{
          minWidth: 0,
        }}
      >

        <Typography
          sx={{
            fontSize: 7.5,
            fontWeight: 700,

            color: '#7A838D',

            letterSpacing: '0.4px',

            whiteSpace: 'nowrap',
          }}
        >
          {label}
        </Typography>


        <Typography
          sx={{
            fontSize: 9.5,
            fontWeight: 600,

            color:
              danger
                ? '#A33A3A'
                : TEXT,

            mt: 0.15,

            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {value}
        </Typography>


        {detail && (
          <Typography
            sx={{
              fontSize: 7.5,
              color: MUTED,

              whiteSpace: 'nowrap',
            }}
          >
            {detail}
          </Typography>
        )}

      </Box>

    </Box>
  );
};

export default Home;