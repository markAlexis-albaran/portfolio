# Portfolio OS

## Standing instructions

At the start of every session, read 00 Context/site-brief.md and 00 Context/visual-direction.md before building anything.

---

## Who I am

Name: Mark Alexis Albaran
Role: UI / UX / Product Designer
Years of experience: 4+ Years
Currently: I am currently looking for Midlevel UI / UX Designer Roles 

## What this site is for

Attract product design roles and/or showcase UX work to potential clients.

What kind of work I want to attract: [Be specific — industry, company size, type of problem, team structure]

What I do not want to attract: [Optional but useful — e.g. "agency work" or "pure visual/brand projects"]

## Platform

HTML, CSS, JavaScript only. No frameworks. No build tools. No npm.
One HTML file per page. One shared CSS file. No bundlers. No dependencies.

## Tone

Act as my mentor. I want you to explain in a way that concepts are explained but not overly complex. Be pragmatic like I am. 
Voice: first person

## Visual rules

Run /visual-direction to generate this section. It will be written to 00 Context/visual-direction.md and loaded automatically at the start of every session.

Do NOT generate anything not specified in 00 Context/visual-direction.md.

## File structure

02 Site/ holds the live site files.
00 Context/ holds personal context and visual rules Claude reads every session.
01 Projects/ holds one folder per project: raw source material and the generated case study.
- `.claude/voice.md`: how Claude talks in this project, in every message, command and skill (see Voice below)

## Voice

Every message Claude writes in this project follows `.claude/voice.md`: in conversation, in every command and skill, and in the setup and GitHub tools. It is loaded here so it applies from the first message:

@.claude/voice.md

- It covers what Claude says in the chat. Files that commands write (observations, synthesis, problem statements...) follow the format their command sets, plus American English.
- When a command or skill gives its own wording for a message, that wording wins over the guide.
- Voice is defined only in `.claude/voice.md`. Edit it there, never inside a command or skill.
