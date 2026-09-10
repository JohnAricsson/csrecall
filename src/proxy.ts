export { auth as proxy } from "@/auth";

export const config = {
  matcher: [
    "/((?!api/auth|login|reset-password|_next/static|_next/image|favicon.ico|icon.svg).*)",
  ],
};
