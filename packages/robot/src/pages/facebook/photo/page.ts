import { Base, MessagePaths } from "../base";

type SectionOptions = "main" | "complementary";
type ComplementaryOptions = "post" | "interaction" | "comments";
type CommentsOptions = "sort" | "comment";
type CommentOptions = "time" | "like" | "reply" | "share";

// type PostOptions = "owner" | "content" | "interaction";
// type MainOptions = "filter" | "posts";

export abstract class FacebookPhotoPage extends Base {
  private get root() {
    return this.page.locator(
      "xpath=//div[@role='main' or @role='complementary']/.."
    );
  }

  protected section(value: SectionOptions) {
    const options = {
      main: 0,
      complementary: 1,
    }[value];

    this.current = this.root.locator(`xpath=./div`).nth(options);

    return {
      complementary: this.complementary.bind(this),
      remove: this.remove.bind(this),
    } as const;
  }

  private complementary(value: ComplementaryOptions) {
    const option = {
      post: 0,
      interaction: 1,
      comments: 2,
    }[value];

    this.current = this.current
      .locator("xpath=./div/div/div/div/div")
      .nth(option);
    return {
      comments: this.comments.bind(this),
      remove: this.remove.bind(this),
    } as const;
  }

  private comments(value?: CommentsOptions | number) {
    this.current = this.current.locator("xpath=./div/div");

    if (typeof value === "undefined" || typeof value === "number") {
      this.current = this.current.locator("xpath=../div[@data-virtualized]"); // 9 item
      if (typeof value === "number") this.current = this.current.nth(value); // 9 item
    } else {
      const option = {
        sort: 0,
        // undefined: 1,
        more: -2,
        comment: -1,
      }[value];

      this.current = this.current.locator("xpath=./div").nth(option);
    }

    return {
      sort: this.sort.bind(this),
      comment: this.comment.bind(this),
    } as const;
  }

  private comment(option: CommentOptions) {
    const options = {
      time: 0,
      like: 1,
      reply: 2,
      share: 3,
    }[option];

    this.current = this.current
      .locator("xpath=.//div[@role='article']")
      .locator("xpath=./div")
      .last()
      .locator("xpath=./div")
      .last()
      .locator("xpath=./ul")
      .locator("xpath=./li")
      .nth(options);
  }

  // private more() {
  //   this.current = this.current.locator(selectorOrLocator);
  // }

  /**
   * BUG: Via nth selector
   */
  // private sort(value: SortOptions) {
  //   const option = {
  //     relevant: 0,
  //     newest: 1,
  //     all: 2,
  //   }[value];
  //
  //   this.current = this.page
  //     .locator("xpath=//div[@role='menuitem']")
  //     .nth(option);
  // }

  private sort(value?: MessagePaths) {
    this.current = this.page.locator("xpath=//div[@role='menuitem']");

    if (value !== undefined) {
      this.current = this.current.getByText(this.intl(value), { exact: true });
    }
  }
}
