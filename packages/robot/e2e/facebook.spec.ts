/* eslint-disable playwright/no-skipped-test */
/* eslint-disable playwright/expect-expect */

import { FacebookPhoto } from "@pages/facebook/photo";
import { FacebookProfile } from "@pages/facebook/profile";
import { FacebookSearch } from "@pages/facebook/search";
import { test } from "@playwright/test";

/*
 * sebelum menjalankan tugas harus di cek dulu apakah ada user login
 */

/**
 * Good Posts
 * https://www.facebook.com/reel/951436853947879
 */

const cookie =
  // DELE
  // "datr=EihtaS83hOAGK-Da7SnzvT5I;sb=EihtaX4G-UnrTE06JFtXges2;ps_l=1;ps_n=1;c_user=100000333888303;wd=1366x615;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1770809101728%2C%22v%22%3A1%7D;fr=1YMcs2PIDyYGD43Wm.AWfBJRfNVBJS9uz63vyVr6ZokzosdcBtDOQfAtkm5ikSooJfs2o.BpjGcN..AAA.0.0.BpjGcN.AWeNCgQaDG8aHCE4SVhwsCvTpvY;xs=9%3A1JEEe1NqBcwpeQ%3A2%3A1768761522%3A-1%3A-1%3A%3AAcyTmVoTfwv9Nx1vjpNpfjTYFbim9Po7RHoF1S_46uw";
  "datr=Vzo4au7P_J8jcQOn7uovP_bR;ps_l=1;ps_n=1;sb=ZDo4ajhSQnO1LfdPtAhpPRzf;dpr=0.8999999761581421;wd=1455x727;c_user=100006407223705;xs=17%3AC4drMnryeQQvGA%3A2%3A1795312808%3A-1%3A-1%3A%3AAc1uqobjc_glIrOZasiWvY2C9Uw9I9U_kjL29J25JA;fr=1dU5F0ToZJzGA7Dyn.AWcNBLlzQleCxutDAZ1CNFmpQfCTVTT6FV5TfIjoW8g8MRF1YhQ.BrAkyq..AAA.0.0.BrAk0w.AWdQ4REFrNWsBOi1FIMeRPQWP3c;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1795313921914%2C%22v%22%3A1%7D";
// "datr=Vzo4au7P_J8jcQOn7uovP_bR;ps_l=1;ps_n=1;sb=ZDo4ajhSQnO1LfdPtAhpPRzf;c_user=100006407223705;dpr=0.8999999761581421;wd=1455x727;fr=15F3krghujUDZgGg5.AWfLN-5L5guMSlND1bzxya5yRj-WqJZgEFKSW_W87IXmLtlSXrE.Bq-bH8..AAA.0.0.Bq-bH8.AWfkjykUnvXry24D1xxcZWqAQfI;xs=41%3AodVgdOy0gpV6iQ%3A2%3A1782128105%3A-1%3A-1%3A%3AAc26EwRs31Xj_07BR4y0VwnE41UYJPFSpnwVdmPwylQ;presence=C%7B%22t3%22%3A%5B%5D%2C%22utc3%22%3A1794748925687%2C%22v%22%3A1%7D";
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
    const quantity = 100;

    /*
     * BUG: cant used searchparams directly
     * must be via UI
     */
    await test.step("Open search page", async () => {
      const params = new URLSearchParams({
        q: "jesus",
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
        .expect(links.length, "Jumlah link post tidak sesuai")
        .toBeLessThanOrEqual(quantity);

      for (const url of links) {
        test.expect(isValid(url), `URL salah: ${url}`).toBe(true);
      }
    });

    console.log(links, links.length);
  });

  test("Crawl posts from user profile", async ({ page }) => {
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
      await facebook.removeBanner();
    });

    await test.step("Menghapus Aside", async () => {
      await facebook.removeAside();
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
  test("Check the post photo what is a trending", async ({ page }) => {
    const facebook = new FacebookPhoto(page, cookie);

    await test.step("Goto photo post", async () => {
      const list = [
        "https://www.facebook.com/photo/?fbid=1454717716770030&set=a.443336247908187&__cft__[0]=AZi5-PsdMteIvUw5Y4fyuXdmhUYGVdprK1rka4FWhUMOreXrCt63NQfQ8lCLmNOI3k1g-APwON8c0l7pAWlN94f7udC-LO_1AnlyhwC_lvBd6jS32GAsUdvq-rGo3XMhSX0w8sehjZaVSPNujtKLO90r01CZVspPdPN8vu4CeQxiaiogV10fwTXnkp4&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122101177407547565&set=a.122099025165547565&__cft__[0]=AZhDf9Jw8NsC_cwdDfII606hibn7-Cfd5ode_dQXr984nWzIEe3DeGQHhm4OPeC6Gq9w6DWZEKSfIJ6r4zci5YNhcGzjArq1CuE4PAWYdG5y7Oih16_TO0xJZ3o_4xYLFB2uEs9iOanl-sbGXyWoLXrZWsBdaILkmGzKMEKTxDbh4pGbnuOCCt16LNSSLNg&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122143133391178936&set=gm.3018631791818175&idorvanity=293926287622086&__cft__[0]=AZiBOFkAswstpSrtu9SO3Zw0f4pdDXeOiwYSsPGeSWF0qwY2aWSIeP3SI8xO-VIiECeYyjv1AhBBiuh3Yh6nMjyy0qi998QoDYF3xrJR2niX4vKeYZbapr1Ew7bhUKSr-MFBNWzo68A3UWcsut1BEVyG-GmI11ERcDl_RDqnWohbTXIQzekumPvqDaGrOjgLziwP&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122145659439358433&set=a.122102704701358433&__cft__[0]=AZgN-eC-wlkLu-j1a4wG8F-jVDb6-YP9JCsIpoRemUdJB2L3UqH3ShBwh0hQEmRI2-DKeh5YJShU7iEMpUokltKdv0G4VLF5dFIlSZYjqTSCHPcMHRv5kLOy_Ali-TxXIyWvapXT2-T2EbEJPihRMVAkuUS5YbXb9vN5HhIFgHP7ENYE2q-yPu9I1LNNiKQ&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122100254457547923&set=a.122100724383547923&__cft__[0]=AZjVFY0jpm8QqYyLxs6ZsUvXRKD0J0ImxCiF_IzNVHMnF1SVm9n-wchq1OdCwRldjnTrUlTGaFUNrQhZnjlf6LZmhRjHypLNLrAHDuK3zYXqbj5m_dYWa-3SNkns08B-4MkHhJNf5JLGQheRjRTGOB182VhujmpGLHZkZBeQTbhaHCEhgF2x9JrVp2D4UPk&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=1471157894939241&set=a.170475351674175&__cft__[0]=AZjOyXBQhH-DiP3gsahwGs9L_OYRl6dyWR8jZqyO4C5764voQqwTRzh3_ZQNVuKyrwanINtebff81ewNCoiaL_lSbNjIFMNvBGV1RmOyrStsZHv6KimAHJZFoebwUyVsJrBttEPHmjr1_7YrRhjYF8SnVChGqBfXqujrnIDZvCJ2_CnR_p3q9tgU9JM&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122149384485345029&set=a.122096366331345029&__cft__[0]=AZiHkjc6MnO3VIe_88v9dVdy4kydtUNWKlLBYHjo1sPpXR0v9APrLfl3UAZeFAvpj8A9ChZLW0wd2T5Z8yD0N8bhHYsrv-qb-ruppGdQpJgdhdtqm2uQMyQFI4RxHMJFeHS59lQH4D9LWbz_YvxyRLh6JOn_--5w5b4ZcGI2FAOqxf40L02Qz_glRFYnl4s&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122207501834773100&set=a.122133149630773100&__cft__[0]=AZgWwo0wa0YcTt80M7K2RjHBXqQs1li6X331Vl8M0AAobbWn9MGo6M7q__ClPrWCuVQi2QIKJxvGwzSIldTEstghzOoiqrPNlhC8npi30W8fwUJVxkIiBD79FxrTo5nkC91i-2bZ04q86RIRWXzh_Crwla-Gxe1pS-r-FoSdRYLuGRo14StQZpzCTDIkQpc&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=1131005746521476&set=a.468442849444439&__cft__[0]=AZjR2Zf_zfskp-9sFIMA20ra7Mzn80doraaczMEAHAAKCnWLX3ExS8UYcPlBnz_Q9ah34ScYEaqj8YxNkOrS9r9YjHunzlwBXxrtpn020a540W1KvEQ9RijXZmJlnzQQeZ-cvztMWsSxKUdiDb6IVvviaflvoZ3borvpDc26l98XKO0vxFtXxYTeSxo&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=1634148728738686&set=a.591111289709107&__cft__[0]=AZjv1v8TSXAEUrZ7O-CTQfxlg7-IRaj0r8IE2cD0lXLtDa7Vt7ogB7q1z1yS9O5NirDveO3MR07w49PImBM3ichxvHohZeJORKt8jp0tc4vbQN6Qc-A8oC4PEd6NzaBeOoUX_QevuiMVenSpmjXF9NLzWBjDtBIOY3Z7qd9E2Y4fahMjeKSEa-cM6rY&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=1058716967226953&set=a.316098148155509&__cft__[0]=AZiHL03cZCj4snmTPm-QxVIARsSuakxAxg1S4O09wjwsX-34cMB04b2nRFgqc-l93cyCa2bGsl3XSkqnTD0aIU-5ZNlnlRhYShW4OHKpWBRYyRlSbpWTAPZ28R9DGhjjuQo4LK353_AY2irtdDEHEW6RJFZ8qm2YFjHjwx-2VBtqbzT4SW5VjheTvOI&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122126888187461821&set=a.122125726869461821&__cft__[0]=AZipi3sC9ym1D-a55HKhkrv4DXv9fjg6tLVPgoXsXqlMrr_CL1rfIFGDxNDJJy8SbEwMtxMTE6SpYWI6YCY3OE5l_HRu-hCkHYTnjGFOgAte7NiZ-tilNrp5EIm7hAfk4nIPX9J0uOHlvZ1Fsr9z6dzLmcgHSZVdv5ysY1T-kMqU6HpGd6hg67jBWRoLXGI&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122140241613404950&set=a.122094723063404950&__cft__[0]=AZgR-WL62rZyUQPMH4ys3H3_v2Qt6p8VqxAw_6plnY_HxoaAIPuEgPSXrE_5UtTBQe9_7y5KsY3VaGv446q2RwA2HoDkdbagRJRr0R-cOg9NJyJ4J_g8fjdKtVWKq6Nsn96rtswz0wiCGrXzqIzKVJqVDlf_sMdA8L65I-zicr-yOIdDMUrTu_eNavprNus&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122126665665461821&set=a.122125726869461821&__cft__[0]=AZiWOiOOqpxYvnnzIBo-CiRX6t_RhvUHTGaWKif49WbMV2cHORJ8J23rTvoPmmuRIhWJmS_E6BDnsgGVXXcrA23_zinyvU6EmQ2eOobX_9mD2t7C6f7_IYsY7P4ZRR2KmYkzXfdu6E7z4nqdL68BPv_m8FBjTq3r4n4eTSYjuzSlnG9ADEEQM2_aCm3Fgc4&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=2194422964838102&set=a.1459973834949689&__cft__[0]=AZiyM2tV7TaCBcaS9S3hCKPKuHmFT-1a5a3F3XavWDVA0YxaYysLl6mzyPjEw8cBKbalcN3DhjRP0F1ebn9us2RFp-p_t87unSBQtsvC701GVMNqNBPPin4Ivt1BTsEwCLGhzBablG_f8A4S2R6cB7NZ3JLSQS5RyVgYcrK6KNYe03hpZCWwot53fqo&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=1632034455616780&set=a.591111289709107&__cft__[0]=AZgBl7zpXCEW_C0lIdJgtqTwE69YLQ0gPJ3YPcgoe4yoc-yXIQGS0XKROmd-Yn89zUJNne_0k7RseUf0MpXmAqznufu3L39_Axk8pPp1QFVzdALhjaBeUj2YRFjjhcAgyVjZCp7BVDVs5qVv28DxK5vY5eTjG305mrH05N39pdaWMe6Fgvf-H_vaBpk&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=1700315258119130&set=a.265792868238050&__cft__[0]=AZiHKJBNa2gYHWwVNYxjEuvJZ_gG3iCcTCDlnKZHIdbYaWI-kH4udK66Gle2NsJQ616MRQSq7zGHDzrsqA4AhA2q2aCE2gtjr2b0H3FsPjIsYEHDpjYNWHj_7SHh0BkX-ppVJKy2K0TVrNd4jkqQQW9awnwTsnTnDNAq2YrwK8xmX7vtW8zqGOQ5olA&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=122155629777219261&set=a.122100750573219261&__cft__[0]=AZi0S3fqhQzl5GLNM1o02p-vIhMNtDxZdss56-qQoM-Vj0Wc5SKz8S5ONWwl1DgZZrOMd8JNq_xIhe1AAy-X8hysLpQGRXsnlKWMUL0uMbYSo5I3_qMkWninWPS28Xr8qSfJejF7ihKTnUxK2fxbZZjxUivGkChlob5YWqzycXpjVbaP-x6GMkPIYkAIVOQ&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=1630431775777048&set=a.591111289709107&__cft__[0]=AZilOAkJruk1UhbwU9O07BUVNHF-lMifT23xLnjd8XaLdmGyQk47dl3vgtQx1KEn_jR8k6AnUoISsCeECkdXhmaVbmTMttqv-9tyR1P1jZ1MpMdErFITmGxajNj706_Fqn-LYesDSAJw4ZouWut4XyqUXjc9TJGRelhHoQGdeilLuQ6Vb6MzRE8Ll60&__tn__=EH-R",
        "https://www.facebook.com/photo/?fbid=1425702892937394&set=a.653758993465125&__cft__[0]=AZaQNfz4L1oNoKylcEZvcd22eVw3Zg-97QPIk1UusRQq6mmRq1G1I9a3MND9uypRDuUlih34DPANdNspPrSkWYy6Co8Y4zhyIg6M92EvEM6LxPPlEUuDXgR7-YUrmeE19lbCqWHVAXP5Hl9Ufez59nPdrN9q8SkzIavXoKPEftdyQhPxqq09rG3Btt-u67WqIoY&__tn__=EH-R",
      ];
      await facebook.open(list[3]);
    });

    // console.log(parseNumber("120"));

    await test.step("Sort to newest", async () => {
      await facebook.setSort("new");
    });

    // await test.step("Check the post is trend via comment per minutes", async () => {
    //   await facebook.getComments(3);
    // });

    await test.step("Check the post is trend via comment per minutes", async () => {
      const trend = await facebook.isTrending({ cpm: 1, countComment: 100 });
      console.log(trend);
    });
  });

  test("Photo page commenting", async ({ page }) => {
    const facebook = new FacebookPhoto(page, cookie);
    const quantity = 3;

    await test.step("Goto photo post", async () => {
      await facebook.open(
        "https://www.facebook.com/photo/?fbid=122126665665461821&set=a.122125726869461821&__cft__[0]=AZiWOiOOqpxYvnnzIBo-CiRX6t_RhvUHTGaWKif49WbMV2cHORJ8J23rTvoPmmuRIhWJmS_E6BDnsgGVXXcrA23_zinyvU6EmQ2eOobX_9mD2t7C6f7_IYsY7P4ZRR2KmYkzXfdu6E7z4nqdL68BPv_m8FBjTq3r4n4eTSYjuzSlnG9ADEEQM2_aCm3Fgc4&__tn__=EH-R"
        // "https://www.facebook.com/photo/?fbid=1700315258119130&set=a.265792868238050&__cft__[0]=AZiHKJBNa2gYHWwVNYxjEuvJZ_gG3iCcTCDlnKZHIdbYaWI-kH4udK66Gle2NsJQ616MRQSq7zGHDzrsqA4AhA2q2aCE2gtjr2b0H3FsPjIsYEHDpjYNWHj_7SHh0BkX-ppVJKy2K0TVrNd4jkqQQW9awnwTsnTnDNAq2YrwK8xmX7vtW8zqGOQ5olA&__tn__=EH-R"
        // "https://www.facebook.com/photo/?fbid=122187997898435342&set=gm.10173326652005183&idorvanity=119522640182"
      );
    });

    // await test.step("Delete content", async () => {
    //   await facebook.deleteContent();
    // });

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

    // await test.step("Set Comment in comment", async () => {
    //   await facebook.setComments(10, "hallloo");
    // });

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
