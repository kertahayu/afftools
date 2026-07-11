/* eslint-disable playwright/no-skipped-test */
/* eslint-disable playwright/expect-expect */

import { FacebookPhoto } from "@pages/facebook/photo";
import { FacebookProfile } from "@pages/facebook/profile";
import { FacebookSearch } from "@pages/facebook/search";
import { test } from "@playwright/test";
import numbro from "numbro";
import { parseNumber } from "../libs";

/*
 * sebelum menjalankan tugas harus di cek dulu apakah ada user login
 */

/**
 * Good Posts
 * https://www.facebook.com/reel/951436853947879
 */

const cookie =
  // DELE
  "datr=EihtaS83hOAGK-Da7SnzvT5I;sb=EihtaX4G-UnrTE06JFtXges2;ps_l=1;ps_n=1;c_user=100000333888303;wd=1366x615;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1770809101728%2C%22v%22%3A1%7D;fr=1YMcs2PIDyYGD43Wm.AWfBJRfNVBJS9uz63vyVr6ZokzosdcBtDOQfAtkm5ikSooJfs2o.BpjGcN..AAA.0.0.BpjGcN.AWeNCgQaDG8aHCE4SVhwsCvTpvY;xs=9%3A1JEEe1NqBcwpeQ%3A2%3A1768761522%3A-1%3A-1%3A%3AAcyTmVoTfwv9Nx1vjpNpfjTYFbim9Po7RHoF1S_46uw";
// Biong
// "datr=Ew37aXyt_n4JXaw2CV-5GwUr;sb=Ew37acTJzeffUuQdcnmYrZfo;c_user=61587388731734;fr=15u3Zhrt10MLr6b0u.AWdXs_tc-d4i2nCQ1MJYIQGYuTiZrt13h6IYNw4YeeebMpC-rN0.Bp-w2-..AAA.0.0.Bp-w2-.AWdwfIHgwBJnTcwT85icamdv9bQ;xs=15%3ACAVGzUAQQ6Whjg%3A2%3A1778060728%3A-1%3A-1%3A%3AAcwh6cmirfKB3j-ZmtLgkqxa7ybpvMVXYwc4f3Gbrw;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1778060740726%2C%22v%22%3A1%7D;wd=1366x649";

const isValid = (u: string) => {
  try {
    new URL(u);
    return true;
  } catch {
    return false;
  }
};

test.describe("Facebook", () => {
  /**
   * Find posts via search
   *
   * cari trend query di facebook (masih belum punya tools)
   *
   * cari menggunakan query saja
   * set ke public
   * jika bagus set ke tahun terbaru
   * jika bagus set ke kota
   *
   * cari berdasarkan postingan cek komentar apakah ada 1 rb
   * cek apakah komentar permenitnya bagus
   * hanya ambil link postingan jika permneitnya bagus
   */
  test("Find posts from search", async ({ page }) => {
    const facebook = new FacebookSearch(page, cookie);
    const quantity = 10;

    /*
     * BUG: cant used searchparams directly
     * FIX: must be via UI
     */
    await test.step("Open search page", async () => {
      const params = new URLSearchParams({
        q: "israel",
      });
      await facebook.open("search", params);
    });

    await test.step("Filter set", async () => {
      await facebook.setFilterAllNew();
    });

    const links = await test.step("Ekstraksi link posts", async () => {
      /*
       * FIX: harus check dulu apakah ada postingan hanya text karena saya akan mengambil link postnya
       * saat inin ketika lebih dari 1 post dan mungkin ada selain post foto (hanya text membuatnya error)
       */
      return Array.from(await facebook.getPostList(quantity, ["photo"]));
    });

    await test.step("Validasi hasil ekstraksi", () => {
      test
        .expect(links, "Jumlah link post tidak sesuai")
        .toHaveLength(quantity);

      for (const url of links) {
        test.expect(isValid(url), `URL salah: ${url}`).toBe(true);
      }
    });

    console.log(links, links.length);
  });

  test.skip("Posts crawl get post trending", async ({ page }) => {
    const facebook = new FacebookProfile(page, cookie);
    const quantity = 2;

    await test.step("Buka halaman dengan cookie (login)", async () => {
      await facebook.open("john.sperling.39");
    });

    /*
     * WARN: masalah remove sepertinya penyebab erorr,
     * selalu blink scroll ke atas (hydration effects)
     */
    await test.step("Menghapus Banner", async () => {
      // await facebook.removeBanner();
    });
    await test.step("Menghapus Aside", async () => {
      // await facebook.removeAside();
    });

    /**
     * TODO: perbaiki getPostList hanya untuk mengembalikan list postingan
     * berikan method lanjutaan untuk mendapatkan hanya link
     */
    const links = await test.step("Ekstraksi links posts", async () => {
      return Array.from(await facebook.getPostList(quantity, ["photo"]));
    });

    await test.step("Validasi hasil ekstraksi", () => {
      test
        .expect(links, "Jumlah link post tidak sesuai")
        .toHaveLength(quantity);

      for (const url of links) {
        test.expect(isValid(url), `URL salah: ${url}`).toBe(true);
      }
    });

    console.log(links, links.length);
  });

  /**
   * Dapatkan jumlah komentar pada sebuah postingan
   *
   * Lebih baik hanya dapatkan postingan dengan komentar terbanyak
   * dan deteksi apakah banyak komentar baru (POST TRENDING)
   */
  test.skip("Check the post photo what is a trending", async ({ page }) => {
    const facebook = new FacebookPhoto(page, cookie);

    // await test.step("Goto photo post", async () => {
    //   await facebook.open(
    //     "https://www.facebook.com/photo/?fbid=1425702892937394&set=a.653758993465125&__cft__[0]=AZaQNfz4L1oNoKylcEZvcd22eVw3Zg-97QPIk1UusRQq6mmRq1G1I9a3MND9uypRDuUlih34DPANdNspPrSkWYy6Co8Y4zhyIg6M92EvEM6LxPPlEUuDXgR7-YUrmeE19lbCqWHVAXP5Hl9Ufez59nPdrN9q8SkzIavXoKPEftdyQhPxqq09rG3Btt-u67WqIoY&__tn__=EH-R"
    //   );
    // });

    parseNumber("1,2 rb");

    // await test.step("Sort to newest", async () => {
    //   await facebook.setSort("new");
    // });
  });

  test.skip("Photo page commenting", async ({ page }) => {
    const facebook = new FacebookPhoto(page, cookie);
    const quantity = 3;

    await test.step("Goto photo post", async () => {
      await facebook.open(
        "https://www.facebook.com/photo/?fbid=122187997898435342&set=gm.10173326652005183&idorvanity=119522640182"
      );
    });

    await test.step("Delete content", async () => {
      await facebook.deleteContent();
    });

    await test.step("Sort to newest", async () => {
      await facebook.setSort("new");
    });

    /**
     * INFO: Its okay
     */
    // await test.step("Get Comment List", async () => {
    //   /**
    //    * BUG: Jika komentar ada [teks, stiker, aksi]
    //    * selector comments tidak bisa mencarinya. entah kenapa
    //    */
    //   await facebook.getComments(quantity);
    // });

    await test.step("Set Comment in comment", async () => {
      await facebook.setComments(3);
    });

    // await test.step("Get Language", async () => {
    //   const language = await facebook.lang();
    //   console.log(language);
    //
    //   // test.expect(language, "Is language ID").toBe('id-ID')
    // });

    /**
     * Cari postingan dengan banyak komentar
     */
  });
});
