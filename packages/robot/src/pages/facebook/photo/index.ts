import parseDuration from "parse-duration";
import id from "parse-duration/locale/id.js";
import type { MessagePaths } from "../base";
import { FacebookPhotoPage } from "./page";

export type SortOptions = "relevant" | "new" | "old" | "all";
export type IsTrending = { commentPerMinute: number; countComment: number };

export class FacebookPhoto extends FacebookPhotoPage {
  /**
   * Delete the content
   */
  public async deleteContent() {
    await this.section().main().remove();
  }

  /**
   * Set sort of comments
   */
  public async setSort(value: SortOptions) {
    const sortValue = {
      new: "sorts.new",
      old: "sorts.old",
      relevant: "sorts.relevant",
      all: "sorts.all",
    }[value] as MessagePaths;

    const comment = this.section().complementary().comments();

    comment.sort();
    const isHaveSort = await this.current.evaluate(
      (node) => node.hasChildNodes
    );
    if (!isHaveSort) return;
    await this.current.click({ button: "left" });

    comment.sort(sortValue);
    await this.current.click({ button: "left" });

    // Wait after changes sort
    this.section().complementary().comments();
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
      this.section().complementary().comments().comment(postIndex);

      // comments.comment();
      // commentList.add((await this.current.textContent()) as string); // harusnya hanya ambil content saja tidak perlu semua
      commentList.add(await this.current.innerText()); // harusnya hanya ambil content saja tidak perlu semua

      postIndex++;
    }

    console.log(commentList);
  }

  public async setComments(loop: number, text: string) {
    let commentIndex = 0;

    while (commentIndex < loop) {
      const comment = this.section()
        .complementary()
        .comments()
        .comment(commentIndex);

      const lastComment = await this.lastComment(3);
      console.log(lastComment);

      if (lastComment) {
        this.section().complementary().comments().loadmore();
        await this.current.click();

        this.section()
          .complementary()
          .comments()
          .comment(commentIndex + 1);
        await this.current.waitFor();
        continue;
      }

      comment.article().message().action().reply();

      await this.current.click();

      await this.page.locator(":focus").pressSequentially(text);

      commentIndex++;
    }
  }

  protected async lastComment(index: number) {
    const isLast = await this.current.evaluate((node, index) => {
      const parent = node.parentElement;
      if (!parent) return -1;

      const childrens = Array.from(parent.children);
      return !(childrens.indexOf(node) < childrens.length - index);
    }, index);

    return isLast;
  }

  /**
   * Mengecek apakah konten sedang trending.
   * @param {IsTrending} params - Parameter untuk mengecek status trending.
   * @param {number} params.cpm - Nilai Cost Per Mille.
   * @param {number} params.countComment - Jumlah komentar.
   */
  public async isTrending({ commentPerMinute, countComment }: IsTrending) {
    const time = 60000; // 1 menit
    let countTime = false;
    let commentIndex = 0;

    this.section().complementary().interaction().count().comment();
    const countCom = Number(await this.current.textContent()) >= countComment;

    while (commentIndex < commentPerMinute) {
      const eachComment = this.section()
        .complementary()
        .comments()
        .comment(commentIndex);
      // this.current.waitFor({ state: "visible" });
      await this.lastComment(2);

      eachComment.article().message().text().time();
      const getTime = await this.current.textContent();

      parseDuration.unit = id;
      countTime = parseDuration(getTime ?? undefined) === time;
      commentIndex++;
    }

    return countTime && countCom;
  }
}
