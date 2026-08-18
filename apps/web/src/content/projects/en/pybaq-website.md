---
title: "PyBAQ Website"
excerpt: "Open-source contributions to the Python Barranquilla community website."
image: "@assets/img/pybaq/contribuir-pybaq.png"
role: "Front-End Developer, Maintainer"
responsibilities: "Maintenance of the community website, Meetup event automation scripts, CI/CD pipeline configuration"
website: https://pybaq.co
tags:
  - python
  - javascript
  - opensource
  - jamstack
  - dev
translationKey: pybaq-website
priority: 90
---

The [Python Barranquilla website](https://pybaq.co) is an open-source project managed by the community
under the [PyBAQ GitHub organisation](https://github.com/pybaq). As a maintainer I have contributed
across several technical areas over the years.

## Event automation

The most significant contribution has been designing and implementing a pipeline that keeps the events
section of the website up to date automatically. The script queries the Meetup API via GraphQL,
normalises the response and generates the necessary content files so that past and upcoming events
are always reflected on the site without manual intervention.

- Built the initial GraphQL query script (`graphql.py`) to fetch event data.
- Added a GitHub Actions workflow that runs on a schedule and commits the generated files.
- Iterated on environment configuration, dependency management and edge-case handling across several
  releases (2024–2025).

## CI/CD and developer experience

- Upgraded the test-E2E and deployment GitHub Actions workflows to current action versions.
- Configured a dev container so contributors can start working with a single click in Codespaces or
  VS Code Remote Containers.

## Content and styling

- Recovered and formatted historical events from 2019 and 2020 to complete the archive.
- Introduced blockquote-based styling for "time-travel" retrospective posts.
- Updated member and ally data (profiles, LinkedIn links, sponsor information).

All contributions are auditable at [github.com/PyBAQ/website](https://github.com/PyBAQ/website).
