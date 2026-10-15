const EST = { n: 'Valladolid (Estación de Autobuses)', p: [41.6403, -4.7348] }
const ARCO = { n: 'Paseo Arco Ladrillo', p: [41.6408, -4.7328] }
const HM = { n: 'Paseo Hospital Militar', p: [41.6436, -4.7343] }
const PZ = { n: 'Paseo Zorrilla', p: [41.6360, -4.7390] }
const AVSAL = { n: 'Avenida de Salamanca', p: [41.6240, -4.7540] }
const RIO = { n: 'C.C. Río Shopping', p: [41.6118, -4.8045] }

const SCH_HIGH = {
  invierno: [
    { days: 'Lunes a Viernes', hours: '06:30 a 23:00', freq: 'Cada 30 min' },
    { days: 'Sábados', hours: '07:00 a 23:00', freq: 'Cada 60 min' },
    { days: 'Domingos y Festivos', hours: '08:00 a 22:00', freq: 'Cada 60 min' }
  ],
  verano: [
    { days: 'Lunes a Viernes', hours: '07:00 a 23:00', freq: 'Cada 45 min' },
    { days: 'Sábados', hours: '07:30 a 23:00', freq: 'Cada 60 min' },
    { days: 'Domingos y Festivos', hours: '08:30 a 22:00', freq: 'Cada 90 min' }
  ]
}

const SCH_MED = {
  invierno: [
    { days: 'Lunes a Viernes', hours: '07:00 a 22:30', freq: 'Cada 60 min' },
    { days: 'Sábados', hours: '08:00 a 22:00', freq: 'Cada 60 min' },
    { days: 'Domingos y Festivos', hours: '09:00 a 21:00', freq: 'Cada 120 min' }
  ],
  verano: [
    { days: 'Lunes a Viernes', hours: '07:30 a 22:30', freq: 'Cada 60 min' },
    { days: 'Sábados', hours: '08:30 a 22:00', freq: 'Cada 90 min' },
    { days: 'Domingos y Festivos', hours: '09:30 a 21:00', freq: 'Cada 120 min' }
  ]
}

const SCH_LOW = {
  invierno: [
    { days: 'Lunes a Viernes', hours: '07:15 a 21:15', freq: 'Cada 90 min' },
    { days: 'Sábados', hours: '08:30 a 20:30', freq: 'Cada 120 min' },
    { days: 'Domingos y Festivos', hours: 'Sin servicio', freq: '-' }
  ],
  verano: [
    { days: 'Lunes a Viernes', hours: '07:45 a 21:15', freq: 'Cada 120 min' },
    { days: 'Sábados', hours: '09:00 y 14:00', freq: '2 expediciones' },
    { days: 'Domingos y Festivos', hours: 'Sin servicio', freq: '-' }
  ]
}

const SCH_TEC = {
  invierno: [
    { days: 'Lunes a Viernes (Ida)', hours: '07:30, 08:30', freq: 'Solo mañanas' },
    { days: 'Lunes a Viernes (Vuelta)', hours: '14:15, 15:15, 18:15', freq: 'Mediodía y tarde' },
    { days: 'Fines de semana', hours: 'Sin servicio', freq: '-' }
  ],
  verano: [
    { days: 'Lunes a Viernes (Ida)', hours: '07:30, 08:30', freq: 'Solo mañanas' },
    { days: 'Lunes a Viernes (Vuelta)', hours: '14:15, 15:15', freq: 'Mediodía' },
    { days: 'Fines de semana', hours: 'Sin servicio', freq: '-' }
  ]
}

const SCH_UNI = {
  invierno: [
    { days: 'Lunes a Viernes (Lectivos)', hours: '07:15 a 21:30', freq: 'Cada 60 min' },
    { days: 'Fines de semana y Festivos', hours: 'Sin servicio', freq: '-' }
  ],
  verano: [
    { days: 'Lunes a Viernes (No lectivos)', hours: 'Sin servicio', freq: '-' },
    { days: 'Fines de semana y Festivos', hours: 'Sin servicio', freq: '-' }
  ]
}

export const LINES = [
  { 
    id: 'A1', 
    color: '#FF4757', 
    ink: '#0A0A0A', 
    name: 'Arroyo de la Encomienda (Línea Roja - Río Shopping)', 
    operator: 'La Regional Vallisoletana', 
    schedule: SCH_HIGH,
    route: [
      EST, 
      ARCO,
      HM,
      PZ,
      AVSAL,
      { n: 'La Vega (Avenida Colón)', p: [41.6180, -4.7850] },
      { n: 'La Flecha (Plaza España)', p: [41.6140, -4.8000] },
      RIO
    ] 
  },
  { 
    id: 'A2', 
    color: '#FF7F50', 
    ink: '#0A0A0A', 
    name: 'Arroyo de la Encomienda (Línea Naranja)', 
    operator: 'La Regional Vallisoletana', 
    schedule: SCH_HIGH, 
    route: [
      EST, 
      ARCO,
      HM,
      PZ,
      AVSAL,
      { n: 'Arroyo (Avenida Jose Luis Lasa)', p: [41.6120, -4.7900] }
    ] 
  },
  { 
    id: 'A3', 
    color: '#EFFF1A', 
    ink: '#0A0A0A', 
    name: 'Arroyo de la Encomienda (Línea Amarilla)', 
    operator: 'La Regional Vallisoletana', 
    schedule: SCH_HIGH, 
    route: [
      EST, 
      ARCO,
      HM,
      PZ,
      { n: 'Parquesol', p: [41.6400, -4.7650] },
      { n: 'Glorieta Zaratán / Av. Gijón', p: [41.6480, -4.7700] },
      RIO
    ] 
  },
  { 
    id: 'A4', 
    color: '#B2FF05', 
    ink: '#0A0A0A', 
    name: 'Arroyo de la Encomienda (Línea Azul - La Vega/Sotoverde)', 
    operator: 'La Regional Vallisoletana', 
    schedule: SCH_HIGH,
    route: [
      EST, 
      ARCO,
      HM,
      PZ,
      AVSAL,
      { n: 'La Vega', p: [41.6180, -4.7850] },
      { n: 'Sotoverde', p: [41.6060, -4.8150] },
      RIO
    ] 
  },
  { 
    id: 'AU', 
    color: '#00F0FF',
    ink: '#0A0A0A', 
    name: 'Arroyo de la Encomienda (Línea Universitaria)', 
    operator: 'La Regional Vallisoletana', 
    schedule: SCH_UNI,
    route: [
      { n: 'La Flecha (Plaza España)', p: [41.6140, -4.8000] },
      { n: 'Avenida Aranzana', p: [41.6110, -4.8040] },
      AVSAL,
      PZ,
      HM,
      ARCO,
      EST,
      { n: 'UEMC', p: [41.6350, -4.7100] }
    ] 
  },
  { 
    id: '2', 
    color: '#00FFAA', 
    ink: '#0A0A0A', 
    name: 'Laguna de Duero', 
    operator: 'Empresa Cabrero (ECSA)', 
    schedule: SCH_HIGH,
    route: [
      EST, 
      ARCO,
      HM,
      { n: 'Paseo Arco Ladrillo', p: [41.6300, -4.7340] },
      { n: 'Carretera de Madrid (N-601)', p: [41.6120, -4.7360] },
      { n: 'Polígono San Cristóbal (N-601)', p: [41.5980, -4.7300] },
      { n: 'Pza. Comunidades (Laguna de Duero)', p: [41.5812, -4.7189] }
    ] 
  },
  { 
    id: '5', 
    color: '#C77DFF', 
    ink: '#0A0A0A', 
    name: 'Boecillo', 
    operator: 'Empresa Cabrero', 
    schedule: SCH_LOW, 
    route: [
      EST, 
      ARCO,
      HM,
      PZ,
      { n: 'Carretera de Madrid (N-601)', p: [41.6050, -4.7380] },
      { n: 'Paseo de Covaresa (N-601)', p: [41.5900, -4.7400] },
      { n: 'Boecillo', p: [41.5736, -4.7600] }
    ] 
  },
  { 
    id: '6', 
    color: '#FF3399', 
    ink: '#0A0A0A', 
    name: 'Tudela de Duero', 
    operator: 'Linecar', 
    schedule: SCH_MED,
    route: [
      EST, 
      ARCO,
      HM,
      { n: 'Paseo de Arco Ladrillo', p: [41.6300, -4.7340] },
      { n: 'Carretera de Soria (La Cistérniga)', p: [41.6160, -4.6560] }, 
      { n: 'Polígono La Mora', p: [41.6050, -4.6300] }, 
      { n: 'Tudela de Duero', p: [41.5890, -4.5730] }, 
      { n: 'Montemayor', p: [41.5000, -4.4500] }, 
      { n: 'Campaspero', p: [41.4800, -4.3100] } 
    ] 
  },
  { 
    id: '7', 
    color: '#FFC300', 
    ink: '#0A0A0A', 
    name: 'Renedo de Esgueva', 
    operator: 'Autodival', 
    schedule: SCH_LOW, 
    route: [
      EST, 
      ARCO,
      { n: 'Plaza Circular', p: [41.6500, -4.7150] },
      { n: 'Barrio Pilarica', p: [41.6530, -4.6950] },
      { n: 'Carretera de Renedo (VA-140)', p: [41.6550, -4.6650] },
      { n: 'Renedo de Esgueva', p: [41.6578, -4.6393] }
    ] 
  },
  { 
    id: '8', 
    color: '#FF85A2', 
    ink: '#0A0A0A', 
    name: 'Cigales (Pueblos / Directo)', 
    operator: 'La Regional Vallisoletana', 
    schedule: SCH_MED,
    route: [
      EST, 
      ARCO,
      { n: 'Plaza Poniente', p: [41.6530, -4.7300] },
      { n: 'Avenida de Gijón', p: [41.6600, -4.7350] },
      { n: 'Autovía de Castilla (A-62 / Fuente Berrocal)', p: [41.6750, -4.7450] },
      { n: 'Cigales', p: [41.7744, -4.7017] }
    ] 
  },
  { 
    id: '10', 
    color: '#2B0042', 
    mapColor: '#D926FF', 
    ink: '#FF66FF', 
    name: 'Zaratán', 
    operator: 'Autocares Interbús', 
    schedule: SCH_HIGH, 
    route: [
      EST,
      ARCO,
      { n: 'Pº Isabel La Católica', p: [41.6530, -4.7300] },
      { n: 'Avenida de Gijón', p: [41.6600, -4.7350] },
      { n: 'Glorieta Zaratán (A-62)', p: [41.6680, -4.7430] },
      { n: 'Equinoccio Park', p: [41.6750, -4.7500] },
      { n: 'Zaratán', p: [41.6850, -4.7800] }
    ] 
  },
  { 
    id: '11', 
    color: '#00E5FF', 
    ink: '#0A0A0A', 
    name: 'Aeropuerto y Villanubla', 
    operator: 'Linecar', 
    schedule: SCH_LOW,
    route: [
      EST, 
      ARCO,
      { n: 'Avenida de Gijón', p: [41.6600, -4.7350] },
      { n: 'Carretera de León (N-601)', p: [41.6700, -4.7600] },
      { n: 'Villanubla', p: [41.6937, -4.8197] }, 
      { n: 'Aeropuerto de Villanubla', p: [41.7061, -4.8515] } 
    ] 
  },
  { 
    id: '12', 
    color: '#CCFF00', 
    ink: '#0A0A0A', 
    name: 'Castronuevo de Esgueva', 
    operator: 'Autodival', 
    schedule: SCH_LOW, 
    route: [
      EST, 
      ARCO,
      { n: 'Plaza Circular', p: [41.6500, -4.7150] },
      { n: 'Carretera de Renedo (VA-140)', p: [41.6560, -4.6500] },
      { n: 'Castronuevo de Esgueva', p: [41.6700, -4.5200] }
    ] 
  },
  { 
    id: '13', 
    color: '#FF6600', 
    ink: '#0A0A0A', 
    name: 'Cabezón de Pisuerga / Santovenia', 
    operator: 'La Regional Vallisoletana', 
    schedule: SCH_MED,
    route: [
      EST,
      ARCO,
      { n: 'Plaza Poniente', p: [41.6530, -4.7300] },
      { n: 'Avenida de Santander', p: [41.6650, -4.7150] },
      { n: 'Santovenia de Pisuerga', p: [41.6850, -4.7000] },
      { n: 'Cabezón de Pisuerga', p: [41.7114, -4.6742] }
    ] 
  },
  { 
    id: '14', 
    color: '#FF0055', 
    ink: '#0A0A0A', 
    name: 'Viana de Cega', 
    operator: 'Empresa Cabrero', 
    schedule: SCH_LOW, 
    route: [
      EST, 
      ARCO,
      HM,
      PZ,
      { n: 'Paseo Arco Ladrillo', p: [41.6300, -4.7340] },
      { n: 'Carretera de Madrid (N-601)', p: [41.6100, -4.7360] },
      { n: 'Viana de Cega', p: [41.5876, -4.7505] }
    ] 
  },
  { 
    id: '15', 
    color: '#4D4DFF', 
    ink: '#FFFFFF', 
    name: 'Parque Tecnológico de Boecillo', 
    operator: 'Empresa Cabrero', 
    schedule: SCH_TEC, 
    route: [
      EST, 
      ARCO,
      HM,
      PZ,
      { n: 'Carretera de Madrid (N-601)', p: [41.6000, -4.7380] },
      { n: 'Desvío Parque Tecnológico', p: [41.5750, -4.7550] },
      { n: 'Parque Tecnológico de Boecillo', p: [41.5690, -4.7650] }
    ] 
  }
]

export const getLine = (id) => LINES.find((l) => l.id === id)

export const OPERATORS = [
  ['Autocares Interbús', 'http://www.autocaresinterbus.com/'],
  ['Autodival', 'http://autodival.com/'],
  ['Auvasa', 'http://www.auvasa.es/'],
  ['Empresa Cabrero', 'http://www.ecsa.es/'],
  ['La Regional Vallisoletana', 'http://www.laregionalvsa.com'],
  ['Linecar', 'http://www.linecar.es'],
]

export const MUNICIPIOS = [
  'Arroyo de la Encomienda', 'Boecillo', 'Cabezón de Pisuerga', 'Cigales', 'Fuensaldaña',
  'La Cistérniga', 'Laguna de Duero', 'Mucientes', 'Renedo de Esgueva', 'Santovenia de Pisuerga',
  'Simancas', 'Tudela de Duero', 'Valladolid', 'Villanubla', 'Zaratán',
]

export const TARIFAS = [
  ['Billete ordinario', 'Tarifa por km o mínimo de percepción'],
  ['Bono por viajes ordinario', '0,55 € / viaje'],
  ['Bono por viajes especial', '0,38 € / viaje'],
  ['Bono mes ordinario', '21,00 € / mes'],
  ['Bono mes combinado (incluye Auvasa)', '29,50 € / mes'],
]