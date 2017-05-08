# csrf-request-tester

This project explores ways to prevent CSRF attacks [using request headers](https://www.owasp.org/index.php/Cross-Site_Request_Forgery_(CSRF)_Prevention_Cheat_Sheet#Verifying_Same_Origin_with_Standard_Headers).

## Installation

```sh
yarn
```

## Usage

```sh
yarn start
```

This starts three webservers, "Alice", "Bob", and "Eve":

  * Alice is your main application, running on http://localhost:9997.
  * Bob is a trusted service, running on http://localhost:9998.
  * Eve is an untrusted service, running on http://localhost:9998.

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
2. All API calls made by Bob's frontend should succeed. (Hint: apply [cors](https://github.com/expressjs/cors) to Alice's APIs).
3. All API calls made by Eve's frontend should fail. (Hint: apply [cors-gate](https://github.com/mixmaxhq/cors-gate) to Alice's APIs.)
4. The POST call made by Alice's backend should succeed. (Hint: set the `Origin` header.)
5. The POST call made by Bob's backend should succeed. (Hint: set the `Origin` header.)

It is acceptable for goals 1 and 2 to fail in Firefox as long as goal 3 is met in Firefox. This
would happen using https://github.com/mixmaxhq/cors-gate because Firefox does not set the `Origin`
header [on same-origin requests](http://stackoverflow.com/a/15514049/495611) and because Firefox
does not set the `Origin` header on form POSTs (possibly tracked by https://bugzilla.mozilla.org/show_bug.cgi?id=446344).
(It's acceptable for Firefox to break because we intend our application to be used from Chrome (and
I think that the proposed solution will work in Safari too).)

It is acceptable for your solution to goals 4 and 5 to allow the POST call made by _Eve's_ backend
to succeed too. Preventing server-side request forgery is out of scope for this exercise (that can
be handled using server-to-server authentication).
