import "@testing-library/jest-dom/jest-globals";
import React from "react";

jest.mock("next/link", () => {
  return function MockedLink({
    children,
    href,
    ...rest
  }: React.PropsWithChildren<{ href: string; [key: string]: unknown }>) {
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  };
});

jest.mock("next/image", () => {
  return function MockedImage(props: React.ComponentProps<"img"> & { priority?: boolean }) {
    const { src, alt, priority: _priority, ...rest } = props as { src: string; alt?: string; priority?: boolean };
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img src={src} alt={alt} {...rest} />;
  };
});
