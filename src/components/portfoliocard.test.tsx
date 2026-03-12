import { expect, test, describe, mock, afterEach } from "bun:test";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";

// Mock next/image
mock.module("next/image", () => {
  return {
    default: ({ blurDataURL, ...props }: any) => {
      // eslint-disable-next-line @next/next/no-img-element
      return <img {...props} data-blurdataurl={blurDataURL} />;
    },
  };
});

// Mock next/link
mock.module("next/link", () => {
  return {
    default: ({ children, href, ...props }: any) => {
      return (
        <a href={href} {...props}>
          {children}
        </a>
      );
    },
  };
});

// Import component after mocks
import PortfolioCard from "./portfoliocard";

describe("PortfolioCard", () => {
  afterEach(() => {
    cleanup();
  });

  test("renders correctly with valid props", () => {
    render(
      <PortfolioCard
        folderKey="Portfolio/MyAlbum/"
        coverImageUrl="/test-image.jpg"
        blurDataURL="data:image/png;base64,test"
      />
    );

    // Assert Image renders correctly
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "MyAlbum");

    // Assert Link renders correctly with derived href
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/portfolio/myalbum");

    // Assert title text renders correctly
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("MyAlbum");
  });

  test("handles empty alt text derivation correctly", () => {
    render(
      <PortfolioCard
        folderKey=""
        coverImageUrl="/test-image.jpg"
        blurDataURL="data:image/png;base64,test"
      />
    );

    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "Portfolio image");

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveTextContent("Portfolio image");
  });

  test("constructs href correctly with nested folders", () => {
    render(
      <PortfolioCard
        folderKey="Portfolio/2023/Summer/Vacation/"
        coverImageUrl="/test-image.jpg"
        blurDataURL="data:image/png;base64,test"
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/portfolio/2023/summer/vacation");

    // Alt text should be the last non-empty segment
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveTextContent("Vacation");
  });

  test("handles missing trailing slash in folderKey", () => {
    render(
      <PortfolioCard
        folderKey="Portfolio/MyAlbum"
        coverImageUrl="/test-image.jpg"
        blurDataURL="data:image/png;base64,test"
      />
    );

    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/portfolio/myalbum");

    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toHaveTextContent("MyAlbum");
  });
});
