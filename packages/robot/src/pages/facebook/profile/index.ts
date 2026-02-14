import { FacebookProfilePage } from "./page";

export class FacebookProfile extends FacebookProfilePage {
  async removeBanner() {
    await this.section("banner").remove();
    // this.section("banner")
    // await this.current.evaluate((node) => node. , arg)
  }

  async removeAside() {
    await this.section("content").content("aside").remove();
  }

  /**
   * Get the posts
   */
  async getPostList(loop: number) {
    let postIndex = 0;
    const postList = new Set<string>();

    while (postIndex < loop) {
      this.section("content").content("main").main("posts").posts(postIndex);

      await this.current.scrollIntoViewIfNeeded(); // Effective for lazy load

      this.post("content"); // The post
      const link = this.current.locator("xpath=.//a").first();

      /**
       * don't use getAttribute to get href value, there is a relative possibility.
       * it's recommended use evaluate instead of getAttribute
       */
      // const href = await link.getAttribute("href");
      const href = await link.evaluate((node) => node.href).catch(() => null);
      postList.add(href);

      postIndex++;
    }

    return postList;
  }
}
