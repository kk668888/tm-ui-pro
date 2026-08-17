## Purpose

Provides a segmented MAC address input control that accepts only hexadecimal digits, normalizes them to uppercase with zero-padded segments, and emits a canonical string only when all six segments are complete. Pairs with TmInputIp for network form entries where IP and MAC address fields co-occur.

## Requirements

### Requirement: Segmented hex-address input structure

TmInputMac SHALL render a single logical MAC address field as six input segments separated by a configurable separator, each segment accepting one or two hexadecimal digits (0-9, A-F) regardless of the case they are typed in.

#### Scenario: Six segments separated by colon

- **WHEN** the component renders with default configuration
- **THEN** exactly six segment inputs are shown, each separated by the default separator `:`

#### Scenario: Segment accepts lowercase hex

- **WHEN** the user types a lowercase letter from `a` to `f` into a segment
- **THEN** the segment displays the letter in uppercase (`A` to `F`)

#### Scenario: Non-hexadecimal character is rejected

- **WHEN** the user types a character outside the hexadecimal alphabet (such as `g`, `z`, or a symbol) into a segment
- **THEN** the character is not inserted and the segment value is unchanged

### Requirement: Auto-advance and cursor navigation across segments

Typing the second digit of a segment SHALL move focus to the next segment; the user MAY type the separator key to jump to the next segment without inserting a character; BACKSPACE at the start of a segment SHALL jump back to the previous segment and delete its trailing digit; LEFT/RIGHT arrow keys SHALL move focus to the adjacent segment when pressed at a segment boundary.

#### Scenario: Full segment auto-advances

- **WHEN** the user types a second digit into a segment that already holds one digit
- **THEN** focus moves to the next segment and the completed segment keeps its two-digit value

#### Scenario: Separator key jumps to next segment

- **WHEN** the user presses the configured separator key inside a segment
- **THEN** no character is inserted and focus moves to the next segment

#### Scenario: Backspace at segment start jumps back

- **WHEN** the user presses BACKSPACE while the cursor is at position zero of a non-first segment
- **THEN** focus moves to the previous segment and the trailing digit of that segment is removed

#### Scenario: Arrow keys cross segment boundaries

- **WHEN** the user presses LEFT at the start of a segment or RIGHT at the end of a segment
- **THEN** focus moves to the adjacent segment on that side

### Requirement: Zero-padding normalization on blur

When the component loses focus, any segment holding a single hexadecimal digit SHALL be padded with a leading `0` to become two digits, and all segment values SHALL be normalized to uppercase. Normalization SHALL only be performed on the blur event, never mid-typing.

#### Scenario: Single-digit segment padded on blur

- **WHEN** the user fills six segments with values such as `A:B:C:D:E:F` and then blurs the field
- **THEN** the segments display `0A:0B:0C:0D:0E:0F`

#### Scenario: Typing is not normalized mid-keystroke

- **WHEN** the user types a single lowercase hex digit such as `b` into a segment while the field is focused
- **THEN** the segment shows `B` (uppercase) and does not yet gain a leading `0` until the field blurs

### Requirement: v-model emits canonical string only when complete

The component SHALL expose a `modelValue` string prop. While any segment is empty or holds fewer than two digits, the component SHALL emit `''`; once blur normalization has made all six segments exactly two hexadecimal digits, the component SHALL emit the canonical joined string in uppercase, preserving any zero padding.

#### Scenario: Incomplete address emits empty string

- **WHEN** fewer than six complete segments exist and the user edits a segment
- **THEN** the emitted `update:modelValue` value is `''`

#### Scenario: Complete address emits canonical string after blur

- **WHEN** all six segments hold single digits and the field blurs
- **THEN** the emitted value is the zero-padded uppercase joined string, for example `0A:0B:0C:0D:0E:0F`

#### Scenario: Leading zeros are preserved

- **WHEN** a programmed value such as `00:11:22:33:44:55` is provided
- **THEN** the trailing `00`-style zeros render verbatim and the emitted value matches the input byte-for-byte

### Requirement: Configurable separator

The component SHALL accept a `separator` prop that may be `':'` or `'-'`, defaulting to `':'`. The separator SHALL be used uniformly for both joining segments into the emitted value and parsing pasted content.

#### Scenario: Custom dash separator

- **WHEN** the component is configured with `separator="-"` and all six segments complete
- **THEN** the emitted value uses dashes, for example `0A-0B-0C-0D-0E-0F`

#### Scenario: Pasting mismatched separator is rejected

- **WHEN** the component uses `:` and the user pastes an address joined with `-`
- **THEN** the paste is rejected and the existing segment values are unchanged

### Requirement: Paste distribution

Pasting content into the field SHALL parse the clipboard text into segments when it matches the configured separator, or treat a contiguous run of hexadecimal digits as a greedy distribution across segments when it contains no separator, allowing at most two digits per segment and reserving at least one digit for each remaining segment. Paste SHALL be rejected entirely if the resulting segmentation is invalid.

#### Scenario: Paste full address with separator

- **WHEN** the user pastes `1A:2B:3C:4D:5E:6F` into the field
- **THEN** the six segments display `1A`, `2B`, `3C`, `4D`, `5E`, `6F` and focus lands on the last segment

#### Scenario: Paste contiguous hex is greedily distributed

- **WHEN** the user pastes a run such as `AABBCCDDEEFF`
- **THEN** the segments are distributed two digits each as `AA`, `BB`, `CC`, `DD`, `EE`, `FF`

#### Scenario: Paste with invalid content is rejected

- **WHEN** the user pastes a string containing a non-hexadecimal character or a segment longer than two digits
- **THEN** the paste is rejected and existing segment values are unchanged

### Requirement: Visual consistency with antd form controls

The component SHALL render its own self-contained shell consistent with antd Input sizing (small/middle/large), with a focus ring on the shell, an error state, a disabled state, and a readonly state. Visual tokens SHALL resolve from antd CSS variables when available and fall back to antd default colors otherwise.

#### Scenario: Sizing variants

- **WHEN** the component is rendered with `size="small"`, `size="middle"`, or `size="large"`
- **THEN** the shell height and padding match the corresponding antd Input variant

#### Scenario: Focus ring on shell

- **WHEN** any segment input receives focus
- **THEN** the shell displays a focus ring and does not rely on a JavaScript-driven focus class

#### Scenario: Error state for invalid programmed value

- **WHEN** a programmed value contains a segment that is not two valid hex digits
- **THEN** the shell shows the error state and the offending segment is visually marked

### Requirement: Form context propagation

When used inside a form context, the component SHALL inherit `disabled` and `readonly` state from the nearest ancestor form control context, and SHALL allow explicitly passed props to override the inherited values.

#### Scenario: Inherits disabled from form

- **WHEN** the component is placed inside a disabled form and no explicit `disabled` prop is passed
- **THEN** all six segment inputs are disabled and uneditable

#### Scenario: Explicit prop overrides inherited readonly

- **WHEN** the form is readonly but the component passes `readonly="false"`
- **THEN** the segment inputs remain editable

### Requirement: Focus methods

The component SHALL expose `focus` and `blur` methods. `focus` SHALL place focus on the first empty segment, or on the last segment when all segments are filled. `blur` SHALL remove focus from the focused segment.

#### Scenario: Focus lands on first empty segment

- **WHEN** the component is given a value with the first two segments filled and `focus()` is called
- **THEN** focus lands on the third segment with the cursor at the start

#### Scenario: Focus lands on last segment when full

- **WHEN** all six segments are complete and `focus()` is called
- **THEN** focus lands on the last segment

#### Scenario: Blur removes focus

- **WHEN** a segment is focused and `blur()` is called
- **THEN** the focused segment loses focus