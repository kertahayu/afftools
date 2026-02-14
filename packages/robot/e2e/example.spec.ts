import { FacebookProfile } from "@pages/facebook/profile";
import { test } from "@playwright/test";

const cookie =
  "datr=EihtaS83hOAGK-Da7SnzvT5I;sb=EihtaX4G-UnrTE06JFtXges2;ps_l=1;ps_n=1;c_user=100000333888303;wd=1366x615;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1770809101728%2C%22v%22%3A1%7D;fr=1YMcs2PIDyYGD43Wm.AWfBJRfNVBJS9uz63vyVr6ZokzosdcBtDOQfAtkm5ikSooJfs2o.BpjGcN..AAA.0.0.BpjGcN.AWeNCgQaDG8aHCE4SVhwsCvTpvY;xs=9%3A1JEEe1NqBcwpeQ%3A2%3A1768761522%3A-1%3A-1%3A%3AAcyTmVoTfwv9Nx1vjpNpfjTYFbim9Po7RHoF1S_46uw";

const isValid = (u: string) => {
  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
};

test.describe("Crawl profile posts", () => {
  test("Persiapan Halaman", async ({ page }) => {
    const facebook = new FacebookProfile(page, cookie);
    const quantity = 20;

    await test.step("Buka halaman dengan cookie (login)", async () => {
      await facebook.open("john.sperling.39");
    });

    await test.step("Menghapus element yang tidak perlu", async () => {
      /*
       * WARN: masalah remove sepertinya penyebab erorr,
       * selalu blink scroll ke atas (hydration effects)
       */
      // await facebook.removeBanner();
      // await facebook.removeAside();
    });

    /**
     * TODO: perbaiki getPostList hanya untuk mengembalikan list postingan
     * berikan method lanjutaan untuk mendapatkan hanya link
     */
    const links = await test.step("Ekstraksi link posts", async () => {
      return Array.from(await facebook.getPostList(quantity));
    });

    await test.step("Validasi hasil ekstraksi", () => {
      test
        .expect(links, "Jumlah link post tidak sesuai")
        .toHaveLength(quantity);

      for (const url of links) {
        test.expect(isValid(url), `URL salah: ${url}`).toBe(true);
      }
    });
  });
});
