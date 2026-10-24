# Campus design system

Product: ASmartSolution consulting site and process workspace, in Spanish.
Audience: small business leaders, consulting staff, and client operations teams.

## Tokens
- Deep navy #183753: brand, strong type, workspace navigation.
- Cobalt #295DCB: actions and selected workflow steps.
- Cloud #F3F6FA: cool neutral background.
- White #FFFFFF: reading and forms.
- Steel #526579: secondary text.
- Mist #DCE4ED: structural borders.
- Type: retain Outfit for headings and Source Sans 3 for reading. Rounded geometric headings relate to the existing AS logo; Source Sans keeps dense process content legible.
- Spacing: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Radius: 6px controls, 12px panels, 24px hero workflow only.
- Icons: Tabler. No decorative icon collections.
- Dials: variance 7 on public site, 4 in workspace; motion 2; density 4 public, 7 workspace.

## Layout exploration
A. Centered headline above service cards: rejected because it could belong to any consulting site.
B. Left-aligned oversized title beside a working process explorer: selected. The client's actual practice, documenting who does what, becomes the opening interaction.

```text
Public:   logo                         nosotros contacto acceso
          large headline               interactive process path
          service description          selected step explanation
          contact action
          two service rows             founder photograph + story
          contact band                 footer
Workspace: navigation | client heading and tools
                      | actual manual library and task entry
Manual:    navigation | searchable index | readable process and activities
```

## Review before build
Keep the logo, routes, Spanish content, contact details, founder history and real manuals. Keep the service workflow the visitor can explore in front of the restored original constellation field. Avoid generic equal cards and invented metrics. The public opening owns the visual emphasis; all workspace controls stay quiet.

## Interaction and architecture
Workspace.Frame, Sidebar, Header and Content compose through children. Manual.Provider owns query, selected process and pins; Manual.Search, Index, Toolbar and Document consume a typed state/actions/meta contract using React 19 use(). No boolean mode props. Pin changes persist under a namespaced localStorage key. Original process editing tools remain available via their existing routes.

## Quality
Visible focus, 44px targets, reduced motion, mobile reflow, useful empty search state, and print layout. Existing legacy editing tools remain intact rather than changing their storage schema.

## Restored animated backgrounds
The original #070914 neural background supports the existing constellation on the home hero, LineRipple on login, and TopologyField sphere on workspaces, manuals, tasks and account settings. Native React components own mounting, responsive presets, reduced-motion changes and cleanup. Original editing tools keep their original backgrounds. White reading surfaces retain navy text.

## Restored header and controls
Fixed transparent header with white logo over the continuous hero animation, without a divider, animated underlines, #4A6FC1 sign-in button and sliding mobile navigation. Original glass account rail, white/outline home buttons with entrance and hover animations, FloatingInput labels, SaveToggle form states, expanding manual action tabs, sliding filter indicator and task disclosure. Controls stay connected to current routes and persisted data.
