# Release Integration

This repository is updated through reviewed public pull requests. The
[published changelog](https://developer.atlassian.com/cloud/twg-cli/changelog/)
covers stable and public beta releases. The
[stable release manifest](https://teamwork-graph.atlassian.com/cli/manifest.json)
lists published CLI artifacts and checksums.

The [GitHub Pages documentation mirror](https://atlassian.github.io/twg-cli/)
is published from the `gh-pages` branch. Plugin packages, versions, and
marketplace installation instructions are maintained in
[atlassian-labs/twg-plugins](https://github.com/atlassian-labs/twg-plugins).

## Prepare a public refresh

1. Identify the generally available CLI release for the refresh. Verify the
   public artifact and checksum. Use release-profile outputs from that version.
2. For command examples, verify the commands against the released CLI's help
   and confirm general availability in public documentation. Link to the
   [stable command catalog](https://developer.atlassian.com/cloud/twg-cli/commands/commands-catalog/)
   for the full list.
3. Stage fully materialized public skills in a temporary directory. Use the
   release profile's bundle policy and static-export filter for workflow skills.
   Verify the offline essentials with an isolated local install from the
   verified CLI with no saved profiles. Include publicly released packages
   available without feature flags, experiments, or restricted grants, along
   with their references, assets, and license notices. Omit local installation
   metadata and cached state.
4. Compare the staged packages with `skills/`. List the included packages in
   `skills/README.md` and record the version used to materialize them. Review
   removed or renamed paths so existing references can be updated.
5. Link to the published changelog and label public beta summaries. Keep
   beta-only commands and skills out of the stable examples and skill export.
6. Run leak checks and verify links, required community files, referenced skill
   files, and licenses. Submit the diff for public review.

## Leak checks

Review the staged changes for credentials, private URLs and identifiers,
customer data, local machine paths, unpublished commands, unresolved templates,
and internal build outputs. Run the repository's public validation workflow.
Keep automated sync and publishing subject to a separate approved design.
