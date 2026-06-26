import { Tool } from "../types/tool"
import { CATEGORIES } from "./featuredCategories"
import { age_calculator } from "./tools/age-calculator"
import { base64_converter } from "./tools/base64-converter"
import { case_converter } from "./tools/case-converter"
import { color_picker } from "./tools/color-picker"
import { csv_to_json } from "./tools/csv-to-json"
import { currency_converter } from "./tools/currency-converter"
import { data_uri_generator } from "./tools/data-uri-generator"
import { favicon_generator } from "./tools/favicon-generator"
import { file_converter } from "./tools/file-converter"
import { file_encryptor } from "./tools/file-encryptor"
import { file_renamer } from "./tools/file-rename-tool"
import { hash_generator } from "./tools/hash-generator"
import { image_compressor } from "./tools/image-compressor"
import { image_resizer } from "./tools/image-resizer"
import { image_to_svg } from "./tools/image-to-svg"
import { json_formatter } from "./tools/json-formatter"
import { jwt_debugger } from "./tools/jwt-debugger"
import { lorem_ipsum_generator } from "./tools/lorem-ipsum-generator"
import { markdown_previewer } from "./tools/markdown-previewer"
import { mp4_to_gif } from "./tools/mp4-to-gif"
import { nutrition_master } from "./tools/nutrition-master"
import { password_generator } from "./tools/password-generator"
import { pdf_image_extractor } from "./tools/pdf-image-extractor"
import { percentage_calculator } from "./tools/percentage-calculator"
import { profile_pic_optimizer } from "./tools/profile-pic-optimizer"
import { qr_code_tool } from "./tools/qr-code-tool"
import { regex_generator } from "./tools/regex-generator"
import { background_remover } from "./tools/remove-background"
import { ssl_checker } from "./tools/ssl-checker"
import { svg_converter } from "./tools/svg-converter"
import { text_diff_checker } from "./tools/text-diff-checker"
import { text_extractor } from "./tools/text-extractor"
import { time_calculator } from "./tools/time-calculator"
import { unit_converter } from "./tools/unit-converter"
import { url_encoder } from "./tools/url-encoder"
import { video_thumbnail_generator } from "./tools/video-thumbnail-generator"
import { website_cost_calculator } from "./tools/website-cost-calculator"
import { word_counter } from "./tools/word-counter"
import { xml_formatter } from "./tools/xml-formatter"

export const ALL_TOOLS: Tool[] = [
    age_calculator,
    base64_converter,
    case_converter,
    color_picker,
    csv_to_json,
    currency_converter,
    data_uri_generator,
    favicon_generator,
    file_converter,
    file_encryptor,
    file_renamer,
    hash_generator,
    image_compressor,
    image_resizer,
    image_to_svg,
    json_formatter,
    jwt_debugger,
    lorem_ipsum_generator,
    markdown_previewer,
    mp4_to_gif,
    nutrition_master,
    password_generator,
    pdf_image_extractor,
    percentage_calculator,
    profile_pic_optimizer,
    qr_code_tool,
    regex_generator,
    background_remover,
    ssl_checker,
    svg_converter,
    text_diff_checker,
    text_extractor,
    time_calculator,
    unit_converter,
    url_encoder,
    video_thumbnail_generator,
    website_cost_calculator,
    word_counter,
    xml_formatter,
]

export const getAllTools = (): Tool[] => ALL_TOOLS

export const getToolBySlug = (slug: string) => {
    return ALL_TOOLS.find((tool) => tool.slug === slug)
}

export const getToolsByTag = (tag: string) => {
    return ALL_TOOLS.filter((tool) => tool.tags.includes(tag))
}

export const getFeaturedCategoryBySlug = (slug: string) => {
    return CATEGORIES.find((category) => category.tag === slug)
}
