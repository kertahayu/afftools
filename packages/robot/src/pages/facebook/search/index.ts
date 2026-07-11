import { FacebookSearchPage } from "./page";

type TargetOptions = "photo" | "reel";

export class FacebookSearch extends FacebookSearchPage {
  async getPostList(loop: number, targetsOptions: TargetOptions[]) {
    let postIndex = 0;
    const postList = new Set<string>();

    while (postList.size < loop) {
      await this.current.waitFor({ state: "attached" }); // before next wait first

      this.content().posts(postIndex);
      // console.log(await this.current.getAttribute("role"));

      // for checker whether content
      console.log(await this.current.allTextContents());

      await this.current.scrollIntoViewIfNeeded(); // Effective for lazy load

      const link = this.post("content").locator("xpath=.//a").first(); // The post

      const href = await link.evaluate((node: HTMLAnchorElement) => node.href);
      // .catch(() => null); // without catch null because not expected return null

      // INFO: Filter by path
      const targets = targetsOptions.map((value) => `/${value}/`);

      if (targets.some((target) => href.includes(target))) {
        postList.add(href);
      }

      postIndex++;
    }
    return postList;
  }

  async setFilterAllNew() {
    await this.filter().all().newest().click();
  }
}
