# Time Gaps — User Test Script
**Feature:** Time Gaps (IntelliMagic)
**Prototype Link:** [INSERT HERE — Show: Prototype under extreme use case]
**Version:** Revised 8/13

---

## Background

Time Gaps is a feature in IntelliMagic (INTM). The feature addresses a problem where the chart currently renders three distinct data states as identical blank spaces, giving users no way to differentiate between them:

- **Filtered Data** — The user intentionally applied filters, excluding specific time or date periods.
- **Missing Data** — A system failure or ingestion error occurred; data was never recorded.
- **Zero Value** — The system was running, but the metric was zero.

**Problem Statement:** Because these three states look identical, users cannot determine which situation they are viewing — creating clarity and trust problems.

**Test Objectives:** Understand how users interpret the current Time Gaps design for both the graph visual and the text summary filter. Identify what needs to be prioritized, opportunities for improvement, and unmet needs within the prototypes.

---

## Target Participants

- IT Engineers
- Analysts (need to quickly spot anomalies or gaps)
- System Engineers
- Internal Review: Todd, Jean Marc

---

## Facilitator Notes

> **Before you begin:** Do not prime participants with what the design solves or what to look for. Let them interpret freely. Reserve directed tasks for after initial comprehension. Avoid closed-ended questions throughout — lean toward open-ended, exploratory prompts. If a participant starts going deep on something interesting, follow that thread before moving on.

---

## Session Structure

| # | Task | Focus |
|---|------|--------|
| 1 | Overall UI Comprehension | First impressions, mental model |
| 2 | Identify Time Gaps in Graph | Gap recognition + interpretation |
| 3 | Text Summary Comprehension | Readability + clarity of exclusions |
| 4 | Extreme Use Case | Design stress test + scalability |

---

## Task 1 — Overall UI Comprehension

**Goal:** Understand the participant's first impressions and mental model of the screen before directing them toward any specific feature.

**Setting the Scene:**
> "I'm going to show you a screen. Take as much time as you need. Just tell me what you see — what this screen is for, what stands out, and what you would do first if this were your own work environment."

**Show:** [Prototype screen]

**Observe (do not prompt):**
- What do they look at first?
- What do they ignore or skip?
- What language do they use to describe what they see?
- Do they notice the gaps without being directed?

**Follow-up Questions (open-ended, ask as natural conversation):**
- "Walk me through what you think this screen is for."
- "If you were using this in your day-to-day, what would you want to see here by default — and what could be hidden or optional?"
- "What's the most important piece of information on this screen to you?"
- "Are there any filter attributes you'd always want visible? What about ones you'd want tucked away?"
- "What feels like it belongs here, and what feels like it might be extra?"

---

## Task 2 — Identify Time Gaps in the Graph

**Goal:** Evaluate whether users can spot gaps, correctly interpret what they mean, and determine how quickly and naturally this happens.

**Setting the Scene:**
> "You are reviewing a data validation report for anomaly evaluation covering the last quarter. Take a look at the graph and tell me what you notice."

**Show:** [Same prototype — do not direct their attention]

**Before they interact — ask:**
> "Before you click or do anything — what would you expect to happen if you hovered over or selected one of those blank areas?"

**Observe (do not prompt):**
- Do they spot the gap unprompted?
- How long does it take?
- What do they describe or say out loud?
- What actions do they take (hover, click, scroll)?
- Do they express any confusion or uncertainty?

**Follow-up Questions:**
- "What does that gap mean to you?"
- "How does it compare to the rest of the chart?"
- "Is there anything about it that surprises you — or anything you expected to see that isn't there?"
- "What would you want to do next if you spotted this in your real work environment?"
- "If there were multiple different kinds of gaps, how would you want to tell them apart?"

---

## Task 3 — Text Summary Comprehension

**Goal:** Understand how users read, scan, and interpret the text summary — specifically the exclusion detail section.

**Setting the Scene:**
> "Now look at the text summary in the corner of the screen. Based on what's displayed, tell me what you understand about what was filtered and what exclusions happened."

**Show:** [Point to the text summary area — do not explain it]

**Before they read — ask:**
> "Before you read through it — what would you expect a text summary like this to tell you?"

**Observe (do not prompt):**
- Do they read the exclusion detail, or do they skip it?
- Do they read top to bottom, or scan for specific items?
- Where do they pause or re-read?
- Any visible confusion (furrowed brow, re-reads, silence)?

**Follow-up Questions:**
- "What does this tell you?"
- "Is there anything here that feels unnecessary or that you'd remove?"
- "Is there anything you expected to see that isn't here?"
- "How would you describe this section to a colleague who hasn't seen it?"
- "Is there anything that's harder to understand than it should be?"

---

## Task 4 — Extreme Use Case

**Goal:** Stress-test the design under high-volume exclusion conditions. Validate design choices for gap distinction and understand users' mental models at scale.

**Setting the Scene:**
> "Now imagine you're reviewing data validation reports — but this time there are thousands of exclusions across the time range. For example: data excluded Monday through Friday from 9am–2pm and 4pm–8pm, every third Tuesday, and Wednesdays from 7pm to midnight. Take a look at what's on screen."

**Show:** [Prototype — extreme use case view]

**Before they interact — ask:**
> "Before you look at it — what would you expect this kind of scenario to look like on a chart? What's your mental image?"

**Observe (do not prompt):**
- How do they react to the density of gaps?
- What mental model do they apply — do they think in terms of exclusions, missing data, or null values?
- Do they feel overwhelmed, or do they quickly orient themselves?
- What do they try to do — read, scan, zoom, filter?

**Follow-up Questions:**
- "Walk me through what you're seeing."
- "How would you typically handle something like this in your work?"
- "Is there anything here that makes it harder to understand what's going on?"
- "What would make this easier to work with at this scale?"
- "If you had to explain the difference between the different types of gaps to someone on your team, how would you do it based on what you see here?"

---

## Closing Questions

> Ask these at the end of every session, regardless of how the tasks went.

- "Is there anything you noticed during the session that you haven't had a chance to mention?"
- "If you could change one thing about what you saw today, what would it be?"
- "What, if anything, would make you trust this data more?"

---

## Post-Session Synthesis Guide

Use this after all sessions are complete.

**1. Pain points and frustrations**
- What moments caused confusion, hesitation, or negative reactions across participants?

**2. Unmet needs**
- What did participants expect to see or do that wasn't possible?

**3. Patterns across participants**
- Where did multiple participants behave the same way, use the same language, or hit the same stumbling blocks?

**4. Design direction**
- Based on synthesis, what should be prioritized, iterated, or reconsidered?
- What questions remain open that require another round of testing?

---

*Time Gaps User Test Script — Revised 8/13*
