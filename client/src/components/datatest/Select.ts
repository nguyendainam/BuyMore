const OptionsPr = [
  { value: "Size", label: "Size" },
  { value: "screenSize", label: "Screen Size Options" },
  { value: "memory", label: "Memory Options" },
  { value: "scanFrequency", label: "Scan Frequency" },
  { value: "screenType", label: "ScreenType" },
];



const OptionClient = [
  { value: "Color", label: "Color", labelVI: "Màu sắc" },
  { value: "Size", label: "Size", labelVI: "Size" },
  { value: "screenSize", label: "Screen Size Options", labelVI: "Kích thướt màn hình" },
  { value: "memory", label: "Memory Options", labelVI: "Bộ Nhớ" },
  { value: "scanFrequency", label: "Scan Frequency", labelVI: "Tần Số Quét" },
  { value: "screenType", label: "ScreenType", labelVI: "Loại Màn Hình" },
];



const Size = [
  { value: "1", label: "Small" },
  { value: "2", label: "Large" },
  { value: "3", label: "Medium" },
  { value: "4", label: "Extra Large" },
  { value: "5", label: "Compact" },
  { value: "6", label: "Oversized" },
  { value: "7", label: "Regular" },
  { value: "8", label: "Big" },
];

const Color = [
  { value: "R", label: "Red" },
  { value: "B", label: "Blue" },
  { value: "G", label: "Green" },
  { value: "Y", label: "Yellow" },
  { value: "P", label: "Pink" },
  { value: "S", label: "Silver" },
  { value: "W", label: "White" },
  { value: "Gy", label: "Gray" },
  { value: "Bl", label: "Black" },
];

const screenSize = [
  { value: "15", label: "15' " },
  { value: "17", label: "17' " },
  { value: "21", label: "21' " },
  { value: "24", label: "24' " },
  { value: "27", label: "27' " },
  { value: "32", label: "32' " },
  { value: "34", label: "34' " },
  { value: "38", label: "38' " },
  { value: "42", label: "42' " },
  { value: "49", label: "49' " },
  // Thêm các kích thước màn hình khác tùy thuộc vào nhu cầu và xu hướng thị trường
];


export const memory = [
  { value: "4GB", label: "4GB" },
  { value: "8GB", label: "8GB" },
  { value: "16GB", label: "16GB" },
  { value: "32GB", label: "32GB" },
  // Thêm dung lượng bộ nhớ khác tùy thuộc vào nhu cầu của bạn
];

const scanFrequency = [
  { value: "60", label: "60 Hz" },
  { value: "75", label: "75 Hz" },
  { value: "120", label: "120 Hz" },
  { value: "144", label: "144 Hz" },
  { value: "240", label: "240 Hz" },
  // Thêm các tần số quét khác tùy thuộc vào nhu cầu của bạn
];

// Mảng cho loại màn hình
const screenType = [
  { value: "LCD", label: "LCD" },
  { value: "LED", label: "LED" },
  { value: "OLED", label: "OLED" },
  { value: "IPS", label: "IPS" },
  { value: "TN", label: "TN" },
  // Thêm các loại màn hình khác tùy thuộc vào nhu cầu của bạn
];


export default {
  OptionsPr,
  Color,
  Size,
  screenSize,
  scanFrequency,
  screenType,
  memory,
  OptionClient
}