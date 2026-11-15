import { FacebookProfilePage } from "./page";

type TargetOptions = "photo" | "reel";

export class FacebookProfile extends FacebookProfilePage {
  async removeBanner() {
    await this.section().banner().remove();
  }

  async removeAside() {
    await this.section().content().aside().remove();
  }

  /**
   * Get the posts
   */
  async getPostList(loop: number, targetsOptions: TargetOptions[]) {
    let postIndex = 0;
    const postList = new Set<string>();

    while (postList.size < loop) {
      /**
       * for now its helped and work
       */
      const postContainer = this.section("content")
        .content("main")
        .main("posts");
      // await a.isVisible();
      postContainer.posts(postIndex);

      // await this.current.isVisible(); // if the error is fixed
      await this.current.scrollIntoViewIfNeeded(); // Effective for lazy load

      const link = this.post("content").locator("xpath=.//a").first(); // The post

      /**
       * don't use getAttribute to get href value, there is a relative possibility.
       * it's recommended use evaluate instead of getAttribute
       */
      // const href = await link.getAttribute("href");
      const href = await link.evaluate((node: HTMLAnchorElement) => node.href);
      // .catch(() => null); // without catch null because not expected return null

      const targets = targetsOptions.map((value) => `/${value}/`);

      if (targets.some((target) => href.includes(target))) postList.add(href);

      postIndex++;
    }

    return postList;
  }
}
