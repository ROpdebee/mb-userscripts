---
title: Re-record PollyJS HTTP recordings
labels: ci, tests
assignees: ROpdebee
---

This is a scheduled reminder to re-record the PollyJS HTTP recordings used in
the tests.

# Why?

We use HTTP recordings to ensure fast, reliable and deterministic test and
CI results. However, as upstream services change their HTTP responses, our test
data becomes outdated and our tests may not uncover actual problems. Therefore,
these recordings should be recreated periodically, and unfortunately we don't
have an automated setup for this yet.

# How?

1. Remove `tests/test-data/__recordings__`
2. Run the tests again (`npm t`)
3. Commit the changes in `tests/test-data/__recordings__`


Thank you!

_:robot: Beep boop, this issue was filed automatically because of a scheduled CI job._
