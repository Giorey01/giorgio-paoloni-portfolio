import { expect, test, describe } from "bun:test";
import React from "react";
import { render } from "@testing-library/react";
import { mock } from "bun:test";
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import PostCard from "./postcard";

GlobalRegistrator.register();

// Mock next/image to avoid URL resolution issues in testing environment
mock.module("next/image", () => {
  return {
    default: function MockImage(props: any) {
      const { fill, blurDataURL, ...rest } = props;
      return <img {...rest} />;
    }
  };
});

describe("PostCard Component", () => {
  const mockPost = {
    title: "Test_Post_Title",
    date: "12 Oct 2023",
    desc: "This is a description for the test post.",
    thumbnail: "https://example.com/test-image.jpg",
    slug: "test-post-slug",
  };

  test("renders post data correctly", () => {
    const { getByText, getByAltText, container } = render(
      <PostCard post={mockPost} />
    );

    // Title should have underscores replaced with spaces
    expect(getByText("Test Post Title")).toBeTruthy();

    // Date should be rendered
    expect(getByText("12 Oct 2023")).toBeTruthy();

    // Description should be rendered
    expect(getByText("This is a description for the test post.")).toBeTruthy();

    // Image should have correct alt text
    const image = getByAltText("Thumbnail for article: Test_Post_Title");
    expect(image).toBeTruthy();
  });

  test("contains correct link to the blog post", () => {
    const { container } = render(<PostCard post={mockPost} />);

    // The outermost element should be a Link (rendered as 'a' tag in DOM)
    // pointing to `/blog/${post.slug}`
    const linkElement = container.querySelector("a");
    expect(linkElement).toBeTruthy();
    expect(linkElement?.getAttribute("href")).toBe("/blog/test-post-slug");
  });
});
