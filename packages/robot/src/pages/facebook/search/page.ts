import { canInstallNxConsoleForEditor } from "nx/src/native";
import { Base } from "../base";

type FilterOptions =
  | "all"
  | "people"
  | "reels"
  | "marketplace"
  | "page"
  | "group";

type FilterAllOptions = "new" | "viewed" | "date" | "from" | "location";

type PostOptions = "owner" | "content" | "interaction";

export class FacebookSearchPage extends Base {
  /**
   * FIX: Ambil dari kedua kemungkinan role tersebut,
   */
  private get root() {
    return this.page.locator("xpath=//div[@role='main']/..");
  }

  /**
   * FIX: Pilih sidebar berdasarkan role tersebut
   */
  private get region() {
    return this.page.locator("xpath=.//div[@role='region']");
  }

  /**
   * FIX: Pilih sidebar berdasarkan role tersebut
   */

  private get main() {
    return this.page.locator("xpath=//div[@role='main']");
  }

  protected sidebar() {
    return this.region.locator("xpath=.//div[@role='list']");
  }

  protected content() {
    this.current = this.main.locator("xpath=.//div[@role='feed']");

    return {
      posts: this.posts.bind(this),
    };
  }

  private posts(index?: number) {
    this.current = this.current.locator("xpath=./div");

    if (typeof index === "number") {
      this.current = this.current.nth(index);
    }
  }

  protected filter(value: FilterOptions) {
    const option = {
      all: 0,
      people: 1,
      reels: 2,
      marketplace: 3,
      page: 4,
      group: 5,
      // undefined: 6
    }[value];

    this.current = this.sidebar().locator("xpath=./div").nth(option);

    return {
      all: this.filterAll.bind(this),
    };
  }

  private filterAll(value: FilterAllOptions) {
    const option = {
      new: 0,
      viewed: 1,
      date: 2,
      from: 3,
      location: 4,
    }[value];

    this.current = this.current.locator("xpath=./div[2]/div").nth(option);

    this.current = this.current.locator("xpath=./div/div[2]/div");

    return this.current;
  }

  protected post(value: PostOptions) {
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
