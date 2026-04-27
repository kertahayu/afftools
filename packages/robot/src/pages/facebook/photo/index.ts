import { log } from "console";
import type { MessagePaths } from "../base";
import { FacebookPhotoPage } from "./page";

export type SortOptions = "relevant" | "new" | "old" | "all";

export class FacebookPhoto extends FacebookPhotoPage {
  /**
   * Delete the content
   */
  public async deleteContent() {
    await this.section("complementary").complementary("post").remove();
  }

  /**
   *
   */
  public async setSort(value: SortOptions) {
    const comments = this.section("complementary").complementary("comments");

    const sort = comments.comments("sort");
    await this.current.click({ button: "left" });

    const sortValue = {
      new: "sorts.new",
      old: "sorts.old",
      relevant: "sorts.relevant",
      all: "sorts.all",
    }[value] as MessagePaths;

    sort.sort(sortValue);
    // console.log(await this.current.allTextContents()); // for get the list sorts

    await this.current.click({ button: "left" });

    // Wait after changes sort
    this.section("complementary").complementary("comments");
    await this.current.waitFor({ state: "visible" });
  }

  /**
   * Write comment for the comment's
   */
  public async getComments(loop: number) {
    let postIndex = 0;
    const commentList = new Set<string>();

    // Berapa banyak komentarnya
    // const comment = this.section("complementary")
    //   .complementary("comments")
    //   .comments(0);
    //
    // console.log(
    //   await this.current.allTextContents()
    //   // await this.current.first().innerHTML(),
    //   // await this.current.count()
    // );

    while (commentList.size < loop) {
      const comments = this.section("complementary")
        .complementary("comments")
        .comments(postIndex);

      // comments.comment();
      // commentList.add((await this.current.textContent()) as string); // harusnya hanya ambil content saja tidak perlu semua
      commentList.add(await this.current.innerText()); // harusnya hanya ambil content saja tidak perlu semua

      postIndex++;
    }

    console.log(commentList);
  }

  public async setComments(loop: number) {
    let postIndex = 0;

    while (postIndex < loop) {
      this.section("complementary")
        .complementary("comments")
        .comments(postIndex)
        .comment("reply");

      await this.current.click();

      await this.page.locator(":focus").pressSequentially("Halllooo");

      // console.log(await this.current.innerHTML());

      // comments.comment();

      postIndex++;
    }
  }
}
