import { Base } from "../base";

type SectionOptions = "banner" | "navigation" | "content";
type ContentOptions = "aside" | "main";
type PostOptions = "owner" | "content" | "interaction";
type MainOptions = "filter" | "posts";

export class FacebookProfilePage extends Base {
  private get root() {
    return this.page.locator("xpath=//div[@role='main']");
  }

  protected section(value?: SectionOptions) {
    // const options = {
    //   banner: 0,
    //   // undefined: 1,
    //   navigation: 2,
    //   content: 3,
    // }[value];

    // this.current = this.root.locator(`xpath=./div`).nth(options);
    this.current = this.root.locator(`xpath=./div`);

    return {
      banner: this.banner.bind(this),
      content: this.content.bind(this),
      remove: this.remove.bind(this),
    } as const;
  }

  private banner() {
    this.current = this.current.nth(0);

    return {
      remove: this.remove.bind(this),
    };
  }

  private content(value?: ContentOptions) {
    // const option = {
    //   aside: 0,
    //   main: 1,
    // }[value];

    this.current = this.current
      .nth(1)
      .locator("xpath=./div/div")
      .last()
      .locator("xpath=./div/div");

    return {
      aside: this.aside.bind(this),
      main: this.main.bind(this),
      remove: this.remove.bind(this),
    } as const;
  }

  private aside() {
    this.current = this.current.nth(0);
    return {
      remove: this.remove.bind(this),
    };
  }

  private main(value?: MainOptions) {
    const option = {
      filter: 0,
      posts: 1,
    }[value];

    this.current = this.current.locator("xpath=./div").nth(option);

    return Object.assign(this.current, {
      posts: this.posts.bind(this),
      remove: this.remove.bind(this),
    });
  }

  /**
   * Get the posts or post
   */
  private posts(index?: number) {
    this.current = this.current.locator(
      "xpath=./div[not(preceding-sibling::div[@class='']) and count(node()) > 0]" // cari div sodara yang memiliki class kosng dan yang memiliki anak
    );

    if (typeof index === "number") {
      this.current = this.current.nth(index);
    }
  }

  /**
   * The post
   */
  post(value: PostOptions) {
    const option = {
      // undefined: 0,
      owner: 1,
      content: 2,
      interaction: 3,
    }[value];

    const container = this.current.locator(
      "xpath=.//div[div[1][not(node()) or normalize-space()='']]" // cara anak ke 2
    );

    const wrapper = container.locator(
      "xpath=./div/div/div[count(div)=4]" // cari anak ke 3 yang memiliki 4 anak
    );

    const list = wrapper.locator("xpath=./div");

    this.current = list.nth(option);

    return this.current;
  }
}
