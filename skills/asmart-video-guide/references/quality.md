# Check the exported result

Inspect representative frames and the critical continuous segments of the final file: start, key action, result, important branches and transitions. A contact sheet alone does not verify timing.

Compare UI text and actions with the discovered product. Check crops, readable type on the target device and overlays that could cover controls. Remove dead time without hiding necessary actions or implying success when a task is incomplete.

Listen to audio when present. Check intelligibility, clipping, sudden levels and synchronization. If listening is unavailable, report that limitation rather than claiming auditory review. Silence is a deliberate valid choice, not the default for all future videos.

Run `python3 scripts/verify_video.py VIDEO --output REPORT` from the skill directory. Optional expected duration is used only when specified in the actual brief. Metadata checks are separate from visual, privacy, factual and auditory review.

Reopen the editable project and confirm assets resolve. Verify subtitle timing before delivery. Report actual duration, size, format, audio status and limitations. Corrections should not silently add new content, a voice, music, functionality or publication.

For a web module, also execute the browser, compressed-audio, packaging and download checks in [web-module.md](web-module.md). Do not treat an existing MP4 as matching a revised web presentation without re-exporting the affected video.
