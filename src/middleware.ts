import { NextRequest, NextResponse } from "next/server";
import { analytics } from "./utils/analytics";

export default async function middleware(req: NextRequest) {
  console.log(req);
  //check the page the user is trying to request access to. if its home page log m
  if (req.nextUrl.pathname === "/") {
    //track analytics events
    // console.log("TRACK!");
    try {
      //we invoke track wit a namespace and an event object
      analytics.track("pageview", {
        page: "/",
        country: req.geo?.country,
      });
    } catch (err) {
      //fail silently
      console.error(err);
    }
  }
  //run next middleware command
  return NextResponse.next();
}

//wen will d middleware function run, only wen its condition is confirmed by d marcher function.
export const matcher = {
  matcher: ["/"],
};
