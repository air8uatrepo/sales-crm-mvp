# Requirement specification

Revision: 2

## Goal

Provide sales staff with a lightweight CRM to record and review customer information. The first phase covers customer record entry, submission, and viewing only, with no login.

## In scope

- Sales staff can enter basic customer information: company name (enterprise name), company contact details, the cooperating buyer, and the BD's own email.
- Sales staff can submit an entered customer record.
- A customer record has a draft status before submission and a submitted status after submission.
- A draft record can be edited before submission; a record is read-only after submission.
- Customer records are visible to sales staff in phase one.
- Sales staff can view customer information.

## Acceptance criteria

- A sales user can create a customer record with company name, company contact, cooperating buyer, and BD email, then submit it.
- A newly entered customer record is in draft status until submitted, and in submitted status after submission.
- A draft record can be edited before submission; a submitted record cannot be edited.
- A sales user can view existing customer records, and records are visible to sales staff in phase one.
- No login or authentication step is required in the first phase.

## Business examples

- A salesperson enters a new customer: company name, company contact, cooperating buyer, and their own BD email, saves it as a draft, edits it, then submits it; the record shows submitted status and is then read-only.
- A salesperson opens the customer list and views previously entered customer information.

## Assumptions and unresolved items

- Target is a new application: Sales CRM MVP.
- Confirmed: a draft record may be edited before submission, and a submitted record is read-only.
- Confirmed: phase-one visibility is sales staff; login and authentication are out of scope.
- Confirmed out of scope for phase one: no other workflow, notification, or permission behavior is required.
- Open: the exact set of company contact fields (for example phone, address) beyond the named ones.

## This change does not

No repository, branch, worktree, or implementation is selected during intake.

