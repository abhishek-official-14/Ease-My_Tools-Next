"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  ArrowRightLeft,
  BookOpen,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Download,
  History,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash2,
  Volume2,
  Wand2,
} from "lucide-react"
import ToolHero from "@/components/tool-page-helpers/ToolHero"
import { ToolHeroProps } from "@/types/tool"

type ConversionCategory =
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "time"
  | "pressure"
  | "energy"
  | "power"
  | "digitalStorage"
  | "dataTransfer"
  | "angle"
  | "frequency"
  | "fuelEconomy"
  | "density"
  | "force"
  | "torque"
  | "current"
  | "voltage"
  | "resistance"
  | "capacitance"

type UnitDef = {
  value: string
  label: string
  shortLabel?: string
  factorToBase?: number
}

type CategoryDef = {
  key: ConversionCategory
  label: string
  description: string
  baseUnit: string
  units: UnitDef[]
  kind?: "standard" | "temperature" | "fuelEconomy"
  formulaHint: string
  examples: string[]
}

type HistoryItem = {
  id: string
  category: ConversionCategory
  fromUnit: string
  toUnit: string
  inputValue: string
  outputValue: string
  timestamp: number
}

type FavoriteItem = {
  id: string
  category: ConversionCategory
  fromUnit: string
  toUnit: string
}

const STORAGE_KEYS = {
  history: "unit-converter-history-v2",
  favorites: "unit-converter-favorites-v2",
} as const

const categoryDefinitions: CategoryDef[] = [
  {
    key: "length",
    label: "Length",
    description: "Measure distance and size",
    baseUnit: "meter",
    kind: "standard",
    formulaHint: "1 meter is the base unit. Convert by multiplying to base, then dividing to the target unit.",
    examples: ["1 kilometer = 1000 meters", "1 mile = 1609.344 meters"],
    units: [
      { value: "meter", label: "Meter (m)", factorToBase: 1 },
      { value: "kilometer", label: "Kilometer (km)", factorToBase: 1000 },
      { value: "centimeter", label: "Centimeter (cm)", factorToBase: 0.01 },
      { value: "millimeter", label: "Millimeter (mm)", factorToBase: 0.001 },
      { value: "mile", label: "Mile (mi)", factorToBase: 1609.344 },
      { value: "yard", label: "Yard (yd)", factorToBase: 0.9144 },
      { value: "foot", label: "Foot (ft)", factorToBase: 0.3048 },
      { value: "inch", label: "Inch (in)", factorToBase: 0.0254 },
      { value: "nauticalMile", label: "Nautical Mile (nmi)", factorToBase: 1852 },
    ],
  },
  {
    key: "weight",
    label: "Weight",
    description: "Mass and weight conversions",
    baseUnit: "kilogram",
    kind: "standard",
    formulaHint: "Kilogram is the base unit here. Use common weight units for everyday conversions.",
    examples: ["1 pound = 0.45359237 kg", "1 ounce = 0.028349523125 kg"],
    units: [
      { value: "kilogram", label: "Kilogram (kg)", factorToBase: 1 },
      { value: "gram", label: "Gram (g)", factorToBase: 0.001 },
      { value: "milligram", label: "Milligram (mg)", factorToBase: 0.000001 },
      { value: "pound", label: "Pound (lb)", factorToBase: 0.45359237 },
      { value: "ounce", label: "Ounce (oz)", factorToBase: 0.028349523125 },
      { value: "ton", label: "Metric Ton (t)", factorToBase: 1000 },
    ],
  },
  {
    key: "temperature",
    label: "Temperature",
    description: "Celsius, Fahrenheit, and Kelvin",
    baseUnit: "celsius",
    kind: "temperature",
    formulaHint: "Temperature uses formulas rather than fixed factors.",
    examples: ["°F = (°C × 9/5) + 32", "K = °C + 273.15"],
    units: [
      { value: "celsius", label: "Celsius (°C)" },
      { value: "fahrenheit", label: "Fahrenheit (°F)" },
      { value: "kelvin", label: "Kelvin (K)" },
    ],
  },
  {
    key: "area",
    label: "Area",
    description: "Surface measurements",
    baseUnit: "squareMeter",
    kind: "standard",
    formulaHint: "Square meter is the base unit.",
    examples: ["1 acre = 4046.8564224 m²", "1 hectare = 10,000 m²"],
    units: [
      { value: "squareMeter", label: "Square Meter (m²)", factorToBase: 1 },
      { value: "squareKilometer", label: "Square Kilometer (km²)", factorToBase: 1_000_000 },
      { value: "squareMile", label: "Square Mile (mi²)", factorToBase: 2_589_988.110336 },
      { value: "squareYard", label: "Square Yard (yd²)", factorToBase: 0.83612736 },
      { value: "squareFoot", label: "Square Foot (ft²)", factorToBase: 0.09290304 },
      { value: "acre", label: "Acre", factorToBase: 4046.8564224 },
      { value: "hectare", label: "Hectare", factorToBase: 10000 },
    ],
  },
  {
    key: "volume",
    label: "Volume",
    description: "Liquid and cubic measurements",
    baseUnit: "cubicMeter",
    kind: "standard",
    formulaHint: "Cubic meter is the base unit.",
    examples: ["1 liter = 0.001 m³", "1 gallon (US) = 0.003785411784 m³"],
    units: [
      { value: "cubicMeter", label: "Cubic Meter (m³)", factorToBase: 1 },
      { value: "liter", label: "Liter (L)", factorToBase: 0.001 },
      { value: "milliliter", label: "Milliliter (mL)", factorToBase: 0.000001 },
      { value: "gallonUS", label: "Gallon (US)", factorToBase: 0.003785411784 },
      { value: "quartUS", label: "Quart (US)", factorToBase: 0.000946352946 },
      { value: "pintUS", label: "Pint (US)", factorToBase: 0.000473176473 },
      { value: "cupUS", label: "Cup (US)", factorToBase: 0.0002365882365 },
      { value: "cubicFoot", label: "Cubic Foot (ft³)", factorToBase: 0.028316846592 },
    ],
  },
  {
    key: "speed",
    label: "Speed",
    description: "Velocity and travel speed",
    baseUnit: "meterPerSecond",
    kind: "standard",
    formulaHint: "Meter per second is the base unit.",
    examples: ["1 km/h = 0.277777... m/s", "1 mph = 0.44704 m/s"],
    units: [
      { value: "meterPerSecond", label: "Meter/Second (m/s)", factorToBase: 1 },
      { value: "kilometerPerHour", label: "Kilometer/Hour (km/h)", factorToBase: 0.2777777777777778 },
      { value: "milePerHour", label: "Mile/Hour (mph)", factorToBase: 0.44704 },
      { value: "knot", label: "Knot (kn)", factorToBase: 0.5144444444444445 },
      { value: "footPerSecond", label: "Foot/Second (ft/s)", factorToBase: 0.3048 },
    ],
  },
  {
    key: "time",
    label: "Time",
    description: "Duration and time intervals",
    baseUnit: "second",
    kind: "standard",
    formulaHint: "Second is the base unit.",
    examples: ["1 minute = 60 seconds", "1 day = 86,400 seconds"],
    units: [
      { value: "second", label: "Second (s)", factorToBase: 1 },
      { value: "minute", label: "Minute (min)", factorToBase: 60 },
      { value: "hour", label: "Hour (h)", factorToBase: 3600 },
      { value: "day", label: "Day", factorToBase: 86400 },
      { value: "week", label: "Week", factorToBase: 604800 },
    ],
  },
  {
    key: "pressure",
    label: "Pressure",
    description: "Force applied over area",
    baseUnit: "pascal",
    kind: "standard",
    formulaHint: "Pascal is the base unit.",
    examples: ["1 bar = 100,000 Pa", "1 atm = 101,325 Pa"],
    units: [
      { value: "pascal", label: "Pascal (Pa)", factorToBase: 1 },
      { value: "kilopascal", label: "Kilopascal (kPa)", factorToBase: 1000 },
      { value: "bar", label: "Bar", factorToBase: 100000 },
      { value: "psi", label: "PSI", factorToBase: 6894.757293168 },
      { value: "atm", label: "Atmosphere (atm)", factorToBase: 101325 },
      { value: "mmHg", label: "mmHg", factorToBase: 133.3223684211 },
    ],
  },
  {
    key: "energy",
    label: "Energy",
    description: "Work and power-related energy",
    baseUnit: "joule",
    kind: "standard",
    formulaHint: "Joule is the base unit.",
    examples: ["1 kWh = 3,600,000 J", "1 kcal = 4184 J"],
    units: [
      { value: "joule", label: "Joule (J)", factorToBase: 1 },
      { value: "kilojoule", label: "Kilojoule (kJ)", factorToBase: 1000 },
      { value: "calorie", label: "Calorie (cal)", factorToBase: 4.184 },
      { value: "kilocalorie", label: "Kilocalorie (kcal)", factorToBase: 4184 },
      { value: "wattHour", label: "Watt-Hour (Wh)", factorToBase: 3600 },
      { value: "kilowattHour", label: "Kilowatt-Hour (kWh)", factorToBase: 3_600_000 },
      { value: "btu", label: "BTU", factorToBase: 1055.05585262 },
    ],
  },
  {
    key: "power",
    label: "Power",
    description: "Energy transfer rate",
    baseUnit: "watt",
    kind: "standard",
    formulaHint: "Watt is the base unit.",
    examples: ["1 kW = 1000 W", "1 HP ≈ 745.6999 W"],
    units: [
      { value: "watt", label: "Watt (W)", factorToBase: 1 },
      { value: "kilowatt", label: "Kilowatt (kW)", factorToBase: 1000 },
      { value: "megawatt", label: "Megawatt (MW)", factorToBase: 1_000_000 },
      { value: "horsepower", label: "Horsepower (hp)", factorToBase: 745.6998715822702 },
    ],
  },
  {
    key: "digitalStorage",
    label: "Digital Storage",
    description: "Bits and bytes",
    baseUnit: "byte",
    kind: "standard",
    formulaHint: "Byte is the base unit.",
    examples: ["1 bit = 0.125 byte", "1 KiB = 1024 bytes"],
    units: [
      { value: "bit", label: "Bit", factorToBase: 0.125 },
      { value: "byte", label: "Byte", factorToBase: 1 },
      { value: "kilobyte", label: "Kilobyte (KB)", factorToBase: 1000 },
      { value: "kibibyte", label: "Kibibyte (KiB)", factorToBase: 1024 },
      { value: "megabyte", label: "Megabyte (MB)", factorToBase: 1_000_000 },
      { value: "mebibyte", label: "Mebibyte (MiB)", factorToBase: 1_048_576 },
      { value: "gigabyte", label: "Gigabyte (GB)", factorToBase: 1_000_000_000 },
      { value: "gibibyte", label: "Gibibyte (GiB)", factorToBase: 1_073_741_824 },
      { value: "terabyte", label: "Terabyte (TB)", factorToBase: 1_000_000_000_000 },
      { value: "tebibyte", label: "Tebibyte (TiB)", factorToBase: 1_099_511_627_776 },
    ],
  },
  {
    key: "dataTransfer",
    label: "Data Transfer",
    description: "Network transfer rates",
    baseUnit: "bps",
    kind: "standard",
    formulaHint: "Bits per second is the base unit.",
    examples: ["1 Mbps = 1,000,000 bps", "1 MB/s = 8,000,000 bps"],
    units: [
      { value: "bps", label: "bps", factorToBase: 1 },
      { value: "kbps", label: "kbps", factorToBase: 1000 },
      { value: "mbps", label: "Mbps", factorToBase: 1_000_000 },
      { value: "gbps", label: "Gbps", factorToBase: 1_000_000_000 },
      { value: "Bps", label: "B/s", factorToBase: 8 },
      { value: "KBps", label: "KB/s", factorToBase: 8000 },
      { value: "MBps", label: "MB/s", factorToBase: 8_000_000 },
    ],
  },
  {
    key: "angle",
    label: "Angle",
    description: "Degrees and radians",
    baseUnit: "degree",
    kind: "standard",
    formulaHint: "Degree is the base unit.",
    examples: ["1 rad = 57.2958°", "1 grad = 0.9°"],
    units: [
      { value: "degree", label: "Degree (°)", factorToBase: 1 },
      { value: "radian", label: "Radian (rad)", factorToBase: 180 / Math.PI },
      { value: "grad", label: "Grad (gon)", factorToBase: 0.9 },
      { value: "arcminute", label: "Arcminute (′)", factorToBase: 1 / 60 },
      { value: "arcsecond", label: "Arcsecond (″)", factorToBase: 1 / 3600 },
    ],
  },
  {
    key: "frequency",
    label: "Frequency",
    description: "Cycles per second",
    baseUnit: "hertz",
    kind: "standard",
    formulaHint: "Hertz is the base unit.",
    examples: ["1 kHz = 1000 Hz", "1 GHz = 1,000,000,000 Hz"],
    units: [
      { value: "hertz", label: "Hertz (Hz)", factorToBase: 1 },
      { value: "kilohertz", label: "Kilohertz (kHz)", factorToBase: 1000 },
      { value: "megahertz", label: "Megahertz (MHz)", factorToBase: 1_000_000 },
      { value: "gigahertz", label: "Gigahertz (GHz)", factorToBase: 1_000_000_000 },
    ],
  },
  {
    key: "fuelEconomy",
    label: "Fuel Economy",
    description: "Distance per fuel usage",
    baseUnit: "kilometerPerLiter",
    kind: "fuelEconomy",
    formulaHint: "We use kilometer per liter as the base unit.",
    examples: ["L/100km is inverse of km/L", "MPG depends on US or UK gallons"],
    units: [
      { value: "kilometerPerLiter", label: "Kilometer per Liter (km/L)" },
      { value: "literPer100km", label: "Liter per 100 km (L/100km)" },
      { value: "mpgUS", label: "Miles per Gallon (US)" },
      { value: "mpgUK", label: "Miles per Gallon (UK)" },
    ],
  },
  {
    key: "density",
    label: "Density",
    description: "Mass per unit volume",
    baseUnit: "kilogramPerCubicMeter",
    kind: "standard",
    formulaHint: "kg/m³ is the base unit.",
    examples: ["1 g/cm³ = 1000 kg/m³", "1 lb/ft³ ≈ 16.0185 kg/m³"],
    units: [
      { value: "kilogramPerCubicMeter", label: "kg/m³", factorToBase: 1 },
      { value: "gramPerCubicCentimeter", label: "g/cm³", factorToBase: 1000 },
      { value: "poundPerCubicFoot", label: "lb/ft³", factorToBase: 16.01846337396 },
    ],
  },
  {
    key: "force",
    label: "Force",
    description: "Push and pull measurements",
    baseUnit: "newton",
    kind: "standard",
    formulaHint: "Newton is the base unit.",
    examples: ["1 kN = 1000 N", "1 lbf ≈ 4.44822 N"],
    units: [
      { value: "newton", label: "Newton (N)", factorToBase: 1 },
      { value: "kilonewton", label: "Kilonewton (kN)", factorToBase: 1000 },
      { value: "dyne", label: "Dyne", factorToBase: 0.00001 },
      { value: "poundForce", label: "Pound-force (lbf)", factorToBase: 4.4482216152605 },
    ],
  },
  {
    key: "torque",
    label: "Torque",
    description: "Rotational force",
    baseUnit: "newtonMeter",
    kind: "standard",
    formulaHint: "Newton-meter is the base unit.",
    examples: ["1 lb·ft ≈ 1.35582 N·m", "1 lb·in ≈ 0.112985 N·m"],
    units: [
      { value: "newtonMeter", label: "Newton-meter (N·m)", factorToBase: 1 },
      { value: "poundFoot", label: "Pound-foot (lb·ft)", factorToBase: 1.3558179483314 },
      { value: "poundInch", label: "Pound-inch (lb·in)", factorToBase: 0.1129848290276167 },
    ],
  },
  {
    key: "current",
    label: "Electric Current",
    description: "Current flow",
    baseUnit: "ampere",
    kind: "standard",
    formulaHint: "Ampere is the base unit.",
    examples: ["1 mA = 0.001 A", "1 kA = 1000 A"],
    units: [
      { value: "ampere", label: "Ampere (A)", factorToBase: 1 },
      { value: "milliampere", label: "Milliampere (mA)", factorToBase: 0.001 },
      { value: "kiloampere", label: "Kiloampere (kA)", factorToBase: 1000 },
    ],
  },
  {
    key: "voltage",
    label: "Voltage",
    description: "Electrical potential",
    baseUnit: "volt",
    kind: "standard",
    formulaHint: "Volt is the base unit.",
    examples: ["1 mV = 0.001 V", "1 kV = 1000 V"],
    units: [
      { value: "volt", label: "Volt (V)", factorToBase: 1 },
      { value: "millivolt", label: "Millivolt (mV)", factorToBase: 0.001 },
      { value: "kilovolt", label: "Kilovolt (kV)", factorToBase: 1000 },
    ],
  },
  {
    key: "resistance",
    label: "Resistance",
    description: "Opposition to current",
    baseUnit: "ohm",
    kind: "standard",
    formulaHint: "Ohm is the base unit.",
    examples: ["1 kΩ = 1000 Ω", "1 MΩ = 1,000,000 Ω"],
    units: [
      { value: "ohm", label: "Ohm (Ω)", factorToBase: 1 },
      { value: "kiloohm", label: "Kiloohm (kΩ)", factorToBase: 1000 },
      { value: "megaohm", label: "Megaohm (MΩ)", factorToBase: 1_000_000 },
    ],
  },
  {
    key: "capacitance",
    label: "Capacitance",
    description: "Electric charge storage",
    baseUnit: "farad",
    kind: "standard",
    formulaHint: "Farad is the base unit.",
    examples: ["1 µF = 0.000001 F", "1 nF = 0.000000001 F"],
    units: [
      { value: "farad", label: "Farad (F)", factorToBase: 1 },
      { value: "microfarad", label: "Microfarad (µF)", factorToBase: 0.000001 },
      { value: "nanofarad", label: "Nanofarad (nF)", factorToBase: 0.000000001 },
      { value: "picofarad", label: "Picofarad (pF)", factorToBase: 0.000000000001 },
    ],
  },
]

const categoryMap = Object.fromEntries(categoryDefinitions.map((item) => [item.key, item]))

function formatValue(value: number): string {
  if (!Number.isFinite(value)) return "—"
  if (value === 0) return "0"
  const abs = Math.abs(value)
  if (abs >= 1e9 || abs < 1e-6) return value.toExponential(8).replace(/\.?0+e/, "e")
  const fixed = Number(value.toFixed(12))
  return fixed.toString()
}

function formatNice(value: number): string {
  if (!Number.isFinite(value)) return "—"
  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 12,
    useGrouping: true,
  }).format(value)
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function downloadText(filename: string, content: string, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function convertTemperature(value: number, fromUnit: string, toUnit: string) {
  let celsius = value
  if (fromUnit === "fahrenheit") celsius = ((value - 32) * 5) / 9
  if (fromUnit === "kelvin") celsius = value - 273.15

  if (toUnit === "celsius") return celsius
  if (toUnit === "fahrenheit") return (celsius * 9) / 5 + 32
  if (toUnit === "kelvin") return celsius + 273.15
  return value
}

function convertFuelEconomy(value: number, fromUnit: string, toUnit: string) {
  const kmPerLiterFromMpgUS = 0.425143707
  const kmPerLiterFromMpgUK = 0.3540061899

  let kmPerLiter = value
  if (fromUnit === "literPer100km") {
    if (value === 0) return Number.POSITIVE_INFINITY
    kmPerLiter = 100 / value
  } else if (fromUnit === "mpgUS") {
    kmPerLiter = value * kmPerLiterFromMpgUS
  } else if (fromUnit === "mpgUK") {
    kmPerLiter = value * kmPerLiterFromMpgUK
  }

  if (toUnit === "kilometerPerLiter") return kmPerLiter
  if (toUnit === "literPer100km") {
    if (kmPerLiter === 0) return Number.POSITIVE_INFINITY
    return 100 / kmPerLiter
  }
  if (toUnit === "mpgUS") return kmPerLiter / kmPerLiterFromMpgUS
  if (toUnit === "mpgUK") return kmPerLiter / kmPerLiterFromMpgUK
  return value
}

function getConvertedValue(category: ConversionCategory, fromUnit: string, toUnit: string, value: number) {
  if (category === "temperature") {
    return convertTemperature(value, fromUnit, toUnit)
  }

  if (category === "fuelEconomy") {
    return convertFuelEconomy(value, fromUnit, toUnit)
  }

  const definition = categoryMap[category]
  const from = definition.units.find((unit) => unit.value === fromUnit)
  const to = definition.units.find((unit) => unit.value === toUnit)

  if (!from?.factorToBase || !to?.factorToBase) return Number.NaN

  const base = value * from.factorToBase
  return base / to.factorToBase
}

function getFormulaText(category: ConversionCategory, fromUnit: string, toUnit: string) {
  if (category === "temperature") {
    if (fromUnit === toUnit) return "Same unit, no conversion needed."
    return `${fromUnit} → ${toUnit} uses temperature formulas through Celsius.`
  }

  if (category === "fuelEconomy") {
    return "Fuel economy uses km/L as the base unit. L/100km is inverse, so we convert through km/L."
  }

  const definition = categoryMap[category]
  const from = definition.units.find((unit) => unit.value === fromUnit)
  const to = definition.units.find((unit) => unit.value === toUnit)

  if (!from || !to || !from.factorToBase || !to.factorToBase) return "Conversion formula unavailable."

  return `Value × ${from.factorToBase} = base unit; base ÷ ${to.factorToBase} = result.`
}

// Custom shadcn/ui style Unit Select Component
function ShadcnUnitSelect({
  value,
  onChange,
  units,
}: {
  value: string
  onChange: (val: string) => void
  units: UnitDef[]
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredUnits = useMemo(() => {
    if (!search.trim()) return units
    const q = search.toLowerCase()
    return units.filter(
      (unit) =>
        unit.label.toLowerCase().includes(q) || unit.value.toLowerCase().includes(q)
    )
  }, [units, search])

  const selectedUnit = units.find((u) => u.value === value)

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700/60 dark:focus:border-blue-400"
      >
        <span className="truncate font-bold">{selectedUnit?.label || value}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1.5 max-h-64 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white/95 p-1.5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
          <div className="relative mb-1">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search unit..."
              className="w-full rounded-xl border-none bg-slate-100/70 py-1.5 pl-8 pr-3 text-xs outline-none focus:bg-slate-100 dark:bg-slate-800/80 dark:text-slate-200 dark:focus:bg-slate-800"
            />
          </div>

          <div className="max-h-48 overflow-auto space-y-0.5 pr-1">
            {filteredUnits.length === 0 ? (
              <div className="py-3 text-center text-xs text-slate-400">No unit found</div>
            ) : (
              filteredUnits.map((unit) => {
                const isSelected = value === unit.value
                return (
                  <button
                    key={unit.value}
                    type="button"
                    onClick={() => {
                      onChange(unit.value)
                      setIsOpen(false)
                      setSearch("")
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition ${
                      isSelected
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                        : "text-slate-700 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60"
                    }`}
                  >
                    <span className="font-bold">{unit.label}</span>
                    {isSelected && <Check className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function UnitConverter({ tool }: ToolHeroProps) {
  const [category, setCategory] = useState<ConversionCategory>("length")
  const [fromUnit, setFromUnit] = useState<string>("meter")
  const [toUnit, setToUnit] = useState<string>("kilometer")
  const [inputValue, setInputValue] = useState<string>("100")
  const [result, setResult] = useState<string>("")
  const [numericResult, setNumericResult] = useState<number | null>(null)
  const [isConverting, setIsConverting] = useState(false)
  const [isSwapping, setIsSwapping] = useState(false)
  const [search, setSearch] = useState("")
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [copied, setCopied] = useState(false)
  const [loadingVoice, setLoadingVoice] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const copyRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeCategory = categoryMap[category]

  const units = useMemo(() => {
    return activeCategory.units
  }, [activeCategory])

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return categoryDefinitions
    return categoryDefinitions.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.units.some((unit) => unit.label.toLowerCase().includes(q) || unit.value.toLowerCase().includes(q))
    )
  }, [search])

  const comparisonRows = useMemo(() => {
    const value = parseFloat(inputValue)
    if (!inputValue || !Number.isFinite(value)) return []
    return units
      .filter((unit) => unit.value !== fromUnit)
      .map((unit) => {
        const converted = getConvertedValue(category, fromUnit, unit.value, value)
        return {
          unit: unit.label,
          value: converted,
        }
      })
  }, [category, fromUnit, inputValue, units])

  const currentFavoriteKey = `${category}|${fromUnit}|${toUnit}`
  const isFavorite = useMemo(
    () => favorites.some((item) => `${item.category}|${item.fromUnit}|${item.toUnit}` === currentFavoriteKey),
    [currentFavoriteKey, favorites]
  )

  useEffect(() => {
    try {
      const rawHistory = localStorage.getItem(STORAGE_KEYS.history)
      if (rawHistory) setHistory(JSON.parse(rawHistory))
      const rawFavorites = localStorage.getItem(STORAGE_KEYS.favorites)
      if (rawFavorites) setFavorites(JSON.parse(rawFavorites))
    } catch {
      // ignore storage errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history.slice(0, 30)))
    } catch {
      // ignore storage errors
    }
  }, [history])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.favorites, JSON.stringify(favorites))
    } catch {
      // ignore storage errors
    }
  }, [favorites])

  const runConversion = useCallback(() => {
    const parsed = parseFloat(inputValue)
    if (!inputValue || !Number.isFinite(parsed)) {
      setResult("")
      setNumericResult(null)
      return
    }

    setIsConverting(true)

    window.setTimeout(() => {
      try {
        const converted = getConvertedValue(category, fromUnit, toUnit, parsed)
        if (!Number.isFinite(converted)) {
          setResult("Error")
          setNumericResult(null)
        } else {
          setNumericResult(converted)
          setResult(formatValue(converted))
        }
      } catch {
        setResult("Error")
        setNumericResult(null)
      } finally {
        setIsConverting(false)
      }
    }, 80)
  }, [category, fromUnit, inputValue, toUnit])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (!inputValue.trim()) {
      setResult("")
      setNumericResult(null)
      return
    }

    debounceRef.current = setTimeout(() => {
      runConversion()
    }, 250)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [inputValue, fromUnit, toUnit, category, runConversion])

  function setDefaultUnitsForCategory(nextCategory: ConversionCategory) {
    const nextUnits = categoryMap[nextCategory].units
    const nextFrom = nextUnits[0]?.value || ""
    const nextTo = nextUnits[1]?.value || nextUnits[0]?.value || ""
    setCategory(nextCategory)
    setFromUnit(nextFrom)
    setToUnit(nextTo)
    setInputValue("100")
    setResult("")
    setNumericResult(null)
  }

  function swapUnits() {
    setIsSwapping(true)
    setFromUnit(toUnit)
    setToUnit(fromUnit)
    setResult("")
    setNumericResult(null)
    window.setTimeout(() => setIsSwapping(false), 220)
  }

  function clearAll() {
    setInputValue("")
    setResult("")
    setNumericResult(null)
  }

  function saveToHistory() {
    const parsed = parseFloat(inputValue)
    if (!inputValue || !Number.isFinite(parsed) || !Number.isFinite(numericResult ?? Number.NaN)) return

    const item: HistoryItem = {
      id: createId(),
      category,
      fromUnit,
      toUnit,
      inputValue: inputValue.trim(),
      outputValue: result,
      timestamp: Date.now(),
    }

    setHistory((prev) => [item, ...prev.filter((existing) => `${existing.category}|${existing.fromUnit}|${existing.toUnit}|${existing.inputValue}` !== `${item.category}|${item.fromUnit}|${item.toUnit}|${item.inputValue}`)].slice(0, 30))
  }

  function toggleFavorite() {
    const exists = favorites.some((item) => `${item.category}|${item.fromUnit}|${item.toUnit}` === currentFavoriteKey)
    if (exists) {
      setFavorites((prev) => prev.filter((item) => `${item.category}|${item.fromUnit}|${item.toUnit}` !== currentFavoriteKey))
      return
    }
    setFavorites((prev) => [
      { id: createId(), category, fromUnit, toUnit },
      ...prev,
    ].slice(0, 20))
  }

  async function handleCopy() {
    if (!result || result === "Error") return
    const text = `${inputValue} ${fromUnit} = ${result} ${toUnit}`
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      if (copyRef.current) clearTimeout(copyRef.current)
      copyRef.current = setTimeout(() => setCopied(false), 1600)
      saveToHistory()
    } catch {
      // ignore
    }
  }

  async function handleShare() {
    if (!result || result === "Error") return
    const text = `${inputValue} ${fromUnit} = ${result} ${toUnit} (${activeCategory.label})`
    try {
      if (navigator.share) {
        await navigator.share({ title: `${activeCategory.label} Conversion`, text })
      } else {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        if (copyRef.current) clearTimeout(copyRef.current)
        copyRef.current = setTimeout(() => setCopied(false), 1600)
      }
    } catch {
      // ignore
    }
  }

  function downloadResult(type: "txt" | "csv") {
    if (!result || result === "Error") return
    const title = `${activeCategory.label} Conversion`
    if (type === "txt") {
      const content = [
        title,
        "",
        `Category: ${activeCategory.label}`,
        `Input: ${inputValue} ${fromUnit}`,
        `Output: ${result} ${toUnit}`,
        `Formula: ${getFormulaText(category, fromUnit, toUnit)}`,
        `Time: ${new Date().toLocaleString()}`,
      ].join("\n")
      downloadText(`unit-conversion-${Date.now()}.txt`, content)
      return
    }

    const csv = [
      ["category", "input", "from_unit", "output", "to_unit", "formula", "timestamp"].join(","),
      [
        activeCategory.label,
        inputValue,
        fromUnit,
        result,
        toUnit,
        `"${getFormulaText(category, fromUnit, toUnit).replace(/"/g, '""')}"`,
        new Date().toISOString(),
      ].join(","),
    ].join("\n")

    downloadText(`unit-conversion-${Date.now()}.csv`, csv, "text/csv;charset=utf-8")
  }

  async function startVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) return

    setLoadingVoice(true)
    const recognition = new SpeechRecognition()
    recognition.lang = "en-US"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || ""
      const match = transcript.match(/[-+]?\d*\.?\d+/)
      if (match?.[0]) setInputValue(match[0])
      setLoadingVoice(false)
    }

    recognition.onerror = () => {
      setLoadingVoice(false)
    }

    recognition.onend = () => {
      setLoadingVoice(false)
    }

    recognition.start()
  }

  return (
    <div className="flex justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:py-12 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
      <div className="w-full max-w-6xl space-y-6">
        <ToolHero tool={tool} />

        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-xl shadow-slate-200/40 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/90 dark:shadow-black/40">
          
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 px-6 py-4 dark:border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600/10 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  Universal Unit Studio
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Instant multi-unit conversion toolkit</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                disabled={!result || result === "Error"}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Copy className="h-3.5 w-3.5" />
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                onClick={handleShare}
                disabled={!result || result === "Error"}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Share2 className="h-3.5 w-3.5" />
                Share
              </button>
              <button
                onClick={() => downloadResult("txt")}
                disabled={!result || result === "Error"}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                <Download className="h-3.5 w-3.5" />
                TXT
              </button>
            </div>
          </div>

          {/* Main Content Workspace */}
          <div className="p-6 space-y-6">

            {/* Quick Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/40">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search category or unit..."
                  className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs font-semibold outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleFavorite}
                  className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    isFavorite
                      ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  }`}
                >
                  <Star className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Saved" : "Favorite"}
                </button>

                <button
                  onClick={startVoiceInput}
                  disabled={loadingVoice}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  {loadingVoice ? "Listening..." : "Voice"}
                </button>

                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear
                </button>
              </div>
            </div>

            {/* Category Pills Bar */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</span>
              <div className="flex flex-wrap gap-1.5">
                {filteredCategories.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setDefaultUnitsForCategory(item.key)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                      category === item.key
                        ? "border-blue-600 bg-blue-600 text-white shadow-xs"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion Panel Grid */}
            <div className="grid gap-6 md:grid-cols-12 md:items-end">
              
              {/* From Unit Input & Dropdown */}
              <div className="space-y-2 md:col-span-5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">From</label>
                <div className="space-y-2">
                  <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-base font-bold text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                  <ShadcnUnitSelect
                    value={fromUnit}
                    onChange={setFromUnit}
                    units={units}
                  />
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center md:col-span-2 pb-1">
                <button
                  onClick={swapUnits}
                  title="Swap units"
                  className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 transition hover:bg-blue-600 hover:text-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-600 ${
                    isSwapping ? "rotate-180" : ""
                  }`}
                >
                  <ArrowRightLeft className="h-4 w-4" />
                </button>
              </div>

              {/* To Unit Input & Dropdown */}
              <div className="space-y-2 md:col-span-5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">To</label>
                <div className="space-y-2">
                  <input
                    value={result}
                    readOnly
                    placeholder="Result"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-base font-bold text-slate-900 outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-100"
                  />
                  <ShadcnUnitSelect
                    value={toUnit}
                    onChange={setToUnit}
                    units={units}
                  />
                </div>
              </div>
            </div>

            {/* Result Display & Formula Card */}
            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-slate-50/70 p-6 dark:border-blue-900/30 dark:bg-slate-900/60">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400">Result Output</span>
                  <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    {result && result !== "Error" ? `${result} ${toUnit}` : "—"}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Formula: {getFormulaText(category, fromUnit, toUnit)}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={runConversion}
                    disabled={!inputValue || !units.length}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-blue-500/10 hover:bg-blue-700 disabled:opacity-50"
                  >
                    <Wand2 className="h-3.5 w-3.5" /> Convert Now
                  </button>
                  <button
                    onClick={saveToHistory}
                    disabled={!result || result === "Error"}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <Clock3 className="h-3.5 w-3.5" /> Save
                  </button>
                </div>
              </div>
            </div>

            {/* Comparison Grid & History Section */}
            <div className="grid gap-6 lg:grid-cols-12">
              
              {/* Category Comparison Grid */}
              <div className="space-y-3 lg:col-span-8">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <BookOpen className="h-3.5 w-3.5 text-blue-500" /> {activeCategory.label} Quick Conversion Matrix
                  </span>
                </div>

                <div className="max-h-56 space-y-1.5 overflow-auto pr-1">
                  {comparisonRows.length ? (
                    comparisonRows.map((row) => (
                      <div
                        key={row.unit}
                        className="flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/60 px-3.5 py-2 text-xs font-medium dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <span className="text-slate-600 dark:text-slate-400">{row.unit}</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{formatNice(row.value)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Enter a value to see conversions across all units in this category.
                    </div>
                  )}
                </div>
              </div>

              {/* History & Favorites Side Log */}
              <div className="space-y-3 lg:col-span-4">
                <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <History className="h-3.5 w-3.5 text-blue-500" /> Saved Favorites
                </span>

                <div className="space-y-1.5 max-h-56 overflow-auto pr-1">
                  {favorites.length ? (
                    favorites.slice(0, 5).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          setDefaultUnitsForCategory(item.category)
                          setFromUnit(item.fromUnit)
                          setToUnit(item.toUnit)
                        }}
                        className="w-full flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/60 p-2.5 text-left text-xs transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-800/40"
                      >
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {categoryMap[item.category]?.label || item.category}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {item.fromUnit} → {item.toUnit}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      No saved favorites yet.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  )
}