import React from 'react'
import {
  FaHome,
  FaBuilding,
  FaBed,
  FaBath,
  FaCar,
  FaParking,
  FaSwimmingPool,
  FaDumbbell,
  FaTree,
  FaWifi,
  FaTv,
  FaGamepad,
  FaShieldAlt,
  FaLock,
  FaVideo,
  FaCamera,
  FaStar,
  FaQuestion,
  FaCheck,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaUtensils,
  FaCoffee,
  FaGlassMartini,
  FaFire,
  FaSnowflake,
  FaLightbulb,
  FaPlug,
  FaBolt,
  FaWater,
  FaThermometerHalf,
  FaFan,
  FaSun,
  FaCloud,
  FaCloudRain,
  FaBus,
  FaTrain,
  FaPlane,
  FaShip,
  FaBicycle,
  FaMotorcycle,
  FaLaptop,
  FaDesktop,
  FaHeart,
  FaHeartbeat,
  FaFilm,
  FaMusic,
  FaBook,
  FaGraduationCap,
  FaBriefcase,
  FaShoppingCart,
  FaDog,
  FaCat,
  FaPaw,
  FaMoon,
  FaWind,
  FaClock,
  FaCalendarAlt,
  FaUsers,
  FaUserFriends,
  FaBaby,
  FaChild,
  FaWheelchair,
  FaExclamationTriangle,
  FaFirstAid,
  FaFireExtinguisher,
  FaUmbrellaBeach,
  FaSeedling,
  FaSmoking,
  FaSmokingBan,
  FaEye,
  FaEyeSlash,
  FaRoute,
  FaLocationArrow,
  FaTruck,
  FaPiggyBank,
  FaChartLine,
  FaCalculator,
  FaFileContract,
  FaHandshake,
  FaCertificate,
  FaAward,
  FaMedal,
  FaComments,
  FaWhatsapp,
  FaTelegram,
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaYoutube,
  FaTabletAlt,
  FaMobile,
  FaServer,
  FaDatabase,
  FaNetworkWired,
  FaBluetooth,
  FaRunning,
  FaWalking,
  FaBiking,
  FaSpa,
  FaHotTub,
  FaTheaterMasks,
  FaDice,
  FaPuzzlePiece,
  FaChess,
  FaTableTennis,
  FaBasketballBall,
  FaFootballBall,
  FaVolleyballBall,
  FaBaseballBall,
  FaHockeyPuck,
  FaGolfBall,
  FaBowlingBall,
  FaFish,
  FaHorse,
  FaBone,
  FaCloudSun,
  FaCloudMoon,
  FaTint,
  FaThermometerEmpty,
  FaThermometerQuarter,
  FaThermometerThreeQuarters,
  FaThermometerFull,
  FaCalendarCheck,
  FaCalendarTimes,
  FaCalendarPlus,
  FaCalendarMinus,
  FaStopwatch,
  FaHourglassHalf,
  FaHourglassStart,
  FaHourglassEnd,
  FaInfo,
  FaTimes,
  FaPlus,
  FaMinus,
  FaEdit,
  FaTrash,
  FaSave,
  FaDownload,
  FaUpload,
  FaShare,
  FaPrint,
  FaSearch,
  FaFilter,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCouch,
  FaDoorOpen,
  FaWindowMaximize,
  FaHouseUser,
  FaWarehouse,
  FaHotel,
  FaStore,
  FaUserTie,
  FaUserGraduate,
  FaUserNurse,
} from 'react-icons/fa'

// Icon mapping based on keywords
const iconMap: Record<string, React.ComponentType<any>> = {
  // Home & Building
  home: FaHome,
  house: FaHome,
  building: FaBuilding,
  apartment: FaBuilding,
  villa: FaHouseUser,
  mansion: FaHouseUser,
  warehouse: FaWarehouse,
  hotel: FaHotel,
  store: FaStore,
  shop: FaStore,
  office: FaBuilding,
  
  // Rooms
  bedroom: FaBed,
  bed: FaBed,
  bathroom: FaBath,
  bath: FaBath,
  kitchen: FaUtensils,
  living: FaCouch,
  dining: FaUtensils,
  study: FaBook,
  garage: FaCar,
  balcony: FaWindowMaximize,
  terrace: FaUmbrellaBeach,
  patio: FaUmbrellaBeach,
  
  // Amenities
  pool: FaSwimmingPool,
  swimming: FaSwimmingPool,
  gym: FaDumbbell,
  fitness: FaDumbbell,
  parking: FaParking,
  car: FaCar,
  garden: FaTree,
  lawn: FaSeedling,
  beach: FaUmbrellaBeach,
  fireplace: FaFire,
  ac: FaSnowflake,
  air: FaSnowflake,
  wifi: FaWifi,
  internet: FaWifi,
  tv: FaTv,
  television: FaTv,
  game: FaGamepad,
  music: FaMusic,
  library: FaBook,
  school: FaGraduationCap,
  work: FaBriefcase,
  shopping: FaShoppingCart,
  restaurant: FaUtensils,
  cafe: FaCoffee,
  bar: FaGlassMartini,
  
  // Security
  security: FaShieldAlt,
  cctv: FaVideo,
  camera: FaCamera,
  lock: FaLock,
  guard: FaShieldAlt,
  alarm: FaExclamationTriangle,
  fire: FaFireExtinguisher,
  safety: FaFirstAid,
  
  // Infrastructure
  wheelchair: FaWheelchair,
  accessible: FaWheelchair,
  baby: FaBaby,
  child: FaChild,
  family: FaUsers,
  pet: FaPaw,
  dog: FaDog,
  cat: FaCat,
  
  // Utilities
  light: FaLightbulb,
  electricity: FaPlug,
  power: FaBolt,
  water: FaWater,
  heating: FaThermometerHalf,
  cooling: FaSnowflake,
  fan: FaFan,
  climate: FaThermometerHalf,
  
  // Location
  location: FaMapMarkerAlt,
  address: FaMapMarkerAlt,
  transport: FaBus,
  bus: FaBus,
  train: FaTrain,
  metro: FaTrain,
  airport: FaPlane,
  port: FaShip,
  bike: FaBicycle,
  motorcycle: FaMotorcycle,
  
  // Financial
  price: FaMoneyBillWave,
  cost: FaMoneyBillWave,
  payment: FaCreditCard,
  mortgage: FaPiggyBank,
  investment: FaChartLine,
  rent: FaCalculator,
  lease: FaFileContract,
  contract: FaHandshake,
  
  // Communication
  phone: FaPhone,
  call: FaPhone,
  email: FaEnvelope,
  message: FaComments,
  contact: FaPhone,
  
  // Technology
  smart: FaLaptop,
  tech: FaDesktop,
  computer: FaDesktop,
  network: FaNetworkWired,
  
  // Health
  health: FaHeart,
  medical: FaHeartbeat,
  spa: FaSpa,
  wellness: FaHeart,
  
  // Entertainment
  movie: FaFilm,
  theater: FaTheaterMasks,
  play: FaGamepad,
  sport: FaBasketballBall,
  basketball: FaBasketballBall,
  football: FaFootballBall,
  tennis: FaTableTennis,
  golf: FaGolfBall,
  
  // Pets
  fish: FaFish,
  horse: FaHorse,
  
  // Weather
  moon: FaMoon,
  rain: FaCloudRain,
  wind: FaWind,
  temperature: FaThermometerHalf,
  
  // Time
  time: FaClock,
  schedule: FaCalendarAlt,
  date: FaCalendarAlt,
  duration: FaStopwatch,
  
  // Features
  feature: FaStar,
  amenity: FaCheck,
  service: FaHandshake,
  facility: FaBuilding,
  
  // Default
  default: FaHome,
}

// Function to get icon based on text
export const getIconFromText = (text: string, size: number = 16): React.ReactElement => {
  const lowerText = text.toLowerCase()
  
  // Try to find exact match first
  for (const [keyword, Icon] of Object.entries(iconMap)) {
    if (lowerText.includes(keyword)) {
      return React.createElement(Icon, { size })
    }
  }
  
  // If no match found, return default icon
  return React.createElement(FaHome, { size })
}

// Function to get icon for features (with specific styling)
export const getFeatureIcon = (feature: string) => {
  const lowerText = feature.toLowerCase()
  
  // Try to find exact match first
  for (const [keyword, Icon] of Object.entries(iconMap)) {
    if (lowerText.includes(keyword)) {
      return React.createElement(Icon, { 
        className: "h-6 w-6 text-[#546B2F]",
        size: 24
      })
    }
  }
  
  // If no match found, return default icon
  return React.createElement(FaHome, { 
    className: "h-6 w-6 text-[#546B2F]",
    size: 24
  })
}

// Function to get icon for specifications (with specific styling)
export const getSpecificationIcon = (specName: string) => {
  const lowerText = specName.toLowerCase()
  
  // Try to find exact match first
  for (const [keyword, Icon] of Object.entries(iconMap)) {
    if (lowerText.includes(keyword)) {
      return React.createElement(Icon, { 
        className: "h-4 w-4 text-[#546B2F] mr-2",
        size: 16
      })
    }
  }
  
  // If no match found, return default icon
  return React.createElement(FaHome, { 
    className: "h-4 w-4 text-[#546B2F] mr-2",
    size: 16
  })
}

// Function to format text for display
export const formatTextForDisplay = (text: string): string => {
  return text
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim()
} 