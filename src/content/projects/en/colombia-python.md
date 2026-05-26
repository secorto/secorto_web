---
title: "Python Colombia Website"
excerpt: "Open-source contributions to the official Python Colombia community website."
role: "Contributor"
responsibilities: "Meetup event automation script, GitHub Actions workflows, dev container setup, content maintenance"
website: https://python.org.co
tags:
  - python
  - opensource
  - jamstack
  - dev
translationKey: colombia-python
image: "@assets/img/project/python-co.png"
priority: 60
---

[python.org.co](https://python.org.co) is the official site of the Python Colombia community, built
with [Lektor](https://www.getlektor.com/) and maintained collaboratively in the
[ColombiaPython/sitio-web](https://github.com/ColombiaPython/sitio-web) repository, where I appear
as one of 13 contributors.

## Meetup event automation (2023–2024)

The main contribution was developing a script that automatically synchronises the Meetup event data
with the Lektor content model:

- Implemented the event-update bot that pulls data from the Meetup platform and generates the
  corresponding Lektor content files (PR [#193](https://github.com/ColombiaPython/sitio-web/pull/193)).
- Updated the scheduled GitHub Actions workflow to keep the bot running reliably.
- Added an event blacklist to skip malformed entries that broke the build.

## Developer experience improvements (2023)

- Set up a dev container for GitHub Codespaces so contributors can work without local installation
  (PR [#190](https://github.com/ColombiaPython/sitio-web/pull/190)).
- Configured the deploy workflow for the `develop` branch
  (PR [#191](https://github.com/ColombiaPython/sitio-web/pull/191)).

## Content contributions (2023)

- Added a Discord link to the community navigation
  (PR [#189](https://github.com/ColombiaPython/sitio-web/pull/189)).
- Updated the events section with data up to August 2023
  (PR [#192](https://github.com/ColombiaPython/sitio-web/pull/192)).

All contributions are auditable at
[github.com/ColombiaPython/sitio-web](https://github.com/ColombiaPython/sitio-web).
