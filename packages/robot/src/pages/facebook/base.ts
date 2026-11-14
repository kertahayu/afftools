import enFacebook from "@messages/en/facebook.json";
import idFacebook from "@messages/id/facebook.json";
import { Cookie, Locator, Page } from "@playwright/test";

type ObjectCookie = Required<Pick<Partial<Cookie>, "name" | "value">>;
type CookieParams = ObjectCookie[] | string;
type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

export type MessagePaths = PathImpl<typeof enFacebook, keyof typeof enFacebook>;

export abstract class Base {
  private readonly url = new URL("https://facebook.com");

  protected current!: Locator;
  protected readonly page: Page;
  protected readonly cookie: CookieParams;
  protected messages: typeof enFacebook;
  protected language: "en" | "id" = "id";

  constructor(page: Page, cookie: CookieParams) {
    this.page = page;
    this.cookie = cookie;
  }

  public async open(path: string, params?: URLSearchParams) {
    await this.authenticated();
    // await this.media();
    const url = new URL(path ?? "", this.url);
    if (params) {
      url.search = params.toString();
    }
    await this.page.goto(url.href);

    // await this.page.waitForLoadState("load"); // gatau ini error
    await this.waitForDomStable();

    const lang = await this.page.getAttribute("html", "lang");
    if (lang === "id" || lang === "en") {
      this.messages = { id: idFacebook, en: enFacebook }[lang];
    }
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
    await this.current.evaluate(async (node) => node.replaceChildren());
  }

  /**
   * FIX:
   */
  // protected async focus() {
  //   await this.current.evaluateHandle(() => {
  //     return document.activeElement;
  //   });
  // }

  protected async waitForDomStable(timeout = 10000, stableTime = 1000) {
    await this.page.waitForFunction(
      ({ stableTime }) => {
        return new Promise((resolve) => {
          let lastChange = Date.now();

          const observer = new MutationObserver(() => {
            lastChange = Date.now();
          });

          observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
          });

          const check = () => {
            if (Date.now() - lastChange >= stableTime) {
              observer.disconnect();
              resolve(true);
            } else {
              requestAnimationFrame(check);
            }
          };

          check();
        });
      },
      { stableTime },
      { timeout }
    );
  }

  public async lang() {
    return await this.page.getAttribute("html", "lang");
  }

  public intl(keyPath: MessagePaths): string {
    const keys = keyPath.split(".");
    let value: any = this.messages;

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        value = undefined;
        break;
      }
    }

    if (value === undefined || typeof value !== "string") {
      console.warn(
        `⚠️ Keypath "${keyPath}" tidak ditemukan atau bukan string di file JSON ${this.language}`
      );
      return keyPath;
    }

    return value;
  }
}
