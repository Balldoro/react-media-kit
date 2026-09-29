---
"react-media-kit": patch
---

Fix `TimeDisplay.Toggle` rendering `data-elapsed-mode="false"` in remaining mode. The attribute is now removed instead, like every other state attribute, so `[data-elapsed-mode]` selectors only match elapsed mode
