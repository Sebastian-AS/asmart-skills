# Portable setup for this distribution

The maintained source is this repository. Four first-party skills are included: asmart-video-guide, asmartdesign, asmart-video-production and asmart-audio. The optional campus-tool-workflow and unslop skills are not distributed here; discover them in the current environment when available. Without unslop, perform the editorial review directly. Campus application access is separate.

For Claude chat, add the repository through Customize > Plugins > Add > Add marketplace, then add ASmart Creative. This loads instructions and packaged resources; it does not guarantee FFmpeg, voice models, local MCP servers or the HyperFrames runtime. Inspect the actual session capabilities before promising MP4 production.

For local agents, from the plugin directory run `python3 skills/asmart-video-guide/scripts/bootstrap.py --destination /path/to/skills`. The existing bootstrap and pinned external dependency sources are retained. `--only-bundled` installs just these four skills; it is not full video tooling. The installer preserves differing local skills instead of overwriting them. Marketplace updates and local bootstrap installs are different mechanisms.

Personal marketplace refresh behavior must be verified in the recipient's Claude account. Team/Enterprise organization GitHub sync currently requires a private/internal repository and administrator setup. Do not promise that every personal account automatically follows GitHub commits.

This is a skills and visual library preview, not a general course builder. No accounts, customer records, paid content, enrollment rights, billing or private storage ship here. No live Campus credentials are shared. Publishing this source does not authorize a platform deployment.
