# Typography Audit Plan

Completed typography work includes shared variants, spacing, bold, uppercase,
disabled styling, color shades, LinkText, web wrapper consolidation, and
attribution typography and positioning.

## Remaining Batches

1. Mobile link accessibility (completed)
   - Put accessibility label, hint, and disabled state on the Pressable.
   - Prevent rejected external-link promises from becoming unhandled.
   - Remove the redundant role from web native anchors.
2. Mobile settings cleanup
   - Replace raw Text and manual uppercase, alignment, shade, and theme colors.
3. Web label semantics
   - Use Label only for associated controls; use Text or Span for descriptions.
4. Web form labels
   - Reuse Label in Input, TextInput, TextArea, ColorInput, and NumberInput.
5. Mobile raw text migration
   - Migrate Tooltip, Button, Chip, NumberInput, Tabstrip, and ClockLabel.
6. Shared typography specifications
   - Share variant metrics and spacing precedence through ui/common.
7. Shared control text scale
   - Consolidate repeated form-control sizes; leave Button and Chip separate.
8. Native input fonts
   - Apply configured default and numeric fonts to native mobile inputs.
9. Residual production text
   - Migrate status, slider, fallback-page, dialog, and preset text where useful.
10. Typography correctness
    - Fix default web shadow, center alignment, mobile nowrap, shade docs, and mobile as.
11. Control accessibility
    - Add roles and state to mobile Checkbox, ToggleSwitch, and Dropdown.
12. Web implementation reduction
    - Simplify class generation and internal imports without speculative APIs.
13. Focused story coverage
    - Cover only changed typography and accessibility behavior.

## Constraints

- Preserve bespoke clock, attribution, neon-title, dialog, and toolbar sizing.
- Do not replace structural text inside composite controls without a concrete benefit.
- Do not add generic form-field or polymorphic typography abstractions prematurely.
- Update stories whenever a UI component changes.
