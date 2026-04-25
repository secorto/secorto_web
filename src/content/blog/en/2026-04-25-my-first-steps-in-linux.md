---
title: My first steps in Linux
date: 2026-04-25
tags:
  - linux
  - summary
  - experiences
excerpt: A concise personal roundup of lessons learned using several distributions and desktop environments.
gallery:
  - image: "@assets/img/post/chakra/openbox.png"
    alt: "Openbox — screenshot"
  - image: "@assets/img/post/chakra/lxde.png"
    alt: "LXDE — screenshot"
  - image: "@assets/img/post/chakra/kde.png"
    alt: "KDE — screenshot"
translationKey: 'mis-primeros-pasos-en-linux'
---

Over the years I wrote tutorials and notes about different distributions and desktop environments. This post gathers those experiences into practical lessons and reflections: what worked, what frustrated me, and what I still use.

## Slitaz

- Main lesson: mini-distros teach you to prioritize the essentials; great for very limited hardware
- Concepts learned: `tazpkg` package manager, flavors (loram), running from RAM, included tools (LightTPD, mplayer, GParted)
- Typical issues: graphics compatibility on some netbooks (solutions: use Xvesa or install Intel drivers and adjust resolutions)
- Tip: minimal distros are excellent for learning hardware diagnosis and minimal package management

## Chakra / Arch-derived (KDE on a netbook)

- Main lesson: `pacman` and the rolling philosophy are powerful, but KDE can be demanding on modest machines
- What I learned: how to reduce effects, choose a compositor (XRender vs OpenGL) and optimize KDE for better performance
- Practical value: learning to balance appearance vs usability and when to prefer lightweight desktops (Openbox, LXDE)

## Openbox and lightweight environments

- Main lesson: separate the compositor/window manager from utilities (Nitrogen for wallpapers, Conky for info, pcmanfm as file manager)
- Practical takeaway: with the right combination, old machines regain a lot of life and flexibility
- Recommendation: use modular configurations to understand each part of the desktop

## General observations

- The GNU/Linux community is a key resource: forums and wikis sped up problem solving
- Cross-cutting lesson: each experiment taught me to diagnose hardware, read logs, and prefer simple solutions when possible
- Instead of repeating long steps, this post prioritizes the lessons and links to the original posts for technical detail

## References and original posts (original in Spanish)

- Slitaz on Acer Aspire One — <http://scot3004.blogspot.com/2010/08/slitaz-gnulinux-acer-aspire-one.html> (original in Spanish)
- Windows or Linux — <http://scot3004.blogspot.com/2010/10/windows-o-linux.html> (original in Spanish)
- Openbox — <http://scot3004.blogspot.com/2011/02/openbox.html> (original in Spanish)
- Screenshots of my Chakra — <http://scot3004.blogspot.com/2011/03/screenshoots-de-mi-chakra-bueno-en.html> (original in Spanish)
- KDE 4.6 netbook (Chakra) — <http://scot3004.blogspot.com/2011/06/kde-46-netbook.html> (original in Spanish)
