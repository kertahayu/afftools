import { Cookie, Locator, Page } from "@playwright/test";

type ObjectCookie = Required<Pick<Partial<Cookie>, "name" | "value">>;
type CookieParams = ObjectCookie[] | string;

export abstract class Base {
  private readonly url = new URL("https://facebook.com");

  protected current!: Locator;
  protected readonly page: Page;
  protected readonly cookie: CookieParams;

  constructor(page: Page, cookie: CookieParams) {
    this.page = page;
    this.cookie = cookie;
  }

  public async open(path?: string) {
    await this.authenticated();
    // await this.disabledMedia();
    await this.page.goto(new URL(path ?? "", this.url).href);

    await this.page.waitForLoadState("load");
  }

  private async authenticated() {
    const authenticate = await this.page
      .context()
      .cookies()
      .then((cookies) => cookies.find((c) => c.name === "c_user"));

    if (!authenticate) {
      await this.setCookie(this.cookie);
    }
  }

  protected async setCookie(cookie: CookieParams) {
    let objectCookie: ObjectCookie[] = [];

    if (typeof cookie === "string") {
      objectCookie = cookie.split(";").map((item) => {
        const [name, value] = item.split("=");
        return {
          name,
          value,
          domain: `.${this.url.hostname}`,
          path: "/",
        };
      });
    } else {
      objectCookie = cookie;
    }

    await this.page.context().addCookies(objectCookie);
  }

  protected async getLink() {
    let link: string;

    try {
      link = await this.current.evaluate((node) => node.href);
    } catch {
      throw new Error("Kemungkinan nested link, coba gunakan nth atau first");
    }

    return link;
  }

  protected async media() {
    // Menggunakan wildcard '**/*' untuk memantau semua request
    await this.page.context().route("**/*", async (route) => {
      const exclude: string[] = ["image", "media", "fetch"];
      const resourceType = route.request().resourceType();

      if (exclude.includes(resourceType)) {
        await route.abort();
      } else {
        await route.continue();
      }
    });
  }

  protected async remove() {
    await this.current.evaluate(async (node) => await node.replaceChildren());
  }
}
