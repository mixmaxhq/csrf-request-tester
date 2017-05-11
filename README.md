# csrf-request-tester

This project explores ways to prevent CSRF attacks [using request headers](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Verifying_Same_Origin_with_Standard_Headers).

## Installation

```sh
yarn
```

## Usage

```sh
yarn test
```

This starts three webservers, "Alice", "Bob", and "Eve":

  * Alice is your main application, running on http://localhost:9997.
  * Bob is a trusted service, running on http://localhost:9998.
  * Eve is an untrusted service, running on http://localhost:9999.

Open the services in your browser. Examine the server logs triggered by loading the services as well
as by clicking the buttons on their pages.

### Goals

Your overall goal is to _preserve same-origin access by Alice_ while _enabling CORS access by Bob_ and
_preventing CSRF attacks by Eve_.

That's a mouthful. First, some terminology:

* a request _succeeds_ if it receives an HTTP 200. If this request was made by the frontend, there should
additionally be no Access-Control-Allow-Origin errors in the console.
* a request _fails_ if it receives an HTTP 403.

Now let's break the overall goal into smaller goals:

1. All API calls made by Alice's frontend should succeed.
2. All API calls made by Bob's frontend should succeed. (Hint: apply [cors](https://github.com/expressjs/cors)
to Alice's APIs).
3. All API calls made by Eve's frontend should fail. (Hint: apply [cors-gate](https://github.com/mixmaxhq/cors-gate)
to Alice's APIs. It may not properly handle GET requests… see the caveats below.)
4. The POST call made by Alice's backend should succeed. (Hint: set the `Origin` header.)
5. The POST call made by Bob's backend should succeed. (Hint: set the `Origin` header.)
6. Make sure that you continue to satisfy the above goals when HTTPS is enabled, in case the browser
applies the Origin header differently, particularly in conjunction with `Referrer-Policy: no-referrer;`
You will need to make some modifications to this harness to enable that.
7. Make sure that neither Chrome nor Safari nor Firefox only expose referrer information over HTTPS
(if ever) and never leak referrer paths.

#### Caveats

Firefox does not set the `Origin` header [on same-origin requests](http://stackoverflow.com/a/15514049/495611)
nor on form POSTs (possibly tracked by https://bugzilla.mozilla.org/show_bug.cgi?id=446344). So, to
accomplish goals 1 and to in Firefox, we'll instead need to check the Referer header. But to accomplish
goal 7, you'll need to set different `Referrer-Policy` headers and [meta referrer](https://wiki.whatwg.org/wiki/Meta_referrer)
elements in the different browsers.

It is acceptable for GET requests from Eve's frontend to partially fail by returning 200s, so long
as they fail CORS (with Access-Control-Allow-Origin errors in the console), and the POST requests from
Eve's frontend completely fail.

It is acceptable for your solution to goals 4 and 5 to allow the POST call made by _Eve's_ backend
to succeed too. Preventing server-side request forgery is out of scope for this exercise (that can
be handled using server-to-server authentication).

#### Bonus

Document your solution in the form of automated tests on cors-gate's repo.
