import { expect, test, describe } from "bun:test";
import { isValidEmail, escapeHtml } from "./validation";

describe("validation utils", () => {
  describe("isValidEmail", () => {
    test("should return true for valid emails", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name+tag@example.co.uk")).toBe(true);
      expect(isValidEmail("user_name@example.org")).toBe(true);
    });

    test("should return false for invalid emails", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("test@.com")).toBe(false);
      expect(isValidEmail("test@example.")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@example")).toBe(false);
      expect(isValidEmail("test@example.c")).toBe(false); // TLD must be at least 2 chars
      expect(isValidEmail("test@example..com")).toBe(false); // Consecutive dots
    });
  });

  describe("escapeHtml", () => {
    test("should escape unsafe HTML characters", () => {
      const unsafe = '<script>alert("XSS & testing\'s!");</script>';
      const safe = '&lt;script&gt;alert(&quot;XSS &amp; testing&#039;s!&quot;);&lt;/script&gt;';
      expect(escapeHtml(unsafe)).toBe(safe);
    });

    test("should not alter safe strings", () => {
      expect(escapeHtml("Hello World")).toBe("Hello World");
      expect(escapeHtml("12345")).toBe("12345");
    });
  });
});
