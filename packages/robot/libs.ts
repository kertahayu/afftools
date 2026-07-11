import enFacebook from "@messages/en/facebook.json";
import idFacebook from "@messages/id/facebook.json";
import numbro from "numbro";

export function parseNumber(text: string) {
  if (!text) return 0;

  // 1. Ubah teks menjadi huruf kecil dan hilangkan spasi
  // const cleanText = text.toLowerCase().replace(/\s+/g, "");

  text = text.toLowerCase();
  // hanya ambil string (1,2 rb to rb)
  // .replace(/[\d.,\s]/g, "");

  for (const [key, suffix] of Object.entries(idFacebook.number)) {
    if (text.includes(suffix)) {
      const targetSuffix = enFacebook.number[key];

      text = text.replace(suffix, targetSuffix);
    }
  }

  console.log(numbro.unformat(text));

  // 3. Parsing menggunakan numbro
  // const result = numbro.unformat(cleanText);
  //
  // return isNaN(result) ? 0 : result;
}
