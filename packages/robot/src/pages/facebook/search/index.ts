import { FacebookSearchPage } from "./page";

type TargetOptions = "photo" | "reel";

export class FacebookSearch extends FacebookSearchPage {
  async getPostList(loop: number, targetsOptions: TargetOptions[]) {
    let postIndex = 0;
    const bankPosts = new Set<string>();

    while (bankPosts.size < loop) {
      // INFO: ambil content pada postingan berdasarkan post index
      // content().posts() bisa digunakan untuk mendapatkan daftar posts
      console.log(postIndex);
      this.content().posts(postIndex);

      // INFO: mendapatkan isi konten dalam postingan full
      // console.log(await this.current.allTextContents());

      // INFO: Cek apakah postingan terakhir dari list
      const elementLazyLoad = (await this.current.allTextContents())[0] === "";
      // (await this.current.locator("xpath=self[not(@*)]").count()) > 0;
      console.log(elementLazyLoad);

      if (elementLazyLoad) {
        continue;
        // await this.current.waitFor({ state: "attached" }); // jika disini gagal gunakan attached
      }

      const nextSibling = this.current.locator("xpath=following-sibling::*[1]");

      if ((await nextSibling.count()) === 0) {
        console.log("akhir : ", postIndex);
        break; // Berhenti jika sudah tidak ada sibling
      }

      // INFO: navigasi scroll ke postingannya
      await this.current.waitFor({ state: "attached" }); // jika disini gagal gunakan attached
      console.log(await this.current.allTextContents());
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
      await link.first().waitFor({ state: "attached", timeout: 60000 });
      // await expect(link).toHaveAttribute('href', /.+/); // jika evaluate gagal gunakan ini untuk menunggu att href

      // INFO: Mendapatkan full url (https://)
      // harus menggunakan evaluate() untul full url
      const href = await link.evaluate(
        (node: HTMLAnchorElement) => node.href,
        {},
        { timeout: 60000 }
      );

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
    // INFO: Cek pada post ke 2, karena jika post ke 1 akan bentrok dengan indikator lazyload
    // cek sampai postnya di tambahkan  ke feed
    const pastPost = this.contents().locator("xpath=./div").nth(1);
    await pastPost.waitFor({ state: "attached" });

    // INFO: Eksekusi filter
    // tunggu hingga pastPost di cabut dan menempelkan yang baru hasi filter
    await this.filter().all().newest().click();
    await pastPost.waitFor({ state: "detached" });
    await pastPost.waitFor({ state: "attached" });

    // this.content().posts(0);
    // console.log(await this.current.allTextContents());
  }
}
