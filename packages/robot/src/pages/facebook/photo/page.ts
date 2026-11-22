import { Base, MessagePaths } from "../base";

export abstract class FacebookPhotoPage extends Base {
  private root() {
    return this.page.locator(
      "xpath=//div[@role='main' or @role='complementary']/.."
    );
  }

  protected section() {
    this.current = this.root().locator(`xpath=./div`);

    return {
      main: this.main.bind(this),
      complementary: this.complementary.bind(this),
      remove: this.remove.bind(this),
    };
  }

  private main() {
    this.current = this.current.nth(0);

    return {
      remove: this.remove.bind(this),
    };
  }

  private complementary() {
    this.current = this.current.nth(1).locator("xpath=./div/div/div/div/div");

    return {
      // caption: this.caption.bind(this),
      interaction: this.complementaryInteraction.bind(this),
      comments: this.complementaryComments.bind(this),
      remove: this.remove.bind(this),
    };
  }

  private complementaryInteraction() {
    this.current = this.current.nth(1);

    return {
      count: this.complementaryInteractionCommentscount.bind(this),
    };
  }

  private complementaryInteractionCommentscount() {
    this.current = this.current.locator("xpath=./div/div/div/div");

    return {
      like: this.complementaryInteractionLikePice.bind(this),
      comment: this.complementaryInteractionCommentPice.bind(this), // ini salah sepertinya
      share: this.complementaryInteractionSharePice.bind(this),
      who: this.complementaryInteractionWhoPice.bind(this),
    };
  }

  private complementaryInteractionLikePice() {
    this.current = this.current.nth(0);
  }

  private complementaryInteractionCommentPice() {
    this.current = this.current.nth(1);
  }

  private complementaryInteractionSharePice() {
    this.current = this.current.nth(2);
  }

  private complementaryInteractionWhoPice() {
    this.current = this.current.nth(2);
  }

  private complementaryComments() {
    this.current = this.current.nth(2);

    return {
      sort: this.complementaryCommentsSort.bind(this),
      comment: this.complementaryCommentsComment.bind(this),
      loadmore: this.complementaryCommentsLoadmore.bind(this),
    };
  }

  private complementaryCommentsSort(value?: MessagePaths) {
    this.current = this.current.locator("xpath=./div/div/div").nth(0);

    if (value !== undefined) {
      this.current = this.page.locator("xpath=//div[@role='menuitem']");
      this.current = this.current.getByText(this.intl(value), { exact: true });
    }
  }

  private complementaryCommentsComment(index: number) {
    this.current = this.current.locator("xpath=./div/div").nth(1 + index);

    return {
      article: this.complementaryCommentsCommentArticle.bind(this),
    };
  }

  private complementaryCommentsLoadmore() {
    this.current = this.current
      .locator("xpath=./div/div")
      .nth(-2)
      .locator("xpath=./div")
      .first();
  }

  private complementaryCommentsCommentArticle() {
    this.current = this.current.locator("xpath=.//div[@role='article']");

    return {
      // profile:
      message: this.complementaryCommentsCommentArticleMessage.bind(this),
    };
  }

  private complementaryCommentsCommentArticleMessage() {
    this.current = this.current.locator("xpath=./div").last();

    return {
      text: this.complementaryCommentsCommentArticleMessageText.bind(this),
      action: this.complementaryCommentsCommentArticelMessageAction.bind(this),
    };
  }

  private complementaryCommentsCommentArticleMessageText() {
    this.current = this.current.locator("xpath=./div").first();

    this.current = this.current
      .locator("xpath=./div")
      .first()
      .locator("xpath=./div/div")
      .first()
      .locator("xpath=./div")
      .first();

    return {
      name: this.complementaryCommentsCommentArticleMessageTextName.bind(this),
      time: this.complementaryCommentsCommentArticleMessageTextTime.bind(this),
    };
  }

  private complementaryCommentsCommentArticleMessageTextName() {
    this.current = this.current.locator("xpath=./div").first();
  }

  private complementaryCommentsCommentArticleMessageTextTime() {
    this.current = this.current
      .locator("xpath=./div")
      .last()
      .locator("xpath=./div/div")
      .last();
  }

  private complementaryCommentsCommentArticelMessageAction() {
    this.current = this.current.locator("xpath=./div").last();

    return {
      like: this.complementaryCommentsCommentArticleMessageActionLike.bind(
        this
      ),
      reply:
        this.complementaryCommentsCommentArticleMessageActionComment.bind(this),
      share:
        this.complementaryCommentsCommentArticleMessageActionShare.bind(this),
    };
  }

  private complementaryCommentsCommentArticleMessageActionLike() {
    this.current = this.current.locator("xpath=./div/div").nth(0);
  }

  private complementaryCommentsCommentArticleMessageActionComment() {
    this.current = this.current
      .locator("xpath=.//li[@role='presentation']")
      .first();
  }

  private complementaryCommentsCommentArticleMessageActionShare() {
    this.current = this.current.locator("xpath=./div/div").nth(2);
  }
}
