import numbro from "numbro";

export function parseNumber(text: string) {
  numbro.registerLanguage({
    languageTag: "id-ID",
    // languageName: "Indonesia",
    delimiters: {
      thousands: " ",
      decimal: ",",
    },
    abbreviations: {
      thousand: "rb",
      million: "m",
      billion: "b",
      trillion: "t",
    },
    ordinal: (number) => {
      return number === 1 ? "er" : "ème";
    },
    currency: {
      symbol: "€",
      position: "postfix",
      code: "EUR",
    },
    currencyFormat: {
      thousandSeparated: true,
      totalLength: 4,
      spaceSeparated: true,
      average: true,
    },
    formats: {
      fourDigits: {
        totalLength: 4,
        spaceSeparated: true,
        average: true,
      },
      fullWithTwoDecimals: {
        output: "currency",
        mantissa: 2,
        spaceSeparated: true,
        thousandSeparated: true,
      },
      fullWithTwoDecimalsNoCurrency: {
        mantissa: 2,
        thousandSeparated: true,
      },
      fullWithNoDecimals: {
        output: "currency",
        spaceSeparated: true,
        thousandSeparated: true,
        mantissa: 0,
      },
    },
  });

  numbro.setLanguage("id-ID");

  // 1. Ubah teks menjadi huruf kecil dan hilangkan spasi
  // const cleanText = text.toLowerCase().replace(/\s+/g, "");

  text = text.toLowerCase();

  return numbro.unformat(text);

  // 3. Parsing menggunakan numbro
  // const result = numbro.unformat(cleanText);
  //
  // return isNaN(result) ? 0 : result;
}
