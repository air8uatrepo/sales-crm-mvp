# Intake events

Append only. Record the Linear event/comment identity, intake revision,
business-readable result, and immutable evidence reference for every processed
input, no-op, confirmation, and materialization handoff.

| Time | Event | Linear source | Revision | Result | Evidence |
| --- | --- | --- | ---: | --- | --- |
| 2026-09-21T15:34:05.976Z | knowledge.read | A8-127 ec105816-6d88-4d83-b90f-ec6e912f392e | 0 | Deterministic bounded read: INDEX plus two relevant documents | SOURCE-MANIFEST.md K-01..K-03 |
| 2026-09-21T15:34:48.692Z | milestone.recorded | comment 215d79a9-d31d-4f4e-ae5c-bb3c0cbd0ede | 0 | Rolling intake milestone created and read back | comment 215d79a9-d31d-4f4e-ae5c-bb3c0cbd0ede |
| 2026-09-21T16:48:10.825Z | target.bound | comment 61158ad5-15f5-412f-878c-3baf754baabf | 1 | Business reply identified NEW application Sales CRM MVP; requirement REQ-A8-127 | comment 61158ad5-15f5-412f-878c-3baf754baabf |
| 2026-09-21T16:57:27.541Z | intake.blocked | issue ec105816-6d88-4d83-b90f-ec6e912f392e | 0 | Deterministic intake stopped: target-binding Linear API request failed | local retry required |
| 2026-09-21T16:59:30.127Z | target.binding.recovered | issue ec105816-6d88-4d83-b90f-ec6e912f392e | 1 | Main issue moved to Requirement Reviewing after verified Requirement Spec A8-128 | Linear readback A8-127 |
| 2026-09-21T17:24:59.055Z | target.spec_synced | comment 48950639-14c8-4e48-880d-249c7366c7cd | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-129 verified | child 1a38b6e9-ddac-48b6-beaa-81777a2afc60 main Requirement Reviewing |
| 2026-09-21T17:27:03.248Z | target.spec_synced | comment 0d10720e-f5dd-4baa-91a5-6fa879f5aae6 | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
| 2026-09-21T17:42:01.747Z | target.spec_synced | comment d787b69b-6622-4840-8b82-0ae443efb07e | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
| 2026-09-21T18:02:38.515Z | target.spec_synced | comment 3046b04c-c520-493d-89e3-28b6423ae378 | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
| 2026-09-21T18:07:54.577Z | target.spec_synced | comment a897c269-be24-463d-8639-c997048f4242 | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
| 2026-09-21T18:13:10.573Z | target.spec_synced | comment 2ee9fc66-d9de-4eab-9e89-bf7a92371566 | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
| 2026-09-21T18:22:37.325Z | target.spec_synced | comment d1da5ee2-29ea-44a7-bba9-5c76a446abc5 | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
| 2026-09-21T18:33:25.212Z | target.spec_synced | comment 1709cabd-b183-462c-a7de-900377d2d135 | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
| 2026-09-21T18:43:37.572Z | target.spec_synced | comment 1e010046-5a14-4196-bc22-cc77f086a059 | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
| 2026-09-21T18:46:46.044Z | target.spec_synced | comment 4a0db25e-9599-402d-b2b1-2c30c9dc4004 | 1 | Target NEW Sales CRM MVP; Requirement Spec A8-128 verified | child 93e53960-6199-4c9b-9176-8ea4d07cae68 main Requirement Reviewing |
