import {
  FaQrcode,
  FaFileCode,
  FaExchangeAlt,
  FaPalette,
  FaImage,
  FaFile,
  FaCalculator,
  FaGlobe,
  FaTextHeight,
  FaBeer,
  FaHeartbeat,
  FaFileCsv,
  FaCompress,
} from "react-icons/fa";
import {
  MdFormatColorText,
  MdOutlineImage,
  MdOutlineCurrencyExchange,
  MdAutoFixHigh,
  MdOutlineDriveFileRenameOutline,
} from "react-icons/md";
import { BiCodeAlt, BiText } from "react-icons/bi";
import { AiOutlineFileText } from "react-icons/ai";
import {
  TbBinaryTree,
  TbFavicon,
  TbVectorBezier,
  TbVectorTriangle,
} from "react-icons/tb";
import { BsFiletypeSvg, BsRegex } from "react-icons/bs";
import { VscFilePdf } from "react-icons/vsc";

export const toolsByCategory = {
  image: [
    {
      name: "Image Resizer",
      slug: "image-resizer",
      icon: MdOutlineImage,
      component: () => import("@/components/tools/image-resizer"),
      seo: {
        title: "Image Resizer",
        description: "Use the Image Resizer tool on EaseMyTools.",
      },
    },
    {
      name: "Image Compressor",
      slug: "image-compressor",
      icon: FaCompress,
      component: () => import("@/components/tools/image-compressor"),
      seo: {
        title: "Image Compressor | Compress Images to Exact Size",
        description:
          "Compress JPEG, PNG, WebP, and AVIF images to exact file sizes while preserving quality. Perfect for web optimization.",
        keywords:
          "image compressor, compress image, reduce image size, image optimizer, webp converter",
      },
    },
    {
      name: "Color Picker",
      slug: "color-picker",
      icon: FaPalette,
      component: () => import("@/components/tools/color-picker"),
      seo: {
        title: "Color Picker",
        description: "Use the Color Picker tool on EaseMyTools.",
      },
    },
    {
      name: "SvgConverter",
      slug: "svg-converter",
      icon: BsFiletypeSvg,
      component: () => import("@/components/tools/svg-converter"),
      seo: {
        title: "Svg Converter",
        description: "Use the SVG Converter tool on EaseMyTools.",
      },
    },
    {
      name: "ImageToSvg",
      slug: "image-to-svg",
      icon: TbVectorTriangle,
      component: () => import("@/components/tools/image-to-svg"),
      seo: {
        title: "Image to SVG",
        description: "Convert raster images into SVG format instantly.",
      },
    },
    {
      name: "RemoveBackground",
      slug: "remove-background",
      icon: MdAutoFixHigh,
      component: () => import("@/components/tools/remove-background"),
      seo: {
        title: "Remove Background",
        description: "Use AI to remove image backgrounds in seconds.",
      },
    },
    {
      name: "Mp4ToGif",
      slug: "mp4-to-gif",
      icon: FaBeer,
      component: () => import("@/components/tools/mp4-to-gif"),
      seo: {
        title: "MP4 to GIF",
        description: "Convert MP4 videos to optimized GIFs online.",
      },
    },
  ],
  converters: [
    {
      name: "Unit Converter",
      slug: "unit-converter",
      icon: FaExchangeAlt,
      component: () => import("@/components/tools/unit-converter"),
      seo: {
        title: "Unit Converter",
        description: "Convert units quickly and accurately.",
      },
    },
    {
      name: "Case Converter",
      slug: "case-converter",
      icon: MdFormatColorText,
      component: () => import("@/components/tools/case-converter"),
      seo: {
        title: "Case Converter",
        description: "Convert text casing instantly.",
      },
    },
    {
      name: "Currency Converter",
      slug: "currency-converter",
      icon: MdOutlineCurrencyExchange,
      component: () => import("@/components/tools/currency-converter"),
      seo: {
        title: "Currency Converter",
        description: "Convert currencies with up-to-date exchange rates.",
      },
    },
    {
      name: "Base64 Converter",
      slug: "base64-converter",
      icon: TbBinaryTree,
      component: () => import("@/components/tools/base64-converter"),
      seo: {
        title: "Base64 Converter",
        description: "Encode and decode Base64 data online.",
      },
    },
  ],
  text: [
    {
      name: "Word Counter",
      slug: "word-counter",
      icon: AiOutlineFileText,
      component: () => import("@/components/tools/word-counter"),
      seo: {
        title: "Word Counter",
        description: "Count words and characters in real time.",
      },
    },
    {
      name: "JSON Formatter",
      slug: "json-formatter",
      icon: FaFileCode,
      component: () => import("@/components/tools/json-formatter"),
      seo: {
        title: "JSON Formatter",
        description: "Format and validate JSON instantly.",
      },
    },
    {
      name: "Markdown Previewer",
      slug: "markdown-previewer",
      icon: BiCodeAlt,
      component: () => import("@/components/tools/markdown-previewer"),
      seo: {
        title: "Markdown Previewer",
        description: "Preview rendered markdown as you type.",
      },
    },
    {
      name: "Text Diff Checker",
      slug: "text-diff-checker",
      icon: BiText,
      component: () => import("@/components/tools/text-diff-checker"),
      seo: {
        title: "Text Diff Checker",
        description: "Compare text and highlight differences.",
      },
    },
    {
      name: "PDFImageExtractor",
      slug: "pdfImage-extractor",
      icon: VscFilePdf,
      component: () => import("@/components/tools/pdf-image-extractor"),
      seo: {
        title: "PDF Image Extractor",
        description: "Extract embedded images from PDF files.",
      },
    },
  ],
  calculators: [
    {
      name: "Percentage Calculator",
      slug: "percentage-calculator",
      icon: FaCalculator,
      component: () => import("@/components/tools/percentage-calculator"),
      seo: {
        title: "Percentage Calculator",
        description: "Calculate percentages quickly and accurately.",
      },
    },
    {
      name: "Age Calculator",
      slug: "age-calculator",
      icon: FaCalculator,
      component: () => import("@/components/tools/age-calculator"),
      seo: {
        title: "Free Age Calculator Online (Instant & Accurate)",
        description: "Calculate your exact age instantly.",
      },
    },
    {
      name: "Time Calculator",
      slug: "time-calculator",
      icon: FaCalculator,
      component: () => import("@/components/tools/time-calculator"),
      seo: {
        title: "Time Calculator",
        description: "Add, subtract, and convert time values.",
      },
    },
  ],
  file: [
    {
      name: "CSV to JSON",
      slug: "csv-to-json",
      icon: FaFile,
      component: () => import("@/components/tools/csv-to-json"),
      seo: {
        title: "CSV to JSON",
        description: "Convert CSV files into JSON format instantly.",
      },
    },
    {
      name: "XML Formatter",
      slug: "xml-formatter",
      icon: FaFileCode,
      component: () => import("@/components/tools/xml-formatter"),
      seo: {
        title: "XML Formatter",
        description: "Format and beautify XML content online.",
      },
    },
    {
      name: "File Rename Tool",
      slug: "file-rename-tool",
      icon: MdOutlineDriveFileRenameOutline,
      component: () => import("@/components/tools/file-rename-tool"),
      seo: {
        title: "File Rename Tool",
        description: "Batch rename files with flexible patterns.",
      },
    },
    {
      name: "File Converter",
      slug: "file-converter",
      icon: FaFileCsv,
      component: () => import("@/components/tools/file-converter"),
      seo: {
        title: "File Converter",
        description: "Convert files between supported formats.",
      },
    },
    {
      name: "Regex Generator",
      slug: "regex-generator",
      icon: BsRegex,
      component: () => import("@/components/tools/regex-generator"),
      seo: {
        title: "Regex Generator",
        description: "Generate and test regular expressions quickly.",
      },
    },
  ],
  web: [
    {
      name: "URL Encoder",
      slug: "url-encoder",
      icon: FaGlobe,
      component: () => import("@/components/tools/url-encoder"),
      seo: {
        title: "URL Encoder",
        description: "Encode and decode URL components.",
      },
    },
    {
      name: "Text Extractor",
      slug: "text-extractor",
      icon: FaTextHeight,
      component: () => import("@/components/tools/text-extractor"),
      seo: {
        title: "Text Extractor",
        description: "Extract text from supported file formats.",
      },
    },
    {
      name: "SSL Checker",
      slug: "ssl-checker",
      icon: FaTextHeight,
      component: () => import("@/components/tools/ssl-checker"),
      seo: {
        title: "SSL Checker",
        description: "Check SSL certificate details for any domain.",
      },
    },
    {
      name: "JWT Debugger",
      slug: "jwt-debugger",
      icon: FaTextHeight,
      component: () => import("@/components/tools/jwt-debugger"),
      seo: {
        title: "JWT Debugger",
        description: "Decode and inspect JWT tokens safely.",
      },
    },
    {
      name: "FaviconGenerator",
      slug: "favicon-generator",
      icon: TbFavicon,
      component: () => import("@/components/tools/favicon-generator"),
      seo: {
        title: "Favicon Generator",
        description: "Create and export favicons for your site.",
      },
    },
    {
      name: "WebsiteCostCalculator",
      slug: "website-cost-calculator",
      icon: TbFavicon,
      component: () => import("@/components/tools/website-cost-calculator"),
      seo: {
        title: "Website Cost Calculator",
        description: "Estimate website development costs.",
      },
    },
  ],
  generators: [
    {
      name: "Lorem Ipsum Generator",
      slug: "lorem-ipsum-generator",
      icon: FaTextHeight,
      component: () => import("@/components/tools/lorem-ipsum-generator"),
      seo: {
        title: "Lorem Ipsum Generator",
        description: "Generate placeholder lorem ipsum text quickly.",
      },
    },
    {
      name: "QR Code Tool",
      slug: "qr-code-tool",
      icon: FaQrcode,
      component: () => import("@/components/tools/qr-code-tool"),
      seo: {
        title: "QR Code Tool",
        description: "Generate downloadable QR codes online.",
      },
    },
    {
      name: "Hash Generator",
      slug: "hash-generator",
      icon: TbVectorBezier,
      component: () => import("@/components/tools/hash-generator"),
      seo: {
        title: "Hash Generator",
        description: "Generate secure hashes for text input.",
      },
    },
    {
      name: "Password Generator",
      slug: "password-generator",
      icon: TbVectorBezier,
      component: () => import("@/components/tools/password-generator"),
      seo: {
        title: "Password Generator",
        description: "Create strong, customizable passwords instantly.",
      },
    },
    {
      name: "Data URI Generator",
      slug: "data-uri-generator",
      icon: TbVectorBezier,
      component: () => import("@/components/tools/data-uri-generator"),
      seo: {
        title: "Data URI Generator",
        description: "Convert files into data URI strings.",
      },
    },
  ],
  health: [
    {
      name: "Nutrition Master",
      slug: "nutrition-master",
      icon: FaTextHeight,
      component: () => import("@/components/tools/nutrition-master"),
      seo: {
        title: "Nutrition Master",
        description: "Plan and track nutrition with smart insights.",
      },
    },
  ],
};

export const categoryTitles = {
  image: "Image Tools",
  converters: "Converters",
  text: "Text Tools",
  calculators: "Calculators",
  file: "File Tools",
  web: "Web Tools",
  generators: "Generators",
  health: "Health Tools",
};

export const getAllTools = () => {
  return Object.values(toolsByCategory).flat();
};

export const getToolBySlug = (slug) => {
  return Object.values(toolsByCategory)
    .flat()
    .find((tool) => tool.slug === slug);
};

export const getToolCategories = () => {
  return [
    {
      id: "image",
      title: "Image Tools",
      description: "Resize, convert and edit images",
      color: "#F97316",
      count: `${toolsByCategory.image.length} tools`,
      icon: FaImage,
      link: "/tools/image",
    },
    {
      id: "converters",
      title: "Converters",
      description: "Various format converters",
      color: "#8B5CF6",
      count: `${toolsByCategory.converters.length} tools`,
      icon: FaExchangeAlt,
      link: "/tools/converters",
    },
    {
      id: "text",
      title: "Text Tools",
      description: "Text formatting and analysis",
      color: "#06B6D4",
      count: `${toolsByCategory.text.length} tools`,
      icon: BiText,
      link: "/tools/text",
    },
    {
      id: "calculators",
      title: "Calculators",
      description: "Various calculation tools",
      color: "#10B981",
      count: `${toolsByCategory.calculators.length} tools`,
      icon: FaCalculator,
      link: "/tools/calculators",
    },
    {
      id: "file",
      title: "File Tools",
      description: "File conversion and management",
      color: "#0D9488",
      count: `${toolsByCategory.file.length} tools`,
      icon: FaFile,
      link: "/tools/file",
    },
    {
      id: "web",
      title: "Web Tools",
      description: "Web development utilities",
      color: "#EC4899",
      count: `${toolsByCategory.web.length} tools`,
      icon: FaGlobe,
      link: "/tools/web",
    },
    {
      id: "generators",
      title: "Generators",
      description: "Code and content generators",
      color: "#F59E0B",
      count: `${toolsByCategory.generators.length} tools`,
      icon: FaQrcode,
      link: "/tools/generators",
    },
    {
      id: "health",
      title: "Health Tools",
      description: "Health and fitness utilities",
      color: "#F43F5E",
      count: `${toolsByCategory.health.length} tools`,
      icon: FaHeartbeat,
      link: "/tools/health",
    },
  ];
};
