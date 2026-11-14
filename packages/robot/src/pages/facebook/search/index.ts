import { FacebookSearchPage } from "./page";

type TargetOptions = "photo" | "reel";

export class FacebookSearch extends FacebookSearchPage {
  async getPostList(loop: number, targetsOptions: TargetOptions[]) {
    let postIndex = 0;
    const bankPosts = new Set<string>();

    while (bankPosts.size < loop) {
      // INFO: Menunggu element pertama ditambahkan pada setiap postingan
      await this.current.waitFor({ state: "attached" });
      console.log(postIndex, await this.current.allTextContents());

      // INFO: ambil content pada postingan berdasarkan post index
      // content().posts() bisa digunakan untuk mendapatkan daftar posts
      this.content().posts(postIndex);

      // INFO: mendapatkan isi konten dalam postingan full
      // console.log(await this.current.allTextContents());

      // INFO: Cek apakah postingan terakhir dari list
      if ((await this.current.count()) === 0) {
        console.log("akhir : ", postIndex);
        break;
      }

      // INFO: navigasi scroll ke postingannya
      await this.current.waitFor({ state: "visible" }); // jika disini gagal gunakan attached
      await this.current.scrollIntoViewIfNeeded(); // Effective for lazy load

      // INFO: Cek apakah postingan memiliki anchor (gambar, video)
      // jika postingan text tidak akan memiliki anchor karena yg akan diambil adalah link post
      const anchor = this.post("content").locator("xpath=.//a"); // The post
      const link = anchor.first();
      if ((await anchor.count()) === 0) {
        postIndex++;
        continue;
      }

      // INFO: Menunggu link ditambahkan / ada
      await link.first().waitFor({ state: "attached" });
      // await expect(link).toHaveAttribute('href', /.+/); // jika evaluate gagal gunakan ini untuk menunggu att href

      // INFO: Mendapatkan full url (https://)
      // harus menggunakan evaluate() untul full url
      const href = await link.evaluate((node: HTMLAnchorElement) => node.href);

      // INFO: Filter by path
      const targets = targetsOptions.map((value) => `/${value}/`);

      if (targets.some((target) => href.includes(target))) {
        bankPosts.add(href);
      }

      postIndex++;
    }
    return bankPosts;
  }

  async setFilterAllNew() {
    await this.filter().all().newest().click();
  }
}
