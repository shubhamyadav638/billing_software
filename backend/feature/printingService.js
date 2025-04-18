import {
  ThermalPrinter,
  PrinterTypes,
  CharacterSet,
  BreakLine,
} from "node-thermal-printer";

const printer = new ThermalPrinter({
  type: PrinterTypes.STAR, // Printer type: 'star' or 'epson'
  interface: "tcp://192.168.29.222", // Printer interface
  characterSet: CharacterSet.PC852_LATIN2, // Printer character set
  removeSpecialCharacters: false, // Removes special characters - default: false
  lineCharacter: "=", // Set character for lines - default: "-"
  breakLine: BreakLine.WORD, // Break line after WORD or CHARACTERS. Disabled with NONE - default: WORD
  options: {
    // Additional options
    timeout: 5000,
  },
});

export async function printText(text) {
  try {
    printer.clear();
    printer.println(text);
    const isConnected = await printer.isPrinterConnected();
    if (!isConnected) throw new Error("Printer not connected");
    await printer.execute();
    return { success: true, message: "Print successful" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
