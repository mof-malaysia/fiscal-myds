# Product

## Register

product

## Users

Two groups use services built with Fiscal MYDS, the Ministry of Finance (MOF) fork of the Malaysia Government Design System.

- **Citizens and businesses** dealing with MOF: checking obligations, applying, paying, tracking a submission. Many are older or not confident online. Money and government deadlines make these tasks stressful, so they arrive anxious and want certainty that they did it right.
- **MOF officers** who work in the same system all day: reviewing tables, processing forms, reading dashboards. Their problem is fatigue, not unfamiliarity. Long sessions in dense screens make eye strain and visual noise real costs.

The primary surfaces are service and task screens: forms, tables, dashboards, portals. Public agency pages exist but are secondary.

## Product Purpose

Fiscal MYDS is a component library, shipped as a shadcn registry, that MOF teams use to build their services. It exists so every MOF service feels like one trustworthy institution, and so teams spend their effort on the service, not on styling.

Success looks like: a citizen finishes a payment or application and feels sure it went through; an officer ends a day in a data table without feeling worn out; a team can build a new service that looks right without a designer.

## Brand Personality

**Calm, capable, humane.**

- **Calm:** quiet surfaces, nothing competing for attention, colour used only when it means something. The national MYDS colours stay bright and confident; calm comes from restraint, not from muting them. The interface lowers the stakes of a stressful task.
- **Capable:** precise and well-made. Alignment, spacing and states are exact, so the system feels like a competent institution handling your money.
- **Humane:** plain language in BM and English, readable sizes, reassurance at the moments that matter (submitting, paying, deleting). Never cold or bureaucratic.

The reference for craft is Linear: restraint, soft surfaces instead of outlines, a confident type hierarchy. That refinement is applied at sizes and contrast that work for older citizens.

## Anti-references

- **Generic Tailwind starter.** Every element outlined with a 1px grey border, boxes inside boxes, the same weight on everything. Fiscal MYDS keeps the national MYDS palette; the generic look came from the outlines and flat hierarchy, not the colours.
- **Old government portals.** Dense banners, crests and logos everywhere, gradients, tiny text, 2010-era layouts.
- **Flashy fintech.** Neon accents, dark gradient heroes, glassmorphism, crypto-app energy.
- **Stiff corporate banking.** Navy and gold, heavy serif headings, formal and distant.

## Design Principles

1. **Quiet by default, loud on purpose.** Most of the screen is calm neutrals. Colour, weight and motion are reserved for the primary action, the current state, and things the user must notice (errors, amounts, deadlines).
2. **Separate with space and surface, not lines.** Group with spacing and tonal backgrounds first. A border has to earn its place.
3. **Two densities, one language.** Comfortable density for citizen-facing services, compact density for officer tools. Same tokens, same components, same feel; only spacing and type size shift.
4. **Certainty at high-stakes moments.** Payments, submissions and destructive actions get clear confirmation, visible status, and plain reassurance. The user should never wonder whether something worked.
5. **Readable before refined.** When polish and legibility conflict, legibility wins: body text never drops below what an older citizen can read comfortably, and secondary text stays dark enough to read without effort.

## Accessibility & Inclusion

- **WCAG 2.2 AA minimum** across all components. Check each story in the Storybook a11y panel (axe); automated axe checks in the test runner and CI are planned but not in place yet.
- **Older citizens:** comfortable density uses 16px body text, generous touch targets (at least 44px for primary controls), high-contrast secondary text (no light-grey hint text), and plain-language copy.
- **Officers in long sessions:** compact density stays readable at 14px, avoids low-contrast text and visual noise, and keeps dark mode a first-class theme for eye comfort.
- **Bilingual BM/EN:** Malay strings run longer than English; components must hold both without truncating key information.
- Respect `prefers-reduced-motion`; never rely on colour alone to convey status.
